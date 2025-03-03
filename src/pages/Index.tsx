
import React from 'react';
import Layout from '../components/Layout';
import FeaturedPost from '../components/FeaturedPost';
import BlogCard from '../components/BlogCard';
import BookCard from '../components/BookCard';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

// Mock data for the demo
const featuredPost = {
  id: '1',
  title: 'The Future of Artificial Intelligence in Everyday Life',
  excerpt: 'As AI continues to evolve, we examine its growing impact on our daily routines and what this means for society.',
  date: 'May 15, 2023',
  imageUrl: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=1600&h=800',
  category: 'Technology'
};

const recentPosts = [
  {
    id: '2',
    title: 'How Minimalism Changed My Perspective on Consumerism',
    excerpt: 'A personal journey through adopting minimalist principles and how it transformed my relationship with material possessions.',
    date: 'April 28, 2023',
    imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&h=600',
    category: 'Lifestyle'
  },
  {
    id: '3',
    title: 'The Overlooked Benefits of Deep Reading in a Digital Age',
    excerpt: 'In an era of short attention spans, the cognitive and emotional benefits of deep reading are more important than ever.',
    date: 'April 15, 2023',
    imageUrl: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&h=600',
    category: 'Culture'
  },
  {
    id: '4',
    title: 'Why Privacy Should Be Your Primary Concern Online',
    excerpt: 'With increasing data breaches and surveillance, protecting your digital footprint has never been more crucial.',
    date: 'March 30, 2023',
    imageUrl: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=800&h=600',
    category: 'Privacy'
  }
];

const recommendedBooks = [
  {
    id: '1',
    title: 'Thinking, Fast and Slow',
    author: 'Daniel Kahneman',
    summary: 'Explores the two systems that drive how we think—System 1 is fast, intuitive, and emotional; System 2 is slower, more deliberative, and more logical.',
    imageUrl: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=600&h=900'
  },
  {
    id: '2',
    title: 'Sapiens: A Brief History of Humankind',
    author: 'Yuval Noah Harari',
    summary: 'A sweeping narrative that explores the ways in which biology and history have defined us and enhanced our understanding of what it means to be "human."',
    imageUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=600&h=900'
  }
];

const Index: React.FC = () => {
  return (
    <Layout>
      {/* Featured Post */}
      <FeaturedPost {...featuredPost} />
      
      {/* Recent Posts Section */}
      <motion.section 
        className="mb-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-serif font-bold">Recent Articles</h2>
          <Link 
            to="/articles" 
            className="flex items-center text-sm font-medium text-gray-900 hover:text-gray-700 transition-colors"
          >
            View all articles
            <ChevronRight size={16} className="ml-1" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentPosts.map(post => (
            <BlogCard key={post.id} {...post} />
          ))}
        </div>
      </motion.section>
      
      {/* Book Recommendations Section */}
      <motion.section 
        className="mb-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-serif font-bold">Book Recommendations</h2>
          <Link 
            to="/books" 
            className="flex items-center text-sm font-medium text-gray-900 hover:text-gray-700 transition-colors"
          >
            View all books
            <ChevronRight size={16} className="ml-1" />
          </Link>
        </div>
        
        <div className="space-y-6">
          {recommendedBooks.map(book => (
            <BookCard key={book.id} {...book} />
          ))}
        </div>
      </motion.section>
      
      {/* Newsletter Subscription */}
      <motion.section 
        className="bg-gray-50 rounded-xl p-8 text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-serif font-bold mb-3">Stay Updated</h2>
        <p className="text-gray-600 mb-6 max-w-xl mx-auto">
          Subscribe to receive the latest articles, book recommendations, and insights directly in your inbox.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input 
            type="email" 
            placeholder="Your email address" 
            className="flex-grow px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900"
          />
          <button className="bg-gray-900 text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors">
            Subscribe
          </button>
        </div>
      </motion.section>
    </Layout>
  );
};

export default Index;
