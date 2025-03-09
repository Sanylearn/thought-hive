
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

const PostNotFound: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto text-center py-20">
      <h1 className="text-2xl font-bold mb-4">Article not found</h1>
      <p className="text-gray-600 dark:text-gray-300 mb-6">
        The article you're looking for doesn't exist or has been removed.
      </p>
      <Link 
        to="/articles"
        className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline"
      >
        <ChevronLeft size={16} className="mr-1" />
        Back to all articles
      </Link>
    </div>
  );
};

export default PostNotFound;
