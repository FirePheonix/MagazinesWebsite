import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock } from 'lucide-react';
import { useInfiniteQuery } from '@tanstack/react-query';
import axios from "axios";
import Filter from '@/components/SideMenu';
import { useInView } from 'react-intersection-observer';

// Define types based on your updated MongoDB schema
interface User {
  _id: string;
  username: string;
  img?: string;
  clerkUserId: string;
  email: string;
}

interface Post {
  _id: string;
  coverImage: string;
  title: string;
  slug: string;
  excerpt: string;
  user: User | string; // Can be populated or just ID
  author: User | string; // Can be populated or just ID
  authorName: string;
  authorImage: string;
  readTime: number;
  category: string;
  content: object;
  isFeatured: boolean;
  visit: number;
  savedBy: string[];
  createdAt: string;
  updatedAt: string;
}

const fetchPosts = async ({ pageParam = 1 }) => {
  try {
    // Check if your API supports pagination - if not, we'll handle it client-side
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/posts`, {
      params: {
        page: pageParam,
        limit: 5 // Fetch 5 posts per page
      }
    });
    
    // Handle both paginated and non-paginated responses
    if (res.data.posts && typeof res.data.totalPosts !== 'undefined') {
      // Server supports pagination
      return {
        posts: res.data.posts,
        totalPosts: res.data.totalPosts,
        nextPage: pageParam < Math.ceil(res.data.totalPosts / 5) ? pageParam + 1 : null
      };
    } else if (Array.isArray(res.data)) {
      // Server returns all posts at once - implement client-side pagination
      const allPosts = res.data;
      const start = (pageParam - 1) * 5;
      const end = start + 5;
      const paginatedPosts = allPosts.slice(start, end);
      
      return {
        posts: paginatedPosts,
        totalPosts: allPosts.length,
        nextPage: end < allPosts.length ? pageParam + 1 : null
      };
    }
    
    // Fallback for unexpected response format
    console.warn("Unexpected API response format:", res.data);
    return {
      posts: Array.isArray(res.data) ? res.data : [],
      totalPosts: Array.isArray(res.data) ? res.data.length : 0,
      nextPage: null
    };
  } catch (error) {
    console.error("Error fetching posts:", error);
    return { posts: [], totalPosts: 0, nextPage: null };
  }
};

const PostList: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState<string>('newest');
  const [showLoadMore, setShowLoadMore] = useState(false);
  
  // Setup intersection observer for infinite scroll
  const { ref, inView } = useInView({
    threshold: 0.5,
    triggerOnce: false
  });
  
  const { 
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status
  } = useInfiniteQuery({
    queryKey: ['posts'],
    queryFn: fetchPosts,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 1
  });
  
  // Fetch next page when the user scrolls to the bottom or clicks the load more button
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage, isFetchingNextPage]);

  const handlePostClick = (slug: string): void => {
    navigate(`/blog/${slug}`);
  };
  
  const allPosts = useMemo(() => {
    return data?.pages?.flatMap(page => page.posts) || [];
  }, [data]);
  
  const filteredAndSortedArticles = useMemo(() => {
    if (!allPosts || allPosts.length === 0) return [];
    
    const filtered = allPosts.filter((post: Post) => {
      const matchesSearch = searchTerm === '' || 
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
        
      const matchesCategory = selectedCategories.length === 0 || 
        selectedCategories.includes(post.category);
        
      return matchesSearch && matchesCategory;
    });
    
    return filtered.sort((a: Post, b: Post) => {
      if (sortOption === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else if (sortOption === 'oldest') {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      return 0;
    });
  }, [searchTerm, selectedCategories, sortOption, allPosts]);
  
  // Option to show load more button instead of automatic infinite scroll
  const handleLoadMore = () => {
    if (hasNextPage) {
      fetchNextPage();
    }
  };
  
  if (status === 'pending') return <div className="py-8 text-center">Loading articles...</div>;
  if (status === 'error') return <div className="py-8 text-center text-red-500">Error loading articles. Please try again later.</div>;
  
  return (
    <div className="flex flex-col md:flex-row gap-8">
      <div className="md:w-2/3 order-2 md:order-1">
        <div className="space-y-8">
          {filteredAndSortedArticles.length > 0 ? (
            <>
              {filteredAndSortedArticles.map((post: Post) => (
                <div 
                  key={post._id} 
                  className="flex flex-col md:flex-row gap-4 border-b pb-6 cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => handlePostClick(post.slug)}
                >
                  <div className="md:w-1/3">
                    <img 
                      src={post.coverImage} 
                      alt={post.title} 
                      className="w-full h-48 object-cover rounded-md"
                      onError={(e) => {
                        // Fallback image if the main image fails to load
                        (e.target as HTMLImageElement).src = '/default-cover.jpg';
                      }}
                    />
                  </div>
                  <div className="md:w-2/3 space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="bg-magazine-gold text-white px-2 py-0.5 rounded-sm">
                        {post.category}
                      </span>
                      <span className="text-gray-500 flex items-center">
                        <Clock className="h-3 w-3 mr-1" /> {post.readTime} min
                      </span>
                    </div>
                    <h2 className="font-serif text-xl font-bold">{post.title}</h2>
                    <p className="text-gray-600">{post.excerpt}</p>
                    <div className="flex items-center gap-3 pt-2">
                      <img 
                        src={post.authorImage || '/default-author.jpg'} 
                        alt={post.authorName} 
                        className="w-8 h-8 rounded-full object-cover"
                        onError={(e) => {
                          // Fallback image if author image fails to load
                          (e.target as HTMLImageElement).src = '/default-author.jpg';
                        }}
                      />
                      <div>
                        <p className="text-sm font-medium">{post.authorName}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(post.createdAt).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Show Load More button or infinite scroll indicator */}
              {showLoadMore ? (
                <div className="flex justify-center mt-8">
                  <button
                    onClick={handleLoadMore}
                    disabled={!hasNextPage || isFetchingNextPage}
                    className="bg-magazine-navy text-white px-6 py-2 rounded-md hover:bg-magazine-navy/90 disabled:opacity-50"
                  >
                    {isFetchingNextPage ? 'Loading more...' : hasNextPage ? 'Show More' : 'No more articles'}
                  </button>
                </div>
              ) : (
                <div 
                  ref={ref} 
                  className="py-4 text-center text-sm text-gray-500"
                >
                  {isFetchingNextPage ? 'Loading more articles...' : hasNextPage ? 'Scroll for more' : 'No more articles to show'}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No articles found matching your criteria.</p>
              <p className="text-sm text-gray-400 mt-2">Try adjusting your filters.</p>
            </div>
          )}
        </div>
      </div>
      
      <div className="md:w-1/3 order-1 md:order-2">
        <div className="sticky top-24">
          <div className="mb-4">
            <label className="flex items-center mb-2">
              <input
                type="checkbox"
                checked={showLoadMore}
                onChange={() => setShowLoadMore(!showLoadMore)}
                className="mr-2"
              />
              <span className="text-sm">Use "Show More" button instead of automatic loading</span>
            </label>
          </div>
          <Filter 
            onCategoryChange={setSelectedCategories}
            onSortChange={setSortOption}
            onSearchChange={setSearchTerm}
          />
        </div>
      </div>
    </div>
  );
};

export default PostList;