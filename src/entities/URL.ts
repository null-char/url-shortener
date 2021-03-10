import "reflect-metadata";
import { Entity, Property } from "@mikro-orm/core";
import { BaseEntity } from "@entities/BaseEntity";

@Entity()
export class URL extends BaseEntity {
    @Property({ type: "string" })
    url: string;

    @Property({ type: "string" })
    slug: string;

    public constructor(url: string, slug: string) {
        super();
        this.url = url;
        this.slug = slug;
    }
}
