import { MongoHighlighter } from "@mikro-orm/mongo-highlighter";
import { URL } from "./src/entities";

const options = {
    type: "mongo",
    dbName: "url-shortener",
    highlighter: new MongoHighlighter(),
    debug: true,
    entities: [URL],
};

export default options;
