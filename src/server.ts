/**
 * Node Modules
 */
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import compression from "compression";
import helmet from "helmet";

/**
 * Custom Modules
 */
import config from "@/config";
import limiter from "@/lib/express_rate_limit";
import { connectToDatabase, disconnectFromDatabase } from "@/lib/mongoose";

/**
 * Router
 */
import v1Routes from "@/routes/v1";

/**
 * Types
 */
import type { CorsOptions } from "cors";

/**
 * Express App Initialization
 */
const app = express();

/**
 * CORS Configuration
 */
const corsOptions: CorsOptions = {
    origin(origin, callback) {
        // Allow requests with no origin
        if (!origin) {
            return callback(null, true);
        }
        
        // Allow in development or if origin is in whitelist
        if (config.NODE_ENV === 'development' || config.WHITELIST_ORIGINS.includes(origin)) {
            return callback(null, true);
        }
        
        // Reject requests from non-whitelist origins
        console.log(`CORS Error: ${origin} is not allowed`);
        return callback(
            new Error(`CORS Error: ${origin} is not allowed by CORS`)
        );
    }
}

/**
 * Middleware Configuration
 * Apply security and utility middleware to the Express app
 */

// Apply CORS middleware with custom configuration
app.use(cors(corsOptions));

// Enable JSON request body parsing for API endpoints
app.use(express.json());

// Enable URL-encoded request body parsing
app.use(express.urlencoded({extended: true}));

// Parse cookies from incoming requests
app.use(cookieParser());

// Enable response compression for better performance
app.use(compression(
    {
        threshold: 1024, // Compress responses larger than 1KB
    }
));

// Apply security headers using Helmet
app.use(helmet());

// Apply rate limiting to prevent abuse
app.use(limiter);

/**
 * Server Startup
 * Initialize the server and start listening for requests
 */
(async() => {
    try {
        await connectToDatabase();
        // Mount API routes under /api/v1 prefix
        app.use('/api/v1', v1Routes);

        // Start the server on the configured port
        app.listen(config.PORT, () => {
            console.log(`Server running: http://localhost:${config.PORT}`);
        });
    }
    catch(err) {
        console.log('Failed to start the server', err);

        // Exit process in production if server fails to start
        if(config.NODE_ENV === 'production') {
            process.exit(1);
        }
    }
})();

/**
 * Graceful Shutdown Handler
 * Handle server shutdown signals to ensure clean termination
 */
const handleServerShutdown = async () => {
    try {
        await disconnectFromDatabase();
        console.log('Server Shutdown');
        process.exit(0);
    }   
    catch(err) {
        console.log('Error during Server Shutdown', err);
    } 
}

// Listen for termination signals to handle graceful shutdown
process.on('SIGTERM', handleServerShutdown);
process.on('SIGINT', handleServerShutdown);

/**
 * Export the Express app for testing or external use
 */
export default app;