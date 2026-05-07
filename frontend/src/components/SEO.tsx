import { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  slug?: string;
}

export default function SEO({ title, description, slug }: SEOProps) {
  useEffect(() => {
    // Update Title
    const baseTitle = 'Wahana Data Utama';
    document.title = title ? `${title} | ${baseTitle}` : baseTitle;

    // Update Meta Description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', description || 'Mitra strategis untuk solusi intelligence data dan teknologi terpadu di Indonesia.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = description || 'Mitra strategis untuk solusi intelligence data dan teknologi terpadu di Indonesia.';
      document.head.appendChild(meta);
    }

    // Open Graph Tags (Phase 4)
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', title || baseTitle);
    
    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) ogUrl.setAttribute('content', `https://wdu.co.id/${slug || ''}`);

  }, [title, description, slug]);

  return null;
}
