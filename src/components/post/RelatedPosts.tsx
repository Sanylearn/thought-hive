
import React from 'react';
import { motion } from 'framer-motion';
import BlogCard from '../BlogCard';

interface RelatedPost {
  id: string;
  title: string;
  content: string;
  image_url: string | null;
  created_at: string;
  category: string;
}

interface RelatedPostsProps {
  posts: RelatedPost[];
  formatExcerpt: (content: string) => string;
  formatDate: (dateString: string) => string;
}

const RelatedPosts: React.FC<RelatedPostsProps> = ({ posts, formatExcerpt, formatDate }) => {
  if (posts.length === 0) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="border-t border-gray-200 dark:border-gray-700 pt-10 mb-16"
    >
      <h2 className="text-2xl font-serif font-bold mb-6 text-gray-900 dark:text-white">Related Articles</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {posts.map(post => (
          <BlogCard 
            key={post.id}
            id={post.id}
            title={post.title}
            excerpt={formatExcerpt(post.content)}
            date={formatDate(post.created_at)}
            imageUrl={post.image_url || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800&h=600'}
            category={post.category}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default RelatedPosts;
