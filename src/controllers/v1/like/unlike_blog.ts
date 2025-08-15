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


const unlikeBlog = async ( req: Request, res: Response ): Promise<void> => {
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

        if(!existingLike) {
            res.status(400).json({
                code: 'BadRequest',
                message: 'You have not liked this blog.'
            });
            return;
        }

        await Like.deleteOne({ _id: existingLike._id });
        blog.likesCount -= 1;
        await blog.save();

        logger.info('Blog unliked successfully', { blogId, userId });

        res.status(204).json({
            likesCount: blog.likesCount,
        });

    } catch (err) {
        res.status(500).json({
            code: 'ServerError',
            message: 'Internal server error.',
            error: err
        });

        logger.error('Error while unliking blog.', err);
    }
}

export default unlikeBlog;