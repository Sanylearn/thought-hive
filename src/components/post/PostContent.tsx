
import React from 'react';
import { motion } from 'framer-motion';
import PostMeta from './PostMeta';
import SharePost from './SharePost';
import type { Post } from '@/types/admin';

interface PostContentProps {
  post: Post;
  formattedDate: string;
  readTime: string;
  author?: string;
}

const PostContent: React.FC<PostContentProps> = ({ post, formattedDate, readTime, author }) => {
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <span className="inline-block bg-gray-100 dark:bg-gray-800 px-3 py-1 text-sm font-medium rounded-full mb-4">
          {post.category}
        </span>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold mb-4 leading-tight text-gray-900 dark:text-white">
          {post.title}
        </h1>
        
        <PostMeta date={formattedDate} readTime={readTime} author={author} />
        
        <div className="flex items-center gap-3 mb-8">
          <SharePost />
        </div>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mb-10"
      >
        {post.image_url && (
          <img 
            src={post.image_url} 
            alt={post.title}
            className="w-full h-auto rounded-xl object-cover aspect-[16/9] mb-8"
          />
        )}
        
        <div 
          className="blog-content prose prose-gray dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </motion.div>
    </>
  );
};

export default PostContent;
