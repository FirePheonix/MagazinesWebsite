import React from 'react';
import { Link } from 'react-router-dom';
import { FiClock, FiArrowRight } from 'react-icons/fi';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

interface Post {
  _id: string;
  coverImage: string;
  title: string;
  slug: string;
  readTime: number;
  createdAt: string;
  category: string;
}

interface RecentArticlesProps {
  currentPostId?: string;
  category?: string;
  limit?: number;
  title?: string;
}

const RecentArticles: React.FC<RecentArticlesProps> = ({ 
  currentPostId, 
  category, 
  limit = 3,
  title = "Recent Articles" 
}) => {
  const { data: articles = [], isLoading } = useQuery({
    queryKey: ['recentArticles', category, limit],
    queryFn: async () => {
      try {
        // Use fallback API URL if environment variable is not set
        const apiUrl = import.meta.env.VITE_API_URL || 'https://magazines-website.vercel.app';
        const res = await axios.get(`${apiUrl}/posts`);
        
        // Filter and sort posts
        let filtered = res.data;
        
        // Skip current post if ID is provided
        if (currentPostId) {
          filtered = filtered.filter((post: Post) => post._id !== currentPostId);
        }
        
        // Filter by category if provided
        if (category) {
          filtered = filtered.filter((post: Post) => post.category === category);
        }
        
        // Sort by created date (newest first)
        filtered.sort((a: Post, b: Post) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        
        // Return only the specified limit
        return filtered.slice(0, limit);
      } catch (error) {
        console.error("Error fetching recent articles:", error);
        return [];
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return (
    <div className="bg-white border border-gray-300 shadow-md rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-playfair text-2xl font-bold text-magazine-navy">
          {title}
        </h2>
        <Link 
          to="/blog" 
          className="text-yellow-500 hover:text-magazine-navy transition flex items-center font-inter text-sm"
        >
          View all <FiArrowRight className="ml-1" />
        </Link>
      </div>
      
      {isLoading ? (
        <div className="py-8 text-center text-gray-500">Loading articles...</div>
      ) : articles.length === 0 ? (
        <div className="py-8 text-center text-gray-500">No articles found</div>
      ) : (
        <div className="space-y-6">
          {articles.map((post: Post) => (
            <Link 
              key={post._id}
              to={`/blog/${post.slug}`}
              className="block group" 
            >
              <div className="flex items-start space-x-4">
                <div className="w-24 h-24 flex-shrink-0 overflow-hidden rounded">
                  <img 
                    src={post.coverImage} 
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder-image.jpg'; // Fallback image
                    }}
                  />
                </div>
                <div className="flex-1">
                  <div className="mb-1">
                    <span className="text-xs font-medium text-yellow-500 uppercase">{post.category}</span>
                  </div>
                  <h3 className="font-playfair font-semibold text-lg text-magazine-navy line-clamp-2 group-hover:text-yellow-500 transition-colors">
                    {post.title}
                  </h3>
                  <div className="flex items-center mt-2 text-xs text-magazine-charcoal/60 font-inter">
                    <FiClock className="h-3 w-3 mr-1" />
                    <span>{post.readTime} min read</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentArticles;