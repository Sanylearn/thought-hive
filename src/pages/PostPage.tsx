
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { ChevronLeft } from 'lucide-react';
import { supabase } from '../integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import MetaTags from '@/components/SEO/MetaTags';
import LoadingSpinner from '@/components/post/LoadingSpinner';
import PostNotFound from '@/components/post/PostNotFound';
import PostContent from '@/components/post/PostContent';
import { formatExcerpt, formatDate, calculateReadTime } from '@/utils/post-utils';
import { parseMarkdown } from '@/utils/markdown';
import type { Post } from '@/types/admin';

const PostPage: React.FC = () => {
  const { id, slug } = useParams<{ id?: string; slug?: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [authorName, setAuthorName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadPost = async () => {
      try {
        setIsLoading(true);
        
        if (!id && !slug) {
          setIsLoading(false);
          return;
        }
        
        let response;
        
        if (id) {
          response = await supabase
            .from('posts')
            .select('*')
            .eq('id', id)
            .eq('status', 'published')
            .limit(1);
        } 
        else {
          response = await supabase
            .from('posts')
            .select('*')
            .eq('slug', slug)
            .eq('status', 'published')
            .limit(1);
        }
        
        const { data, error } = response;
        
        if (error) throw error;
        
        if (data && data.length > 0) {
          const postData = data[0];
          const processedPost = {
            ...postData,
            content: parseMarkdown(postData.content)
          };
          
          setPost(processedPost);
          
          // Fetch author information if author_id exists
          if (postData.author_id) {
            const { data: authorData, error: authorError } = await supabase
              .from('profiles')
              .select('full_name')
              .eq('id', postData.author_id)
              .limit(1);
              
            if (!authorError && authorData && authorData.length > 0) {
              setAuthorName(authorData[0].full_name);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching post:', error);
        toast({
          title: "Error",
          description: "Failed to load article. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadPost();
  }, [id, slug]);

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
        title={post.title || ''}
        description={post.meta_description || formatExcerpt(post.content)}
        keywords={post.meta_keywords || post.category}
        imageUrl={post.image_url}
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
          author={authorName || undefined}
        />
      </article>
    </Layout>
  );
};

export default PostPage;
