/**
 * Node Modules
 */
import { Router } from "express";
import { param, query, body } from "express-validator";

/**
 * Middleware
 */
import authenticate from "@/middlewares/authenticate";
import validationError from "@/middlewares/validationError";
import authorize from "@/middlewares/authorize";

/**
 * Controllers
 */
import getCurrentUser from "@/controllers/v1/user/get_current_user";
import updateCurrentUser from "@/controllers/v1/user/update_current_user";


/**
 * Models
 */
import User from '@/models/user';

const router = Router();

router.get('/current',
    authenticate,
    authorize(['admin','user']),
    getCurrentUser
)

router.put('/current',
    authenticate,
    authorize(['admin','user']),
    body('username')
        .optional()
        .trim()
        .isLength({ max : 20 })
        .withMessage('Username must be less than 20 characters.')
        .custom(async (value) => {
            const userExists = await User.exists({ username: value });

            if(userExists) {
                throw Error('This username is already in use.');
            }
        }),
    body('email')
        .optional()
        .isLength({ max : 50 })
        .withMessage('Email must be less than 50 characters.')
        .isEmail()
        .withMessage('Invalid email address')
        .custom(async (value) => {
            const userExists = await User.exists({ email: value });

            if(userExists) {
                throw Error('This email is already in use.');
            }
        }),
    body('password')
        .optional()
        .isLength({ min : 8 })
        .withMessage('Password must be atleast 8 characters long.'),
    body('first_name')
        .optional()
        .isLength({ max: 20 })
        .withMessage('First name must be less than 20 characters.'),
    body('last_name')
        .optional()
        .isLength({ max: 20 })
        .withMessage('Last name must be less than 20 characters.'),
    body(['website','facebook','instagram','linkedin','x','youtube'])
        .optional()
        .isURL()
        .withMessage('Invalid URL')
        .isLength({ max: 100 })
        .withMessage('Url must be less than 100 characters'),
    validationError,
    updateCurrentUser
)

export default router;