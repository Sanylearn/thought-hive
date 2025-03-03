
import React from 'react';
import { Link } from 'react-router-dom';
import { Twitter, Facebook, Instagram, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200 py-12 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand section */}
          <div className="md:col-span-2">
            <Link to="/" className="text-xl font-serif font-bold tracking-tight">
              Opinion Matters
            </Link>
            <p className="mt-4 text-sm text-gray-600 max-w-md">
              A personal blog sharing thoughts and perspectives on technology, culture, 
              and contemporary issues that matter.
            </p>
          </div>
          
          {/* Navigation */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Navigation</h3>
            <ul className="mt-4 space-y-3">
              {[
                { name: 'Home', link: '/' },
                { name: 'Articles', link: '/articles' },
                { name: 'Books', link: '/books' },
                { name: 'About', link: '/about' },
              ].map((item) => (
                <li key={item.name}>
                  <Link to={item.link} className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Social links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Connect</h3>
            <div className="mt-4 flex space-x-4">
              <a href="#" className="text-gray-500 hover:text-gray-900 transition-colors">
                <Twitter size={20} />
                <span className="sr-only">Twitter</span>
              </a>
              <a href="#" className="text-gray-500 hover:text-gray-900 transition-colors">
                <Facebook size={20} />
                <span className="sr-only">Facebook</span>
              </a>
              <a href="#" className="text-gray-500 hover:text-gray-900 transition-colors">
                <Instagram size={20} />
                <span className="sr-only">Instagram</span>
              </a>
              <a href="mailto:contact@opinionmatters.com" className="text-gray-500 hover:text-gray-900 transition-colors">
                <Mail size={20} />
                <span className="sr-only">Email</span>
              </a>
            </div>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500 text-center">
            &copy; {new Date().getFullYear()} Opinion Matters. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
