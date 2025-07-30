import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@clerk/clerk-react';
import axios from 'axios';
import { 
  FiClock, 
  FiCalendar, 
  FiBookmark
} from 'react-icons/fi';

// Import Header and Footer from sections
import Header from "@/sections/Header";
import Footer from "@/sections/Footer";

// Define Post type
interface Post {
  _id: string;
  coverImage: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  readTime: number;
  createdAt: string;
}

const SavedPostsList: React.FC = () => {
  const { userId, isSignedIn, getToken } = useAuth();
  const navigate = useNavigate();
  
  // Fetch saved posts
  const { 
    data: savedPosts, 
    isLoading, 
    error,
    refetch
  } = useQuery({
    queryKey: ['savedPosts'],
    queryFn: async () => {
      try {
        const token = await getToken();
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/users/saved`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        return response.data;
      } catch (error) {
        console.error("Error fetching saved posts:", error);
        throw error;
      }
    },
    enabled: !!isSignedIn // Only run query if user is signed in
  });

  // Redirect to login if not signed in
  React.useEffect(() => {
    if (!isSignedIn) {
      navigate('/login');
    }
  }, [isSignedIn, navigate]);

  // Update document title
  React.useEffect(() => {
    document.title = 'Saved Articles | The Chronicle';
  }, []);

  if (!isSignedIn) {
    return (
      <>
        <Header />
        <main className="bg-magazine-cream p-10">
          <div className="bg-white border border-gray-300 shadow-md max-w-5xl mx-auto p-8 text-center">
            <h1 className="font-playfair text-3xl font-bold mb-6">Please sign in</h1>
            <p className="mb-4">You need to be signed in to view your saved articles.</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (isLoading) {
    return (
      <>
        <Header />
        <main className="bg-magazine-cream p-10">
          <div className="bg-white border border-gray-300 shadow-md max-w-5xl mx-auto p-8 text-center">
            <h1 className="font-playfair text-3xl font-bold mb-6">Loading saved articles...</h1>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <main className="bg-magazine-cream p-10">
          <div className="bg-white border border-gray-300 shadow-md max-w-5xl mx-auto p-8 text-center">
            <h1 className="font-playfair text-3xl font-bold mb-6">Error loading saved articles</h1>
            <p className="mb-4">There was an error loading your saved articles. Please try again later.</p>
            <button 
              onClick={() => refetch()} 
              className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
            >
              Try Again
            </button>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="bg-magazine-cream p-8">
        <div className="container mx-auto">
          <div className="bg-white border border-gray-300 shadow-md p-8 mb-8">
            <div className="flex items-center mb-8">
              <FiBookmark className="text-yellow-500 mr-3" size={24} />
              <h1 className="font-playfair text-3xl font-bold text-magazine-navy">Your Saved Articles</h1>
            </div>
            
            {savedPosts && savedPosts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {savedPosts.map((post: Post) => {
                  // Format date
                  const formattedDate = new Date(post.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  });
                  
                  return (
                    <Link 
                      to={`/blog/${post.slug}`} 
                      key={post._id}
                      className="block border border-gray-200 shadow-sm hover:shadow-md transition-shadow rounded-lg overflow-hidden bg-white"
                    >
                      {/* Post Image */}
                      <div className="relative h-48 overflow-hidden">
                        <img 
                          src={post.coverImage} 
                          alt={post.title} 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = '/placeholder-image.jpg'; // Fallback image
                          }}
                        />
                        <div className="absolute top-0 right-0 bg-yellow-500 text-white text-xs px-2 py-1 m-2">
                          {post.category}
                        </div>
                      </div>
                      
                      {/* Post Content */}
                      <div className="p-4">
                        <h2 className="font-playfair text-xl font-bold text-magazine-navy mb-2 line-clamp-2">
                          {post.title}
                        </h2>
                        
                        <p className="text-magazine-charcoal/80 text-sm mb-4 line-clamp-3">
                          {post.excerpt}
                        </p>
                        
                        <div className="flex justify-between text-xs text-magazine-charcoal/60">
                          <div className="flex items-center">
                            <FiCalendar className="h-3 w-3 mr-1" />
                            <span>{formattedDate}</span>
                          </div>
                          <div className="flex items-center">
                            <FiClock className="h-3 w-3 mr-1" />
                            <span>{post.readTime} min read</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <h2 className="font-playfair text-xl mb-4">You haven't saved any articles yet</h2>
                <p className="text-magazine-charcoal/60 mb-6">
                  Browse our articles and click the bookmark icon to save them for later.
                </p>
                <Link 
                  to="/blog" 
                  className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                >
                  Browse Articles
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default SavedPostsList;