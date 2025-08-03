/**
 * Node Modules
 */

import dotenv from "dotenv";

dotenv.config();

const config = {
    PORT: process.env.PORT || 3000,
    NODE_ENV: process.env.NODE_ENV || "development",
    WHITELIST_ORIGINS: ['http://localhost:3001'],
}

export default config;