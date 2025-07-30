import ImageKit from "imagekit";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import dotenv from "dotenv";

// Ensure environment variables are loaded
dotenv.config();

export const getPosts = async (req, res) => {
    try {
        const posts = await Post.find()
            .populate({
                path: 'author',
                select: 'username img'
            })
            .populate({
                path: 'user',
                select: 'username img'
            })
            .sort({ createdAt: -1 });
        res.status(200).json(posts);
    } catch (error) {
        console.error("Error getting posts:", error);
        res.status(500).json({ error: error.message });
    }
};

export const getPost = async (req, res) => {
    try {
        const post = await Post.findOne({ slug: req.params.slug })
            .populate({
                path: 'author',
                select: 'username img'
            })
            .populate({
                path: 'user',
                select: 'username img'
            });
            
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        
        res.status(200).json(post);
    } catch (error) {
        console.error("Error getting post:", error);
        res.status(500).json({ error: error.message });
    }
};

// Create post - now public for any authenticated user
export const createPost = async (req, res) => {
    try {
        const clerkUserId = req.auth?.userId;

        if (!clerkUserId) {
            return res.status(401).json({ error: "Not authenticated!" });
        }

        // Find or create user
        let user = await User.findOne({ clerkUserId });
        
        if (!user) {
            // Create a new user if they don't exist
            user = new User({
                clerkUserId,
                username: req.body.authorName || "Anonymous",
                email: req.auth?.sessionClaims?.email || "anonymous@example.com"
            });
            await user.save();
        }

        let slug = req.body.title.replace(/ /g, "-").toLowerCase();

        let existingPost = await Post.findOne({slug});

        let counter = 2;

        while(existingPost) {
            slug = `${slug}-${counter}`;
            existingPost = await Post.findOne({slug});
            counter++;
        }

        // Set both user and author fields to the user's _id
        const newPost = new Post({ 
            ...req.body,  // Place the spread before user and author to avoid overwriting
            user: user._id, 
            author: user._id,
            slug
        });
        
        const post = await newPost.save();
        res.status(201).json(post);
    } catch (error) {
        console.error("Error creating post:", error);
        res.status(400).json({ error: error.message });
    }
};

// Update post - now public for any authenticated user
export const updatePost = async (req, res) => {
    try {
        const clerkUserId = req.auth?.userId;

        if (!clerkUserId) {
            return res.status(401).json({ error: "Not authenticated!" });
        }

        const { postId } = req.params;
        
        const post = await Post.findById(postId);
        
        if (!post) {
            return res.status(404).json({ error: "Post not found!" });
        }

        // Find the user
        const user = await User.findOne({ clerkUserId });
        
        if (!user) {
            return res.status(404).json({ error: "User not found!" });
        }

        // Check if user is the author of the post (allow editing own posts)
        if (post.user.toString() !== user._id.toString()) {
            return res.status(403).json({ error: "You can only edit your own posts!" });
        }

        // Generate new slug if title changed
        let slug = post.slug;
        if (req.body.title && req.body.title !== post.title) {
            slug = req.body.title.replace(/ /g, "-").toLowerCase();
            
            let existingPost = await Post.findOne({ slug, _id: { $ne: postId } });
            let counter = 2;

            while(existingPost) {
                slug = `${slug}-${counter}`;
                existingPost = await Post.findOne({ slug, _id: { $ne: postId } });
                counter++;
            }
        }

        const updatedPost = await Post.findByIdAndUpdate(
            postId,
            { 
                ...req.body,
                slug
            },
            { new: true, runValidators: true }
        ).populate({
            path: 'author',
            select: 'username img'
        }).populate({
            path: 'user',
            select: 'username img'
        });

        res.status(200).json(updatedPost);
    } catch (error) {
        console.error("Error updating post:", error);
        res.status(400).json({ error: error.message });
    }
};

