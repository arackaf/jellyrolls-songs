import { dataTypes, createGraphqlSchema, dbHelpers } from "mongo-graphql-starter";
const { MongoIdType, StringType, StringArrayType, BoolType, IntType, FloatType, arrayOf } = dataTypes;

export const Song = {
  table: "songs",
  fields: {
    title: StringType,
    artist: StringType,
    group: BoolType,
    singers: StringArrayType
  }
};
