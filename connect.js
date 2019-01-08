import { MongoClient } from "mongodb";

export default () => {
  let connString = process.env.MONGO_CONNECTION;
  let dbName = "jellyrolls";
  return MongoClient.connect(
    connString,
    { useNewUrlParser: true }
  ).then(client => client.db(dbName));
};
