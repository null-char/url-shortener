import cookieParser from "cookie-parser";
import morgan from "morgan";
import helmet from "helmet";

import path from "path";
import express, { NextFunction, Request, Response } from "express";
import StatusCodes from "http-status-codes";
import "express-async-errors";

import BaseRouter from "./routes";
import logger from "@shared/Logger";

import {
    MikroORM,
    EntityManager,
    RequestContext,
    EntityRepository,
} from "@mikro-orm/core";

import { URL } from "./entities";
import MikroORMConfig from "./mikro-orm.config";

const app = express();

export const DI = {} as {
    orm: MikroORM;
    em: EntityManager;
    urlRepository: EntityRepository<URL>;
};

(async () => {
    // Set up mikro orm
    DI.orm = await MikroORM.init(MikroORMConfig);
    DI.em = DI.orm.em;
    DI.urlRepository = DI.em.getRepository(URL);

    // Set up a basic express server
    app.use(express.json());
    app.use(express.static(path.join(__dirname, "./public")));
    app.use((req: Request, res: Response, next: NextFunction) =>
        RequestContext.create(DI.orm.em, next)
    );
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser());

    // Show routes called in console during development
    if (process.env.NODE_ENV === "development") {
        app.use(morgan("dev"));
    }

    // Security
    if (process.env.NODE_ENV === "production") {
        app.use(helmet());
    }

    // Add APIs
    app.use("/api", BaseRouter);
    // Redirect
    app.get("/:id", async (req: Request<{ id: string }>, res: Response) => {
        const slug = req.params.id;
        const url = await DI.urlRepository.findOne({ slug });
        if (url) {
            res.redirect(url.url);
        } else {
            res.status(400);
        }
    });

    // Print API errors
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
        logger.err(err, true);
        return res.status(StatusCodes.BAD_REQUEST).json({
            error: err.message,
        });
    });
})();

export default app;
