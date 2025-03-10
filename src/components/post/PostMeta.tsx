
import React from 'react';
import { Clock } from 'lucide-react';

const PostMeta = ({ date, readTime }) => {
  return (
    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-6">
      <time dateTime={date}>{date}</time>
      <span className="mx-2">•</span>
      <span className="flex items-center">
        <Clock size={14} className="mr-1" />
        {readTime}
      </span>
    </div>
  );
};

export default PostMeta;
