import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { motion } from 'framer-motion';
import { Share2, Calendar, Clock, ChevronLeft, Copy, Facebook, Twitter } from 'lucide-react';
import BlogCard from '../components/BlogCard';
import { supabase } from '../integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import MetaTags from '@/components/SEO/MetaTags';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Post } from '@/types/admin';

// Define a simple interface for related posts without circular references
interface RelatedPost {
  id: string;
  title: string;
  content: string;
  image_url: string | null;
  created_at: string;
  category: string;
}

const PostPage: React.FC = () => {
  const { id, slug } = useParams<{ id?: string; slug?: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<RelatedPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (id) {
      fetchPostById(id);
    } else if (slug) {
      fetchPostBySlug(slug);
    }
  }, [id, slug]);
  
  const fetchPostById = async (postId: string) => {
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
        fetchRelatedPosts(postData);
      }
    } catch (error: any) {
      console.error('Error fetching post by ID:', error.message);
      toast({
        title: "Error",
        description: "Failed to load article. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };
  
  const fetchPostBySlug = async (postSlug: string) => {
    try {
      setIsLoading(true);
      
      // Fetch the post by slug
      const { data: postData, error: postError } = await supabase
        .from('posts')
        .select('*')
        .eq('slug', postSlug)
        .eq('status', 'published')
        .single();
        
      if (postError) throw postError;
      
      if (postData) {
        setPost(postData);
        fetchRelatedPosts(postData);
      }
    } catch (error: any) {
      console.error('Error fetching post by slug:', error.message);
      toast({
        title: "Error",
        description: "Failed to load article. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };
  
  const fetchRelatedPosts = async (currentPost: Post) => {
    try {
      // Fetch related posts in the same category
      const { data: relatedData, error: relatedError } = await supabase
        .from('posts')
        .select('id, title, content, image_url, created_at, category')
        .eq('status', 'published')
        .eq('category', currentPost.category)
        .neq('id', currentPost.id)
        .order('created_at', { ascending: false })
        .limit(3);
        
      if (relatedError) throw relatedError;
      
      // Cast the data to RelatedPost[] to ensure type safety
      setRelatedPosts(relatedData as RelatedPost[] || []);
    } catch (error: any) {
      console.error('Error fetching related posts:', error.message);
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

  // Handle sharing
  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link copied",
      description: "Link has been copied to your clipboard",
    });
  };

  const handleShareToTwitter = () => {
    const text = encodeURIComponent(`Check out this article: ${post?.title}`);
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
      {/* SEO Metadata */}
      <MetaTags
        title={post.title}
        description={post.meta_description || formatExcerpt(post.content)}
        keywords={post.meta_keywords || post.category}
        imageUrl={post.image_url || undefined}
        type="article"
        publishedTime={post.created_at}
        category={post.category}
      />
      
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
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                    <Share2 size={18} />
                    <span className="text-sm font-medium">Share</span>
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
