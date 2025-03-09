
import React from 'react';
import { Calendar, Clock } from 'lucide-react';

interface PostMetaProps {
  date: string;
  readTime: string;
}

const PostMeta: React.FC<PostMetaProps> = ({ date, readTime }) => {
  return (
    <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400 mb-6">
      <div className="flex items-center gap-1">
        <Calendar size={16} />
        <span className="text-sm">{date}</span>
      </div>
      <div className="flex items-center gap-1">
        <Clock size={16} />
        <span className="text-sm">{readTime}</span>
      </div>
    </div>
  );
};

export default PostMeta;
