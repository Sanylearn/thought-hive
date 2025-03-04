
import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import BookCard from '../components/BookCard';
import { motion } from 'framer-motion';
import { Search, RefreshCw } from 'lucide-react';
import { supabase } from '../integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

interface Book {
  id: string;
  title: string;
  author: string;
  description: string | null;
  cover_url: string;
}

const BooksPage: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      setBooks(data || []);
    } catch (error: any) {
      console.error('Error fetching books:', error.message);
      toast({
        title: "Error",
        description: "Failed to load books. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredBooks = books.filter(book => {
    return (
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <Layout>
      <motion.div 
        className="max-w-4xl mx-auto mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl md:text-4xl font-serif font-bold mb-4">Book Recommendations</h1>
        <p className="text-gray-600 dark:text-gray-300 text-lg mb-8">
          A curated collection of books that have shaped my thinking, with personal notes and summaries.
        </p>
        
        <div className="relative mb-12 flex items-center">
          <input 
            type="text"
            placeholder="Search books by title or author..."
            className="w-full px-4 py-3 pl-10 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          
          <button 
            onClick={fetchBooks} 
            className="ml-4 flex items-center text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          >
            <RefreshCw size={16} className="mr-1" />
            Refresh
          </button>
        </div>
      </motion.div>
      
      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900 dark:border-white"></div>
        </div>
      ) : filteredBooks.length === 0 ? (
        <div className="text-center py-20">
          {searchQuery ? (
            <p className="text-lg text-gray-600 dark:text-gray-400">No books matching your search criteria.</p>
          ) : (
            <p className="text-lg text-gray-600 dark:text-gray-400">No books available.</p>
          )}
        </div>
      ) : (
        <div className="space-y-8">
          {filteredBooks.map((book) => (
            <BookCard 
              key={book.id}
              id={book.id}
              title={book.title}
              author={book.author}
              summary={book.description || 'No description available.'}
              imageUrl={book.cover_url}
            />
          ))}
        </div>
      )}
    </Layout>
  );
};

export default BooksPage;
