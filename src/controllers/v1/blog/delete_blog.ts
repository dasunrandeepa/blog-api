/**
 * Node Modules
 */
import { v2 as cloudinary } from 'cloudinary';

/**
 * Custom Modules
 */
import { logger } from "@/lib/winston";

/**
 * Models
 */
import User from "@/models/user";
import Blog from "@/models/blog";

/**
 * Types 
 */
import { Request, Response } from "express";

const deleteBlog = async (req: Request,  res: Response): Promise<void> => {
    const userId = req.userId;
    const blogId = req.params.blogId;
    try {
        const user = await User.findById(userId).select('role').lean().exec();
        const blog = await Blog.findById(blogId).select('author banner.publicId').exec();

        if(!blog) {
            res.status(404).json({
                code: 'NotFound',
                message: 'Blog not found.'
            });
            return;
        }

        if(blog.author !== userId && user?.role !== 'admin') {
            res.status(403).json({
                code: 'Forbidden',
                message: 'You are not authorized to delete this blog.'
            });
            logger.warn(`User ${userId} tried to delete blog ${blogId} but not authorized.`);
            return;
        }

        await cloudinary.uploader.destroy(blog.banner.publicId);

        logger.info(`Deleting blog ${blogId} banner image from Cloudinary.`, {
            blogId,
            publicId: blog.banner.publicId
        });

        await Blog.deleteOne({_id: blogId});
        logger.info('A blog has been deleted', {
            blogId
        });

        res.sendStatus(204);
    } catch (err) {
        res.status(500).json({
            code: 'ServerError',
            message: 'Internal server error.',
            error: err
        });

        logger.error('Error while deleting a blog.', err);
    }
}

export default deleteBlog;