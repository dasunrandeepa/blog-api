/**
 * Node Modules
 */
import { Schema, model } from 'mongoose';

export interface IUser {
    username: string;
    email: string;
    password: string;
    role: 'admin' | 'user';
    firstName?: string;
    lastName?: string;
    socialLinks?: {
        website?: string;
        facebook?: string;
        instagram?: string;
        x?: string;
        youtube?: string;
    };
}

/**
 * User Schema
 */
const userSchema = new Schema<IUser>(
    {
        username: {
            type: String,
            required: [true, 'Username is required'],
            maxlength: [20, 'Username must be less than 20 characters'],
            unique: [true, 'Username must be unique']
        }
    }
)