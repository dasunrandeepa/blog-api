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
const userSchema = new Schema<IUser>()