
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import ThemeToggle from '@/components/ThemeToggle';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Post, Book, Category } from '@/types/admin';
import DashboardStats from '@/components/admin/DashboardStats';
import TabNavigation from '@/components/admin/TabNavigation';
import { PostsSection } from '@/components/admin/PostsSection';
import { BooksSection } from '@/components/admin/BooksSection';
import CategoriesSection from '@/components/admin/CategoriesSection';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { signOut, profile, user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('posts');
  
  useEffect(() => {
    if (user) {
      fetchPosts();
      fetchBooks();
      fetchCategories();
    }
  }, [user]);
  
  // --- FETCH FUNCTIONS ---
  
  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      setPosts(data || []);
    } catch (error: any) {
      console.error('Error fetching posts:', error.message);
      toast({
        title: "Error",
        description: "Failed to load posts",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const fetchBooks = async () => {
    try {
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      setBooks(data || []);
    } catch (error: any) {
      console.error('Error fetching books:', error.message);
      toast({
        title: "Error",
        description: "Failed to load books",
        variant: "destructive",
      });
    }
  };
  
  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name', { ascending: true });
        
      if (error) throw error;
      
      setCategories(data || []);
    } catch (error: any) {
      console.error('Error fetching categories:', error.message);
      toast({
        title: "Error",
        description: "Failed to load categories",
        variant: "destructive",
      });
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="font-serif font-bold text-lg text-gray-900 dark:text-white">Opinion Matters Admin</div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              {profile && (
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  Welcome, {profile.full_name || profile.email}
                </span>
              )}
              <button 
                onClick={() => signOut()}
                className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <LogOut size={18} className="mr-1" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DashboardStats 
          posts={posts}
          books={books}
          categories={categories}
        />
        
        <TabNavigation 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
        
        {activeTab === 'posts' && (
          <PostsSection 
            posts={posts}
            categories={categories}
            isLoading={isLoading}
            fetchPosts={fetchPosts}
          />
        )}
        
        {activeTab === 'books' && (
          <BooksSection 
            books={books}
            isLoading={isLoading}
            fetchBooks={fetchBooks}
          />
        )}
        
        {activeTab === 'categories' && (
          <CategoriesSection 
            categories={categories}
            isLoading={isLoading}
            fetchCategories={fetchCategories}
          />
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
