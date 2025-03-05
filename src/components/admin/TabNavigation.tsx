
import React from 'react';

interface TabNavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, setActiveTab }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 mb-8">
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setActiveTab('posts')}
          className={`px-6 py-3 text-sm font-medium ${
            activeTab === 'posts' 
              ? 'border-b-2 border-gray-900 dark:border-gray-300 text-gray-900 dark:text-white' 
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          Posts
        </button>
        <button
          onClick={() => setActiveTab('books')}
          className={`px-6 py-3 text-sm font-medium ${
            activeTab === 'books' 
              ? 'border-b-2 border-gray-900 dark:border-gray-300 text-gray-900 dark:text-white' 
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          Books
        </button>
        <button
          onClick={() => setActiveTab('categories')}
          className={`px-6 py-3 text-sm font-medium ${
            activeTab === 'categories' 
              ? 'border-b-2 border-gray-900 dark:border-gray-300 text-gray-900 dark:text-white' 
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          Categories
        </button>
      </div>
    </div>
  );
};

export default TabNavigation;
