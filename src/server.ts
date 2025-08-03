/**
 * Node Modules
 */
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import compression from "compression";
import helmet from "helmet";

/**
 * Custome Modules
 */
import config from "@/config";
import limiter from "@/lib/express_rate_limit";

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

//Configure CORS Options
const corsOptions: CorsOptions = {
    origin(origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
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

//Apply CORS Middleware
app.use(cors(corsOptions));

//Enable JSON Request Body Parsing
app.use(express.json());

app.use(express.urlencoded({extended: true}));

app.use(cookieParser());

app.use(compression(
    {
        threshold:1024,
    }
));

app.use(helmet());

app.use(limiter);


(async()=>{
    try{
        
        app.use('/api/v1',v1Routes)

        app.listen(config.PORT, () => {
            console.log(`Server running: http://localhost:${config.PORT}`);
        });
    }
    catch(err){
        console.log('Failed to start the server', err)

        if(config.NODE_ENV==='production'){
            process.exit(1);
        }
    }
})();

export default app;