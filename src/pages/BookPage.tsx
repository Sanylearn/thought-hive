
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { motion } from 'framer-motion';
import { ChevronLeft, BookOpen, Share2, Copy, Twitter, Facebook } from 'lucide-react';
import { supabase } from '../integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { parseMarkdown } from '@/utils/markdown';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Book {
  id: string;
  title: string;
  author: string;
  description: string | null;
  cover_url: string;
  download_url: string;
  is_markdown?: boolean;
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

  // Handle sharing
  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link copied",
      description: "Link has been copied to your clipboard",
    });
  };

  const handleShareToTwitter = () => {
    const text = encodeURIComponent(`Check out this book: ${book?.title} by ${book?.author}`);
    const url = encodeURIComponent(window.location.href);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
  };

  const handleShareToFacebook = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
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

  // Determine content to display
  const displayDescription = book.is_markdown && book.description
    ? parseMarkdown(book.description)
    : book.description;

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
            
            <div className="flex mt-4 space-x-2">
              {book.download_url && (
                <a 
                  href={book.download_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 bg-gray-900 dark:bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors"
                >
                  <BookOpen size={18} />
                  <span>Read Book</span>
                </a>
              )}
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center justify-center p-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors">
                    <Share2 size={18} />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-white dark:bg-gray-800 p-2">
                  <DropdownMenuItem onClick={handleCopyLink} className="cursor-pointer">
                    <Copy size={16} className="mr-2" />
                    <span>Copy link</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleShareToTwitter} className="cursor-pointer">
                    <Twitter size={16} className="mr-2" />
                    <span>Share on X</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleShareToFacebook} className="cursor-pointer">
                    <Facebook size={16} className="mr-2" />
                    <span>Share on Facebook</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-serif font-bold mb-2">{book.title}</h1>
            <p className="text-gray-600 dark:text-gray-300 text-lg mb-6">by {book.author}</p>
            
            <div className="prose prose-gray dark:prose-invert max-w-none">
              <h2 className="text-xl font-semibold mb-4">Summary</h2>
              {book.description ? (
                <div 
                  className="whitespace-pre-wrap"
                  dangerouslySetInnerHTML={{ __html: displayDescription || '' }}
                />
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
