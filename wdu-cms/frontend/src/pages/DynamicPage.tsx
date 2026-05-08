import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { pageService } from '../services/pageService';
import NotFoundPage from './NotFoundPage';
import { sanitizeHtml } from '../utils/sanitizer';
import SEO from '../components/SEO';

export default function DynamicPage() {
  const { slug } = useParams<{ slug: string }>();
  const [page, setPage] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPage = async () => {
      if (slug) {
        setLoading(true);
        try {
          const { data } = await pageService.getBySlug(slug);
          setPage(data);
        } catch (e) {
          console.error('Failed to fetch page:', e);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchPage();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const isPreview = new URLSearchParams(window.location.search).get('preview') === 'true';

  if (!page || (!page.isPublished && !isPreview)) {
    return <NotFoundPage />;
  }

  return (
    <div className="bg-white min-h-screen">
      <SEO 
        title={page.seoTitle || page.title} 
        description={page.seoDescription} 
        slug={slug} 
      />
      
      {/* ── CINEMATIC DYNAMIC HERO ── */}
      <section className="relative h-[70vh] min-h-[600px] flex items-center overflow-hidden bg-zinc-950">
        <div className="absolute inset-0 z-0">
          <img 
            alt={page.title} 
            className="w-full h-full object-cover opacity-40 mix-blend-overlay scale-110" 
            src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/60 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 w-full">
          <div className="max-w-4xl">

            <h1 className="text-6xl md:text-9xl font-black text-white tracking-tighter uppercase leading-[0.85] drop-shadow-2xl mb-12">
               {page.title}
            </h1>
            <div className="w-40 h-2 bg-primary"></div>
          </div>
        </div>
      </section>

      {/* ── ARTICLE CONTENT ── */}
      <section className="py-32 relative overflow-hidden bg-white">
         <div className="max-w-4xl mx-auto px-6 relative z-10">
            <div className="space-y-16">
               {page.content ? (
                 <div 
                   className="prose prose-xl dark:prose-invert max-w-none text-emerald-950/80 leading-relaxed font-medium"
                   dangerouslySetInnerHTML={{ __html: sanitizeHtml(page.content) }}
                 />
               ) : (
                 <div className="text-center py-20 border-2 border-dashed border-zinc-100 rounded-[3rem]">
                    <span className="material-symbols-outlined text-6xl text-zinc-200 mb-6">description_off</span>
                    <p className="text-xl text-zinc-400 italic">Konten artikel sedang dalam tahap penyusunan.</p>
                 </div>
               )}
               
               {/* Decorative Footer Element */}
               <div className="pt-16 border-t border-zinc-100 flex items-center justify-between opacity-40">
                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-950">© 2026 Wahana Data Utama</span>
                  <div className="flex gap-4">
                     <div className="w-2 h-2 rounded-full bg-primary"></div>
                     <div className="w-2 h-2 rounded-full bg-zinc-200"></div>
                     <div className="w-2 h-2 rounded-full bg-zinc-200"></div>
                  </div>
               </div>
            </div>
         </div>
      </section>
    </div>
  );
}
