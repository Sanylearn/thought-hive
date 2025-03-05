
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Edit3, PlusCircle, Save, Trash2, X } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Category } from '@/types/admin';
import CategoryForm from './CategoryForm';

interface CategoriesSectionProps {
  categories: Category[];
  isLoading: boolean;
  fetchCategories: () => Promise<void>;
}

const CategoriesSection: React.FC<CategoriesSectionProps> = ({ 
  categories, 
  isLoading, 
  fetchCategories 
}) => {
  const [showAddCategoryForm, setShowAddCategoryForm] = useState(false);
  const [showEditCategoryForm, setShowEditCategoryForm] = useState(false);
  const [editCategory, setEditCategory] = useState<Category>({
    id: '',
    name: '',
    description: '',
    created_at: ''
  });
  
  const [newCategory, setNewCategory] = useState({
    name: '',
    description: ''
  });

  const handleEditCategory = (category: Category) => {
    setEditCategory(category);
    setShowEditCategoryForm(true);
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (!newCategory.name.trim()) {
        throw new Error("Category name is required");
      }
      
      const { data, error } = await supabase
        .from('categories')
        .insert([{
          name: newCategory.name.trim(),
          description: newCategory.description || null
        }])
        .select();
        
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Category added successfully",
      });
      
      // Reset form
      setNewCategory({
        name: '',
        description: ''
      });
      
      setShowAddCategoryForm(false);
      fetchCategories(); // Refresh categories list
      
    } catch (error: any) {
      console.error('Error adding category:', error.message);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const saveEditedCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (!editCategory.name.trim()) {
        throw new Error("Category name is required");
      }
      
      const { error } = await supabase
        .from('categories')
        .update({
          name: editCategory.name.trim(),
          description: editCategory.description
        })
        .eq('id', editCategory.id);
        
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Category updated successfully",
      });
      
      setShowEditCategoryForm(false);
      fetchCategories(); // Refresh categories list
      
    } catch (error: any) {
      console.error('Error updating category:', error.message);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      // Check if the category is in use by any posts
      const { data: postsUsingCategory, error: checkError } = await supabase
        .from('posts')
        .select('id')
        .eq('category', categories.find(c => c.id === id)?.name || '')
        .limit(1);
        
      if (checkError) throw checkError;
      
      if (postsUsingCategory && postsUsingCategory.length > 0) {
        throw new Error("Cannot delete category: it is being used by posts");
      }
      
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Category deleted successfully",
      });
      
      fetchCategories(); // Refresh categories list
    } catch (error: any) {
      console.error('Error deleting category:', error.message);
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
        <h2 className="text-xl font-serif font-bold text-gray-900 dark:text-white">Categories</h2>
        <button 
          onClick={() => setShowAddCategoryForm(true)}
          className="flex items-center bg-gray-900 dark:bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors"
        >
          <PlusCircle size={18} className="mr-2" />
          Add Category
        </button>
      </div>
      
      {/* Add Category Form */}
      {showAddCategoryForm && (
        <motion.div 
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-6 mb-6"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Add New Category</h3>
            <button 
              onClick={() => setShowAddCategoryForm(false)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <X size={18} />
            </button>
          </div>
          
          <CategoryForm 
            category={newCategory}
            setCategory={setNewCategory as any}
            onSubmit={handleAddCategory}
            onCancel={() => setShowAddCategoryForm(false)}
            submitButtonText="Add Category"
          />
        </motion.div>
      )}
      
      {/* Edit Category Form */}
      {showEditCategoryForm && (
        <motion.div 
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-6 mb-6"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Edit Category</h3>
            <button 
              onClick={() => setShowEditCategoryForm(false)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <X size={18} />
            </button>
          </div>
          
          <CategoryForm 
            category={editCategory}
            setCategory={setEditCategory}
            onSubmit={saveEditedCategory}
            onCancel={() => setShowEditCategoryForm(false)}
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
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Description</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date Created</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {isLoading ? (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                  Loading categories...
                </td>
              </tr>
            ) : categories.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                  No categories found. Add your first category.
                </td>
              </tr>
            ) : (
              categories.map((category) => (
                <tr key={category.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{category.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {category.description || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(category.created_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleEditCategory(category)} 
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300"
                      >
                        <Edit3 size={18} />
                      </button>
                      <button 
                        onClick={() => handleDeleteCategory(category.id)}
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

export default CategoriesSection;
