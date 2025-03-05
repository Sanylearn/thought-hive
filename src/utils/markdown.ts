
import { marked } from 'marked';

export const parseMarkdown = (content: string): string => {
  if (!content) return '';
  return marked.parse(content);
};
