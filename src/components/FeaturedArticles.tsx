import React from 'react';
import { Clock, ArrowRight } from 'lucide-react';
import { useState } from 'react';

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

interface Article {
  id: number;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  readTime: string;
  featured?: boolean;
}
const articles: Article[] = [
    {
      id: 1,
      title: "Inside IIIT Sonepat: Innovation at the Core",
      excerpt: "Explore how IIIT Sonepat fosters innovation and entrepreneurship through its student-led initiatives and mentorship programs.",
      image: "/assets/FeaturedArticlesImages/TechnoCampus.jpg",
      category: "Campus Life",
      readTime: "6 min",
      featured: true
    },
    {
      id: 2,
      title: "How IIIT Sonepat Students are Cracking Google and Amazon",
      excerpt: "A deep dive into the preparation strategies and placement stories of top-achieving students at IIIT Sonepat.",
      image: "/assets/FeaturedArticlesImages/GoogleAmazon.jpg",
      category: "Placements",
      readTime: "7 min"
    },
    {
      id: 3,
      title: "Festive Vibes: A Glimpse of Technika & Kalrav",
      excerpt: "From hackathons to cultural dance battles, discover how students balance code and culture at IIIT Sonepat.",
      image: "/assets/FeaturedArticlesImages/Convocation.jpg",
      category: "Events",
      readTime: "5 min"
    },
    {
      id: 4,
      title: "IIIT Sonepat’s AI Club: Building the Future, Byte by Byte",
      excerpt: "An inside look at one of the most active student communities working on real-world AI and ML projects.",
      image: "/assets/FeaturedArticlesImages/TechnoClassroom.jpg",
      category: "Clubs",
      readTime: "6 min"
    },
    {
      id: 5,
      title: "The Hostel Life: More Than Just Shared Rooms",
      excerpt: "Late-night coding, chai breaks, and bonding – experience hostel life through the lens of IIIT Sonepat students.",
      image: "/assets/FeaturedArticlesImages/Classroom.jpg",
      category: "Student Life",
      readTime: "4 min"
    },
    {
      id: 6,
      title: "From Sonepat to Silicon Valley: IIIT Alumni Speak",
      excerpt: "Success stories of alumni making it big globally and how their roots in IIIT Sonepat helped shape them.",
      image: "/assets/FeaturedArticlesImages/IIITLogo.jpg",
      category: "Alumni",
      readTime: "6 min"
    },
    {
      id: 7,
      title: "The Startup Scene: IIIT Sonepat’s Budding Entrepreneurs",
      excerpt: "Meet the founders and teams behind the next big startups emerging from this tech-savvy campus.",
      image: "/assets/FeaturedArticlesImages/Convocation.jpg",
      category: "Entrepreneurship",
      readTime: "7 min",
      featured: true
    },
    {
      id: 8,
      title: "Cracking GSoC from IIIT Sonepat: The Open Source Way",
      excerpt: "Discover how students at IIIT Sonepat are contributing to global projects through Google Summer of Code.",
      image: "/assets/FeaturedArticlesImages/GoogleAmazon.jpg",
      category: "Open Source",
      readTime: "5 min"
    },
    {
      id: 9,
      title: "Academic Rigour at IIIT Sonepat: Not Just Another Coding College",
      excerpt: "The curriculum, faculty, and projects that make IIIT Sonepat stand out in India’s tech education space.",
      image: "/assets/FeaturedArticlesImages/Classroom.jpg",
      category: "Academics",
      readTime: "6 min"
    },
    {
      id: 10,
      title: "Why IIIT Sonepat is One of the Fastest Growing IIITs",
      excerpt: "Explore the journey of IIIT Sonepat from a fledgling institution to a highly competitive engineering college.",
      image: "/assets/FeaturedArticlesImages/IIITLogo.jpg",
      category: "About IIIT",
      readTime: "5 min"
    }
  ];
  
  

const FeaturedArticles: React.FC = () => {
    const [showAll, setShowAll] = useState(false);
  
    const visibleArticles = showAll ? articles : articles.slice(0, 5);
  
    return (
      <section className="py-16 md:py-24">
        <div className="mx-auto w-[85%] px-4 md:px-6">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">Featured Articles</h2>
            <Button
              className="text-yellow-500 hover:text-black"
              onClick={() => setShowAll((prev) => !prev)}
            >
              {showAll ? 'Show less' : 'View all'}{' '}
              <ArrowRight className="ml-2 h-4 w-4" />
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
    <div
      className={cn(
        "group flex flex-col rounded-lg overflow-hidden border border-gray-100 transition-transform hover:-translate-y-1 hover:shadow-lg",
        article.featured && "md:col-span-2 md:flex-row"
      )}
    >
      <h1></h1>
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
        <h3 className="font-serif text-xl md:text-2xl font-semibold mb-3 line-clamp-2 group-hover:text-yellow-500 transition-colors">
          {article.title}
        </h3>
        <p className="text-gray-700 mb-4 line-clamp-3">{article.excerpt}</p>
        <div className="mt-auto flex items-center text-sm text-gray-500">
          <Clock className="h-4 w-4 mr-1" />
          <span>{article.readTime} read</span>
        </div>
      </div>
    </div>
  );
};

export default FeaturedArticles;
