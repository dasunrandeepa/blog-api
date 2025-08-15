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
import likeBlog from "@/controllers/v1/like/like_blog";
import unlikeBlog from "@/controllers/v1/like/unlike_blog";



const router = Router();

router.post(
    '/blog/:blogId',
    authenticate,
    authorize(['user']),
    param('blogId')
        .notEmpty()
        .isMongoId()
        .withMessage('Invalid blog ID.'),
    body('userId')
        .notEmpty()
        .withMessage('Invalid user ID.')
        .isMongoId()
        .withMessage('Invalid user ID.'),
    validationError,
    likeBlog
);

router.delete(
    '/blog/:blogId',
    authenticate,
    authorize(['user']),
    param('blogId')
        .notEmpty()
        .isMongoId()
        .withMessage('Invalid blog ID.'),
    body('userId')
        .notEmpty()
        .withMessage('Invalid user ID.')
        .isMongoId()
        .withMessage('Invalid user ID.'),
    validationError,
    unlikeBlog
)

export default router;