
import React from 'react';
import { Save } from 'lucide-react';
import { Post, Category } from '@/types/admin';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface PostFormProps {
  post: Post | {
    title: string;
    content: string;
    status: string;
    image_url: string;
    category: string;
    is_markdown?: boolean;
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
          onChange={(e) => setPost({...post, title: e.target.value})}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
          required
        />
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
      
      <div className="flex items-center space-x-2">
        <Switch 
          id="markdown-mode" 
          checked={post.is_markdown || false}
          onCheckedChange={(checked) => setPost({...post, is_markdown: checked})}
        />
        <Label htmlFor="markdown-mode" className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Use Markdown
        </Label>
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
