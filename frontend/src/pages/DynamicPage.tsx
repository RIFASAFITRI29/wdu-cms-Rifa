import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { pageService } from '../services/pageService';
import NotFoundPage from './NotFoundPage';

export default function DynamicPage() {
  const { slug } = useParams<{ slug: string }>();
  const [page, setPage] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPage = async () => {
      if (slug) {
        setLoading(true);
        const { data } = await pageService.getBySlug(slug);
        setPage(data);
        setLoading(false);
      }
    };
    fetchPage();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8faf8]">
        <div className="text-emerald-600 font-bold uppercase tracking-widest animate-pulse italic">
          Intelligence Data loading...
        </div>
      </div>
    );
  }

  if (!page || !page.isPublished) {
    return <NotFoundPage />;
  }

  const paragraphs = page.content ? page.content.split('\n\n') : [];

  return (
    <div className="bg-[#f8faf8] text-[#191c1b] antialiased selection:bg-[#bdefbe] selection:text-[#164220] min-h-screen">
      {/* Dynamic Hero */}
      <section className="relative h-[500px] flex items-center overflow-hidden bg-emerald-950">
        <div className="absolute inset-0 z-0">
          <img 
            alt={page.title} 
            className="w-full h-full object-cover opacity-30" 
            src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-transparent to-transparent"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
          <div className="max-w-3xl">
            <span className="inline-block bg-emerald-400 text-emerald-950 px-3 py-1 rounded-sm text-[10px] font-black tracking-widest uppercase mb-6 shadow-xl">
              Published Content
            </span>
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-6 leading-[0.9] drop-shadow-2xl">
               {page.title}
            </h1>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-24 relative overflow-hidden">
         <div className="max-w-4xl mx-auto px-6 relative z-10">
            <div className="bg-white p-12 md:p-20 rounded-[3rem] shadow-[0_40px_100px_rgba(0,0,0,0.03)] border border-zinc-50">
               <div className="space-y-10">
                  {paragraphs.length > 0 ? paragraphs.map((p: string, i: number) => (
                    <p key={i} className="text-xl md:text-2xl text-zinc-700 leading-relaxed font-medium">
                       {p}
                    </p>
                  )) : (
                    <p className="text-xl text-zinc-400 italic">Belum ada konten artikel untuk halaman ini.</p>
                  )}
               </div>
            </div>
         </div>
         
         {/* Decorative backgrounds */}
         <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-50 rounded-full blur-[120px] -z-10 opacity-60"></div>
         <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-50 rounded-full blur-[120px] -z-10 opacity-60"></div>
      </section>
    </div>
  );
}
