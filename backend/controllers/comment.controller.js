import Comment from '../models/comment.model.js';
import Post from '../models/post.model.js';
import User from '../models/user.model.js';

// Get all comments for a post
export const getCommentsByPost = async (req, res) => {
  try {
    const postId = req.params.postId;
    
    const comments = await Comment.find({ postId })
      .sort({ createdAt: -1 });
    
    res.status(200).json(comments);
  } catch (error) {
    console.error('Error getting comments:', error);
    res.status(500).json({ error: error.message });
  }
};

// Create a new comment
export const createComment = async (req, res) => {
  try {
    const { postId, content, userName, userId, userImage } = req.body;
    
    // Verify the post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    // Create the comment
    const newComment = new Comment({
      postId,
      content,
      userName,
      userId,
      userImage
    });
    
    const savedComment = await newComment.save();
    res.status(201).json(savedComment);
  } catch (error) {
    console.error('Error creating comment:', error);
    res.status(500).json({ error: error.message });
  }
};

// Delete a comment
export const deleteComment = async (req, res) => {
  try {
    const commentId = req.params.id;
    const clerkUserId = req.auth?.userId;
    
    if (!clerkUserId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    const comment = await Comment.findById(commentId);
    
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    
    // Check if user is the owner of the comment
    if (comment.userId && comment.userId !== clerkUserId) {
      return res.status(403).json({ message: 'You can only delete your own comments' });
    }
    
    await Comment.findByIdAndDelete(commentId);
    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ error: error.message });
  }
};