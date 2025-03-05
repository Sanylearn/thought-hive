
// When creating books, include the is_markdown property
const handleAddBook = async (e: React.FormEvent) => {
  e.preventDefault();
  
  try {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) throw sessionError;
    if (!session?.user) throw new Error("User not authenticated");
    
    const { data, error } = await supabase
      .from('books')
      .insert([{
        title: newBook.title,
        author: newBook.author,
        description: newBook.description,
        cover_url: newBook.cover_url,
        download_url: newBook.download_url || '#', // Ensure download_url is provided
        created_by: session.user.id,
        is_markdown: newBook.is_markdown || false
      }])
      .select();
      
    if (error) throw error;
    
    toast({
      title: "Success",
      description: "Book added successfully",
    });
    
    // Reset form
    setNewBook({
      title: '',
      author: '',
      description: '',
      cover_url: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=600&h=900',
      download_url: '#',
      is_markdown: false
    });
    
    setShowAddBookForm(false);
    fetchBooks(); // Refresh books list
    
  } catch (error: any) {
    console.error('Error adding book:', error.message);
    toast({
      title: "Error",
      description: error.message,
      variant: "destructive",
    });
  }
};

const saveEditedBook = async (e: React.FormEvent) => {
  e.preventDefault();
  
  try {
    const { error } = await supabase
      .from('books')
      .update({
        title: editBook.title,
        author: editBook.author,
        description: editBook.description,
        cover_url: editBook.cover_url,
        download_url: editBook.download_url,
        is_markdown: editBook.is_markdown || false
      })
      .eq('id', editBook.id);
      
    if (error) throw error;
    
    toast({
      title: "Success",
      description: "Book updated successfully",
    });
    
    setShowEditBookForm(false);
    fetchBooks(); // Refresh books list
    
  } catch (error: any) {
    console.error('Error updating book:', error.message);
    toast({
      title: "Error",
      description: error.message,
      variant: "destructive",
    });
  }
};
