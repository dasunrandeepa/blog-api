/**
 * Node Modules
 */
import { Schema, model, Types } from "mongoose";

export interface IComment {
    blogId: Types.ObjectId;
    userId: Types.ObjectId;
    content: string;
}

const commentSchema = new Schema<IComment>({
    blogId: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    content: {
        type: String,
        required: [true, 'Comment content is required.'],
        minlength: [1, 'Comment content must be at least 1 character long.'],
        maxlength: [1000, 'Comment content must be less than 1000 characters long.'],
    },
}, {
    timestamps: true,
});

export default model<IComment>('Comment', commentSchema);