
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Edit3, PlusCircle, Save, Trash2, X } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Post, Category } from '@/types/admin';
import PostForm from './PostForm';

interface PostsSectionProps {
  posts: Post[];
  categories: Category[];
  isLoading: boolean;
  fetchPosts: () => Promise<void>;
}

const PostsSection: React.FC<PostsSectionProps> = ({ 
  posts, 
  categories, 
  isLoading, 
  fetchPosts 
}) => {
  const [showAddPostForm, setShowAddPostForm] = useState(false);
  const [showEditPostForm, setShowEditPostForm] = useState(false);
  const [editPost, setEditPost] = useState<Post>({
    id: '',
    title: '',
    content: '',
    status: 'draft',
    image_url: '',
    category: 'Uncategorized',
    created_at: ''
  });
  
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    status: 'draft',
    image_url: '',
    category: 'Uncategorized'
  });

  const handleEditPost = (post: Post) => {
    setEditPost(post);
    setShowEditPostForm(true);
  };

  const handleAddPost = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;
      if (!session?.user) throw new Error("User not authenticated");
      
      const { data, error } = await supabase
        .from('posts')
        .insert([{
          title: newPost.title,
          content: newPost.content,
          status: newPost.status,
          image_url: newPost.image_url,
          category: newPost.category,
          author_id: session.user.id
        }])
        .select();
        
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Post created successfully",
      });
      
      // Reset form
      setNewPost({
        title: '',
        content: '',
        status: 'draft',
        image_url: '',
        category: 'Uncategorized'
      });
      
      setShowAddPostForm(false);
      fetchPosts(); // Refresh posts list
      
    } catch (error: any) {
      console.error('Error creating post:', error.message);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const saveEditedPost = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { error } = await supabase
        .from('posts')
        .update({
          title: editPost.title,
          content: editPost.content,
          status: editPost.status,
          image_url: editPost.image_url,
          category: editPost.category
        })
        .eq('id', editPost.id);
        
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Post updated successfully",
      });
      
      setShowEditPostForm(false);
      fetchPosts(); // Refresh posts list
      
    } catch (error: any) {
      console.error('Error updating post:', error.message);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDeletePost = async (id: string) => {
    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Post deleted successfully",
      });
      
      fetchPosts(); // Refresh posts list
    } catch (error: any) {
      console.error('Error deleting post:', error.message);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-serif font-bold text-gray-900 dark:text-white">Posts</h2>
        <button 
          onClick={() => setShowAddPostForm(true)}
          className="flex items-center bg-gray-900 dark:bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors"
        >
          <PlusCircle size={18} className="mr-2" />
          New Post
        </button>
      </div>
      
      {/* Add Post Form */}
      {showAddPostForm && (
        <motion.div 
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-6 mb-6"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Add New Post</h3>
            <button 
              onClick={() => setShowAddPostForm(false)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <X size={18} />
            </button>
          </div>
          
          <PostForm 
            post={newPost}
            setPost={setNewPost as any}
            categories={categories}
            onSubmit={handleAddPost}
            onCancel={() => setShowAddPostForm(false)}
            submitButtonText="Create Post"
          />
        </motion.div>
      )}
      
      {/* Edit Post Form */}
      {showEditPostForm && (
        <motion.div 
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-6 mb-6"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Edit Post</h3>
            <button 
              onClick={() => setShowEditPostForm(false)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <X size={18} />
            </button>
          </div>
          
          <PostForm 
            post={editPost}
            setPost={setEditPost}
            categories={categories}
            onSubmit={saveEditedPost}
            onCancel={() => setShowEditPostForm(false)}
            submitButtonText="Save Changes"
            isEdit={true}
          />
        </motion.div>
      )}
      
      <motion.div 
        className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Title</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Category</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {isLoading ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                  Loading posts...
                </td>
              </tr>
            ) : posts.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                  No posts found. Create your first post.
                </td>
              </tr>
            ) : (
              posts.map((post) => (
                <tr key={post.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{post.title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-500 dark:text-gray-400">{post.category}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      post.status === 'published' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                    }`}>
                      {post.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(post.created_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleEditPost(post)} 
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300"
                      >
                        <Edit3 size={18} />
                      </button>
                      <button 
                        onClick={() => handleDeletePost(post.id)}
                        className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </motion.div>
    </div>
  );
};

export default PostsSection;
