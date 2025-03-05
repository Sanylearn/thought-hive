
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Edit3, PlusCircle, Save, Trash2, X } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Book } from '@/types/admin';
import BookForm from './BookForm';

interface BooksSectionProps {
  books: Book[];
  isLoading: boolean;
  fetchBooks: () => Promise<void>;
}

const BooksSection: React.FC<BooksSectionProps> = ({ 
  books, 
  isLoading, 
  fetchBooks 
}) => {
  const [showAddBookForm, setShowAddBookForm] = useState(false);
  const [showEditBookForm, setShowEditBookForm] = useState(false);
  const [editBook, setEditBook] = useState<Book>({
    id: '',
    title: '',
    author: '',
    description: '',
    cover_url: '',
    download_url: '',
    created_at: ''
  });
  
  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    description: '',
    cover_url: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=600&h=900',
    download_url: '#' // Default value
  });

  const handleEditBook = (book: Book) => {
    setEditBook(book);
    setShowEditBookForm(true);
  };

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
        <h2 className="text-xl font-serif font-bold text-gray-900 dark:text-white">Book Recommendations</h2>
        <button 
          onClick={() => setShowAddBookForm(true)}
          className="flex items-center bg-gray-900 dark:bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors"
        >
          <PlusCircle size={18} className="mr-2" />
          Add Book
        </button>
      </div>
      
      {/* Add Book Form */}
      {showAddBookForm && (
        <motion.div 
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-6 mb-6"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Add New Book</h3>
            <button 
              onClick={() => setShowAddBookForm(false)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <X size={18} />
            </button>
          </div>
          
          <BookForm 
            book={newBook}
            setBook={setNewBook as any}
            onSubmit={handleAddBook}
            onCancel={() => setShowAddBookForm(false)}
            submitButtonText="Add Book"
          />
        </motion.div>
      )}
      
      {/* Edit Book Form */}
      {showEditBookForm && (
        <motion.div 
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-6 mb-6"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Edit Book</h3>
            <button 
              onClick={() => setShowEditBookForm(false)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <X size={18} />
            </button>
          </div>
          
          <BookForm 
            book={editBook}
            setBook={setEditBook}
            onSubmit={saveEditedBook}
            onCancel={() => setShowEditBookForm(false)}
            submitButtonText="Save Changes"
            isEdit={true}
          />
        </motion.div>
      )}
      
      <motion.div 
        className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Title</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Author</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date Added</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {isLoading ? (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                  Loading books...
                </td>
              </tr>
            ) : books.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                  No books found. Add your first book recommendation.
                </td>
              </tr>
            ) : (
              books.map((book) => (
                <tr key={book.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{book.title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {book.author}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(book.created_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleEditBook(book)} 
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300"
                      >
                        <Edit3 size={18} />
                      </button>
                      <button 
                        onClick={() => handleDeleteBook(book.id)}
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

export default BooksSection;
