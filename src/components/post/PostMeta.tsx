
import React from 'react';
import { Clock, User } from 'lucide-react';

interface PostMetaProps {
  date: string;
  readTime: string;
  author?: string;
}

const PostMeta: React.FC<PostMetaProps> = ({ date, readTime, author }) => {
  return (
    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-6">
      <time dateTime={date}>{date}</time>
      <span className="mx-2">•</span>
      <span className="flex items-center">
        <Clock size={14} className="mr-1" />
        {readTime}
      </span>
      {author && (
        <>
          <span className="mx-2">•</span>
          <span className="flex items-center">
            <User size={14} className="mr-1" />
            {author}
          </span>
        </>
      )}
    </div>
  );
};

export default PostMeta;
