/**
 * Custom Modules
 */
import { logger } from "@/lib/winston";

/**
 * Models
 */
import Blog from "@/models/blog";
import Like from "@/models/like";

/**
 * Types
 */
import { Request, Response } from "express";


const likeBlog = async ( req: Request, res: Response ): Promise<void> => {
    const { blogId } = req.params;
    const { userId } = req.body;
    try {
        const blog = await Blog.findById(blogId).select('likesCount').exec();

        if(!blog) {
            res.status(404).json({
                code: 'NotFound',
                message: 'Blog not found.'
            });
            return;
        }

        const existingLike = await Like.findOne({ blogId, userId }).lean().exec();

        if(existingLike) {
            res.status(400).json({
                code: 'BadRequest',
                message: 'You have already liked this blog.'
            });
            return;
        }

        const newLike = await Like.create({ blogId, userId });

        blog.likesCount += 1;
        await blog.save();

        logger.info('A new like has been created', newLike);

        res.status(201).json({
            likesCount: blog.likesCount,
        });
    } catch (err) {
        res.status(500).json({
            code: 'ServerError',
            message: 'Internal server error.',
            error: err
        });

        logger.error('Error while liking blog.', err);
    }
}

export default likeBlog;