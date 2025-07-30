import React, { useState } from 'react';
import { articles } from '@/constants/blogConstants';
import { Search } from 'lucide-react';

type SideMenuProps = {
  onSearchChange: (searchTerm: string) => void;
  onCategoryChange: (categories: string[]) => void;
  onSortChange: (sort: string) => void;
};

const SideMenu: React.FC<SideMenuProps> = ({
  onSearchChange,
  onCategoryChange,
  onSortChange,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sort, setSort] = useState('newest');

  const categories = Array.from(new Set(articles.map(article => article.category)));

  const handleCategoryChange = (category: string) => {
    let updated: string[];
    if (selectedCategories.includes(category)) {
      updated = selectedCategories.filter(c => c !== category);
    } else {
      updated = [...selectedCategories, category];
    }
    setSelectedCategories(updated);
    onCategoryChange(updated);
  };

  const handleSortChange = (sortOption: string) => {
    setSort(sortOption);
    onSortChange(sortOption);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    onSearchChange(value);
  };

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 sticky top-20 w-full">
      <h2 className="text-xl font-serif font-bold mb-4">Filter Posts</h2>

      {/* Search input */}
      <div className="relative mb-6">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="w-full border rounded-lg pl-10 pr-3 py-2 focus:ring-1 focus:ring-magazine-gold focus:border-magazine-gold"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
      </div>

      {/* Categories */}
      <div>
        <h3 className="font-bold mb-2 text-sm uppercase text-gray-600">Categories</h3>
        <ul className="space-y-2">
          {categories.map((category) => (
            <li key={category}>
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category)}
                  onChange={() => handleCategoryChange(category)}
                  className="rounded border-gray-300 text-magazine-gold focus:ring-magazine-gold mr-2"
                />
                <span>{category}</span>
                <span className="ml-auto text-gray-500 text-sm">
                  {articles.filter(article => article.category === category).length}
                </span>
              </label>
            </li>
          ))}
        </ul>
      </div>

      {/* Date filter */}
      <div className="mt-6">
        <h3 className="font-bold mb-2 text-sm uppercase text-gray-600">Date</h3>
        <div className="space-y-2">
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="date"
              value="newest"
              checked={sort === 'newest'}
              onChange={() => handleSortChange('newest')}
              className="text-magazine-gold focus:ring-magazine-gold mr-2"
            />
            <span>Newest first</span>
          </label>
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="date"
              value="oldest"
              checked={sort === 'oldest'}
              onChange={() => handleSortChange('oldest')}
              className="text-magazine-gold focus:ring-magazine-gold mr-2"
            />
            <span>Oldest first</span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default SideMenu;
