
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface BlogCardProps {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  imageUrl: string;
  category: string;
}

const BlogCard: React.FC<BlogCardProps> = ({ id, title, excerpt, date, imageUrl, category }) => {
  return (
    <motion.article 
      className="overflow-hidden rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <Link to={`/post/${id}`}>
        <div className="relative h-48 overflow-hidden">
          <img 
            src={imageUrl} 
            alt={title}
            className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-4 left-4">
            <span className="inline-block bg-white/90 backdrop-blur-sm px-3 py-1 text-xs font-medium rounded-full">
              {category}
            </span>
          </div>
        </div>
        <div className="p-6">
          <p className="text-sm text-gray-500 mb-2">{date}</p>
          <h3 className="font-serif text-xl font-semibold mb-2 leading-tight">{title}</h3>
          <p className="text-gray-600 text-sm line-clamp-3">{excerpt}</p>
          <div className="mt-4">
            <span className="inline-flex items-center text-sm font-medium text-gray-900 hover:text-gray-700">
              Read more
              <svg className="ml-1 w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13.5 4.5L21 12M21 12L13.5 19.5M21 12H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
};

export default BlogCard;
