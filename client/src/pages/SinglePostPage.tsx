import React, { useEffect, useState } from 'react';
import { useParams, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  FiClock, 
  FiCalendar, 
  FiUser,
  FiArrowLeft,
  FiBookmark,
  FiEdit,
  FiTrash2
} from 'react-icons/fi';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useUser, useAuth } from '@clerk/clerk-react';

// Import Header and Footer from sections
import Header from "@/sections/Header";
import Footer from "@/sections/Footer";

// Import Comments and RecentArticles components
import Comments from '@/components/Comments';
import RecentArticles from '@/components/RecentArticles';

// Define types based on your MongoDB schema and backend responses
interface User {
  _id: string;
  username: string;
  img?: string;
  clerkUserId?: string;
  email?: string;
}

interface Post {
  _id: string;
  coverImage: string;
  title: string;
  slug: string;
  excerpt: string;
  user: User;
  author: User;
  authorName: string;
  authorImage: string;
  readTime: number;
  category: string;
  content: any;
  isFeatured: boolean;
  visit: number;
  savedBy?: string[];
  createdAt: string;
  updatedAt: string;
}

// Get the slug from the URL directly as a workaround if useParams() isn't working
function getSlugFromPath(pathname: string): string | null {
  // Check if pathname has the format "/blog/[slug]"
  const match = pathname.match(/\/blog\/([^\/]+)/);
  return match ? match[1] : null;
}

