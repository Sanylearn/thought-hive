
import React from 'react';
import { Sun, Moon, BookOpen } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { Toggle } from '@/components/ui/toggle';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme, readingMode, toggleReadingMode } = useTheme();

  return (
    <div className="flex items-center gap-2">
      {theme === 'light' && (
        <Toggle
          aria-label="Toggle reading mode"
          pressed={readingMode}
          onPressedChange={toggleReadingMode}
          className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
        >
          <BookOpen size={18} />
        </Toggle>
      )}
      
      <button
        onClick={toggleTheme}
        className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      >
        {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
      </button>
    </div>
  );
};

export default ThemeToggle;
