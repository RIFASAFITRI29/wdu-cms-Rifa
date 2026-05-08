import { useState, useEffect, useRef } from 'react';
import { pageService } from '../services/pageService';
import { useLanguage } from '../context/LanguageContext';
import { experiencePartnerService, ExperiencePartner } from '../services/experiencePartnerService';
import SEO from '../components/SEO';
import { sanitizeHtml } from '../utils/sanitizer';
import NotFoundPage from './NotFoundPage';

export default function ExperiencePage() {
  const { t, language } = useLanguage();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [data, setData] = useState<any>(() => {
    const stored = localStorage.getItem('wdu_pages');
    if (stored) {
      const pages = JSON.parse(stored);
      return pages.find((p: any) => p.slug === 'experience') || { title: 'Pengalaman Kami', content: '' };
    }
    return { title: 'Pengalaman Kami', content: '' };
  });
  const [dynamicPartners, setDynamicPartners] = useState<any[]>(() => {
     const stored = localStorage.getItem('wdu_experience_partners');
     if (stored) {
        const partnersData = JSON.parse(stored);
        const grouped = partnersData.reduce((acc: any, curr: any) => {
           if (!acc[curr.year]) acc[curr.year] = { year: curr.year, logos: [] };
           acc[curr.year].logos.push(curr.logoUrl);
           return acc;
        }, {});
        return Object.values(grouped).sort((a: any, b: any) => b.year.localeCompare(a.year));
     }
     return [];
  });
  const [isNotFound, setIsNotFound] = useState(false);

  useEffect(() => {
    const fetchPageData = async () => {
      try {
        const { data: pageData } = await pageService.getBySlug('pengalaman');
        if (pageData) {
          const isPreview = new URLSearchParams(window.location.search).get('preview') === 'true';
          if (pageData.isPublished === false && !isPreview) {
            setIsNotFound(true);
          }
          setData(pageData);
        } else if (!data) {
          setIsNotFound(true);
        }
      } catch (e) {
        console.error('Failed to fetch experience page content', e);
      }
    };
    
    const fetchPartners = async () => {
       try {
          const { data: partnersData } = await experiencePartnerService.getAll();
          // Group by year
          const grouped = (partnersData || []).reduce((acc: any, curr: ExperiencePartner) => {
             if (!acc[curr.year]) acc[curr.year] = { year: curr.year, logos: [] };
             acc[curr.year].logos.push(curr.logoUrl);
             return acc;
          }, {});
          
          setDynamicPartners(Object.values(grouped).sort((a: any, b: any) => b.year.localeCompare(a.year)));
       } catch (error) {
          console.error('Failed to fetch partners:', error);
       }
    };

    fetchPageData();
    fetchPartners();
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = direction === 'left' ? -400 : 400;
      current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };


  return (
    <div className="bg-white">
      <SEO 
        title={data?.seoTitle || data?.title || 'Pengalaman Kami'} 
        description={data?.seoDescription} 
        slug="pengalaman" 
      />
      <style>{`
        .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
        .hero-gradient { background: linear-gradient(135deg, #064e3b 0%, #065f46 100%); }
        .text-reveal { animation: reveal 1s cubic-bezier(0.77, 0, 0.175, 1) forwards; }
        @keyframes reveal { from { transform: translateY(100%); } to { transform: translateY(0); } }
      `}</style>

      {isNotFound ? (
        <NotFoundPage />
      ) : (
        <>
      <section className="relative h-[80vh] min-h-[600px] flex items-center overflow-hidden bg-zinc-950">
        <div className="absolute inset-0 z-0 scale-110">
          <img 
            src="https://images.pexels.com/photos/3183153/pexels-photo-3183153.jpeg" 
            className="w-full h-full object-cover opacity-60 mix-blend-overlay"
            alt="Experience Hero"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/60 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 w-full">
           <div className="max-w-5xl reveal-up">

              <h1 className="text-7xl md:text-9xl font-black text-white tracking-tighter uppercase leading-[0.85] mb-12">
                {data?.title || t('experience.hero_title')}
              </h1>
           </div>
        </div>

        {/* Decorative corner element */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 -skew-x-12 translate-x-1/2"></div>
      </section>

      {/* ── INTRO SECTION (Garda Style Redesign) ── */}
      <section className="py-32 bg-zinc-50" id="intro">
        <div className="max-w-7xl mx-auto px-8">
           <div className="bg-white rounded-[4rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.05)] border border-zinc-100 relative overflow-hidden flex flex-col lg:flex-row">
              
             {/* Left Column: Image with Accent Background */}
            <div className="lg:w-1/2 bg-emerald-50/50 p-8 md:p-12 flex flex-col justify-center relative">
              <div className="absolute top-0 left-0 w-2 h-full bg-primary/20"></div>
              <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-2xl border border-white/50 aspect-[3/2]">
                <img 
                  src="https://sis.wahanadata.co.id/img/wdu-building.jpg" 
                  className="w-full h-full object-cover scale-105"
                  alt="WDU Building"
                />
              </div>
            </div>

            <div className="lg:w-1/2 p-12 md:p-20 bg-white flex flex-col justify-center">
               <div 
                 className="prose prose-xl dark:prose-invert max-w-none text-emerald-950/70 leading-relaxed font-medium text-justify"
                 dangerouslySetInnerHTML={{ __html: sanitizeHtml((language === 'id' && data?.content?.trim()) ? data.content.split('\n\n')[0] : t('experience.content_1')) }} 
               />
             </div>

           </div>
        </div>
      </section>

      {/* ── NARRATIVE SECTION (Garda Style Redesign - Mirrored) ── */}
      <section className="py-32 bg-white" id="narrative">
        <div className="max-w-7xl mx-auto px-8">
          <div className="bg-zinc-50 rounded-[4rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.05)] border border-zinc-100 relative overflow-hidden flex flex-col lg:flex-row-reverse">
            
            {/* Right Column (Visual): Image with Accent Background */}
            <div className="lg:w-1/2 bg-emerald-950/5 p-8 md:p-12 flex flex-col justify-center relative">
              <div className="absolute top-0 right-0 w-2 h-full bg-primary/20"></div>
              <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-2xl border border-white/50 aspect-[3/2]">
                <img 
                  src="https://wahanadata.co.id/wp-content/uploads/2025/01/34695135-c70d-4d76-92d5-10c39eb5390f.jpg" 
                  className="w-full h-full object-cover scale-105"
                  alt="WDU Team"
                />
              </div>
            </div>

            {/* Left Column (Content) */}
            <div className="lg:w-1/2 p-12 md:p-20 bg-zinc-50 flex flex-col justify-center">
              <div className="space-y-8">
                {((language === 'id' && data?.content?.trim() && data.content.split('\n\n').length > 1) ? data.content.split('\n\n').slice(1) : [
                  t('experience.content_2'),
                  t('experience.content_3'),
                  t('experience.content_4')
                ]).map((p: string, i: number) => (
                  <p key={i} className="text-lg md:text-xl text-emerald-950/80 leading-relaxed font-medium text-justify">
                    {p}
                  </p>
                ))}
                
                <div className="pt-8 border-t border-emerald-100">
                   <div className="flex items-center gap-6 p-8 bg-emerald-950 rounded-[2.5rem] text-white shadow-2xl">
                      <span className="material-symbols-outlined text-4xl text-primary">verified</span>
                      <div>
                         <p className="text-lg font-bold">{t('experience.data_accurate')}</p>
                      </div>
                   </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── TIMELINE LOGOS SECTION ── */}
      <section className="py-32 px-6 md:px-12 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <div>
              <h3 className="text-5xl font-black text-emerald-950 tracking-tighter uppercase mb-4">{t('experience.milestones_title')}</h3>
              <p className="text-emerald-900/60 font-bold max-w-xl text-lg uppercase tracking-widest">
                {t('experience.milestones_subtitle')}
              </p>
            </div>
            <div className="flex gap-4">
              <button onClick={() => scroll('left')} className="w-16 h-16 rounded-2xl bg-zinc-100 text-emerald-950 flex items-center justify-center hover:bg-emerald-950 hover:text-white transition-all shadow-sm active:scale-95">
                <span className="material-symbols-outlined text-2xl">west</span>
              </button>
              <button onClick={() => scroll('right')} className="w-16 h-16 rounded-2xl bg-zinc-100 text-emerald-950 flex items-center justify-center hover:bg-emerald-950 hover:text-white transition-all shadow-sm active:scale-95">
                <span className="material-symbols-outlined text-2xl">east</span>
              </button>
            </div>
          </div>

          <div 
            ref={scrollRef}
            className="flex overflow-x-auto gap-8 pb-16 snap-x snap-mandatory scrollbar-hide"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {dynamicPartners.length > 0 ? dynamicPartners.map((item, index) => (
              <div key={index} className="min-w-[320px] md:min-w-[380px] shrink-0 snap-center bg-white rounded-[3rem] p-8 shadow-sm border border-emerald-50 hover:shadow-2xl transition-all duration-700">
                 <div className="mb-10 flex justify-between items-center">
                    <h2 className="text-4xl font-black text-emerald-950 tracking-tighter">{item.year}</h2>
                    <span className="px-3 py-1 bg-primary/10 text-emerald-950 text-[10px] font-black rounded-full uppercase tracking-widest border border-primary/20">
                       {item.logos.length} {t('experience.partners_count')}
                    </span>
                 </div>

                 <div className="grid grid-cols-3 gap-y-10 gap-x-6 place-items-center transition-opacity">
                    {item.logos.map((logo: string, i: number) => (
                       <div key={i} className="bg-white p-3 rounded-xl shadow-[0_10px_20px_-5px_rgba(0,0,0,0.1)] hover:shadow-[0_20px_40px_-10px_rgba(21,128,61,0.2)] transition-all duration-500 hover:-translate-y-1 cursor-pointer group/icon">
                          <img src={logo} className="max-h-12 w-auto object-contain transition-transform duration-500 group-hover/icon:scale-110" alt="Partner Logo" />
                       </div>
                    ))}
                 </div>
              </div>
            )) : (
              <div className="w-full text-center py-20 text-zinc-300 font-black uppercase tracking-[0.5em] text-sm animate-pulse">
                 {t('experience.syncing')}
              </div>
            )}
          </div>
        </div>
      </section>
        </>
      )}
    </div>
  );
}