const SinglePostsPage: React.FC = () => {
  const { userId, isSignedIn, getToken } = useAuth();
  const { user } = useUser();
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const queryClient = useQueryClient();
  
  // Try getting slug from useParams() as normal
  const params = useParams<{ slug?: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Fallback: extract slug from the URL if useParams() didn't work
  const urlSlug = getSlugFromPath(location.pathname);
  
  // Use the extracted slug or the one from useParams
  const slug = params.slug || urlSlug;
  
  console.log('[DEBUG] Component mounted');
  console.log('[DEBUG] Current pathname:', location.pathname);
  console.log('[DEBUG] Full params:', params);
  console.log('[DEBUG] Params.slug:', params.slug);
  console.log('[DEBUG] Extracted urlSlug:', urlSlug);
  console.log('[DEBUG] Using slug:', slug);
  
  // Redirect to blog page if no slug is provided
  useEffect(() => {
    if (!slug) {
      console.log('[DEBUG] No slug found, redirecting to blog page');
      navigate('/blog');
    }
  }, [slug, navigate]);

  // Fetch single post by slug
  const { 
    data: post, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['post', slug],
    queryFn: async () => {
      console.log('[queryFn] Fetching post data for slug:', slug);
      try {
        if (!slug) {
          console.error('[queryFn] Cannot fetch post with undefined slug');
          throw new Error('Invalid slug parameter');
        }
        
        const apiUrl = `${import.meta.env.VITE_API_URL}/posts/${slug}`;
        console.log('[queryFn] API URL:', apiUrl);
        
        const res = await axios.get(apiUrl);
        console.log('[queryFn] Post API response:', res.data);
        return res.data;
      } catch (error) {
        console.error("[queryFn] Error fetching post:", error);
        throw error;
      }
    },
    enabled: !!slug // Only run the query if slug is defined
  });

  // Check if current user is the author of the post
  const isAuthor = post && isSignedIn && user?.id === post.user?.clerkUserId;
  
  console.log('[DEBUG] Is author:', isAuthor);

  // Check if post is saved by current user
  useEffect(() => {
    const checkSavedStatus = async () => {
      if (isSignedIn && post) {
        try {
          const token = await getToken();
          const response = await axios.get(`${import.meta.env.VITE_API_URL}/users/saved`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          
          const savedPosts = response.data;
          const postIsSaved = savedPosts.some((savedPost: any) => savedPost._id === post._id);
          setIsSaved(postIsSaved);
        } catch (error) {
          console.error("Error checking saved status:", error);
        }
      }
    };
    
    checkSavedStatus();
  }, [isSignedIn, post, getToken]);

  // Save/unsave post mutation
  const savePostMutation = useMutation({
    mutationFn: async (postId: string) => {
      const token = await getToken();
      return axios.post(
        `${import.meta.env.VITE_API_URL}/users/save-post`,
        { postId },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
    },
    onSuccess: (response) => {
      setIsSaved(!isSaved);
      queryClient.invalidateQueries({ queryKey: ['savedPosts'] });
    },
    onError: (error) => {
      console.error("Error saving/unsaving post:", error);
    }
  });

  // Delete post mutation - now for any authenticated user who is the author
  const deletePostMutation = useMutation({
    mutationFn: async (postId: string) => {
      const token = await getToken();
      return axios.delete(
        `${import.meta.env.VITE_API_URL}/posts/${postId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      navigate('/blog');
    },
    onError: (error) => {
      console.error("Error deleting post:", error);
      alert("Failed to delete post. Please try again.");
    }
  });

  const handleSavePost = () => {
    if (!isSignedIn) {
      // Redirect to sign in page or show sign in modal
      alert("Please sign in to save posts");
      return;
    }
    
    if (post) {
      savePostMutation.mutate(post._id);
    }
  };

  // Handle delete post - now for any authenticated user who is the author
  const handleDeletePost = () => {
    if (!isAuthor) {
      alert("You need to be the author to delete your own posts.");
      return;
    }

    if (window.confirm("Are you sure you want to delete this post? This action cannot be undone.")) {
      deletePostMutation.mutate(post._id);
    }
  };

  // Handle edit post - now for any authenticated user who is the author
  const handleEditPost = () => {
    if (!isAuthor) {
      alert("You need to be the author to edit your own posts.");
      return;
    }

    // Navigate to edit page (you'll need to create this)
    navigate(`/write?edit=${post._id}`);
  };

  useEffect(() => {
    console.log('[useEffect] Post data in effect:', post);
    
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    // Update document title with post title
    if (post) {
      console.log('[useEffect] Setting document title to:', `${post.title} | The Chronicle`);
      document.title = `${post.title} | The Chronicle`;
    }
  }, [post]);

  // If we're redirecting due to missing slug
  if (!slug) {
    console.log('[Render] No slug available, waiting for redirect');
    return (
      <>
        <Header />
        <main className="bg-magazine-cream p-10">
          <div className="bg-white border border-gray-300 shadow-md max-w-5xl mx-auto p-8 text-center">
            <h1 className="font-playfair text-3xl font-bold mb-6">Redirecting to blog page...</h1>
            <p>Path: {location.pathname}</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (isLoading) {
    console.log('[Render] Showing loading state');
    return (
      <>
        <Header />
        <main className="bg-magazine-cream p-10">
          <div className="bg-white border border-gray-300 shadow-md max-w-5xl mx-auto p-8 text-center">
            <h1 className="font-playfair text-3xl font-bold mb-6">Loading post...</h1>
            <p>Looking for: {slug}</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (error || !post) {
    console.log('[Render] Showing error state. Error:', error, 'Post:', post);
    return (
      <>
        <Header />
        <main className="bg-magazine-cream p-10">
          <div className="bg-white border border-gray-300 shadow-md max-w-5xl mx-auto p-8 text-center">
            <h1 className="font-playfair text-3xl font-bold mb-6">Post not found</h1>
            <p className="mb-4">The post you're looking for could not be found.</p>
            <pre className="bg-gray-100 p-4 rounded text-left text-sm mb-4 overflow-auto">
              Requested slug: {slug}
              Path: {location.pathname}
            </pre>
            <Link to="/blog" className="text-yellow-500 hover:text-black inline-flex items-center font-inter">
              <FiArrowLeft className="mr-2" /> Return to blog
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  console.log('[Render] Rendering full post page with data:', {
    title: post.title,
    author: post.author,
    authorName: post.authorName,
    content: typeof post.content
  });

  const formattedDate = new Date(post.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // For backward compatibility - if post.authorName is available use it, otherwise use author.username
  const displayAuthorName = post.authorName || (post.author && post.author.username) || "Unknown Author";
  
  // For backward compatibility - if post.authorImage is available use it, otherwise use author.img
  const displayAuthorImage = post.authorImage || (post.author && post.author.img) || "/default-author.jpg";

  return (
    <>
      <Header />
      <main className="bg-magazine-cream p-8">
        {/* Main grid layout with post and sidebar */}
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main post content - takes up 2/3 of the grid */}
            <div className="lg:col-span-2">
              {/* Newspaper-style frame for main post */}
              <div className="bg-white border border-gray-300 shadow-md">
                {/* Post navigation */}
                <div className="bg-magazine-navy text-white p-4 flex justify-between items-center">
                  <Link to="/blog" className="text-white hover:text-yellow-100 font-inter flex items-center">
                    <FiArrowLeft className="mr-2" /> Back to articles
                  </Link>
                  
                  <div className="flex items-center gap-4">
                    {/* Edit and Delete buttons - only for the author */}
                    {isAuthor && (
                      <>
                        <button
                          onClick={handleEditPost}
                          className="flex items-center text-white hover:text-yellow-300 transition-colors"
                          title="Edit post"
                          disabled={deletePostMutation.isPending}
                        >
                          <FiEdit size={18} className="mr-2" />
                          <span className="hidden sm:inline">Edit</span>
                        </button>
                        <button
                          onClick={handleDeletePost}
                          className="flex items-center text-red-300 hover:text-red-100 transition-colors"
                          title="Delete post"
                          disabled={deletePostMutation.isPending}
                        >
                          <FiTrash2 size={18} className="mr-2" />
                          <span className="hidden sm:inline">Delete</span>
                        </button>
                      </>
                    )}
                    
                    {/* Save Post Button */}
                    <button
                      onClick={handleSavePost}
                      className={`flex items-center ${isSaved ? 'text-yellow-500' : 'text-white'} hover:text-yellow-300 transition-colors`}
                      title={isSaved ? "Unsave post" : "Save post"}
                      disabled={savePostMutation.isPending}
                    >
                      <FiBookmark 
                        className={`${isSaved ? 'fill-yellow-500' : ''} mr-2`} 
                        size={18} 
                      />
                      <span className="hidden sm:inline">{isSaved ? "Saved" : "Save"}</span>
                    </button>
                  </div>
                </div>
                
                <div className="p-4 md:p-6 lg:p-8">
                  {/* Category */}
                  <div className="mb-6">
                    <span className="inline-block bg-yellow-500 text-white text-xs font-medium px-3 py-1">
                      {post.category}
                    </span>
                  </div>
                  
                  {/* Title */}
                  <h1 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold text-magazine-navy mb-6 leading-tight">
                    {post.title}
                  </h1>
                  
                  {/* Metadata */}
                  <div className="flex flex-wrap items-center text-magazine-charcoal/60 mb-8 gap-6">
                    <div className="flex items-center">
                      <FiCalendar className="h-4 w-4 mr-2" />
                      <span>{formattedDate}</span>
                    </div>
                    <div className="flex items-center">
                      <FiClock className="h-4 w-4 mr-2" />
                      <span>{post.readTime} min read</span>
                    </div>
                    <div className="flex items-center">
                      <FiUser className="h-4 w-4 mr-2" />
                      <span>By {displayAuthorName}</span>
                    </div>
                  </div>
                  
                  {/* Featured Image */}
                  <div className="mb-12">
                    <img 
                      src={post.coverImage} 
                      alt={post.title} 
                      className="w-full h-auto max-h-96 object-cover rounded-lg"
                      onError={(e) => {
                        console.error('[Image] Failed to load cover image:', post.coverImage);
                        e.currentTarget.src = '/placeholder-image.jpg'; // Fallback image
                      }}
                    />
                  </div>
                  
                  {/* Author Info Card */}
                  <div className="bg-white p-6 mb-10 border border-gray-200 rounded-lg shadow-sm">
                    <div className="flex items-center">
                      <img 
                        src={displayAuthorImage} 
                        alt={displayAuthorName} 
                        className="w-16 h-16 rounded-full object-cover mr-4"
                        onError={(e) => {
                          console.error('[Image] Failed to load author image:', displayAuthorImage);
                          e.currentTarget.src = '/default-author.jpg'; // Fallback image
                        }}
                      />
                      <div>
                        <h3 className="font-playfair font-semibold text-lg text-magazine-navy">
                          {displayAuthorName}
                        </h3>
                        {post.author && post.author.email && (
                          <p className="text-sm text-magazine-charcoal/60 font-inter">
                            {post.author.email}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Article Content */}
                  <article className="prose prose-lg max-w-none font-inter">
                    {/* Render TipTap content */}
                    {(() => {
                      console.log('[Content Rendering] Content type:', typeof post.content);
                      const contentToRender = typeof post.content === 'string' 
                        ? post.content 
                        : post.content ? JSON.stringify(post.content) : '';
                      return (
                        <div dangerouslySetInnerHTML={{ __html: contentToRender }} />
                      );
                    })()}
                  </article>
                </div>
              </div>

              {/* Comments Section - Moved from sidebar to below the article */}
              <div className="mt-8">
                <Comments postId={post._id} />
              </div>
            </div>

            {/* Sidebar content - takes up 1/3 of the grid */}
            <div className="space-y-8">
              {/* Recent Articles Component (outside the main post box) */}
              <RecentArticles 
                currentPostId={post._id}
                category={post.category}
                title="Related Articles" 
              />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default SinglePostsPage;