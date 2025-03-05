
import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, FileText, Tag } from 'lucide-react';
import { Post, Book, Category } from '@/types/admin';

interface DashboardStatsProps {
  posts: Post[];
  books: Book[];
  categories: Category[];
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ posts, books, categories }) => {
  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-100 dark:border-gray-700">
        <div className="flex items-center mb-4">
          <FileText size={20} className="mr-2 text-blue-600 dark:text-blue-400" />
          <h3 className="font-semibold text-gray-900 dark:text-white">Total Posts</h3>
        </div>
        <p className="text-3xl font-bold text-gray-900 dark:text-white">{posts.length}</p>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-100 dark:border-gray-700">
        <div className="flex items-center mb-4">
          <BookOpen size={20} className="mr-2 text-green-600 dark:text-green-400" />
          <h3 className="font-semibold text-gray-900 dark:text-white">Book Recommendations</h3>
        </div>
        <p className="text-3xl font-bold text-gray-900 dark:text-white">{books.length}</p>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-100 dark:border-gray-700">
        <div className="flex items-center mb-4">
          <Tag size={20} className="mr-2 text-yellow-600 dark:text-yellow-400" />
          <h3 className="font-semibold text-gray-900 dark:text-white">Categories</h3>
        </div>
        <p className="text-3xl font-bold text-gray-900 dark:text-white">{categories.length}</p>
      </div>
    </motion.div>
  );
};

export default DashboardStats;
