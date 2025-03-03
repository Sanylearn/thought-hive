
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface BookCardProps {
  id: string;
  title: string;
  author: string;
  summary: string;
  imageUrl: string;
}

const BookCard: React.FC<BookCardProps> = ({ id, title, author, summary, imageUrl }) => {
  return (
    <motion.div 
      className="flex flex-col sm:flex-row items-start gap-6 rounded-lg overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-full sm:w-1/3 lg:w-1/4 aspect-[2/3] overflow-hidden">
        <img 
          src={imageUrl} 
          alt={title} 
          className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
        />
      </div>
      
      <div className="p-6 flex-1">
        <h3 className="font-serif text-xl font-semibold mb-1">{title}</h3>
        <p className="text-gray-600 text-sm mb-3">by {author}</p>
        <p className="text-gray-700 line-clamp-3 mb-4">{summary}</p>
        <Link 
          to={`/book/${id}`} 
          className="inline-flex items-center text-sm font-medium text-gray-900 hover:text-gray-700 transition-colors"
        >
          Read summary
          <svg className="ml-1 w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13.5 4.5L21 12M21 12L13.5 19.5M21 12H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Link>
      </div>
    </motion.div>
  );
};

export default BookCard;
