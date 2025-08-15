/**
 * Node Modules
 */
import { Router } from "express";
import { param, body } from "express-validator";

/**
 * Middleware
 */
import authenticate from "@/middlewares/authenticate";
import authorize from "@/middlewares/authorize";
import validationError from "@/middlewares/validationError";

/**
 * Controllers
 */
import commentBlog from "@/controllers/v1/comment/comment_blog";
import getCommentsByBlog from "@/controllers/v1/comment/get_comments_by_blog";


const router = Router();

router.post(
    '/blog/:blogId',
    authenticate,
    authorize(['user', 'admin']),
    param('blogId')
        .isMongoId()
        .withMessage('Invalid blog ID.'),
    body('content')
        .notEmpty()
        .withMessage('Comment content is required.')
        .isString()
        .withMessage('Comment content must be a string.')
        .isLength({ min: 1, max: 1000 })
        .withMessage('Comment content must be between 1 and 1000 characters.'),
    validationError,
    commentBlog
);

router.get(
    '/blog/:blogId',
    authenticate,
    authorize(['user', 'admin']),
    param('blogId')
        .isMongoId()
        .withMessage('Invalid blog ID.'),
    validationError,
    getCommentsByBlog
);

export default router;