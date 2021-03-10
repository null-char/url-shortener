import { Options } from "@mikro-orm/core";
import { MongoHighlighter } from "@mikro-orm/mongo-highlighter";
import { URL } from "./entities";

const options: Options = {
    type: "mongo",
    dbName: "url-shortener",
    highlighter: new MongoHighlighter(),
    debug: process.env.NODE_ENV === "development" ? true : false,
    entities: [URL],
    clientUrl: process.env.MONGO_URI,
};

export default options;
