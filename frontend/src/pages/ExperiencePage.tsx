import { useState, useEffect, useRef } from 'react';
import { pageService } from '../services/pageService';
import { useLanguage } from '../context/LanguageContext';
import { experiencePartnerService, ExperiencePartner } from '../services/experiencePartnerService';
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
          if (pageData.isPublished === false) {
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
          {/* ── HERO SECTION ── */}
      <section className="relative h-[60vh] flex items-center overflow-hidden hero-gradient">
        <div className="absolute inset-0">
          <img 
            src="https://images.pexels.com/photos/3183153/pexels-photo-3183153.jpeg" 
            className="w-full h-full object-cover opacity-30 mix-blend-overlay"
            alt="Experience Hero"
          />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 w-full">
           <div className="max-w-4xl">
              <span className="text-xs font-black uppercase tracking-[0.5em] text-primary mb-6 block animate-pulse">
                {t('experience.track_record')}
              </span>
              <h1 className="text-6xl md:text-9xl font-black text-white tracking-tighter uppercase leading-[0.8] mb-8">
                {data?.title || t('experience.hero_title')}
              </h1>
              <div className="w-32 h-2 bg-primary"></div>
           </div>
        </div>
      </section>

      {/* ── INTRO SECTION (SIDE IMAGE) ── */}
      <section className="relative py-32 overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
             <div className="space-y-8">
                <p className="text-xl md:text-2xl text-emerald-900/70 font-medium leading-relaxed text-justify">
                  {(language === 'id' && data?.content) ? data.content.split('\n\n')[0] : t('experience.content_1')}
                </p>
             </div>
             
             {/* Larger Right Image */}
             <div className="relative group">
                <div className="rounded-[3rem] overflow-hidden shadow-2xl border border-emerald-100">
                   <img 
                     src="https://sis.wahanadata.co.id/img/wdu-building.jpg" 
                     className="w-full h-[550px] object-cover group-hover:scale-110 transition-transform duration-1000"
                     alt="WDU Building"
                   />
                </div>
                {/* Decorative tag */}
                <div className="absolute -bottom-6 -left-6 bg-primary px-8 py-3 rounded-2xl shadow-xl">
                   <span className="text-xs font-black uppercase tracking-widest text-emerald-950">{t('experience.headquarter')}</span>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* ── NARRATIVE SECTION ── */}
      <section className="py-32 bg-zinc-50 border-y border-zinc-100 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div className="space-y-10">
              {((language === 'id' && data?.content) ? data.content.split('\n\n').slice(1) : [
                t('experience.content_2'),
                t('experience.content_3'),
                t('experience.content_4')
              ]).map((p: string, i: number) => (
                <p key={i} className="text-lg md:text-xl text-emerald-950/80 leading-relaxed font-medium">
                  {p}
                </p>
              ))}
              <div className="pt-6">
                 <div className="flex items-center gap-6 p-8 bg-emerald-950 rounded-[2rem] text-white shadow-2xl">
                    <span className="material-symbols-outlined text-4xl text-primary">verified</span>
                    <div>
                       <p className="text-xs font-black uppercase tracking-widest text-primary mb-1">{t('experience.quality_assured')}</p>
                       <p className="text-lg font-bold">{t('experience.data_accurate')}</p>
                    </div>
                 </div>
              </div>
            </div>
            <div className="relative group">
              <div className="rounded-[3rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] border border-emerald-100/20">
                <img 
                  src="https://wahanadata.co.id/wp-content/uploads/2025/01/34695135-c70d-4d76-92d5-10c39eb5390f.jpg" 
                  className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-1000"
                  alt="Wahana Data Utama Team"
                />
              </div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary/20 -z-10 rounded-full blur-3xl animate-pulse"></div>
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
              <div key={index} className="min-w-[340px] md:min-w-[420px] shrink-0 snap-center bg-zinc-50/50 rounded-[3rem] p-12 shadow-sm border border-zinc-100 hover:bg-white hover:shadow-2xl transition-all duration-700">
                 <div className="mb-12 flex justify-between items-center">
                    <h2 className="text-5xl font-black text-emerald-950 tracking-tighter">{item.year}</h2>
                    <span className="px-4 py-1 bg-primary text-emerald-950 text-[10px] font-black rounded-full uppercase tracking-widest">
                       {item.logos.length} {t('experience.partners_count')}
                    </span>
                 </div>

                 <div className="grid grid-cols-3 gap-y-12 gap-x-8 place-items-center opacity-60 hover:opacity-100 transition-opacity">
                    {item.logos.map((logo: string, i: number) => (
                       <img key={i} src={logo} className="max-h-12 max-w-full object-contain transition-all duration-500 cursor-pointer" alt="Partner Logo" />
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