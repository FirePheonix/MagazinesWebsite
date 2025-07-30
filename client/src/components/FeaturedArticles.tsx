import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiClock, FiArrowRight } from 'react-icons/fi';
import { Article } from '@/constants/blogConstants';

// Simple cn utility function
function cn(...classes: (string | false | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

// Custom Button Component
const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({
  className = '',
  children,
  ...props
}) => {
  return (
    <button
      className={cn(
        'inline-flex items-center px-4 py-2 rounded-xl font-medium transition-colors',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

// Import the blog posts to display as featured articles
import { articles } from '@/constants/blogConstants';

const FeaturedArticles: React.FC = () => {
  const [showAll, setShowAll] = useState(false);

  const visibleArticles = showAll ? articles : articles.slice(0, 5);

  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto w-[85%] px-4 md:px-6">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-playfair">Featured Articles</h2>
          <Button
            className="text-yellow-500 hover:text-black font-inter"
            onClick={() => setShowAll((prev) => !prev)}
          >
            {showAll ? 'Show less' : 'View all'}{' '}
            <FiArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {visibleArticles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </div>
    </section>
  );
};

const ArticleCard: React.FC<{ article: Article }> = ({ article }) => {
  return (
    <Link to={`/blog/${article.id}`} className="block">
      <div
        className={cn(
          "group flex flex-col rounded-lg overflow-hidden border border-gray-100 transition-transform hover:-translate-y-1 hover:shadow-lg",
          article.featured && "md:col-span-2 md:flex-row"
        )}
      >
        <div
          className={cn(
            "relative h-60 overflow-hidden",
            article.featured ? "md:w-1/2 md:h-auto" : ""
          )}
        >
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover transition-transform group-hover:scale-105"
          />
          <div className="absolute top-0 left-0 bg-yellow-500 text-white text-xs font-medium px-3 py-1">
            {article.category}
          </div>
        </div>

        <div
          className={cn(
            "flex flex-col p-6 bg-white flex-grow",
            article.featured && "md:w-1/2"
          )}
        >
          <h3 className="font-playfair text-xl md:text-2xl font-semibold mb-3 line-clamp-2 group-hover:text-yellow-500 transition-colors">
            {article.title}
          </h3>
          <p className="text-gray-700 mb-4 line-clamp-3 font-inter">{article.excerpt}</p>
          <div className="mt-auto flex items-center text-sm text-gray-500 font-inter">
            <FiClock className="h-4 w-4 mr-1" />
            <span>{article.readTime} read</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default FeaturedArticles;