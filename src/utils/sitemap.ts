
import { supabase } from '@/integrations/supabase/client';

interface SitemapEntry {
  url: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

export async function generateSitemap(baseUrl: string): Promise<string> {
  // Get all published posts
  const { data: posts, error: postsError } = await supabase
    .from('posts')
    .select('id, slug, updated_at, created_at')
    .eq('status', 'published');
    
  if (postsError) {
    console.error('Error fetching posts for sitemap:', postsError);
    throw postsError;
  }
  
  // Get all book pages
  const { data: books, error: booksError } = await supabase
    .from('books')
    .select('id, updated_at, created_at');
    
  if (booksError) {
    console.error('Error fetching books for sitemap:', booksError);
    throw booksError;
  }
  
  // Static pages
  const staticPages: SitemapEntry[] = [
    { url: `${baseUrl}/`, priority: 1.0, changefreq: 'daily' },
    { url: `${baseUrl}/articles`, priority: 0.8, changefreq: 'daily' },
    { url: `${baseUrl}/books`, priority: 0.8, changefreq: 'weekly' },
  ];
  
  // Post pages
  const postPages: SitemapEntry[] = posts?.map(post => ({
    url: `${baseUrl}/post/${post.slug || post.id}`,
    lastmod: post.updated_at || post.created_at,
    priority: 0.7,
    changefreq: 'weekly'
  })) || [];
  
  // Book pages
  const bookPages: SitemapEntry[] = books?.map(book => ({
    url: `${baseUrl}/book/${book.id}`,
    lastmod: book.updated_at || book.created_at,
    priority: 0.6,
    changefreq: 'monthly'
  })) || [];
  
  // Combine all pages
  const allPages = [...staticPages, ...postPages, ...bookPages];
  
  // Generate sitemap XML
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map(page => `  <url>
    <loc>${page.url}</loc>
    ${page.lastmod ? `<lastmod>${new Date(page.lastmod).toISOString().split('T')[0]}</lastmod>` : ''}
    ${page.changefreq ? `<changefreq>${page.changefreq}</changefreq>` : ''}
    ${page.priority !== undefined ? `<priority>${page.priority}</priority>` : ''}
  </url>`).join('\n')}
</urlset>`;

  return sitemap;
}

export async function generateRobotsTxt(baseUrl: string): Promise<string> {
  return `User-agent: *
Allow: /

Sitemap: ${baseUrl}/sitemap.xml
`;
}
