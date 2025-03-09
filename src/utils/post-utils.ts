
/**
 * Format the excerpt from content
 */
export const formatExcerpt = (content: string): string => {
  // Remove any HTML tags and limit to 150 characters
  return content.replace(/<[^>]*>?/gm, '').substring(0, 150) + '...';
};

/**
 * Format the date
 */
export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

/**
 * Calculate read time
 */
export const calculateReadTime = (content: string): string => {
  const wordsPerMinute = 200;
  const textOnly = content.replace(/<[^>]*>?/gm, '');
  const wordCount = textOnly.split(/\s+/).length;
  const readTime = Math.ceil(wordCount / wordsPerMinute);
  return `${readTime} min read`;
};
