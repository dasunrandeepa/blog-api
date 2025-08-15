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

const deleteUser = async (req: Request,  res: Response): Promise<void> => {
    const userId = req.params.userId;
    try {
        const blogs = await Blog.find({author: userId}).select('banner.publicId').lean().exec();
        const publicIds = blogs.map(blog => blog.banner.publicId);

        if(publicIds.length > 0) {
            await cloudinary.api.delete_resources(publicIds);
            logger.info(`Deleted ${publicIds.length} blog banner images from Cloudinary.`, {
                publicIds
            });
        }

        await Blog.deleteMany({author: userId});
        logger.info(`Deleted ${blogs.length} blogs from the database.`, {
            userId,
            blogs
        });

        await User.deleteOne({_id: userId});
        logger.info('A user account has been deleted', {
            userId
        });

        res.sendStatus(204);
    } catch (err) {
        res.status(500).json({
            code: 'ServerError',
            message: 'Internal server error.',
            error: err
        });

        logger.error('Error while deleting a user.', err);
    }
}

export default deleteUser;