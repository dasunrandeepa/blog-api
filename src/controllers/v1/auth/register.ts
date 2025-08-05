/**
 * Custom Modules
 */
import { logger } from '@/lib/winston'
import config from '@/config'

/**
 * Models
 */


/**
 * Types
 */
import type { Request, Response } from 'express'

const register = async (req: Request, res: Response): Promise<void> => {
    try {
        res.status(201).json({
            message: 'New User Created',

        });
    } catch (err) {
        res.status(500).json({
            code: 'ServerError',
            message: 'Internal Server Error',
            error: err
        })

        logger.error('Error during user registration', err);
    }
}

export default register;