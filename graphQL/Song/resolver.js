import { insertUtilities, queryUtilities, projectUtilities, updateUtilities, processHook, dbHelpers } from "mongo-graphql-starter";
import hooksObj from "../hooks";
const { decontructGraphqlQuery, cleanUpResults } = queryUtilities;
const { setUpOneToManyRelationships, newObjectFromArgs } = insertUtilities;
const { getMongoProjection, parseRequestedFields } = projectUtilities;
const { getUpdateObject, setUpOneToManyRelationshipsForUpdate } = updateUtilities;
import { ObjectId } from "mongodb";
import SongMetadata from "./Song";

export async function loadSongs(db, queryPacket, root, args, context, ast) {
  let { $match, $project, $sort, $limit, $skip } = queryPacket;

  let aggregateItems = [
    { $match }, 
    $sort ? { $sort } : null, 
    { $project },
    $skip != null ? { $skip } : null, 
    $limit != null ? { $limit } : null
  ].filter(item => item);

  await processHook(hooksObj, "Song", "queryPreAggregate", aggregateItems, root, args, context, ast);
  let Songs = await dbHelpers.runQuery(db, "songs", aggregateItems);
  await processHook(hooksObj, "Song", "adjustResults", Songs);
  Songs.forEach(o => {
    if (o._id){
      o._id = "" + o._id;
    }
  });
  cleanUpResults(Songs, SongMetadata);
  return Songs;
}

export const Song = {


}

export default {
  Query: {
    async getSong(root, args, context, ast) {
      await processHook(hooksObj, "Song", "queryPreprocess", root, args, context, ast);
      let db = await (typeof root.db === "function" ? root.db() : root.db);
      context.__mongodb = db;
      let queryPacket = decontructGraphqlQuery(args, ast, SongMetadata, "Song");
      await processHook(hooksObj, "Song", "queryMiddleware", queryPacket, root, args, context, ast);
      let results = await loadSongs(db, queryPacket, root, args, context, ast);

      return {
        Song: results[0] || null
      };
    },
    async allSongs(root, args, context, ast) {
      await processHook(hooksObj, "Song", "queryPreprocess", root, args, context, ast);
      let db = await (typeof root.db === "function" ? root.db() : root.db);
      context.__mongodb = db;
      let queryPacket = decontructGraphqlQuery(args, ast, SongMetadata, "Songs");
      await processHook(hooksObj, "Song", "queryMiddleware", queryPacket, root, args, context, ast);
      let result = {};

      if (queryPacket.$project) {
        result.Songs = await loadSongs(db, queryPacket, root, args, context, ast);
      }

      if (queryPacket.metadataRequested.size) {
        result.Meta = {};

        if (queryPacket.metadataRequested.get("count")) {
          let countResults = await dbHelpers.runQuery(db, "songs", [{ $match: queryPacket.$match }, { $group: { _id: null, count: { $sum: 1 } } }]);  
          result.Meta.count = countResults.length ? countResults[0].count : 0;
        }
      }

      return result;
    }
  },
  Mutation: {
    async createSong(root, args, context, ast) {
      let db = await (typeof root.db === "function" ? root.db() : root.db);
      context.__mongodb = db;
      let newObject = await newObjectFromArgs(args.Song, SongMetadata, { db, dbHelpers, hooksObj, root, args, context, ast });
      let requestMap = parseRequestedFields(ast, "Song");
      let $project = requestMap.size ? getMongoProjection(requestMap, SongMetadata, args) : null;

      if ((newObject = await dbHelpers.processInsertion(db, newObject, { typeMetadata: SongMetadata, hooksObj, root, args, context, ast })) == null) {
        return { Song: null };
      }
      await setUpOneToManyRelationships(newObject, args.Song, SongMetadata, { db, hooksObj, root, args, context, ast });
      let result = $project ? (await loadSongs(db, { $match: { _id: newObject._id }, $project, $limit: 1 }, root, args, context, ast))[0] : null;
      return {
        success: true,
        Song: result
      }
    },
    async updateSong(root, args, context, ast) {
      let db = await (typeof root.db === "function" ? root.db() : root.db);
      context.__mongodb = db;
      let { $match, $project } = decontructGraphqlQuery(args._id ? { _id: args._id } : {}, ast, SongMetadata, "Song");
      let updates = await getUpdateObject(args.Updates || {}, SongMetadata, { db, dbHelpers, hooksObj, root, args, context, ast });

      if (await processHook(hooksObj, "Song", "beforeUpdate", $match, updates, root, args, context, ast) === false) {
        return { Song: null };
      }
      if (!$match._id) {
        throw "No _id sent, or inserted in middleware";
      }
      await setUpOneToManyRelationshipsForUpdate([args._id], args, SongMetadata, { db, dbHelpers, hooksObj, root, args, context, ast });
      await dbHelpers.runUpdate(db, "songs", $match, updates);
      await processHook(hooksObj, "Song", "afterUpdate", $match, updates, root, args, context, ast);
      
      let result = $project ? (await loadSongs(db, { $match, $project, $limit: 1 }, root, args, context, ast))[0] : null;
      return {
        Song: result,
        success: true
      };
    },
    async updateSongs(root, args, context, ast) {
      let db = await (typeof root.db === "function" ? root.db() : root.db);
      context.__mongodb = db;
      let { $match, $project } = decontructGraphqlQuery({ _id_in: args._ids }, ast, SongMetadata, "Songs");
      let updates = await getUpdateObject(args.Updates || {}, SongMetadata, { db, dbHelpers, hooksObj, root, args, context, ast });

      if (await processHook(hooksObj, "Song", "beforeUpdate", $match, updates, root, args, context, ast) === false) {
        return { success: true };
      }
      await setUpOneToManyRelationshipsForUpdate(args._ids, args, SongMetadata, { db, dbHelpers, hooksObj, root, args, context, ast });
      await dbHelpers.runUpdate(db, "songs", $match, updates, { multi: true });
      await processHook(hooksObj, "Song", "afterUpdate", $match, updates, root, args, context, ast);
      
      let result = $project ? await loadSongs(db, { $match, $project }, root, args, context, ast) : null;
      return {
        Songs: result,
        success: true
      };
    },
    async updateSongsBulk(root, args, context, ast) {
      let db = await (typeof root.db === "function" ? root.db() : root.db);
      let { $match } = decontructGraphqlQuery(args.Match, ast, SongMetadata);
      let updates = await getUpdateObject(args.Updates || {}, SongMetadata, { db, dbHelpers, hooksObj, root, args, context, ast });

      if (await processHook(hooksObj, "Song", "beforeUpdate", $match, updates, root, args, context, ast) === false) {
        return { success: true };
      }
      await dbHelpers.runUpdate(db, "songs", $match, updates, { multi: true });
      await processHook(hooksObj, "Song", "afterUpdate", $match, updates, root, args, context, ast);

      return { success: true };
    },
    async deleteSong(root, args, context, ast) {
      if (!args._id) {
        throw "No _id sent";
      }
      let db = await (typeof root.db === "function" ? root.db() : root.db);
      let $match = { _id: ObjectId(args._id) };
      
      if (await processHook(hooksObj, "Song", "beforeDelete", $match, root, args, context, ast) === false) {
        return false;
      }
      await dbHelpers.runDelete(db, "songs", $match);
      await processHook(hooksObj, "Song", "afterDelete", $match, root, args, context, ast);
      return true;
    }
  }
};