import React, { useState } from 'react';
import axios from 'axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FiUser, FiSend, FiTrash2 } from 'react-icons/fi';
import { SignedIn, SignedOut, SignInButton, useUser, useAuth } from '@clerk/clerk-react';

interface CommentType {
  _id: string;
  postId: string;
  userId: string;
  userName: string;
  userImage?: string;
  content: string;
  createdAt: string;
}

interface CommentsProps {
  postId: string;
}

const Comments: React.FC<CommentsProps> = ({ postId }) => {
  const [newComment, setNewComment] = useState('');
  const [showSignInPrompt, setShowSignInPrompt] = useState(false);
  const queryClient = useQueryClient();
  
  // Clerk authentication hooks
  const { user, isSignedIn } = useUser();
  const { getToken } = useAuth();

  // Fetch comments for this post
  const { data: comments = [], isLoading } = useQuery({
    queryKey: ['comments', postId],
    queryFn: async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/comments/${postId}`);
        return response.data;
      } catch (error) {
        console.error('Error fetching comments:', error);
        return [];
      }
    },
  });

  // Add comment mutation
  const addCommentMutation = useMutation({
    mutationFn: async (newCommentData: { postId: string; userName: string; content: string; userId?: string; userImage?: string }) => {
      const token = isSignedIn ? await getToken() : null;
      
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/comments`, 
        newCommentData,
        token ? { headers: { Authorization: `Bearer ${token}` } } : undefined
      );
      
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
      setNewComment('');
      setShowSignInPrompt(false);
    },
  });

  // Delete comment mutation
  const deleteCommentMutation = useMutation({
    mutationFn: async (commentId: string) => {
      const token = isSignedIn ? await getToken() : null;
      
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/comments/${commentId}`,
        token ? { headers: { Authorization: `Bearer ${token}` } } : undefined
      );
      
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
    },
  });

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    if (!isSignedIn) {
      setShowSignInPrompt(true);
      return;
    }
    
    // User is signed in, proceed with comment
    addCommentMutation.mutate({
      postId,
      userName: user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : 'Guest',
      userId: user?.id,
      userImage: user?.imageUrl,
      content: newComment.trim()
    });
  };

  const handleGuestComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    // Allow guest comments
    addCommentMutation.mutate({
      postId,
      userName: 'Guest',
      content: newComment.trim()
    });
  };

  const handleDeleteComment = (commentId: string) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      deleteCommentMutation.mutate(commentId);
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white border border-gray-300 shadow-md rounded-lg p-6">
      <h2 className="font-playfair text-2xl font-bold text-magazine-navy mb-6">
        Comments
      </h2>
      
      {/* Comment Form */}
      <form onSubmit={handleSubmitComment} className="mb-8">
        <div className="mb-4 relative">
          <div className="flex items-center mb-3">
            <SignedIn>
              {user?.imageUrl ? (
                <img 
                  src={user.imageUrl} 
                  alt={user.firstName || 'User'} 
                  className="w-10 h-10 rounded-full mr-3" 
                />
              ) : (
                <div className="bg-gray-100 rounded-full w-10 h-10 flex items-center justify-center mr-3">
                  <FiUser className="text-gray-500" />
                </div>
              )}
            </SignedIn>
            
            <SignedOut>
              <div className="bg-gray-100 rounded-full w-10 h-10 flex items-center justify-center mr-3">
                <FiUser className="text-gray-500" />
              </div>
            </SignedOut>
            
            <textarea
              placeholder="Add a comment..."
              className="w-full p-3 pr-12 border border-gray-300 rounded-md font-inter min-h-[100px]"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              required
            />
          </div>
          
          <button
            type="submit"
            className="absolute right-3 bottom-3 bg-yellow-500 text-white p-2 rounded-full hover:bg-yellow-600 transition"
            disabled={addCommentMutation.isPending}
          >
            <FiSend />
          </button>
        </div>
        
        {addCommentMutation.isError && (
          <p className="text-red-500 text-sm">Failed to post comment. Please try again.</p>
        )}
        
        {/* Sign In Prompt */}
        {showSignInPrompt && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex flex-col sm:flex-row items-center justify-between">
            <div className="mb-3 sm:mb-0">
              <h4 className="font-semibold text-blue-800">Want to join the conversation?</h4>
              <p className="text-blue-600 text-sm">Sign in to continue</p>
            </div>
            <div className="flex space-x-3">
              <SignInButton>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition">
                  Sign In
                </button>
              </SignInButton>
              <button 
                onClick={handleGuestComment}
                className="border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-md font-medium transition"
              >
                Continue as Guest
              </button>
            </div>
          </div>
        )}
      </form>
      
      {/* Comments List */}
      <div className="space-y-6">
        {isLoading ? (
          <p className="text-center py-4 text-gray-500">Loading comments...</p>
        ) : comments.length === 0 ? (
          <p className="text-center py-4 text-gray-500">No comments yet. Be the first to comment!</p>
        ) : (
          comments.map((comment: CommentType) => (
            <div key={comment._id} className="border-b border-gray-200 pb-4 last:border-0">
              <div className="flex items-start">
                <div className="bg-gray-100 rounded-full w-10 h-10 flex items-center justify-center mr-3">
                  {comment.userImage ? (
                    <img 
                      src={comment.userImage} 
                      alt={comment.userName} 
                      className="w-10 h-10 rounded-full"
                      onError={(e) => {
                        e.currentTarget.src = '/default-user.jpg'; // Fallback image
                      }} 
                    />
                  ) : (
                    <FiUser className="text-gray-500" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold text-magazine-navy">{comment.userName}</h4>
                    <div className="flex items-center">
                      <span className="text-xs text-gray-500">{formatDate(comment.createdAt)}</span>
                      {/* Only show delete button for the comment owner or admin */}
                      {(isSignedIn && user?.id === comment.userId) && (
                        <button 
                          onClick={() => handleDeleteComment(comment._id)}
                          className="ml-3 text-gray-400 hover:text-red-500"
                          aria-label="Delete comment"
                        >
                          <FiTrash2 size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="text-magazine-charcoal font-inter">{comment.content}</p>
                </div>
              </div>
            </div>
          ))
        )}
        
        {/* Loading more comments UI if needed */}
        {comments.length > 0 && (
          <button 
            className="w-full py-2 text-sm text-magazine-navy hover:text-yellow-500 transition font-inter"
          >
            View all comments
          </button>
        )}
      </div>
    </div>
  );
};

export default Comments;