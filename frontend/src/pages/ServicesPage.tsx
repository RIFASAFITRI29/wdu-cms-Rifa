import { useState, useEffect } from 'react';
import { pageService } from '../services/pageService';
import { useLanguage } from '../context/LanguageContext';
import { serviceDataService, Service } from '../services/serviceDataService';
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
          if (data.isPublished === false) {
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
      <style>{`
        .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
      `}</style>

      {isNotFound ? (
        <NotFoundPage />
      ) : (
        <div className="flex flex-col">
          {/* ── IMAGE HERO SECTION ── */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.pexels.com/photos/7868970/pexels-photo-7868970.jpeg?_gl=1*ae2ft6*_ga*NjE5MTIyMDcuMTc1NDk2MTUyMQ..*_ga_8JE65Q40S6*czE3NzczNDQ5NTYkbzMzJGcxJHQxNzc3MzQ4OTQ1JGoxNiRsMCRoMA.." 
            className="w-full h-full object-cover brightness-50"
            alt="Services Hero"
          />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-6">
          <div className="bg-white/90 backdrop-blur-md p-10 md:p-16 rounded-[40px] shadow-2xl border border-white text-center transform transition-all duration-700 hover:scale-105">
            <h1 className="text-5xl md:text-7xl font-black text-emerald-950 leading-tight tracking-tighter mb-6 reveal-text">
               {pageData?.title || t('services.hero_title')}
            </h1>
            <div className="w-24 h-1.5 bg-primary mx-auto mb-8"></div>
            <p className="text-lg md:text-xl text-emerald-950/80 font-bold leading-relaxed max-w-2xl mx-auto reveal-text" style={{ animationDelay: '0.3s' }}>
               {(language === 'id' && pageData?.content) ? pageData.content.split('\n\n')[0] : t('services.hero_content')}
            </p>
          </div>
        </div>
      </section>

      {/* ── INTRO SECTION (TEXT) ── */}
      <section className="relative py-24 overflow-hidden bg-white border-b border-zinc-100">
        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 text-center">
          <span className="text-xs font-black uppercase tracking-[0.5em] text-primary mb-6 block">
            {t('services.intro_subtitle')}
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-emerald-950 leading-tight tracking-tighter mb-8 max-w-5xl mx-auto">
            {(language === 'id' && pageData?.content) ? pageData.content.split('\n\n')[1] : t('services.intro_content_2')}
          </h1>
          <div className="w-24 h-1.5 bg-primary mx-auto mb-10"></div>
          <p className="text-xl text-emerald-900/70 font-medium leading-relaxed max-w-3xl mx-auto">
            {(language === 'id' && pageData?.content) ? pageData.content.split('\n\n')[2] : t('services.intro_content_3')}
          </p>
        </div>
        
        {/* Background Decorative */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-50 rounded-full blur-3xl opacity-30 -mr-48 -mt-48" />
      </section>

      {/* ── GRID SECTION ── */}
      <section className="py-24 px-6 md:px-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {servicesList.length > 0 ? (
              servicesList.map((service) => (
                <div key={service.id} className="bg-white p-12 rounded-[30px] border border-emerald-50 shadow-xl hover:shadow-2xl hover:border-emerald-100 transition-all duration-500 hover:-translate-y-4 group cursor-pointer">
                  <div className="w-16 h-16 bg-emerald-950 rounded-2xl flex items-center justify-center mb-10 group-hover:bg-primary transition-all duration-500 shadow-lg">
                    <span className="material-symbols-outlined text-white text-3xl">{service.icon || 'star'}</span>
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
      <section className="relative py-40 overflow-hidden bg-zinc-950">
        <div className="absolute inset-0 opacity-40">
          <img className="w-full h-full object-cover" alt="Data Abstract" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDi-Bq7GjTUt0AkhAUjMdgi23XZM1CppJs8QmjU3hymd1vM-qLjJmDNVrz2T6_NFU2cR6k48luEKgZwKECteBevCCWLbiFjnA4hrAWZ8duVFrvagWiLy_sUKC3rK3KRAyAuTWIZUE7_PxDES_XuovhFg-t6y7VHA7Fxjy0k7_VpWoDbbtOo4Na_aCCyhxG2OpeExCaGUMX5Da45AOePnSm7imbMg9hadmvbLLIaFIZZERsqwhisBpdyIkr62MiIIo-dz9m7YMjk3zg" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/80 to-transparent"></div>
        <div className="relative max-w-7xl mx-auto px-8 text-center md:text-left flex flex-col items-center md:items-start">
          <h2 className="text-white text-7xl md:text-9xl font-black tracking-tighter mb-4 uppercase leading-none">{t('common.data_business').split(' ').slice(0,3).join(' ')}<br />{t('common.data_business').split(' ').slice(3).join(' ')}</h2>
          <div className="h-1 w-32 bg-primary mb-8"></div>
          <p className="text-zinc-400 text-xl max-w-2xl font-light tracking-wide leading-relaxed">
            {t('services.data_business_desc')}
          </p>
        </div>
      </section>
        </div>
      )}
    </div>
  );
}