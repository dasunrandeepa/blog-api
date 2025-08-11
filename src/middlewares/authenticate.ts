/**
 * Node Modules
 */
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";

/**
 * Custom Modules
 */
import { verifyAccessToken } from "@/lib/jwt";
import { logger } from "@/lib/winston";

/**
 * Types
 */
import { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";

/**
* @function authenticate
* @description Middleware to verify the user's access token from the Authorization header. 
*              If the token is valid, the user's ID is attached to the request object.
               Otherwise, it returns an appropriate error response.

* @param {Request} req - Express request object. Expects a Bifarer token in the Authorization
header.
* @param {Response} res - Express response object used to send error responses if
authentication fails.
* @param {NextFunction} next - Express next function to pass control to the next middleware.

* @returns {void}
 */

const authenticate = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    // If there's no Bearer token, respond with 401 Unauthorized
    if(!authHeader?.startsWith('Bearer')) {
        res.status(401).json({
            code: 'AuthenticationError',
            message: 'Access denied. No token provided.'
        });
        return;
    }

    // Split out the token from the 'Bearer' prefix
    const [_, token] = authHeader.split(' ');

    try {
        // Verify the token and extract the userId from the payload.
        const jwtPayload = verifyAccessToken(token) as { userId : Types.ObjectId }

        // Attach the userId to the request object for later use
        req.userId = jwtPayload.userId;

        // Proceed to the next middleware or route handler;
        return next();

    } catch (err) {
        if( err instanceof TokenExpiredError) {
            res.status(401).json({
                code:'AuthenticationError',
                message: 'Refresh token is expired. Please log in again.'
            });
            return;
        }

        if( err instanceof JsonWebTokenError) {
            res.status(401).json({
                code:'AuthenticationError',
                message: 'Invalid refresh token.'
            });
            return;
        }

        res.status(500).json({
            code: 'ServerError',
            message: 'Internal Server Error.',
            error: err
        });

        logger.error('Error during authentication.', err);
    }
}

export default authenticate;