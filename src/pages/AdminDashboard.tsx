
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  PlusCircle, 
  Edit3, 
  Trash2, 
  LogOut, 
  BookOpen, 
  FileText, 
  Settings,
  Image
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import ThemeToggle from '@/components/ThemeToggle';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { signOut, profile } = useAuth();
  
  // Mock data for recent posts
  const recentPosts = [
    { id: '1', title: 'The Future of Artificial Intelligence in Everyday Life', status: 'Published', date: 'May 15, 2023' },
    { id: '2', title: 'How Minimalism Changed My Perspective on Consumerism', status: 'Published', date: 'April 28, 2023' },
    { id: '3', title: 'The Overlooked Benefits of Deep Reading in a Digital Age', status: 'Draft', date: 'April 15, 2023' },
  ];
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="font-serif font-bold text-lg dark:text-white">Opinion Matters Admin</div>
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
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center mb-4">
              <FileText size={20} className="mr-2 text-blue-600 dark:text-blue-400" />
              <h3 className="font-semibold dark:text-white">Total Posts</h3>
            </div>
            <p className="text-3xl font-bold dark:text-white">12</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center mb-4">
              <BookOpen size={20} className="mr-2 text-green-600 dark:text-green-400" />
              <h3 className="font-semibold dark:text-white">Book Recommendations</h3>
            </div>
            <p className="text-3xl font-bold dark:text-white">6</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center mb-4">
              <Image size={20} className="mr-2 text-purple-600 dark:text-purple-400" />
              <h3 className="font-semibold dark:text-white">Media Files</h3>
            </div>
            <p className="text-3xl font-bold dark:text-white">24</p>
          </div>
        </motion.div>
        
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-serif font-bold dark:text-white">Recent Posts</h2>
            <button className="flex items-center bg-gray-900 dark:bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors">
              <PlusCircle size={18} className="mr-2" />
              New Post
            </button>
          </div>
          
          <motion.div 
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Title</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {recentPosts.map((post) => (
                  <tr key={post.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{post.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        post.status === 'Published' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      }`}>
                        {post.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{post.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300">
                          <Edit3 size={18} />
                        </button>
                        <button className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-100 dark:border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-serif font-bold dark:text-white">Quick Draft</h3>
              <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">Save Draft</button>
            </div>
            <div className="space-y-4">
              <input 
                type="text" 
                placeholder="Post title" 
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-500"
              />
              <textarea 
                placeholder="Start writing your post..." 
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-500"
              ></textarea>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-100 dark:border-gray-700">
            <h3 className="font-serif font-bold mb-4 dark:text-white">Admin Actions</h3>
            <div className="space-y-3">
              <button className="flex items-center w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-md transition-colors dark:text-white">
                <BookOpen size={18} className="mr-3 text-blue-600 dark:text-blue-400" />
                <span>Manage Book Recommendations</span>
              </button>
              <button className="flex items-center w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-md transition-colors dark:text-white">
                <Image size={18} className="mr-3 text-green-600 dark:text-green-400" />
                <span>Media Library</span>
              </button>
              <button className="flex items-center w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-md transition-colors dark:text-white">
                <Settings size={18} className="mr-3 text-purple-600 dark:text-purple-400" />
                <span>Site Settings</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;
