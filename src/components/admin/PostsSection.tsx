
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
