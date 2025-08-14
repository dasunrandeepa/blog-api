/**
 * Node Modules
 */
import DOMPurify from "dompurify";
import { JSDOM } from "jsdom";

/**
 * Custom Modules
 */
import { logger } from "@/lib/winston";

/**
 * Models
 */
import Blog from "@/models/blog";

/**
 * Types
 */
import { Request, Response } from "express";
import { IBlog } from "@/models/blog";

type BlogData = Pick<IBlog, 'title' | 'content' | 'banner' | 'status'>;

/**
 * Purify the blog content
 */
const window = new JSDOM('').window;
const purify = DOMPurify(window);

const createBlog = async ( req: Request, res: Response ): Promise<void> => {
    try {
        const { title, content, banner, status } = req.body as BlogData;
        const userId = req.userId;

        const sanitizedContent = purify.sanitize(content);

        const newBlog = await Blog.create({
            title,
            content: sanitizedContent,
            banner,
            status,
            author: userId,
        });

        logger.info('A new blog has been created', newBlog);

        res.status(201).json({
            blog: newBlog,
        });
        
    } catch (err) {
        res.status(500).json({
            code: 'InternalServerError',
            message: 'Error while creating a blog.',
            error: err
        });

        logger.error('Error while creating a blog.', err);
    }
}

export default createBlog;