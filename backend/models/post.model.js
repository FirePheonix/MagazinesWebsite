import { Schema } from "mongoose";
import mongoose from "mongoose";

const postSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User", // BSPofficial or whoever is uploading
            required: true,
        },
        author: {
            type: Schema.Types.ObjectId, // can be null or another User if needed
            ref: "User",
        },
        authorName: {
            type: String,
            required: true,
        },
        authorImage: {
            type: String,
            required: true,
        },
        coverImage: {
            type: String,
            required: true,
        },
        title: {
            type: String,
            required: true,
            unique: true,
        },
        slug: {
            type: String,
            required: true,
            unique: true,
        },
        excerpt: {
            type: String,
            required: true,
        },
        readTime: {
            type: Number,
            required: true,
            min: 1,
        },
        category: {
            type: String,
            required: true,
        },
        content: {
            type: Object, // TipTap content
            required: true,
        },
        isFeatured: {
            type: Boolean,
            default: false,
        },
        visit: {
            type: Number,
            default: 0,
        },
        savedBy: {
            type: [Schema.Types.ObjectId],
            ref: 'User',
            default: [],
        },
    },
    { timestamps: true }
);

export default mongoose.model("Post", postSchema);
