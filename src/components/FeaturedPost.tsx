
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface FeaturedPostProps {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  imageUrl: string;
  category: string;
}

const FeaturedPost: React.FC<FeaturedPostProps> = ({ id, title, excerpt, date, imageUrl, category }) => {
  return (
    <motion.div 
      className="relative rounded-xl overflow-hidden h-[500px] mb-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7 }}
    >
      <div className="absolute inset-0">
        <img 
          src={imageUrl} 
          alt={title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <span className="inline-block bg-white/90 backdrop-blur-sm text-black px-3 py-1 text-sm font-medium rounded-full mb-4">
            {category}
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white mb-3 leading-tight">
            {title}
          </h2>
          <p className="text-gray-200 text-base sm:text-lg mb-4 max-w-2xl line-clamp-2">
            {excerpt}
          </p>
          <div className="flex items-center justify-between">
            <p className="text-gray-300 text-sm">{date}</p>
            <Link 
              to={`/post/${id}`}
              className="inline-flex items-center text-white bg-black/40 backdrop-blur-sm hover:bg-black/60 px-4 py-2 rounded-full transition-colors duration-300"
            >
              Read article
              <svg className="ml-2 w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13.5 4.5L21 12M21 12L13.5 19.5M21 12H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default FeaturedPost;
