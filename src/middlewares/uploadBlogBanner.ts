/**
 * Custom Modules
 */
import { logger } from "@/lib/winston";
import uploadToCloudinary from "@/lib/cloudinary";

/**
 * Models
 */
import Blog from "@/models/blog";

/**
 * Types
 */
import { Request, Response, NextFunction } from "express";
import { UploadApiErrorResponse } from "cloudinary";

/**
 * Constants
 */
const MAX_FILE_SIZE = 1024 * 1024 * 2; // 2MB

const uploadBlogBanner = (method: 'post' | 'put') => {
    return async (req: Request, res: Response, next: NextFunction) => {
        if (method == 'put' && !req.file) {
            next();
            return;
        }

        if (!req.file) {
            res.status(400).json({
                code: 'ValidationError',
                message: 'Blog banner is required,'
            });
            return;
        }

        if( req.file.size > MAX_FILE_SIZE ) {
            res.status(413).json({
                code: 'ValidationError',
                message: 'Blog banner must be less than 2MB.'
            });
            return;
        }

        try {
            const { blogId } = req.params;
            const blog = await Blog.findById(blogId).select('banner.publicId').exec();

            const data = await uploadToCloudinary(
                req.file.buffer,
                blog?.banner.publicId.replace('blog-api/', '')
            );

            if(!data) {
                res.status(500).json({
                    code: 'InternalServerError',
                    message: 'Internal server error.'
                });
                
                logger.error('Failed to upload blog banner to cloudinary.', {
                    blogId,
                    publicId: blog?.banner.publicId
                });
                return;
            }

            const newBanner = {
                publicId: data.public_id,
                url: data.secure_url,
                width: data.width,
                height: data.height,
            }

            logger.info('Blog banner uploaded to cloudinary.', {
                blogId,
                newBanner,
            });

            req.body.banner = newBanner;
            next();
        } catch(err: UploadApiErrorResponse | any) {
            res.status(err.http_code).json({
                code: err.http_code < 500 ? 'ValidationError' : err.name,
                message: err.message,
            });

            logger.error('Failed to upload blog banner to cloudinary.', err);
        }
    }
}

export default uploadBlogBanner;