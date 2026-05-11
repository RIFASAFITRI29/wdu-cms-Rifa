import { useState, useEffect } from 'react';
import { pageService } from '../services/pageService';
import { useLanguage } from '../context/LanguageContext';
import { serviceDataService, Service } from '../services/serviceDataService';
import SEO from '../components/SEO';
import NotFoundPage from './NotFoundPage';


export default function ServicesPage() {
  const { t, language } = useLanguage();
  const [pageData, setPageData] = useState<any>(() => {
    const stored = localStorage.getItem('wdu_pages');
    if (stored) {
      const pages = JSON.parse(stored);
      return pages.find((p: any) => p.slug === 'services');
    }
    return null;
  });
  const [servicesList, setServicesList] = useState<Service[]>(() => {
    const stored = localStorage.getItem('wdu_services');
    return stored ? JSON.parse(stored) : [];
  });
  const [isNotFound, setIsNotFound] = useState(false);

  useEffect(() => {
    const fetchPageData = async () => {
      try {
        const { data } = await pageService.getBySlug('layanan');
        if (data) {
          const isPreview = new URLSearchParams(window.location.search).get('preview') === 'true';
          if (data.isPublished === false && !isPreview) {
            setIsNotFound(true);
          }
          setPageData(data);
        } else if (!pageData) {
          setIsNotFound(true);
        }
      } catch (e) {
        console.error('Failed to fetch services page content', e);
      }
    };
    fetchPageData();
    
    const fetchServices = async () => {
      try {
        const res = await serviceDataService.getAll();
        if (res && Array.isArray(res.data)) {
          const filtered = res.data.filter((s: any) => s && s.isActive === true);
          const sorted = [...filtered].sort((a: any, b: any) => (Number(a.order) || 0) - (Number(b.order) || 0));
          setServicesList(sorted);
        }
      } catch (error) {
        console.error('Failed to fetch services', error);
      }
    };
    fetchServices();
  }, []);


  return (
    <div className="bg-white">
      <SEO 
        title={pageData?.seoTitle || pageData?.title || 'Layanan'} 
        description={pageData?.seoDescription} 
        slug="layanan" 
      />
      <style>{`
        .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
      `}</style>

      {isNotFound ? (
        <NotFoundPage />
      ) : (
        <div className="flex flex-col">
          {/* ── IMAGE HERO SECTION ── */}
      <section className="relative h-[80vh] min-h-[600px] flex items-center justify-center overflow-hidden bg-emerald-950">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.pexels.com/photos/7868970/pexels-photo-7868970.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
            className="w-full h-full object-cover opacity-40 scale-110"
            alt="Services Hero"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-emerald-950 via-emerald-950/60 to-emerald-950"></div>
        </div>
        
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <div className="reveal-up">

            <h1 className="text-6xl md:text-9xl font-black text-white leading-none tracking-tighter mb-8 drop-shadow-2xl">
               {pageData?.title || t('services.hero_title')}
            </h1>
            <p className="text-xl md:text-2xl text-emerald-100/70 font-medium leading-relaxed max-w-3xl mx-auto mb-12">
               {(language === 'id' && pageData?.content) ? pageData.content.split('\n\n')[0] : t('services.hero_content')}
            </p>
            <div className="flex justify-center">
              <div className="w-24 h-1 bg-primary rounded-full shadow-[0_0_15px_rgba(21,128,61,0.5)]"></div>
            </div>
          </div>
        </div>
      </section>

      {/* ── INTRO SECTION (GARDA STYLE - NO PHOTO) ── */}
      <section className="py-24 bg-white relative overflow-hidden" id="intro">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-emerald-50/50 rounded-full blur-[150px] -z-10 translate-x-1/2 -translate-y-1/2"></div>
        
        <div className="max-w-7xl mx-auto px-8">
           <div className="bg-zinc-50 rounded-[4rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.05)] border-[12px] border-emerald-900/10 relative overflow-hidden p-12 md:p-24 text-center flex flex-col items-center">
              
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-emerald-100/50 border border-emerald-200/50 mb-8">
                 <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                 <span className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-900">
                    {language === 'id' ? 'Layanan Kami' : t('services.intro_badge')}
                 </span>
              </div>

              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-emerald-950 leading-tight tracking-tighter mb-8 max-w-4xl">
                 {language === 'id' 
                   ? 'Jelajahi beragam solusi terbaik dengan menggunakan layanan kami!' 
                   : t('services.intro_title')}
              </h2>
              
              <div className="w-24 h-1.5 bg-primary mb-10"></div>
              
              <p className="text-xl md:text-2xl text-emerald-900/70 font-medium leading-relaxed max-w-4xl">
                 {language === 'id' 
                   ? 'Kami dengan senang hati siap membantu memenuhi kebutuhan Anda melalui layanan terbaik yang kami sediakan. Jangan ragu untuk mengandalkan kami dalam memberikan solusi yang tepat untuk Anda!' 
                   : t('services.intro_desc')}
              </p>
           </div>
        </div>
      </section>

      {/* ── GRID SECTION ── */}
      <section className="py-24 px-6 md:px-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {servicesList.length > 0 ? (
              servicesList.map((service) => (
                <div key={service.id} className="bg-white p-12 rounded-[30px] border border-emerald-50 shadow-xl hover:shadow-2xl hover:border-emerald-100 transition-all duration-500 hover:-translate-y-4 group cursor-pointer">
                  <div className="w-24 h-24 bg-emerald-950 rounded-[2rem] flex items-center justify-center mb-10 group-hover:bg-primary transition-all duration-700 shadow-[0_20px_40px_-10px_rgba(6,78,59,0.3)] group-hover:shadow-[0_30px_60px_-15px_rgba(21,128,61,0.4)] group-hover:-translate-y-2">
                    <span className="material-symbols-outlined text-white text-4xl drop-shadow-2xl">{service.icon || 'star'}</span>
                  </div>
                  <h3 className="text-2xl font-black text-emerald-950 mb-4">
                    {(() => {
                      const key = `services.title.${service.title}`;
                      const translated = t(key);
                      return translated === key ? service.title : translated;
                    })()}
                  </h3>
                  <p className="text-emerald-950/60 leading-relaxed font-medium mb-2 text-sm">
                    {(() => {
                      const key = `services.desc.${service.title}`;
                      const translated = t(key);
                      return translated === key ? service.description : translated;
                    })()}
                  </p>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-20 text-emerald-950/60 font-medium text-lg">
                {t('services.no_services')}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── DATA IS OUR BUSINESS SECTION ── */}
      <section className="relative py-48 overflow-hidden bg-zinc-950">
        <div className="absolute inset-0 z-0">
          <img 
            className="w-full h-full object-cover opacity-20 mix-blend-overlay" 
            alt="Data Abstract" 
            src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
          />
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/40 to-transparent"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-8">
           <div className="max-w-4xl">
              <h2 className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-none mb-10 uppercase opacity-90">
                DATA IS OUR<br /><span className="text-primary">BUSINESS.</span>
              </h2>
              <div className="w-24 h-1 bg-primary mb-10"></div>
              <p className="text-zinc-400 text-lg md:text-xl font-bold leading-relaxed max-w-2xl">
                {pageData?.sections?.data_business_desc || t('services.data_business_desc')}
              </p>
           </div>
        </div>
      </section>
        </div>
      )}
    </div>
  );
}