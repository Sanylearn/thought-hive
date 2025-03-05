
import React from 'react';
import { Save } from 'lucide-react';
import { Category } from '@/types/admin';

interface CategoryFormProps {
  category: Category | {
    name: string;
    description: string;
  };
  setCategory: React.Dispatch<React.SetStateAction<any>>;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onCancel: () => void;
  submitButtonText: string;
  isEdit?: boolean;
}

const CategoryForm: React.FC<CategoryFormProps> = ({
  category,
  setCategory,
  onSubmit,
  onCancel,
  submitButtonText,
  isEdit = false
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label htmlFor="categoryName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Name
        </label>
        <input
          id="categoryName"
          type="text"
          value={category.name}
          onChange={(e) => setCategory({...category, name: e.target.value})}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
          required
        />
      </div>
      
      <div>
        <label htmlFor="categoryDescription" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Description (optional)
        </label>
        <textarea
          id="categoryDescription"
          value={category.description || ''}
          onChange={(e) => setCategory({...category, description: e.target.value})}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
          rows={3}
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

export default CategoryForm;
