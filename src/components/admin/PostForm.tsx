
import React from 'react';
import { Save } from 'lucide-react';
import { Post, Category } from '@/types/admin';

interface PostFormProps {
  post: Post | {
    title: string;
    content: string;
    status: string;
    image_url: string;
    category: string;
    meta_description?: string;
    meta_keywords?: string;
    slug?: string;
  };
  setPost: React.Dispatch<React.SetStateAction<any>>;
  categories: Category[];
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onCancel: () => void;
  submitButtonText: string;
  isEdit?: boolean;
}

const PostForm: React.FC<PostFormProps> = ({
  post,
  setPost,
  categories,
  onSubmit,
  onCancel,
  submitButtonText,
  isEdit = false
}) => {
  // Function to generate a slug from the title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-'); // Replace multiple hyphens with single hyphen
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setPost({
      ...post, 
      title, 
      slug: post.slug || generateSlug(title) // Only auto-generate if slug is empty
    });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Title
        </label>
        <input
          id="title"
          type="text"
          value={post.title}
          onChange={handleTitleChange}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
          required
        />
      </div>
      
      <div>
        <label htmlFor="slug" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          URL Slug
        </label>
        <div className="flex">
          <input
            id="slug"
            type="text"
            value={post.slug || ''}
            onChange={(e) => setPost({...post, slug: e.target.value})}
            placeholder="your-post-url"
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
          />
          <button 
            type="button"
            onClick={() => setPost({...post, slug: generateSlug(post.title)})}
            className="ml-2 px-3 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-white rounded-md text-sm"
          >
            Generate
          </button>
        </div>
      </div>
      
      {/* SEO Metadata Section */}
      <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-800">
        <h3 className="text-md font-medium mb-3 text-gray-700 dark:text-gray-300">SEO Metadata</h3>
        
        <div className="space-y-3">
          <div>
            <label htmlFor="metaDescription" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Meta Description
            </label>
            <textarea
              id="metaDescription"
              value={post.meta_description || ''}
              onChange={(e) => setPost({...post, meta_description: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
              placeholder="Brief description of your post (150-160 characters)"
              rows={2}
              maxLength={160}
            />
            <p className="text-xs text-gray-500 mt-1">
              {post.meta_description ? post.meta_description.length : 0}/160 characters
            </p>
          </div>
          
          <div>
            <label htmlFor="metaKeywords" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Meta Keywords
            </label>
            <input
              id="metaKeywords"
              type="text"
              value={post.meta_keywords || ''}
              onChange={(e) => setPost({...post, meta_keywords: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
              placeholder="keyword1, keyword2, keyword3"
            />
            <p className="text-xs text-gray-500 mt-1">
              Separate keywords with commas
            </p>
          </div>
        </div>
      </div>
      
      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Content
        </label>
        <textarea
          id="content"
          value={post.content}
          onChange={(e) => setPost({...post, content: e.target.value})}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
          rows={5}
          required
        />
      </div>
      
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Category
        </label>
        <select
          id="category"
          value={post.category}
          onChange={(e) => setPost({...post, category: e.target.value})}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
          required
        >
          {categories.map(category => (
            <option key={category.id} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
      
      <div>
        <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Image URL (optional)
        </label>
        <input
          id="imageUrl"
          type="text"
          value={post.image_url || ''}
          onChange={(e) => setPost({...post, image_url: e.target.value})}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
          placeholder="https://example.com/image.jpg"
        />
      </div>
      
      <div>
        <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Status
        </label>
        <select
          id="status"
          value={post.status}
          onChange={(e) => setPost({...post, status: e.target.value})}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
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

export default PostForm;
