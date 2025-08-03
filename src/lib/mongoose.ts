/**
 * Node Modules
 */
import mongoose from "mongoose";

/**
 * Custom Modules
 */
import config from "@/config";

/**
 * Types
 */
import type { ConnectOptions } from "mongoose";

/**
 * Client Option
 */
const clientOptions: ConnectOptions = {
    dbName: 'blog-db',
    appName: 'Blog API',
    serverApi: {
        version: '1',
        strict: true,
        deprecationErrors: true
    },
};

export const connectToDatabase = async(): Promise<void> => {
    if(!config.MONGO_URI){
        throw new Error('MongoDB URI is not defined in the configuration');
    }

    try {
        await mongoose.connect(config.MONGO_URI, clientOptions);

        console.log('Database Connected Successfully.', {
            uri: config.MONGO_URI,
            options: clientOptions
        })
    } catch (err) {
     if(err instanceof Error){
        throw err;
     }

     console.log('Error connecting to Database',err)
    }
};

export const disconnectFromDatabase = async(): Promise<void> => {
    try {
        await mongoose.disconnect();

        console.log('Database Disconnected Successfully.', {
            uri: config.MONGO_URI,
            options: clientOptions
        })
    } catch (err) {
        if(err instanceof Error){
            throw err;
        }

        console.log('Error Disconnecting from the Database', err);
    }
};