/**
 * Node Modules
 */
import { Router } from "express";
import { param, query, body } from "express-validator";
import multer from "multer";

/**
 * Middleware
 */
import authenticate from "@/middlewares/authenticate";
import authorize from "@/middlewares/authorize";
import validationError from "@/middlewares/validationError";
import uploadBlogBanner from "@/middlewares/uploadBlogBanner";

/**
 * Controllers
 */
import createBlog from "@/controllers/v1/blog/create_blog"
import getAllBlogs from "@/controllers/v1/blog/get_all_blogs";
import getBlogsByUser from "@/controllers/v1/blog/get_blogs_by_user";
import getBlogBySlug from "@/controllers/v1/blog/get_blog_by_slug";
import updateBlog from "@/controllers/v1/blog/update_blog";


const upload = multer();

const router = Router();

router.post('/',
    authenticate,
    authorize(['admin']),
    upload.single('banner_image'),
    body('title') 
        .trim()
        .notEmpty()
        .withMessage('Title is required')
        .isLength({ max: 180 })
        .withMessage('Title must be less than 180 characters'), 
    body('content')
        .trim()
        .notEmpty()
        .withMessage('Content is required'),
    body('status')
        .optional()
        .isIn(['draft', 'published'])
        .withMessage('Status must be one of the value, draft or published'),
    validationError,
    uploadBlogBanner('post'),
    createBlog
);

router.get(
    '/',
    authenticate,
    authorize(['admin', 'user']),
    query('limit')
        .optional()
        .isInt({ min: 1, max: 50})
        .withMessage('Limit must be between 1 and 50.'),
    query('offset')
        .optional()
        .isInt({ min: 0})
        .withMessage('Offset must be greater than 0.'),
    validationError,
    getAllBlogs
);

router.get(
    '/user/:userId',
    authenticate,
    authorize(['admin', 'user']),
    param('userId')
        .notEmpty()
        .isMongoId()
        .withMessage('Invalid user ID.'),
    query('limit')
        .optional()
        .isInt({ min: 1, max: 50})
        .withMessage('Limit must be between 1 and 50.'),
    query('offset')
        .optional()
        .isInt({ min: 0})
        .withMessage('Offset must be greater than 0.'),
    validationError,
    getBlogsByUser
);

router.get(
    '/:slug',
    authenticate,
    authorize(['admin', 'user']),
    param('slug')
        .notEmpty()
        .withMessage('Slug is required.'),
    validationError,
    getBlogBySlug
);

router.put('/:blogId',
    authenticate,
    authorize(['admin']),
    param('blogId')
        .notEmpty()
        .isMongoId()
        .withMessage('Invalid blog ID.'),
    upload.single('banner_image'),
    body('title')
        .optional()
        .isLength({ max: 180 })
        .withMessage('Title must be less than 180 characters'), 
    body('content'),
    body('status')
        .optional()
        .isIn(['draft', 'published'])
        .withMessage('Status must be one of the value, draft or published'),
    validationError,
    uploadBlogBanner('put'),
    updateBlog
)

export default router;