import { useState, useEffect } from 'react';
import { pageService } from '../services/pageService';
import { useLanguage } from '../context/LanguageContext';
import SEO from '../components/SEO';
import NotFoundPage from './NotFoundPage';
import { sanitizeHtml } from '../utils/sanitizer';

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
          const isPreview = new URLSearchParams(window.location.search).get('preview') === 'true';
          if (pageData.isPublished === false && !isPreview) {
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
    <div className="bg-white">
      <SEO 
        title={data?.seoTitle || data?.title || 'Tentang Kami'} 
        description={data?.seoDescription} 
        slug="tentang-kami" 
      />
      <style>{`
        .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
        .signature-gradient { background: linear-gradient(135deg, #164220 0%, #2e5a35 100%); }
      `}</style>

      {isNotFound ? (
        <NotFoundPage />
      ) : (
        <>
          {/* ── HERO SECTION ── */}
      {/* ── HERO SECTION: ELITE BRANDING ── */}
      <section className="relative h-[95vh] flex items-center justify-center overflow-hidden bg-zinc-950">
        {/* Advanced Background Layers */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=2070" 
            className="w-full h-full object-cover opacity-30 animate-ken-burns scale-110"
            alt="Intelligence Background"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-zinc-950 via-zinc-950/60 to-emerald-950/20" />
          
          {/* Decorative Mesh Gradient */}
          <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-primary/10 rounded-full blur-[150px] animate-pulse"></div>
          <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-emerald-900/10 rounded-full blur-[150px] animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-8 flex flex-col items-center">
           {/* Floating Badge */}
           <div className="reveal-up mb-12">
              <div className="px-6 py-2 rounded-full bg-white/5 backdrop-blur-2xl border border-white/10 flex items-center gap-3 shadow-2xl">
                 <div className="w-2 h-2 bg-primary rounded-full animate-ping"></div>
                 <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white/90">WDU Precision Intelligence</span>
              </div>
           </div>
           
           <div className="text-center space-y-6 relative">
              {/* Massive Title with Mixed Styles */}
              <h1 className="text-[12vw] lg:text-[10vw] font-black leading-[0.8] tracking-tighter uppercase reveal-up select-none">
                 <span className="block text-white">TENTANG</span>
                 <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary via-emerald-400 to-primary/80">KAMI.</span>
                 <span className="block text-white opacity-10 absolute -bottom-8 left-1/2 -translate-x-1/2 blur-sm pointer-events-none">KAMI.</span>
              </h1>
            </div>

           {/* Floating Data Nodes (Decorative) */}
           <div className="absolute top-1/4 -left-12 hidden xl:block animate-float reveal-up" style={{ animationDelay: '0.5s' }}>
              <div className="p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl">
                 <span className="material-symbols-outlined text-primary text-3xl mb-2">query_stats</span>
                 <div className="text-[10px] font-black text-white/40 uppercase tracking-widest">Accuracy</div>
                 <div className="text-xl font-black text-white">99.9%</div>
              </div>
           </div>

           <div className="absolute bottom-1/4 -right-12 hidden xl:block animate-float-slow reveal-up" style={{ animationDelay: '0.7s' }}>
              <div className="p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl">
                 <span className="material-symbols-outlined text-emerald-400 text-3xl mb-2">verified</span>
                 <div className="text-[10px] font-black text-white/40 uppercase tracking-widest">Experience</div>
                 <div className="text-xl font-black text-white">18+ Yrs</div>
              </div>
           </div>

        </div>
      </section>

      <style>{`
        @keyframes ken-burns {
          0% { transform: scale(1.1) rotate(0deg); }
          100% { transform: scale(1.2) rotate(1deg); }
        }
        .animate-ken-burns { animation: ken-burns 60s linear infinite alternate; }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
        
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        .animate-float-slow { animation: float-slow 8s ease-in-out infinite; }

        @keyframes scroll-line {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        .animate-scroll-line { animation: scroll-line 2s cubic-bezier(0.16, 1, 0.3, 1) infinite; }

        @keyframes revealUp {
          from { opacity: 0; transform: translateY(60px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .reveal-up { opacity: 0; animation: revealUp 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>

       {/* ── SECTION: DYNAMIC COMPANY OVERVIEW (Garda Style Redesign) ── */}
       <section className="py-32 bg-white relative overflow-hidden" id="about">
         <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-emerald-50/50 rounded-full blur-[150px] -z-10 translate-x-1/2 -translate-y-1/2"></div>
         
         <div className="max-w-7xl mx-auto px-8">
            <div className="bg-zinc-50 rounded-[4rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.05)] border border-zinc-100 relative overflow-hidden flex flex-col lg:flex-row">
               
               {/* Left Column: Visual with Accent Background */}
               <div className="lg:w-1/2 bg-emerald-50/50 p-8 md:p-12 flex flex-col justify-center relative">
                  <div className="absolute top-0 left-0 w-2 h-full bg-primary/20"></div>
                  <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl border border-white/50">
                     <img 
                       className="w-full h-auto" 
                       alt="Corporate Environment" 
                       src={data?.sections?.intro?.image || "https://sis.wahanadata.co.id/img/wdu-building.jpg"} 
                     />
                  </div>
               </div>
 
               {/* Right Column: Content */}
               <div className="lg:w-1/2 p-12 md:p-20 bg-zinc-50 flex flex-col justify-center">
                  <div className="space-y-10">
                     <h2 className="text-5xl md:text-7xl font-black text-emerald-950 tracking-tighter leading-tight uppercase">
                        {t('about.intro_title')}
                     </h2>
                     
                     <div 
                       className="prose prose-xl dark:prose-invert max-w-none text-emerald-950/70 leading-relaxed font-medium text-justify"
                       dangerouslySetInnerHTML={{ __html: sanitizeHtml((language === 'id' && data?.content?.trim()) ? (data.sections?.intro_content || data.content) : t('about.intro_content')) }} 
                     />
                  </div>
               </div>
 
            </div>
         </div>
       </section>


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
                {typeof data?.sections?.data_business_desc === 'string' ? data.sections.data_business_desc : t('about.data_business_desc')}
              </p>
           </div>
        </div>
      </section>

      {/* ── SECTION: PROFESSIONAL EXCELLENCE ── */}
      <section className="py-32 bg-zinc-50" id="professionals">
        <div className="max-w-7xl mx-auto px-8">
           <div className="bg-white rounded-[4rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.05)] border border-zinc-100 relative overflow-hidden flex flex-col lg:flex-row">
              {/* Left Column (Accent Background) */}
              <div className="lg:w-2/5 bg-emerald-50/50 p-12 md:p-20 flex flex-col justify-center relative">
                 <div className="absolute top-0 left-0 w-2 h-full bg-primary/20"></div>
                 <div className="space-y-6 relative z-10">
                    <div className="flex items-center gap-4">
                      <div className="h-[2px] w-12 bg-primary"></div>
                      <span className="text-[10px] font-black uppercase tracking-[0.5em] text-primary">Our Foundation</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black text-emerald-950 tracking-tighter leading-tight">
                      {data?.sections?.professional?.title || "Garda Terdepan Profesional Berpengalaman"}
                    </h2>
                 </div>
              </div>

              {/* Right Column (Content) */}
              <div className="lg:w-3/5 p-12 md:p-20 bg-white flex items-center">
                 <div 
                   className="prose prose-lg dark:prose-invert max-w-none text-emerald-950/70 leading-relaxed font-medium text-justify"
                   dangerouslySetInnerHTML={{ __html: sanitizeHtml(data?.sections?.professional?.content || `Didirikan oleh para profesional berpengalaman dengan spesialisasi lebih dari satu dekade, kami membangun fondasi perusahaan yang kokoh dalam setiap aspek operasional, mulai dari perencanaan, pelaksanaan, pengawasan, hingga evaluasi, dengan pendekatan metodologi berbasis teknologi modern. Tenaga ahli kami yang terlatih dan bersertifikasi terus meningkatkan kompetensi melalui pendidikan dan pelatihan berbasis digital, termasuk riset dan penggunaan software analitik canggih. Sebagai mitra strategis bagi instansi pemerintah maupun swasta, kami telah membuktikan kapabilitas dengan menyelesaikan berbagai proyek konsultasi yang kompleks dan multidimensi, mencakup riset tren pasar global, pelatihan profesional berbasis teknologi, hingga event organizing yang didukung platform digital. Dengan integrasi solusi berkelanjutan untuk menghadapi tantangan global, transformasi digital, dan ketahanan ekonomi, kami memanfaatkan data sebagai aset strategis untuk mendukung pembangunan nasional dan internasional. Di tahun 2025, kami terus berkomitmen untuk menjadi mitra terpercaya yang menghadirkan inovasi dan perubahan signifikan dalam ekosistem data-driven yang berorientasi pada masa depan.`) }}
                 />
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
                  "{data?.sections?.vision?.text || t('about.vision_text')}"
                </p>
              </div>

              {/* MISI Box */}
              <div className="bg-emerald-50/50 p-10 rounded-sm border-l-4 border-emerald-900">
                <div className="flex items-center gap-4 mb-6">
                  <span className="material-symbols-outlined text-emerald-900 text-3xl">rocket_launch</span>
                  <h3 className="text-xl font-black uppercase tracking-widest text-emerald-900">{t('about.mission_label')}</h3>
                </div>
                <ul className="space-y-4">
                  {(Array.isArray(data?.sections?.vision?.missions) ? data.sections.vision.missions : [
                    t('about.mission_1'),
                    t('about.mission_2'),
                    t('about.mission_3')
                  ]).map((item: string, idx: number) => (
                    <li key={idx} className="flex gap-3 text-emerald-950/70 text-sm leading-relaxed font-medium">
                      <span className="material-symbols-outlined text-emerald-900 text-lg shrink-0">check_circle</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right Column: Why Choose Us (With Brackets) */}
            <div className="lg:col-span-7 space-y-12 py-4">
              <div className="mb-8">
                <span className="text-[#164220] font-bold tracking-[0.2em] uppercase text-[10px] mb-2 block">Our Strength</span>
                <h3 className="text-3xl font-black text-[#164220] uppercase tracking-tight">Mengapa Memilih Kami?</h3>
              </div>
              {(Array.isArray(data?.sections?.pillars) ? data.sections.pillars : [
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
              ]).map((pillar: any, idx: number) => (
                <div key={idx} className="relative p-8 group">
                  {/* Decorative Brackets */}
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-emerald-900/20 group-hover:border-emerald-900 transition-colors duration-500"></div>
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-emerald-900/20 group-hover:border-emerald-900 transition-colors duration-500"></div>
                  
                  <div className="flex items-center gap-8 relative z-10">
                    <div className="w-16 h-16 bg-emerald-50 rounded-sm flex items-center justify-center shrink-0 shadow-sm group-hover:bg-emerald-900 group-hover:text-white transition-all duration-500">
                      <span className="material-symbols-outlined text-3xl">{pillar?.icon || 'science'}</span>
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-emerald-950 mb-2">{pillar?.title}</h4>
                      <p className="text-emerald-900/60 text-sm leading-relaxed max-w-lg font-medium">{pillar?.desc}</p>
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
            <div className="mb-4" />
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
                      <div className="w-full aspect-[3/2] bg-white relative flex items-end justify-center overflow-hidden">
                        {leader.image ? (
                          <img src={leader.image} alt={leader.name} className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700" />
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
                        <div className="w-full aspect-[3/2] bg-white relative flex items-end justify-center overflow-hidden">
                          {leader.image ? (
                            <img src={leader.image} alt={leader.name} className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700" />
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
    </div>
  );
}
