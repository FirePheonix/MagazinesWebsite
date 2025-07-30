import { User } from "../models/user.model.js";
import mongoose from "mongoose";

export const getUserSavedPosts = async (req, res) => {
    try {
        const clerkId = req.auth.userId;

        if (!clerkId) {
            return res.status(401).json({ message: "Not authenticated" });
        }

        const user = await User.findOne({ clerkUserId: clerkId });
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        // Assuming you have a Post model imported
        // Find all posts with IDs in user.savedPosts
        const savedPosts = await mongoose.model("Post").find({
            _id: { $in: user.savedPosts }
        }).select('_id title slug excerpt coverImage category createdAt readTime');
        
        res.status(200).json(savedPosts);
    } catch (error) {
        console.error("Error getting saved posts:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const savePost = async (req, res) => {
    try {
        const clerkId = req.auth.userId;
        const postId = req.body.postId;

        if (!clerkId) {
            return res.status(401).json({ message: "Not authenticated" });
        }

        if (!postId) {
            return res.status(400).json({ message: "Post ID is required" });
        }

        const user = await User.findOne({ clerkUserId: clerkId });
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isSaved = user.savedPosts.some((p) => p.toString() === postId.toString());

        if (!isSaved) {
            await User.findByIdAndUpdate(user._id, {
                $push: { savedPosts: postId },
            });
        } else {
            await User.findByIdAndUpdate(user._id, {
                $pull: { savedPosts: postId },
            });
        }

        res.status(200).json({ 
            message: isSaved ? "Post unsaved" : "Post saved",
            isSaved: !isSaved
        });
    } catch (error) {
        console.error("Error saving post:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};