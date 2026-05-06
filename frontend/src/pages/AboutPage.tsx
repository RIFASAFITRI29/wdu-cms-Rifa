import { useState, useEffect } from 'react';
import { pageService } from '../services/pageService';
import { useLanguage } from '../context/LanguageContext';
import NotFoundPage from './NotFoundPage';

interface Section {
  title?: string;
  subtitle?: string;
  content?: any;
  [key: string]: any;
}

interface PageData {
  title: string;
  sections: {
    hero?: Section;
    profile?: Section;
    vision?: Section;
    mission?: Section;
    dynamic_points?: any[];
    directors?: any[];
  };
}


const defaultData: PageData = {
  title: 'Tentang Kami',
  sections: {
    hero: {
      title: 'Precision Intelligence',
      subtitle: 'Empowering global enterprises since 2006',
    },
    directors: [
      { name: "Dr. Ir. Erfiani, M.Si", role: "KOMISARIS UTAMA", image: "https://wahanadata.co.id/wp-content/uploads/2025/02/direksi_bu-erfi_scaled.png" },
      { name: "Ir. Yudi A. Idrus", role: "DIREKTUR UTAMA", image: "https://wahanadata.co.id/wp-content/uploads/2025/02/direksi_pak-yudi-only.png" },
      { name: "M. Adlan Fadillah , S.E", role: "DIREKTUR", image: "https://wahanadata.co.id/wp-content/uploads/2025/02/direksi_pak-adlan_fixed.png" },
      { name: "M. Hafiz Abdillah , S.T", role: "DIREKTUR", image: "https://wahanadata.co.id/wp-content/uploads/2025/02/direksi_bu-hafiz_fixed.png" },
      { name: "Nurul Athia R, S.Bns", role: "DIREKTUR", image: "https://wahanadata.co.id/wp-content/uploads/2025/02/direksi_mba-nia_fixed.png" }
    ]
  }
};


