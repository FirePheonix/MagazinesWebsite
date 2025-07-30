import express from "express"
import { 
    getPosts, 
    getPost,
    createPost,
    updatePost,
    deletePost,
    uploadAuth,
    uploadImage,
    uploadAuthorImage
} from "../controllers/post.controller.js";

const router = express.Router()

// All routes are now public (no auth required)
router.get("/upload-auth", uploadAuth);
router.get("/", getPosts);
router.get("/:slug", getPost);

// CRUD operations - now public
router.post("/upload-image", uploadImage);
router.post("/upload-author-image", uploadAuthorImage);
router.post("/", createPost);
router.put("/:postId", updatePost);
router.delete("/:postId", deletePost);

export default router;