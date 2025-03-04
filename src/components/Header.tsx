
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-sm' : 'bg-transparent dark:bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex-shrink-0"
          >
            <Link to="/" className="text-2xl font-serif font-bold tracking-tight text-gray-900 dark:text-white">
              Opinion Matters
            </Link>
          </motion.div>
          
          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {[
              { name: 'Home', link: '/' },
              { name: 'Articles', link: '/articles' },
              { name: 'Books', link: '/books' },
              { name: 'About', link: '/about' },
            ].map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Link 
                  to={item.link} 
                  className="text-gray-900 dark:text-gray-200 hover:text-gray-600 dark:hover:text-gray-400 transition-colors px-1 py-2 text-sm font-medium"
                >
                  {item.name}
                </Link>
              </motion.div>
            ))}
            <ThemeToggle />
          </nav>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-4">
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-900 dark:text-gray-200 hover:text-gray-600 dark:hover:text-gray-400 p-2 rounded-md"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <motion.div 
          className="md:hidden bg-white dark:bg-gray-800"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="px-4 py-2 space-y-1 divide-y divide-gray-200 dark:divide-gray-700">
            {[
              { name: 'Home', link: '/' },
              { name: 'Articles', link: '/articles' },
              { name: 'Books', link: '/books' },
              { name: 'About', link: '/about' },
            ].map((item) => (
              <Link
                key={item.name}
                to={item.link}
                className="block px-3 py-4 text-base font-medium text-gray-900 dark:text-gray-200 hover:text-gray-600 dark:hover:text-gray-400"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </motion.div>
      )}
    </header>
  );
};

export default Header;
