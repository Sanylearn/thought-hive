
import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex justify-center py-20">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900 dark:border-white"></div>
    </div>
  );
};

export default LoadingSpinner;
