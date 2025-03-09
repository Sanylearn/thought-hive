
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

interface SitemapEntry {
  url: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/xml'
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    const { searchParams } = new URL(req.url);
    const format = searchParams.get('format') || 'sitemap';
    const baseUrl = searchParams.get('baseUrl') || 'https://yourdomain.com';
    
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    if (format === 'robots') {
      // Generate robots.txt
      const robotsTxt = `User-agent: *
Allow: /

Sitemap: ${baseUrl}/api/sitemap
`;
      return new Response(robotsTxt, { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'text/plain' 
        } 
      });
    } else {
      // Get all published posts
      const { data: posts, error: postsError } = await supabase
        .from('posts')
        .select('id, slug, updated_at, created_at')
        .eq('status', 'published');
        
      if (postsError) {
        throw postsError;
      }
      
      // Get all book pages
      const { data: books, error: booksError } = await supabase
        .from('books')
        .select('id, updated_at, created_at');
        
      if (booksError) {
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

      return new Response(sitemap, { headers: corsHeaders });
    }
  } catch (error) {
    console.error('Error generating sitemap:', error);
    
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 500,
      headers: { 
        ...corsHeaders,
        'Content-Type': 'application/json' 
      } 
    });
  }
});
