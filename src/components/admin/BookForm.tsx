
import React from 'react';
import { Save } from 'lucide-react';
import { Book } from '@/types/admin';

interface BookFormProps {
  book: Book | {
    title: string;
    author: string;
    description: string;
    cover_url: string;
    download_url: string;
  };
  setBook: React.Dispatch<React.SetStateAction<any>>;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onCancel: () => void;
  submitButtonText: string;
  isEdit?: boolean;
}

const BookForm: React.FC<BookFormProps> = ({
  book,
  setBook,
  onSubmit,
  onCancel,
  submitButtonText,
  isEdit = false
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label htmlFor="bookTitle" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Title
        </label>
        <input
          id="bookTitle"
          type="text"
          value={book.title}
          onChange={(e) => setBook({...book, title: e.target.value})}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
          required
        />
      </div>
      
      <div>
        <label htmlFor="author" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Author
        </label>
        <input
          id="author"
          type="text"
          value={book.author}
          onChange={(e) => setBook({...book, author: e.target.value})}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
          required
        />
      </div>
      
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Description
        </label>
        <textarea
          id="description"
          value={book.description || ''}
          onChange={(e) => setBook({...book, description: e.target.value})}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
          rows={3}
        />
      </div>
      
      <div>
        <label htmlFor="coverUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Cover Image URL
        </label>
        <input
          id="coverUrl"
          type="text"
          value={book.cover_url || ''}
          onChange={(e) => setBook({...book, cover_url: e.target.value})}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
          placeholder="https://example.com/cover.jpg"
          required
        />
      </div>
      
      <div>
        <label htmlFor="downloadUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Download URL
        </label>
        <input
          id="downloadUrl"
          type="text"
          value={book.download_url || ''}
          onChange={(e) => setBook({...book, download_url: e.target.value})}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
          placeholder="https://example.com/book.pdf"
          required
        />
      </div>
      
      <div className="flex justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 mr-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-white"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex items-center px-4 py-2 text-sm bg-gray-900 dark:bg-gray-700 text-white rounded-md hover:bg-gray-800 dark:hover:bg-gray-600"
        >
          {isEdit && <Save size={16} className="mr-1" />}
          {submitButtonText}
        </button>
      </div>
    </form>
  );
};

export default BookForm;
