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
import Comment from "@/models/comment";

/**
 * Types
 */
import { Request, Response } from "express";
import { IComment } from "@/models/comment";

type CommentData = Pick<IComment, 'content'>;

/**
 * Purify the comment content
 */
const window = new JSDOM('').window;
const purify = DOMPurify(window);

const commentBlog = async ( req: Request, res: Response ): Promise<void> => {
    const { blogId } = req.params;
    const { content } = req.body as CommentData;
    const userId = req.userId;
    try {
        const blog = await Blog.findById(blogId).select('_id commentsCount').exec();

        if(!blog) {
            res.status(404).json({
                code: 'NotFound',
                message: 'Blog not found.'
            });
            return;
        }

        const sanitizedContent = purify.sanitize(content);

        const newComment = await Comment.create({
            blogId,
            userId,
            content: sanitizedContent,
        });

        blog.commentsCount += 1;
        await blog.save();

        logger.info('A new comment has been created', newComment);

        res.status(201).json({
            comment: newComment,
            blog: {
                _id: blog._id,
                commentsCount: blog.commentsCount,
            },
        });
    } catch (err) {
        res.status(500).json({
            code: 'ServerError',
            message: 'Internal server error.',
            error: err
        });

        logger.error('Error while commenting on blog.', err);
    }
}

export default commentBlog;