export default function AboutPage() {
  const { t, language } = useLanguage();
  const [data, setData] = useState<any>(() => {
    const stored = localStorage.getItem('wdu_pages');
    if (stored) {
      const pages = JSON.parse(stored);
      return pages.find((p: any) => p.slug === 'about') || defaultData;
    }
    return defaultData;
  });
  const [isNotFound, setIsNotFound] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: pageData } = await pageService.getBySlug('tentang-kami');
        if (pageData) {
          if (pageData.isPublished === false) {
            setIsNotFound(true);
          }
          setData(pageData);
        } else if (!data) {
          setIsNotFound(true);
        }
      } catch (error) {
        console.error('Failed to fetch about page data', error);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <style>{`
        .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
        .signature-gradient { background: linear-gradient(135deg, #164220 0%, #2e5a35 100%); }
      `}</style>

      {isNotFound ? (
        <NotFoundPage />
      ) : (
        <>
          {/* ── HERO SECTION ── */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={data?.sections?.hero?.wallpaper || "https://images.openai.com/static-rsc-4/6nhIZK3f8waRLXva3khx1n4y2eI2aJ8F-sFQ0pPnMl37kBXcKgYQkrCVSUb607SpI6MqZ7qwUayuT7B-iqEYn1LdPE8IFNiYHO3b3lPDIcs65Xpr_ZJqKwJ8naGL4fAAbAVIPveZbeA776O3_H-zqUbcoY1zM0wgpA4zFjn9in6zXJ4FGUITx69aNheCys0v?purpose=fullsize"} 
            className="w-full h-full object-cover"
            alt="About Hero"
          />

          <div className="absolute inset-0 bg-emerald-950/60 backdrop-blur-[1px]" />
        </div>
        <div className="relative z-10 text-center px-6">
           <span className="text-sm font-black uppercase tracking-[0.5em] text-white/80 mb-4 block">
           </span>
           <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter uppercase reveal-text">
              {data?.title || t('about.hero_title')}
           </h1>
        </div>
      </section>

      {/* Tentang Kami (About Us) */}
      <section className="py-32 bg-[#f2f4f2]" id="about">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div className="relative">
              <div className="relative z-10 bg-[#f0f4f2] rounded-[40px] overflow-hidden shadow-2xl group border border-emerald-50 aspect-square">
                <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Consultants Team" src="https://sis.wahanadata.co.id/img/wdu-building.jpg" />
              </div>
              <div className="absolute top-12 -right-12 w-64 h-64 bg-[#164220]/5 -z-10 rounded-[40px]"></div>
            </div>
            <div>
              <span className="text-[#164220] font-bold tracking-[0.2em] uppercase text-xs mb-4 block">{t('about.intro_subtitle')}</span>
              <h2 className="text-4xl md:text-5xl font-bold text-[#164220] tracking-tight mb-8 leading-tight">{t('about.intro_title')}</h2>
              <div 
                className="prose prose-lg dark:prose-invert max-w-none text-[#414940] leading-loose"
                dangerouslySetInnerHTML={{ __html: (language === 'id' && (data?.sections?.intro_content || data?.content)) ? (data.sections?.intro_content || data.content) : t('about.intro_content') }}
              />
              <div className="mt-12 flex items-center gap-4 text-[#164220] font-bold italic text-2xl">
                <span className="material-symbols-outlined text-3xl">verified</span>
                {t('common.data_business')}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Data Is Our Business (High Impact) */}
      <section className="relative py-40 overflow-hidden bg-zinc-950">
        <div className="absolute inset-0 opacity-40">
          <img className="w-full h-full object-cover" alt="Data Abstract" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDi-Bq7GjTUt0AkhAUjMdgi23XZM1CppJs8QmjU3hymd1vM-qLjJmDNVrz2T6_NFU2cR6k48luEKgZwKECteBevCCWLbiFjnA4hrAWZ8duVFrvagWiLy_sUKC3rK3KRAyAuTWIZUE7_PxDES_XuovhFg-t6y7VHA7Fxjy0k7_VpWoDbbtOo4Na_aCCyhxG2OpeExCaGUMX5Da45AOePnSm7imbMg9hadmvbLLIaFIZZERsqwhisBpdyIkr62MiIIo-dz9m7YMjk3zg" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/80 to-transparent"></div>
        <div className="relative max-w-7xl mx-auto px-8 text-center md:text-left">
          <h2 className="text-white text-7xl md:text-9xl font-black tracking-tighter mb-4 uppercase">{t('common.data_business').split(' ').slice(0,3).join(' ')}<br />{t('common.data_business').split(' ').slice(3).join(' ')}</h2>
          <div className="h-1 w-32 bg-[#bdefbe] mb-8"></div>
          <p className="text-[#e1e3e1] text-xl max-w-2xl font-light tracking-wide leading-relaxed">
            {t('about.data_business_desc')}
          </p>
        </div>
      </section>

      {/* Garda Terdepan Profesional Berpengalaman */}
      <section className="py-32 bg-white" id="professionals">
        <div className="max-w-7xl mx-auto px-8">
          <div className="max-w-5xl mx-auto">
            <div className="bg-emerald-50/50 border border-emerald-900/5 p-8 md:p-16 rounded-sm relative overflow-hidden shadow-sm">
              {/* Decorative Accent */}
              <div className="absolute top-0 left-0 w-full h-1 bg-emerald-900/20"></div>
              
              <div className="text-center">
                <h2 className="text-4xl md:text-5xl font-bold text-emerald-950 tracking-tight mb-12 leading-tight">
                  {t('about.pro_title')}
                </h2>
                <div 
                  className="prose prose-lg dark:prose-invert max-w-none text-emerald-900/80 leading-loose"
                  dangerouslySetInnerHTML={{ __html: (language === 'id' && data?.sections?.professional_content) ? data.sections.professional_content : t('about.pro_content') }}
                />
              </div>

              {/* Decorative Corner Element */}
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-emerald-900/5 rounded-tl-full -mr-16 -mb-16"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Visi & Misi Kami (Redesigned) */}
      <section className="py-32 bg-white overflow-hidden border-t border-emerald-900/10" id="visi-misi">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            
            {/* Left Column: VISI & MISI Boxes */}
            <div className="lg:col-span-5 space-y-8">
              {/* VISI Box */}
              <div className="bg-emerald-50/50 p-10 rounded-sm border-l-4 border-emerald-900 relative">
                <div className="flex items-center gap-4 mb-6">
                  <span className="material-symbols-outlined text-emerald-900 text-3xl">visibility</span>
                  <h3 className="text-xl font-black uppercase tracking-widest text-emerald-900">{t('about.vision_label')}</h3>
                </div>
                <p className="text-xl text-emerald-950/80 italic font-medium leading-relaxed">
                  "{t('about.vision_text')}"
                </p>
              </div>

              {/* MISI Box */}
              <div className="bg-emerald-50/50 p-10 rounded-sm border-l-4 border-emerald-900">
                <div className="flex items-center gap-4 mb-6">
                  <span className="material-symbols-outlined text-emerald-900 text-3xl">rocket_launch</span>
                  <h3 className="text-xl font-black uppercase tracking-widest text-emerald-900">{t('about.mission_label')}</h3>
                </div>
                <ul className="space-y-4">
                  {[
                    t('about.mission_1'),
                    t('about.mission_2'),
                    t('about.mission_3')
                  ].map((item, idx) => (
                    <li key={idx} className="flex gap-3 text-emerald-950/70 text-sm leading-relaxed font-medium">
                      <span className="material-symbols-outlined text-emerald-900 text-lg shrink-0">check_circle</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right Column: Strategic Pillars (With Brackets) */}
            <div className="lg:col-span-7 space-y-12 py-4">
              {[
                {
                  title: t('about.pillar_1_title'),
                  desc: t('about.pillar_1_desc'),
                  icon: "science"
                },
                {
                  title: t('about.pillar_2_title'),
                  desc: t('about.pillar_2_desc'),
                  icon: "precision_manufacturing"
                },
                {
                  title: t('about.pillar_3_title'),
                  desc: t('about.pillar_3_desc'),
                  icon: "lightbulb"
                }
              ].map((pillar, idx) => (
                <div key={idx} className="relative p-8 group">
                  {/* Decorative Brackets */}
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-emerald-900/20 group-hover:border-emerald-900 transition-colors duration-500"></div>
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-emerald-900/20 group-hover:border-emerald-900 transition-colors duration-500"></div>
                  
                  <div className="flex items-center gap-8 relative z-10">
                    <div className="w-16 h-16 bg-emerald-50 rounded-sm flex items-center justify-center shrink-0 shadow-sm group-hover:bg-emerald-900 group-hover:text-white transition-all duration-500">
                      <span className="material-symbols-outlined text-3xl">{pillar.icon}</span>
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-emerald-950 mb-2">{pillar.title}</h4>
                      <p className="text-emerald-900/60 text-sm leading-relaxed max-w-lg font-medium">{pillar.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* Jajaran Direksi (Board of Directors) */}
      <section className="py-32 bg-[#f8faf8]" id="directors">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-20">
            <span className="text-[#164220] font-bold tracking-[0.2em] uppercase text-xs mb-4 block">{t('about.leadership_label')}</span>
            <h2 className="text-4xl font-bold text-[#164220] mb-4">{t('about.directors_title')}</h2>
            <div className="w-20 h-1 bg-[#164220] mx-auto"></div>
          </div>

          {/* Dynamic Directors List */}
          {(() => {
            const directors = data?.sections?.directors || defaultData.sections.directors || [];
            return (
              <div className="space-y-16">
                {/* Top Row: First 2 Directors */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
                  {directors.slice(0, 2).map((leader: any, i: number) => (
                    <div key={i} className="group relative bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 flex flex-col border border-emerald-900/5">
                      <div className="w-full aspect-[4/3] bg-[#f4f5f5] relative flex items-end justify-center overflow-hidden pt-4">
                        {leader.image ? (
                          <img src={leader.image} alt={leader.name} className="w-full h-full object-contain object-bottom group-hover:scale-105 transition-transform duration-700" />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center">
                            <span className="material-symbols-outlined text-7xl text-emerald-900/20 mb-2">person</span>
                          </div>
                        )}
                      </div>
                      <div className="bg-[#164220] py-6 px-4 text-center">
                        <h3 className="text-xl font-bold text-white mb-1 tracking-wide">{leader.name}</h3>
                        <p className="text-[10px] font-bold tracking-[0.2em] text-[#a0bba6] uppercase">
                          {(() => {
                            const key = `role.${leader.role}`;
                            const translated = t(key);
                            return translated === key ? leader.role : translated;
                          })()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Bottom Row: Remaining Directors */}
                {directors.length > 2 && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {directors.slice(2).map((leader: any, i: number) => (
                      <div key={i} className="group relative bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 flex flex-col border border-emerald-900/5">
                        <div className="w-full aspect-[4/3] bg-[#f4f5f5] relative flex items-end justify-center overflow-hidden pt-4">
                          {leader.image ? (
                            <img src={leader.image} alt={leader.name} className="w-full h-full object-contain object-bottom group-hover:scale-105 transition-transform duration-700" />
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center">
                              <span className="material-symbols-outlined text-7xl text-emerald-900/20 mb-2">person</span>
                            </div>
                          )}
                        </div>
                        <div className="bg-[#164220] py-6 px-4 text-center">
                          <h3 className="text-xl font-bold text-white mb-1 tracking-wide">{leader.name}</h3>
                          <p className="text-[10px] font-bold tracking-[0.2em] text-[#a0bba6] uppercase">
                            {(() => {
                              const key = `role.${leader.role}`;
                              const translated = t(key);
                              return translated === key ? leader.role : translated;
                            })()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })()}

        </div>
      </section>
        </>
      )}
    </>
  );
}
