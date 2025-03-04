
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import BlogCard from '../components/BlogCard';
import { supabase } from '../integrations/supabase/client';
import { Filter, RefreshCw } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface Post {
  id: string;
  title: string;
  content: string;
  image_url: string | null;
  created_at: string;
  category: string;
}

interface Category {
  id: string;
  name: string;
  description: string | null;
}

const ArticlesPage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  useEffect(() => {
    fetchPosts();
    fetchCategories();
  }, []);
  
  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      let query = supabase
        .from('posts')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false });
        
      if (selectedCategory) {
        query = query.eq('category', selectedCategory);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      setPosts(data || []);
    } catch (error: any) {
      console.error('Error fetching posts:', error.message);
      toast({
        title: "Error",
        description: "Failed to load articles. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');
        
      if (error) throw error;
      setCategories(data || []);
    } catch (error: any) {
      console.error('Error fetching categories:', error.message);
    }
  };
  
  const filterByCategory = (categoryName: string | null) => {
    setSelectedCategory(categoryName);
    // Fetch posts when category changes
    setTimeout(() => {
      fetchPosts();
    }, 100);
  };
  
  // Format the excerpt from content
  const formatExcerpt = (content: string): string => {
    // Remove any HTML tags and limit to 150 characters
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

  return (
    <Layout>
      <motion.div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl md:text-4xl font-serif font-bold mb-8 dark:text-white">Articles</h1>
        
        {/* Category filter */}
        <div className="mb-8 flex flex-wrap items-center gap-2">
          <div className="flex items-center mr-2 text-gray-600 dark:text-gray-300">
            <Filter size={18} className="mr-1" />
            <span className="text-sm font-medium">Filter by:</span>
          </div>
          
          <button 
            onClick={() => filterByCategory(null)}
            className={`px-3 py-1 text-sm rounded-full ${
              selectedCategory === null 
                ? 'bg-gray-900 text-white dark:bg-gray-700' 
                : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700'
            } transition-colors`}
          >
            All
          </button>
          
          {categories.map(category => (
            <button 
              key={category.id}
              onClick={() => filterByCategory(category.name)}
              className={`px-3 py-1 text-sm rounded-full ${
                selectedCategory === category.name 
                  ? 'bg-gray-900 text-white dark:bg-gray-700' 
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700'
              } transition-colors`}
            >
              {category.name}
            </button>
          ))}
          
          <button 
            onClick={fetchPosts} 
            className="ml-auto flex items-center text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          >
            <RefreshCw size={16} className="mr-1" />
            Refresh
          </button>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900 dark:border-white"></div>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-lg text-gray-600 dark:text-gray-400">No articles found in this category.</p>
            <Link 
              to="/"
              className="inline-block mt-4 text-blue-600 dark:text-blue-400 hover:underline"
            >
              Return to homepage
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
        )}
      </motion.div>
    </Layout>
  );
};

export default ArticlesPage;
