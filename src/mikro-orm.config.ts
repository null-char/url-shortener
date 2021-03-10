import { Options } from "@mikro-orm/core";
import { MongoHighlighter } from "@mikro-orm/mongo-highlighter";
import { URL } from "./entities";

const options: Options = {
    type: "mongo",
    dbName: "url-shortener",
    highlighter: new MongoHighlighter(),
    debug: true,
    entities: [URL],
};

export default options;
