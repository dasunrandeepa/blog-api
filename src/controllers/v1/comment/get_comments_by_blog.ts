/**
 * Custom Modules
 */
import { logger } from "@/lib/winston";

/**
 * Models
 */
import Comment from "@/models/comment";
import Blog from "@/models/blog";

/**
 * Types
 */
import { Request, Response } from "express";

const getCommentsByBlog = async ( req: Request, res: Response ): Promise<void> => {
    const { blogId } = req.params;

    try {
        const blog = await Blog.findById(blogId).select('_id').lean().exec();

        if(!blog) {
            res.status(404).json({
                code: 'NotFound',
                message: 'Blog not found.'
            });
            return;
        }

        const comments = await Comment.find({ blogId }).sort({ createdAt: -1 }).lean().exec();

        res.status(200).json({
            comments: comments,
        });
    } catch (err) {
        res.status(500).json({
            message: 'Internal server error.',
        });

        logger.error('Error while getting comments by blog.', err);
    }
}

export default getCommentsByBlog;