import { DI } from "@server";
import { Router, Request, Response } from "express";
import { nanoid } from "nanoid";

// Init router and path
const router = Router();

type ReqBody = {
    url: string;
    slug?: string;
};
router.post(
    "/url",
    async (
        req: Request<Record<string, unknown>, Record<string, unknown>, ReqBody>,
        res: Response
    ) => {
        const url = req.body.url;
        let slug: string;
        // If a slug is provided in request body use that otherwise
        // generate a slug with nanoid
        if (req.body.slug) {
            slug = req.body.slug;
        } else {
            // 10 characters long. Collision probability shouldn't be that high
            // for our use case.
            slug = nanoid(10);
        }

        const newUrl = DI.urlRepository.create({
            url,
            slug,
        });
        // Commit changes
        await DI.em.persist(newUrl).flush();

        const host = req.get("host") || "host";
        res.status(200).json({
            message: `Shortened URL: ${host}/${slug}`,
        });
    }
);

// Export the router for /api
export default router;
