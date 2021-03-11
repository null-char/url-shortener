import { DI } from "../Server";
import { Router, Request, Response } from "express";
import { nanoid } from "nanoid";
import { URL } from "url";

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
        let url: string;
        const bodyUrl = req.body.url;
        // Format the urls correctly
        if (!(bodyUrl.includes("http://") || bodyUrl.includes("https://"))) {
            // Protocol is not specified here (assume only hostname provided) so we insert
            // the hostname into a dummy url with an https protocol
            const urlObj = new URL("https://./");
            urlObj.hostname = bodyUrl;
            url = urlObj.toString();
        } else {
            url = bodyUrl;
        }

        let slug: string;
        // If a slug is provided in request body use that otherwise
        // generate a slug with nanoid
        if (req.body.slug) {
            slug = req.body.slug;
            // Check to see if this slug is already associated to some URL
            const existing = await DI.urlRepository.findOne({ slug });
            if (existing) {
                return res.status(400).json({
                    message:
                        "ERROR: This slug is already associated to some URL",
                });
            }
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
            message: `${host}/${slug}`,
        });
    }
);

// Export the router for /api
export default router;