// Delete post - now public for any authenticated user
export const deletePost = async (req, res) => {
    try {
        const clerkUserId = req.auth?.userId;

        if (!clerkUserId) {
            return res.status(401).json({ error: "Not authenticated!" });
        }

        const { postId } = req.params;

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ error: "Post not found!" });
        }

        // Find the user
        const user = await User.findOne({ clerkUserId });
        
        if (!user) {
            return res.status(404).json({ error: "User not found!" });
        }

        // Check if user is the author of the post (allow deleting own posts)
        if (post.user.toString() !== user._id.toString()) {
            return res.status(403).json({ error: "You can only delete your own posts!" });
        }

        await Post.findByIdAndDelete(postId);

        res.status(200).json({ message: "Post has been deleted successfully" });
    } catch (error) {
        console.error("Error deleting post:", error);
        res.status(500).json({ error: error.message });
    }
};

// Log ImageKit configuration before initializing
console.log("ImageKit ENV Vars:", {
    publicKey: process.env.IK_YOUR_IMAGEKIT_PUBLIC_KEY,
    privateKey: "****" + (process.env.IK_YOUR_IMAGEKIT_PRIVATE_KEY ? process.env.IK_YOUR_IMAGEKIT_PRIVATE_KEY.slice(-4) : undefined),
    urlEndpoint: process.env.IK_YOUR_IMAGEKIT_URL_ENDPOINT
});

// Initialize ImageKit with proper error handling
const imagekit = new ImageKit({
    publicKey: process.env.IK_YOUR_IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IK_YOUR_IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IK_YOUR_IMAGEKIT_URL_ENDPOINT
});

export const uploadAuth = async (req, res) => {
    try {
        // Use the instance method instead of the static method
        const result = imagekit.getAuthenticationParameters();
        res.status(200).json(result);
    } catch (error) {
        console.error("ImageKit auth error:", error);
        res.status(500).json({ error: "Failed to generate authentication parameters" });
    }
};

// Add a new function to handle direct uploads - now public for any authenticated user
export const uploadImage = async (req, res) => {
    try {
        const clerkUserId = req.auth?.userId;

        if (!clerkUserId) {
            return res.status(401).json({ error: "Not authenticated!" });
        }

        const { file } = req.body;
        
        if (!file || !file.base64Data) {
            return res.status(400).json({ error: "No image data provided" });
        }
        
        const uploadResponse = await imagekit.upload({
            file: file.base64Data,
            fileName: file.name || `upload-${Date.now()}`,
            folder: file.folder || "/uploads"
        });
        
        res.status(200).json({
            url: uploadResponse.url,
            fileId: uploadResponse.fileId
        });
    } catch (error) {
        console.error("Image upload error:", error);
        res.status(500).json({ error: "Failed to upload image" });
    }
};

// Function specifically for author profile images - now public for any authenticated user
export const uploadAuthorImage = async (req, res) => {
    try {
        const clerkUserId = req.auth?.userId;

        if (!clerkUserId) {
            return res.status(401).json({ error: "Not authenticated!" });
        }

        const user = await User.findOne({ clerkUserId });
        
        if (!user) {
            return res.status(404).json({ error: "User not found!" });
        }
        
        const { file } = req.body;
        
        if (!file || !file.base64Data) {
            return res.status(400).json({ error: "No image data provided" });
        }
        
        // Upload to a specific folder for author images
        const uploadResponse = await imagekit.upload({
            file: file.base64Data,
            fileName: `author-${user._id}-${Date.now()}`,
            folder: "/author-images",
            // You can add tags for better organization
            tags: [`user_${user._id}`, "author", "profile"]
        });
        
        // Update the user's img field with the new image URL
        user.img = uploadResponse.url;
        await user.save();
        
        res.status(200).json({
            url: uploadResponse.url,
            fileId: uploadResponse.fileId,
            message: "Author image updated successfully"
        });
    } catch (error) {
        console.error("Author image upload error:", error);
        res.status(500).json({ error: "Failed to upload author image" });
    }
};