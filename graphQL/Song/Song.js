export default {
  table: "songs",
  typeName: "Song",
  fields: {
    _id: "MongoId",
    title: "String",
    artist: "String",
    group: "Boolean",
    singers: "StringArray"
  },
  relationships: {

  }
};