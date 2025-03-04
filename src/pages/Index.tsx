
import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import FeaturedPost from '../components/FeaturedPost';
import BlogCard from '../components/BlogCard';
import BookCard from '../components/BookCard';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { supabase } from '../integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

interface Post {
  id: string;
  title: string;
  content: string;
  image_url: string | null;
  created_at: string;
  category: string;
  status: string;
}

interface Book {
  id: string;
  title: string;
  author: string;
  description: string | null;
  cover_url: string;
}

const Index: React.FC = () => {
  const [featuredPost, setFeaturedPost] = useState<Post | null>(null);
  const [recentPosts, setRecentPosts] = useState<Post[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [email, setEmail] = useState('');

  useEffect(() => {
    fetchPosts();
    fetchBooks();
  }, []);

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      
      // Fetch published posts
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      if (data && data.length > 0) {
        // Set first post as featured
        setFeaturedPost(data[0]);
        
        // Set rest as recent posts (up to 3)
        setRecentPosts(data.slice(1, 4));
      }
    } catch (error: any) {
      console.error('Error fetching posts:', error.message);
      toast({
        title: "Error",
        description: "Failed to load posts. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBooks = async () => {
    try {
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(2);
        
      if (error) throw error;
      
      setBooks(data || []);
    } catch (error: any) {
      console.error('Error fetching books:', error.message);
      toast({
        title: "Error",
        description: "Failed to load books. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Helper function to create excerpt from content
  const formatExcerpt = (content: string): string => {
    return content.replace(/<[^>]*>?/gm, '').substring(0, 150) + '...';
  };

  // Format the date
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Subscribed!",
      description: "Thank you for subscribing to our newsletter.",
    });
    
    setEmail('');
  };

  return (
    <Layout>
      {/* Featured Post */}
      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900 dark:border-white"></div>
        </div>
      ) : featuredPost ? (
        <FeaturedPost 
          id={featuredPost.id}
          title={featuredPost.title}
          excerpt={formatExcerpt(featuredPost.content)}
          date={formatDate(featuredPost.created_at)}
          imageUrl={featuredPost.image_url || 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=1600&h=800'}
          category={featuredPost.category}
        />
      ) : (
        <div className="text-center py-20">
          <p className="text-lg text-gray-600 dark:text-gray-400">No featured posts available.</p>
        </div>
      )}
      
      {/* Recent Posts Section */}
      <motion.section 
        className="mb-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-serif font-bold dark:text-white">Recent Articles</h2>
          <Link 
            to="/articles" 
            className="flex items-center text-sm font-medium text-gray-900 dark:text-gray-200 hover:text-gray-700 dark:hover:text-gray-400 transition-colors"
          >
            View all articles
            <ChevronRight size={16} className="ml-1" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentPosts.length > 0 ? (
            recentPosts.map(post => (
              <BlogCard 
                key={post.id}
                id={post.id}
                title={post.title}
                excerpt={formatExcerpt(post.content)}
                date={formatDate(post.created_at)}
                imageUrl={post.image_url || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800&h=600'}
                category={post.category}
              />
            ))
          ) : (
            <div className="col-span-3 text-center py-10">
              <p className="text-gray-600 dark:text-gray-400">No recent articles available.</p>
            </div>
          )}
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
          <h2 className="text-2xl font-serif font-bold dark:text-white">Book Recommendations</h2>
          <Link 
            to="/books" 
            className="flex items-center text-sm font-medium text-gray-900 dark:text-gray-200 hover:text-gray-700 dark:hover:text-gray-400 transition-colors"
          >
            View all books
            <ChevronRight size={16} className="ml-1" />
          </Link>
        </div>
        
        <div className="space-y-6">
          {books.length > 0 ? (
            books.map(book => (
              <BookCard 
                key={book.id}
                id={book.id}
                title={book.title}
                author={book.author}
                summary={book.description || 'No description available.'}
                imageUrl={book.cover_url}
              />
            ))
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-600 dark:text-gray-400">No book recommendations available.</p>
            </div>
          )}
        </div>
      </motion.section>
      
      {/* Newsletter Subscription */}
      <motion.section 
        className="bg-gray-50 dark:bg-gray-800 rounded-xl p-8 text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-serif font-bold mb-3 dark:text-white">Stay Updated</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-xl mx-auto">
          Subscribe to receive the latest articles, book recommendations, and insights directly in your inbox.
        </p>
        <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input 
            type="email" 
            placeholder="Your email address" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-grow px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-500"
          />
          <button 
            type="submit"
            className="bg-gray-900 dark:bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
          >
            Subscribe
          </button>
        </form>
      </motion.section>
    </Layout>
  );
};

export default Index;
