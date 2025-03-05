
import React, { useState } from 'react';
import { Book } from '@/types/admin';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import BookForm from './BookForm';

interface BooksSectionProps {
  books: Book[];
  isLoading: boolean;
  fetchBooks: () => Promise<void>;
}

export const BooksSection: React.FC<BooksSectionProps> = ({ books, isLoading, fetchBooks }) => {
  const [showAddBookForm, setShowAddBookForm] = useState(false);
  const [showEditBookForm, setShowEditBookForm] = useState(false);
  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    description: '',
    cover_url: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=600&h=900',
    download_url: '#'
  });
  const [editBook, setEditBook] = useState<Book | null>(null);

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
          created_by: session.user.id
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
        download_url: '#'
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
      if (!editBook) return;
      
      const { error } = await supabase
        .from('books')
        .update({
          title: editBook.title,
          author: editBook.author,
          description: editBook.description,
          cover_url: editBook.cover_url,
          download_url: editBook.download_url
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
  
  const handleEditBook = (book: Book) => {
    setEditBook(book);
    setShowEditBookForm(true);
  };
  
  const handleDeleteBook = async (id: string) => {
    try {
      const { error } = await supabase
        .from('books')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Book deleted successfully",
      });
      
      fetchBooks(); // Refresh books list
      
    } catch (error: any) {
      console.error('Error deleting book:', error.message);
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
        <h2 className="text-xl font-bold">Books</h2>
        <button 
          onClick={() => setShowAddBookForm(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add New Book
        </button>
      </div>
      
      {isLoading ? (
        <div className="text-center py-4">Loading books...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
            <thead className="bg-gray-200 dark:bg-gray-700">
              <tr>
                <th className="py-3 px-4 text-left">Title</th>
                <th className="py-3 px-4 text-left">Author</th>
                <th className="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-300 dark:divide-gray-600">
              {books.length === 0 ? (
                <tr>
                  <td colSpan={3} className="py-4 px-4 text-center text-gray-500">No books found</td>
                </tr>
              ) : (
                books.map((book) => (
                  <tr key={book.id} className="hover:bg-gray-100 dark:hover:bg-gray-700">
                    <td className="py-3 px-4">{book.title}</td>
                    <td className="py-3 px-4">{book.author}</td>
                    <td className="py-3 px-4 flex space-x-2">
                      <button 
                        onClick={() => handleEditBook(book)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDeleteBook(book.id)}
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
      
      {showAddBookForm && (
        <BookForm 
          book={newBook}
          setBook={setNewBook as any}
          onSubmit={handleAddBook}
          onCancel={() => setShowAddBookForm(false)}
          submitButtonText="Add Book"
        />
      )}
      
      {showEditBookForm && editBook && (
        <BookForm 
          book={editBook}
          setBook={setEditBook as any}
          onSubmit={saveEditedBook}
          onCancel={() => setShowEditBookForm(false)}
          submitButtonText="Update Book"
          isEdit={true}
        />
      )}
    </div>
  );
};
