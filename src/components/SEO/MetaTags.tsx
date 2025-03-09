
import React from 'react';
import { Helmet } from 'react-helmet-async';

interface MetaTagsProps {
  title: string;
  description?: string;
  keywords?: string;
  imageUrl?: string;
  url?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  author?: string;
  category?: string;
}

export const MetaTags: React.FC<MetaTagsProps> = ({
  title,
  description,
  keywords,
  imageUrl,
  url,
  type = 'website',
  publishedTime,
  author,
  category
}) => {
  const siteTitle = "Your Blog Name";
  const fullTitle = `${title} | ${siteTitle}`;
  const currentUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
  const imageUrlFull = imageUrl || 'https://yourdomain.com/og-image.png'; // Default OG image
  
  return (
    <Helmet>
      {/* Basic Metadata */}
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
      {keywords && <meta name="keywords" content={keywords} />}
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:title" content={title} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:image" content={imageUrlFull} />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={currentUrl} />
      <meta property="twitter:title" content={title} />
      {description && <meta property="twitter:description" content={description} />}
      <meta property="twitter:image" content={imageUrlFull} />
      
      {/* Article Specific Tags */}
      {type === 'article' && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {type === 'article' && author && (
        <meta property="article:author" content={author} />
      )}
      {type === 'article' && category && (
        <meta property="article:section" content={category} />
      )}
      
      {/* JSON-LD Structured Data */}
      {type === 'article' && (
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": title,
            "image": [imageUrlFull],
            "datePublished": publishedTime,
            "author": {
              "@type": "Person",
              "name": author || "Blog Author"
            }
          })}
        </script>
      )}
    </Helmet>
  );
};

export default MetaTags;
