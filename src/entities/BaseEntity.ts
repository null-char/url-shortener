import { PrimaryKey, Property, SerializedPrimaryKey } from "@mikro-orm/core";
import { ObjectId } from "@mikro-orm/mongodb";

export abstract class BaseEntity {
    @PrimaryKey({ type: "ObjectId" })
    _id!: ObjectId;

    @SerializedPrimaryKey({ type: "string" })
    id!: string;

    @Property({ type: Date, onCreate: () => new Date() })
    createdAt = new Date();
}
