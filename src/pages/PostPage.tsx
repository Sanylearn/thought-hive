
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { ChevronLeft, BookOpen } from 'lucide-react';
import { supabase } from '../integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { useTheme } from '@/contexts/ThemeContext';
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
  const { theme, readingMode, toggleReadingMode } = useTheme();
  
  useEffect(() => {
    const loadPost = async () => {
      try {
        setIsLoading(true);
        
        if (!id && !slug) {
          setIsLoading(false);
          return;
        }
        
        const response = await (id 
          ? supabase.from('posts').select().eq('status', 'published').eq('id', id).limit(1)
          : supabase.from('posts').select().eq('status', 'published').eq('slug', slug).limit(1)
        );
        
        const { data, error } = response;
        
        if (error) throw error;
        
        if (data && data.length > 0) {
          const postData = data[0] as Post;
          
          const processedPost = {
            ...postData,
            content: parseMarkdown(postData.content)
          };
          
          setPost(processedPost);
          
          if (postData.author_id) {
            const authorResponse = await supabase
              .from('profiles')
              .select('full_name')
              .eq('id', postData.author_id)
              .single();
              
            if (!authorResponse.error && authorResponse.data) {
              setAuthorName(authorResponse.data.full_name);
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

  const showReadingModeToggle = theme === 'light';

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
        <div className="flex justify-between items-center mb-8">
          <Link 
            to="/articles"
            className="inline-flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          >
            <ChevronLeft size={16} className="mr-1" />
            Back to all articles
          </Link>
          
          {showReadingModeToggle && (
            <button
              onClick={toggleReadingMode}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm ${
                readingMode 
                  ? 'bg-amber-100 text-amber-800' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <BookOpen size={14} />
              Reading Mode {readingMode ? 'On' : 'Off'}
            </button>
          )}
        </div>
      
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
