import express from 'express';
import { getCommentsByPost, createComment, deleteComment } from '../controllers/comment.controller.js';

const router = express.Router();

// Get comments for a specific post
router.get('/:postId', getCommentsByPost);

// Create a new comment
router.post('/', createComment);

// Delete a comment
router.delete('/:id', deleteComment);

export default router;