
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { motion } from 'framer-motion';
import { Share2, Calendar, Clock, ChevronLeft } from 'lucide-react';
import BlogCard from '../components/BlogCard';
import { supabase } from '../integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

interface Post {
  id: string;
  title: string;
  content: string;
  image_url: string | null;
  created_at: string;
  category: string;
}

const PostPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (id) {
      fetchPost(id);
    }
  }, [id]);
  
  const fetchPost = async (postId: string) => {
    try {
      setIsLoading(true);
      
      // Fetch the post
      const { data: postData, error: postError } = await supabase
        .from('posts')
        .select('*')
        .eq('id', postId)
        .eq('status', 'published')
        .single();
        
      if (postError) throw postError;
      
      if (postData) {
        setPost(postData);
        
        // Fetch related posts in the same category
        const { data: relatedData, error: relatedError } = await supabase
          .from('posts')
          .select('*')
          .eq('status', 'published')
          .eq('category', postData.category)
          .neq('id', postId)
          .order('created_at', { ascending: false })
          .limit(3);
          
        if (relatedError) throw relatedError;
        setRelatedPosts(relatedData || []);
      }
    } catch (error: any) {
      console.error('Error fetching post:', error.message);
      toast({
        title: "Error",
        description: "Failed to load article. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
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
  
  // Calculate read time
  const calculateReadTime = (content: string): string => {
    const wordsPerMinute = 200;
    const textOnly = content.replace(/<[^>]*>?/gm, '');
    const wordCount = textOnly.split(/\s+/).length;
    const readTime = Math.ceil(wordCount / wordsPerMinute);
    return `${readTime} min read`;
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
  
  if (!post) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto text-center py-20">
          <h1 className="text-2xl font-bold mb-4">Article not found</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">The article you're looking for doesn't exist or has been removed.</p>
          <Link 
            to="/articles"
            className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline"
          >
            <ChevronLeft size={16} className="mr-1" />
            Back to all articles
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <article className="max-w-4xl mx-auto">
        <Link 
          to="/articles"
          className="inline-flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white mb-8"
        >
          <ChevronLeft size={16} className="mr-1" />
          Back to all articles
        </Link>
      
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
          
          <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400 mb-6">
            <div className="flex items-center gap-1">
              <Calendar size={16} />
              <span className="text-sm">{formatDate(post.created_at)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock size={16} />
              <span className="text-sm">{calculateReadTime(post.content)}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3 mb-8">
            <div className="ml-auto">
              <button className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                <Share2 size={18} />
                <span className="text-sm font-medium">Share</span>
              </button>
            </div>
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
        
        {relatedPosts.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="border-t border-gray-200 dark:border-gray-700 pt-10 mb-16"
          >
            <h2 className="text-2xl font-serif font-bold mb-6 text-gray-900 dark:text-white">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map(relatedPost => (
                <BlogCard 
                  key={relatedPost.id}
                  id={relatedPost.id}
                  title={relatedPost.title}
                  excerpt={formatExcerpt(relatedPost.content)}
                  date={formatDate(relatedPost.created_at)}
                  imageUrl={relatedPost.image_url || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800&h=600'}
                  category={relatedPost.category}
                />
              ))}
            </div>
          </motion.div>
        )}
      </article>
    </Layout>
  );
};

export default PostPage;
