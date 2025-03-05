
import React, { useState } from 'react';
import { Post, Category } from '@/types/admin';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import PostForm from './PostForm';

interface PostsSectionProps {
  posts: Post[];
  categories: Category[];
  isLoading: boolean;
  fetchPosts: () => Promise<void>;
}

export const PostsSection: React.FC<PostsSectionProps> = ({ posts, categories, isLoading, fetchPosts }) => {
  const [showAddPostForm, setShowAddPostForm] = useState(false);
  const [showEditPostForm, setShowEditPostForm] = useState(false);
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    status: 'draft',
    image_url: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800&h=600',
    category: categories[0]?.name || '',
    is_markdown: false
  });
  const [editPost, setEditPost] = useState<Post | null>(null);

  // When creating posts, include the is_markdown property
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
          author_id: session.user.id,
          is_markdown: newPost.is_markdown || false
        }])
        .select();
        
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Post added successfully",
      });
      
      // Reset form
      setNewPost({
        title: '',
        content: '',
        status: 'draft',
        image_url: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800&h=600',
        category: categories[0]?.name || '',
        is_markdown: false
      });
      
      setShowAddPostForm(false);
      fetchPosts(); // Refresh posts list
      
    } catch (error: any) {
      console.error('Error adding post:', error.message);
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
      if (!editPost) return;
      
      const { error } = await supabase
        .from('posts')
        .update({
          title: editPost.title,
          content: editPost.content,
          status: editPost.status,
          image_url: editPost.image_url,
          category: editPost.category,
          is_markdown: editPost.is_markdown || false
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
  
  const handleEditPost = (post: Post) => {
    setEditPost(post);
    setShowEditPostForm(true);
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
  
  return (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Posts</h2>
        <button 
          onClick={() => setShowAddPostForm(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add New Post
        </button>
      </div>
      
      {isLoading ? (
        <div className="text-center py-4">Loading posts...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
            <thead className="bg-gray-200 dark:bg-gray-700">
              <tr>
                <th className="py-3 px-4 text-left">Title</th>
                <th className="py-3 px-4 text-left">Status</th>
                <th className="py-3 px-4 text-left">Category</th>
                <th className="py-3 px-4 text-left">Date</th>
                <th className="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-300 dark:divide-gray-600">
              {posts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-4 px-4 text-center text-gray-500">No posts found</td>
                </tr>
              ) : (
                posts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-100 dark:hover:bg-gray-700">
                    <td className="py-3 px-4">{post.title}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-block px-2 py-1 rounded text-xs ${
                        post.status === 'published' 
                          ? 'bg-green-200 text-green-800 dark:bg-green-900 dark:text-green-200' 
                          : 'bg-yellow-200 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      }`}>
                        {post.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">{post.category}</td>
                    <td className="py-3 px-4">{new Date(post.created_at).toLocaleDateString()}</td>
                    <td className="py-3 px-4 flex space-x-2">
                      <button 
                        onClick={() => handleEditPost(post)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDeletePost(post.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
      
      {showAddPostForm && (
        <PostForm 
          post={newPost}
          setPost={setNewPost as any}
          categories={categories}
          onSubmit={handleAddPost}
          onCancel={() => setShowAddPostForm(false)}
          submitButtonText="Add Post"
        />
      )}
      
      {showEditPostForm && editPost && (
        <PostForm 
          post={editPost}
          setPost={setEditPost as any}
          categories={categories}
          onSubmit={saveEditedPost}
          onCancel={() => setShowEditPostForm(false)}
          submitButtonText="Update Post"
          isEdit={true}
        />
      )}
    </div>
  );
};
