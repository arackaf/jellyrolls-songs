import express from "express";
const app = express();
import path from "path";
import bodyParser from "body-parser";
import session from "express-session";
import cookieParser from "cookie-parser";
import fs from "fs";
import compression from "compression";

import connectToDb from "./connect";
import expressGraphql from "express-graphql";

import resolvers from "./graphQL/resolver";
import schema from "./graphQL/schema";

import { makeExecutableSchema } from "graphql-tools";
import { middleware } from "generic-persistgraphql";

app.use(compression());
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(
  bodyParser.urlencoded({
    // to support URL-encoded bodies
    extended: true
  })
);
app.use(cookieParser());
app.use(session({ secret: "jellyrolls", saveUninitialized: true, resave: true }));

const dbPromise = connectToDb();
export const root = { db: dbPromise };
export const executableSchema = makeExecutableSchema({ typeDefs: schema, resolvers });

//middleware(app, { url: "/graphql", mappingFile: path.resolve(__dirname, "./extracted_queries.json") });
app.use(
  "/graphql",
  expressGraphql({
    schema: executableSchema,
    graphiql: true,
    rootValue: root
  })
);

app.get("/", browseToMain);
function browseToMain(request, response) {
  response.sendFile(path.join(__dirname + "/index.html"));
}

// app.get("/favicon.ico", function(request, response) {
//   response.sendFile(path.join(__dirname + "/favicon.ico"));
// });

process.on("uncaughtException", error);
process.on("unhandledRejection", error);
process.on("exit", shutdown);
process.on("SIGINT", shutdown);

function shutdown() {
  process.exit();
}

function error(err) {
  try {
    let logger = new ErrorLoggerDao();
    logger.log("exception", err);
  } catch (e) {}
}

app.listen(process.env.PORT || 3000);

export default null;
