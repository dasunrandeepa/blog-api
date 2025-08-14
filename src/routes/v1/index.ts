/**
 * Node Modules
 */
import { timeStamp } from "console";
import { Router } from "express";
import { version } from "os";

const router = Router();

/**
 * Routes
 */
import authRoutes from '@/routes/v1/auth';
import userRoutes from '@/routes/v1/user';
import blogRoutes from '@/routes/v1/blog';

/**
 * Root route
 */
router.get('/',(req, res)=>{
    res.status(200).json(
        {
            message:'API is Live',
            status:'OK',
            version: '1.0.0',
            docs: 'https://github.com/dasunrandeepa',
            timeStamp: new Date().toISOString()
        }
    );
});

/**
 * Mount v1 routes
 */
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/blogs', blogRoutes);

export default router;