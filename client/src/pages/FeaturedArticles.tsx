import React, { useState } from 'react';
import PostList from '@/components/PostList';
import Header from '@/sections/Header';
import Footer from '@/sections/Footer';

const FeaturedArticlesPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-magazine-cream">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="font-serif text-3xl md:text-4xl font-bold mb-8 text-magazine-navy">Featured Articles</h1>
        
        <PostList />
      </main>
      <Footer />
    </div>
  );
};

export default FeaturedArticlesPage;