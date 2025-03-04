
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { motion } from 'framer-motion';
import { ChevronLeft, BookOpen } from 'lucide-react';
import { supabase } from '../integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

interface Book {
  id: string;
  title: string;
  author: string;
  description: string | null;
  cover_url: string;
  download_url: string;
}

const BookPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [book, setBook] = useState<Book | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchBook(id);
    }
  }, [id]);

  const fetchBook = async (bookId: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .eq('id', bookId)
        .single();
        
      if (error) throw error;
      setBook(data);
    } catch (error: any) {
      console.error('Error fetching book:', error.message);
      toast({
        title: "Error",
        description: "Failed to load book details. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900 dark:border-white"></div>
        </div>
      </Layout>
    );
  }

  if (!book) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto text-center py-20">
          <h1 className="text-2xl font-bold mb-4">Book not found</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">The book you're looking for doesn't exist or has been removed.</p>
          <Link 
            to="/books"
            className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline"
          >
            <ChevronLeft size={16} className="mr-1" />
            Back to all books
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <Link 
          to="/books"
          className="inline-flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white mb-8"
        >
          <ChevronLeft size={16} className="mr-1" />
          Back to all books
        </Link>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row gap-8 mb-12"
        >
          <div className="w-full md:w-1/3 flex-shrink-0">
            <div className="aspect-[2/3] rounded-lg overflow-hidden shadow-md">
              <img 
                src={book.cover_url} 
                alt={book.title}
                className="w-full h-full object-cover"
              />
            </div>
            
            {book.download_url && (
              <a 
                href={book.download_url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full mt-4 flex items-center justify-center gap-2 bg-gray-900 dark:bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors"
              >
                <BookOpen size={18} />
                <span>Read Full Book</span>
              </a>
            )}
          </div>
          
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-serif font-bold mb-2">{book.title}</h1>
            <p className="text-gray-600 dark:text-gray-300 text-lg mb-6">by {book.author}</p>
            
            <div className="prose prose-gray dark:prose-invert max-w-none">
              <h2 className="text-xl font-semibold mb-4">Summary</h2>
              {book.description ? (
                <div className="whitespace-pre-wrap">{book.description}</div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400 italic">No summary available for this book.</p>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default BookPage;
