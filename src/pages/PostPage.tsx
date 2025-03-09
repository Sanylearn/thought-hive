
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import { supabase } from '../integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import MetaTags from '@/components/SEO/MetaTags';
import { Post } from '@/types/admin';
import LoadingSpinner from '@/components/post/LoadingSpinner';
import PostNotFound from '@/components/post/PostNotFound';
import PostContent from '@/components/post/PostContent';
import RelatedPosts from '@/components/post/RelatedPosts';
import { formatExcerpt, formatDate, calculateReadTime } from '@/utils/post-utils';

// Define a completely separate interface for related posts
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
      
      const { data: postData, error: postError } = await supabase
        .from('posts')
        .select('*')
        .eq('id', postId)
        .eq('status', 'published')
        .single();
        
      if (postError) throw postError;
      
      if (postData) {
        setPost(postData);
        await fetchRelatedPosts(postData.category, postData.id);
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
      
      const { data: postData, error: postError } = await supabase
        .from('posts')
        .select('*')
        .eq('slug', postSlug)
        .eq('status', 'published')
        .single();
        
      if (postError) throw postError;
      
      if (postData) {
        setPost(postData);
        await fetchRelatedPosts(postData.category, postData.id);
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
  
  // Completely refactored to avoid type issues
  const fetchRelatedPosts = async (category: string, currentPostId: string) => {
    try {
      // Use a raw query approach to avoid type inference issues
      const { data, error } = await supabase
        .from('posts')
        .select('id, title, content, image_url, created_at, category')
        .eq('status', 'published')
        .eq('category', category)
        .neq('id', currentPostId)
        .order('created_at', { ascending: false })
        .limit(3);
      
      if (error) throw error;
      
      // Manually map the results to our RelatedPost interface
      const relatedPostsData: RelatedPost[] = [];
      
      if (data) {
        for (const item of data) {
          relatedPostsData.push({
            id: item.id,
            title: item.title,
            content: item.content,
            image_url: item.image_url,
            created_at: item.created_at,
            category: item.category
          });
        }
      }
      
      setRelatedPosts(relatedPostsData);
    } catch (error: any) {
      console.error('Error fetching related posts:', error.message);
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
      
        <PostContent 
          post={post} 
          formattedDate={formatDate(post.created_at)} 
          readTime={calculateReadTime(post.content)} 
        />
        
        <RelatedPosts 
          posts={relatedPosts} 
          formatExcerpt={formatExcerpt} 
          formatDate={formatDate} 
        />
      </article>
    </Layout>
  );
};

export default PostPage;
