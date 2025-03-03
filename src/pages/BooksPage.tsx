
import React from 'react';
import Layout from '../components/Layout';
import BookCard from '../components/BookCard';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';

// Mock data for the demo
const books = [
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
  },
  {
    id: '3',
    title: 'Atomic Habits',
    author: 'James Clear',
    summary: 'Offers a proven framework for improving every day. Learn how tiny changes in behavior can result in the formation of good habits and the elimination of bad ones.',
    imageUrl: 'https://images.unsplash.com/photo-1585521549422-583853226278?auto=format&fit=crop&w=600&h=900'
  },
  {
    id: '4',
    title: 'Noise: A Flaw in Human Judgment',
    author: 'Daniel Kahneman, Olivier Sibony, and Cass R. Sunstein',
    summary: 'Explores the detrimental effects of "noise" in human decision making—the unwanted variability in judgments that should be identical.',
    imageUrl: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=600&h=900'
  },
  {
    id: '5',
    title: 'Deep Work',
    author: 'Cal Newport',
    summary: 'Argues that the ability to focus without distraction is becoming increasingly valuable in our economy, and presents a series of practices for cultivating intense concentration.',
    imageUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&h=900'
  },
  {
    id: '6',
    title: 'Educated',
    author: 'Tara Westover',
    summary: 'A memoir about a young girl who, kept out of school, leaves her survivalist family and goes on to earn a PhD from Cambridge University.',
    imageUrl: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?auto=format&fit=crop&w=600&h=900'
  }
];

const BooksPage: React.FC = () => {
  return (
    <Layout>
      <motion.div 
        className="max-w-4xl mx-auto mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl md:text-4xl font-serif font-bold mb-4">Book Recommendations</h1>
        <p className="text-gray-600 text-lg mb-8">
          A curated collection of books that have shaped my thinking, with personal notes and summaries.
        </p>
        
        <div className="relative mb-12">
          <input 
            type="text"
            placeholder="Search books by title or author..."
            className="w-full px-4 py-3 pl-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        </div>
      </motion.div>
      
      <div className="space-y-8">
        {books.map((book, index) => (
          <motion.div 
            key={book.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <BookCard {...book} />
          </motion.div>
        ))}
      </div>
    </Layout>
  );
};

export default BooksPage;
