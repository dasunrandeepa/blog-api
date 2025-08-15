/**
 * Custom Modules
 */
import { logger } from "@/lib/winston";

/**
 * Models
 */
import Comment from "@/models/comment";
import Blog from "@/models/blog";
import User from "@/models/user";

/**
 * Types
 */
import { Request, Response } from "express";

const deleteComment = async ( req: Request, res: Response ): Promise<void> => {
    const { commentId } = req.params;
    const currentUserId = req.userId;

    try {
        const comment = await Comment.findById(commentId).select('blogId userId').lean().exec();
        const user = await User.findById(currentUserId).select('role').lean().exec();

        if(!comment) {
            res.status(404).json({
                code: 'NotFound',
                message: 'Comment not found.'
            });
            return;
        }

        if(comment.userId != currentUserId && user?.role !== 'admin') {
            res.status(403).json({
                code: 'Forbidden',
                message: 'You are not allowed to delete this comment.'
            });
            logger.error('A user tried to delete a comment without permission.', { 
                userId: currentUserId, 
                comment
            });
            return;
        }

        await Comment.deleteOne({ _id: commentId });
        await Blog.updateOne({ _id: comment.blogId }, { $inc: { commentsCount: -1 } });

        logger.info('Comment deleted successfully', { commentId });

        res.status(204).json({});
    } catch (err) {
        res.status(500).json({
            message: 'Internal server error.',
        });

        logger.error('Error while deleting comment.', err);
    }
}

export default deleteComment;
