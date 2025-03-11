
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { ChevronLeft } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import MetaTags from '@/components/SEO/MetaTags';
import LoadingSpinner from '@/components/post/LoadingSpinner';
import PostNotFound from '@/components/post/PostNotFound';
import PostContent from '@/components/post/PostContent';
import { formatExcerpt, formatDate, calculateReadTime } from '@/utils/post-utils';
import { parseMarkdown } from '@/utils/markdown';

const PostPage = () => {
  const { id, slug } = useParams();
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    async function loadPost() {
      if (id) {
        await fetchPostById(id);
      } else if (slug) {
        await fetchPostBySlug(slug);
      } else {
        setIsLoading(false);
      }
    }
    
    loadPost();
  }, [id, slug]);
  
  const fetchPostById = async (postId) => {
    try {
      setIsLoading(true);
      
      // Use simple fetch instead of Supabase client directly
      const response = await fetch(`https://lafurncfvyrszfsfhkkf.supabase.co/rest/v1/posts?id=eq.${postId}&status=eq.published`, {
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxhZnVybmNmdnlyc3pmc2Zoa2tmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA5OTkwMjAsImV4cCI6MjA1NjU3NTAyMH0.VynVB7rt-QYbbLTH2k-0G64PWyPfgpFmf43gjCUA1ug',
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch post');
      }
      
      const data = await response.json();
      
      if (data && data.length > 0) {
        // Process the markdown content
        const processedPost = {
          ...data[0],
          content: parseMarkdown(data[0].content)
        };
        setPost(processedPost);
      }
    } catch (error) {
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
  
  const fetchPostBySlug = async (postSlug) => {
    try {
      setIsLoading(true);
      
      // Use simple fetch instead of Supabase client directly
      const response = await fetch(`https://lafurncfvyrszfsfhkkf.supabase.co/rest/v1/posts?slug=eq.${postSlug}&status=eq.published`, {
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxhZnVybmNmdnlyc3pmc2Zoa2tmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA5OTkwMjAsImV4cCI6MjA1NjU3NTAyMH0.VynVB7rt-QYbbLTH2k-0G64PWyPfgpFmf43gjCUA1ug',
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch post');
      }
      
      const data = await response.json();
      
      if (data && data.length > 0) {
        // Process the markdown content
        const processedPost = {
          ...data[0],
          content: parseMarkdown(data[0].content)
        };
        setPost(processedPost);
      }
    } catch (error) {
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
