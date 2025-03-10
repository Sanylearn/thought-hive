
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { ChevronLeft } from 'lucide-react';
import { supabase } from '../integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import MetaTags from '@/components/SEO/MetaTags';
import { Post } from '@/types/admin';
import LoadingSpinner from '@/components/post/LoadingSpinner';
import PostNotFound from '@/components/post/PostNotFound';
import PostContent from '@/components/post/PostContent';
import { formatExcerpt, formatDate, calculateReadTime } from '@/utils/post-utils';

const PostPage: React.FC = () => {
  const { id, slug } = useParams<{ id?: string; slug?: string }>();
  const [post, setPost] = useState<Post | null>(null);
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
      
      const { data: postData, error: postError } = await supabase
        .from('posts')
        .select('*')
        .eq('id', postId)
        .eq('status', 'published')
        .single();
        
      if (postError) throw postError;
      setPost(postData);
    } catch (error: any) {
      console.error('Error fetching post by ID:', error.message);
      toast({
        title: "Error",
        description: "Failed to load article. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const fetchPostBySlug = async (postSlug: string) => {
    try {
      setIsLoading(true);
      
      const { data: postData, error: postError } = await supabase
        .from('posts')
        .select('*')
        .eq('slug', postSlug)
        .eq('status', 'published')
        .single();
        
      if (postError) throw postError;
      setPost(postData);
    } catch (error: any) {
      console.error('Error fetching post by slug:', error.message);
      toast({
        title: "Error",
        description: "Failed to load article. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <LoadingSpinner />
      </Layout>
    );
  }
  
  if (!post) {
    return (
      <Layout>
        <PostNotFound />
      </Layout>
    );
  }

  return (
    <Layout>
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
      
        <PostContent 
          post={post} 
          formattedDate={formatDate(post.created_at)} 
          readTime={calculateReadTime(post.content)} 
        />
      </article>
    </Layout>
  );
};

export default PostPage;
