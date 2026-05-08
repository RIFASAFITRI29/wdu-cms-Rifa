import { useState, useEffect, useRef } from 'react';
import { galleryService, GalleryImage } from '../services/galleryService';
import { clientService, ClientLogo } from '../services/clientService';
import { serviceDataService, Service } from '../services/serviceDataService';
import { pageService } from '../services/pageService';
import { useLanguage } from '../context/LanguageContext';
import SEO from '../components/SEO';
import NotFoundPage from './NotFoundPage';
import { sanitizeHtml } from '../utils/sanitizer';


interface Section {
  title?: string;
  subtitle?: string;
  content?: string;
  items?: any[];
  [key: string]: any;
}

interface PageData {
  title: string;
  seoTitle?: string;
  seoDescription?: string;
  sections: {
    hero?: Section;
    intro?: Section;
    stats?: Section;
    services?: Section;
    trust?: Section;
  };
}

const defaultData: PageData = {
  title: 'Home',
  sections: {
    hero: {
      title: 'Data Terpadu, Solusi Cerdas | Hasil Maksimal',
      subtitle: '',
      content: 'Percayakan kebutuhan riset, analisis data, dan teknologi kepada Wahana Data Utama. Kami mengubah data menjadi wawasan berharga dan solusi praktis yang membantu Anda meraih keunggulan kompetitif di era digital.',
      wallpaper: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=2426'
    },
    intro: {
      title: 'Memiliki pengalaman yang luas serta didukung oleh tim profesional yang kompeten.',
      content: 'Wahana Data Utama didirikan pada 2006 merupakan perusahaan riset dan survei yang berfokus pada bidang sosial-politik, ekonomi, pemasaran, pertanian, dan lainnya. Dengan visi menjadi penyedia data riset global, WDU didukung oleh tim profesional berpengalaman lebih dari 10 tahun. Berkantor di Bogor, kami telah memperoleh kepercayaan dari berbagai instansi pemerintah dan swasta untuk menangani berbagai proyek konsultasi, mulai dari riset hingga event organizing.'
    },
    stats: {
      items: [
        { label: 'Proyek Selesai', value: '500+' },
        { label: 'Klien Puas', value: '200+' },
        { label: 'Efisiensi Data', value: '98%' },
        { label: 'Dukungan', value: '24/7' }
      ]
    },
    services: {
      title: 'Layanan Kami',
      subtitle: 'Solusi Data Terintegrasi',
      content: 'Wahana Data Utama berkomitmen untuk membantu bisnis dan organisasi Anda mengelola, menganalisis, dan memanfaatkan data secara optimal.'
    },
    trust: {
      title: 'Kepercayaan klien terhadap kami',
      subtitle: 'Dengan pengalaman selama 18 tahun, kami membangun kolaborasi strategis untuk organisasi pemerintah dan juga sektor swasta.',
      content: 'Dengan pengalaman selama 18 tahun, kami membangun kolaborasi strategis untuk organisasi pemerintah dan juga sektor swasta.'
    }
  }
};

const clientLogos = [
  "https://wahanadata.co.id/wp-content/uploads/elementor/thumbs/ojk-qzsnm4azwliooo9bxr00atqdptuufbguuyqsnnofzw.png",
  "https://wahanadata.co.id/wp-content/uploads/elementor/thumbs/kpk-qzsnm3d5prhed2ap38ldqbyx4fzh7md4iu3b6dpu64.png",
  "https://wahanadata.co.id/wp-content/uploads/elementor/thumbs/kota-bogor-qzsnm2fbixg41gc28q6r5u7gj243zx9e6pftp3r8cc.png",
  "https://wahanadata.co.id/wp-content/uploads/elementor/thumbs/klh-qzsnm0jn59dje8esjpdi0uojcaddkj1xig4uqju0os.png",
  "https://wahanadata.co.id/wp-content/uploads/elementor/thumbs/kemenristek-qzsnlzlsyfc92mg5p6yvgcx2qwi0cty76bhd99vev0.png",
  "https://wahanadata.co.id/wp-content/uploads/elementor/thumbs/kemenkopukm-qzsnlxq4kr9ofeiw065mbde5k4r9xfqqi26eapy77g.png",
  "https://wahanadata.co.id/wp-content/uploads/elementor/thumbs/kemendesa-qzsnlxq4kr9ofeiw065mbde5k4r9xfqqi26eapy77g.png",
  "https://wahanadata.co.id/wp-content/uploads/elementor/thumbs/jakarta-qzsnlwsadx8e3sk95nqzqvmoyqvwpqn05xiwtfzldo.png",
  "https://wahanadata.co.id/wp-content/uploads/elementor/thumbs/pupr-qzsnm58u3fjz0a7ys9emvbhub7q7n0kl73ea4xn1to.png",
  "https://wahanadata.co.id/wp-content/uploads/elementor/thumbs/esdm-qzsnluwm095tgkmzgmxqlw3rrz56acfjho7xuw2dq4.png",
  "https://wahanadata.co.id/wp-content/uploads/elementor/thumbs/kemenperin-qzsnlynyrlayr0hiuok8vv5m5imn54ugu6tvrzwt18.png",
  "https://wahanadata.co.id/wp-content/uploads/elementor/thumbs/bumn-qzsn7zsb786k7mrzf56ubw20cdh9r2e2l1t40ymfi4.png",
  "https://wahanadata.co.id/wp-content/uploads/elementor/thumbs/bps-qzsmwqnvdmrz7p4g4s2mz8acbay2liprdcmu6pb3zw.png",
  "https://wahanadata.co.id/wp-content/uploads/elementor/thumbs/bpom-qzsmvfnxvwzn370pr7raik5am1dpwnj6iw0k6v8sn0.png",
  "https://wahanadata.co.id/wp-content/uploads/elementor/thumbs/bkpm-qzsmr5ier34m758mrd4h5n1p6uhiuaj79p0xhhlczg.png",
  "https://wahanadata.co.id/wp-content/uploads/elementor/thumbs/bank-indonesia-qzsmr4kkk93bvj9zwupul5a8lgm5mlfgxkdg07mr5o.png",
  "https://wahanadata.co.id/wp-content/uploads/elementor/thumbs/bpk-qzsmdae3y25cy7dmpvdkvmzxr8tmb0hqd2m3nk5erg.png",
  "https://wahanadata.co.id/wp-content/uploads/elementor/thumbs/bangka-selatan-1-qzsmd5owzvyxc5kghbcg166msbgs8iz2ofco96cdmk.png",
  "https://wahanadata.co.id/wp-content/uploads/elementor/thumbs/komdigi-qzsnm1hhc3etpudfe7s4lcfzxo8qs85nuksc7tsmik.png"
];

const galleryImages = [
  "https://wahanadata.co.id/wp-content/uploads/2025/01/91ff19eb-9bae-41be-bd79-86c09efa26ae.jpg",
  "https://wahanadata.co.id/wp-content/uploads/2025/01/1384bbe7-3362-446d-b989-77114335e7ea-scaled.jpg",
  "https://wahanadata.co.id/wp-content/uploads/2025/01/433319d2-e1de-4c4f-9a80-b83df6470507-scaled.jpg",
  "https://wahanadata.co.id/wp-content/uploads/2025/01/feac7c05-7818-4564-951d-893e14f37bfe-scaled.jpg",
  "https://wahanadata.co.id/wp-content/uploads/2025/01/a3f30e87-3b43-418b-b4ba-4529ed4e895a.jpg",
  "https://wahanadata.co.id/wp-content/uploads/2025/01/34695135-c70d-4d76-92d5-10c39eb5390f.jpg"
];



export default function HomePage() {
  const { t, language } = useLanguage();
  const [data, setData] = useState<PageData>(() => {
    const stored = localStorage.getItem('wdu_pages');
    if (stored) {
      const pages = JSON.parse(stored);
      const home = pages.find((p: any) => p.slug === 'home');
      return home || defaultData;
    }
    return defaultData;
  });
  const [clients, setClients] = useState<ClientLogo[]>(() => {
    const stored = localStorage.getItem('wdu_clients');
    return stored ? JSON.parse(stored) : [];
  });
  const [servicesList, setServicesList] = useState<Service[]>(() => {
    const stored = localStorage.getItem('wdu_services');
    return stored ? JSON.parse(stored) : [];
  });
  const [galleryList, setGalleryList] = useState<GalleryImage[]>(() => {
    const stored = localStorage.getItem('wdu_gallery');
    return stored ? JSON.parse(stored) : [];
  });
  const [isLoadingServices, setIsLoadingServices] = useState(false);
  const [isNotFound, setIsNotFound] = useState(false);

  const [isAutoScrollPaused, setIsAutoScrollPaused] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const galleryScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let animationFrameId: number;

    const scroll = () => {
      if (!isAutoScrollPaused) {
        scrollContainer.scrollLeft += 0.5; // Slower, smoother scroll
        const maxScroll = scrollContainer.scrollWidth / 3;
        if (scrollContainer.scrollLeft >= maxScroll * 2) {
          scrollContainer.scrollLeft -= maxScroll;
        }
      }
      animationFrameId = requestAnimationFrame(scroll);
    };

    const handleMouseEnter = () => setIsAutoScrollPaused(true);
    const handleMouseLeave = () => setIsAutoScrollPaused(false);

    scrollContainer.addEventListener('mouseenter', handleMouseEnter);
    scrollContainer.addEventListener('mouseleave', handleMouseLeave);

    animationFrameId = requestAnimationFrame(scroll);

    return () => {
      cancelAnimationFrame(animationFrameId);
      scrollContainer.removeEventListener('mouseenter', handleMouseEnter);
      scrollContainer.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [clients, isAutoScrollPaused]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const results = await Promise.allSettled([
          pageService.getBySlug('home'),
          clientService.getAll(),
          serviceDataService.getAll(),
          galleryService.getAll()
        ]);

        const pageRes = results[0].status === 'fulfilled' ? results[0].value : null;
        const clientRes = results[1].status === 'fulfilled' ? results[1].value : null;
        const serviceRes = results[2].status === 'fulfilled' ? results[2].value : null;
        const galleryRes = results[3].status === 'fulfilled' ? results[3].value : null;

        if (pageRes?.data) {
          const isPreview = new URLSearchParams(window.location.search).get('preview') === 'true';
          if (pageRes.data.isPublished === false && !isPreview) {
            setIsNotFound(true);
          }
          setData(pageRes.data);
          // Also sync to localStorage for next initial load
          const stored = localStorage.getItem('wdu_pages');
          const pages = stored ? JSON.parse(stored) : [];
          const updated = pages.map((p: any) => p.slug === 'home' ? pageRes.data : p);
          localStorage.setItem('wdu_pages', JSON.stringify(updated));
        } else if (!data) {
          setIsNotFound(true);
        }

        if (galleryRes?.data && Array.isArray(galleryRes.data) && galleryRes.data.length > 0) {
          const activeGallery = galleryRes.data.filter(g => g.isActive !== false).sort((a, b) => a.order - b.order);
          setGalleryList(activeGallery.length > 0 ? activeGallery : galleryImages.map((url, i) => ({ id: String(i), title: `Activity ${i+1}`, url, order: i, createdAt: '' })));
        } else {
          setGalleryList(galleryImages.map((url, i) => ({ id: String(i), title: `Activity ${i+1}`, url, order: i, createdAt: '' })));
        }

        // Standard logic for clients - Fallback to hardcoded if empty to maintain the marquee UI
        if (clientRes?.data && Array.isArray(clientRes.data) && clientRes.data.length > 0) {
          const activeClients = clientRes.data.filter(c => c.isActive !== false);
          if (activeClients.length > 0) {
            setClients(activeClients);
          } else {
            setClients(clientLogos.map((url, i) => ({
              id: `hardcoded-${i}`,
              name: `Client ${i}`,
              url,
              isActive: true,
              createdAt: new Date().toISOString()
            })));
          }
        } else {
          setClients(clientLogos.map((url, i) => ({
            id: `hardcoded-${i}`,
            name: `Client ${i}`,
            url,
            isActive: true,
            createdAt: new Date().toISOString()
          })));
        }

        // Use CMS services if available
        if (serviceRes?.data && Array.isArray(serviceRes.data)) {
          setServicesList(serviceRes.data.filter(s => s.isActive !== false).sort((a, b) => a.order - b.order));
        }
      } catch (error) {
        console.error('Critical error in home page data fetch:', error);
        setClients(clientLogos.map((url, i) => ({
          id: `error-fallback-${i}`,
          name: `Client ${i}`,
          url,
          isActive: true,
          createdAt: new Date().toISOString()
        })));
      } finally {
        setIsLoadingServices(false);
      }
    };
    fetchData();
  }, []);

  const handleScroll = (ref: React.RefObject<HTMLDivElement>, direction: 'left' | 'right') => {
    if (ref.current) {
      // Pause auto-scroll briefly when manual button is clicked
      setIsAutoScrollPaused(true);
      const scrollAmount = direction === 'left' ? -400 : 400;
      ref.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      
      // Resume auto-scroll after a delay
      setTimeout(() => setIsAutoScrollPaused(false), 2000);
    }
  };

  const hero = data?.sections?.hero || defaultData.sections.hero;
  const intro = data?.sections?.intro || defaultData.sections.intro;
  const stats = data?.sections?.stats || defaultData.sections.stats;
  const services = data?.sections?.services || defaultData.sections.services;
  const trust = data?.sections?.trust || defaultData.sections.trust;

  return (
    <>
      <SEO
        title={data?.seoTitle}
        description={data?.seoDescription}
        slug="home"
      />
      
      <style>{`
        @keyframes ken-burns {
          0% { transform: scale(1); }
          100% { transform: scale(1.15); }
        }
        .animate-ken-burns { animation: ken-burns 40s ease-out infinite alternate; }
        .reveal-up { animation: revealUp 1s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes revealUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {isNotFound ? (
        <NotFoundPage />
      ) : (
        <>
{/* ── HERO SECTION (CINEMATIC PREMIUM) ── */}
      <section className="relative h-screen min-h-[800px] flex items-center overflow-hidden bg-zinc-950">
        {/* Background Layer with Parallax & Ken Burns effect */}
        <div className="absolute inset-0 z-0 scale-125 animate-ken-burns">
          <img 
            src={data.sections.hero?.wallpaper || defaultData.sections.hero?.wallpaper} 
            alt="Hero Background" 
            className="w-full h-full object-cover opacity-50"
          />
        </div>
        
        {/* Gradient Overlays */}
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-zinc-950 via-zinc-950/60 to-transparent"></div>
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-zinc-950 via-transparent to-transparent"></div>

        <div className="relative z-20 max-w-7xl mx-auto px-6 md:px-12 w-full">
          <div className="flex flex-col items-start max-w-5xl">
            <div className="mb-8" />

            <h1 className="text-6xl md:text-9xl font-black text-white leading-[0.85] tracking-tighter mb-10">
              {(() => {
                const title = (language === 'id' && hero?.title) ? hero.title : t('home.hero_title');
                const parts = title.split('|');
                return parts.map((part, i) => (
                  <span key={i} className={`block ${i === 1 ? 'text-primary' : ''} ${i === 2 ? 'text-zinc-500' : ''}`}>
                    {part.trim()}
                  </span>
                ));
              })()}
            </h1>

            <div className="max-w-2xl">
              <div 
                className="text-xl md:text-2xl text-zinc-300 leading-relaxed font-medium mb-12"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml((language === 'id' && hero?.content) ? hero.content : t('home.hero_content')) }}
              />
              
              <div className="flex flex-wrap gap-6">
                <a href="#layanan" className="px-10 py-5 bg-primary text-zinc-950 rounded-full font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-2xl shadow-primary/20">
                  {t('common.get_started') || 'Jelajahi Solusi'}
                </a>
                <a href="#tentang-kami" className="px-10 py-5 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full font-black text-xs uppercase tracking-widest hover:bg-white/20 transition-all">
                  {t('common.learn_more') || 'Tentang Kami'}
                </a>
              </div>
            </div>
          </div>
        </div>


      </section>

      {/* ── STATS SECTION ── */}
      {stats?.items && stats.items.length > 0 && (
        <section className="py-12 bg-emerald-950 text-white border-y border-emerald-900/50">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.items.map((item: any, i: number) => (
                <div key={i} className="text-center">
                  <div className="text-4xl md:text-5xl font-black text-primary mb-2 tracking-tighter">
                    {item.value}
                  </div>
                  <div className="text-xs font-bold uppercase tracking-[0.2em] text-white/60">
                    {(() => {
                      // Try to translate the label directly if it's a known key or if we have a mapping
                      const key = `home.stats.${item.label}`;
                      const translated = t(key);
                      if (translated !== key) return translated;
                      
                      // Fallback for default labels
                      const defaultKeys: Record<string, string> = {
                        'Proyek Selesai': 'home.stats_projects',
                        'Klien Puas': 'home.stats_clients',
                        'Efisiensi Data': 'home.stats_efficiency',
                        'Dukungan': 'home.stats_support'
                      };
                      if (defaultKeys[item.label]) return t(defaultKeys[item.label]);
                      
                      return item.label;
                    })()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
      
      {/* ── NEW SERVICES SECTION (SYNCED STYLE FROM ServicesPage.tsx) ── */}
      <section className="py-24 bg-white px-6 md:px-12 border-b border-zinc-50" id="layanan">
        <div className="max-w-7xl mx-auto">
          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {isLoadingServices ? (
              <div className="col-span-full text-center py-20 text-emerald-950/40 font-bold tracking-widest uppercase text-xs animate-pulse">
                {t('home.loading_services')}
              </div>
            ) : servicesList.length > 0 ? (
              servicesList.map((service) => (
                <div key={service.id} className="glass-card p-12 rounded-[40px] shadow-xl hover:shadow-2xl hover:border-primary/40 transition-all duration-700 hover:-translate-y-4 group cursor-pointer relative overflow-hidden">
                  <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all duration-700" />
                  <div className="w-14 h-14 bg-emerald-950 rounded-xl flex items-center justify-center mb-10 group-hover:bg-primary transition-all duration-500 shadow-lg">
                    <span className="material-symbols-outlined text-white text-3xl">{service.icon || 'star'}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-emerald-950 mb-4">
                    {(() => {
                      const key = `services.title.${service.title}`;
                      const translated = t(key);
                      return translated === key ? service.title : translated;
                    })()}
                  </h3>
                  <p className="text-emerald-950 leading-relaxed font-medium mb-2 text-sm opacity-80">
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
                {t('home.no_services')}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── SUMMARY SOLUTION SECTION ── */}
      <section className="py-24 bg-zinc-50 px-6 md:px-12 text-center border-y border-zinc-100">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 mb-12">
            <div className="h-1.5 w-24 bg-primary rounded-full" />
            <h2 className="text-4xl md:text-6xl font-black text-emerald-950 tracking-tighter">
              {t('home.solution_title')}
            </h2>
          </div>
          <div 
            className="prose prose-xl dark:prose-invert max-w-none text-emerald-950/80 leading-relaxed font-medium mx-auto"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(((language === 'id' && services?.content) ? services.content : t('home.services_content'))) }} 
          />
        </div>
      </section>

      {/* ── TENTANG KAMI SECTION (Garda Style Redesign) ── */}
      <section className="py-32 bg-zinc-50" id="tentang-kami">
        <div className="max-w-7xl mx-auto px-8">
          <div className="bg-white rounded-[4rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.05)] border border-zinc-100 relative overflow-hidden flex flex-col lg:flex-row">
            
            {/* Left Column: Visual with Accent Background (Enlarged) */}
            <div className="lg:w-[45%] bg-emerald-50/50 p-8 md:p-12 flex flex-col justify-center relative">
              <div className="absolute top-0 left-0 w-2 h-full bg-primary/20"></div>
              <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-2xl border border-white/50">
                <img 
                  src={intro?.image || "https://wahanadata.co.id/wp-content/uploads/2025/02/direksi_pak-yudi-only.png"} 
                  className="w-full h-auto object-cover scale-105"
                  alt={intro?.title || "Director Profile"}
                />
              </div>
            </div>

            {/* Right Column: Content (Garda Style) */}
            <div className="lg:w-[55%] p-12 md:p-20 bg-white flex flex-col justify-center">
              <div className="space-y-10">
                <div className="space-y-6">

                  <h2 className="text-4xl md:text-5xl font-black text-emerald-950 tracking-tighter leading-tight">
                    {(language === 'id' && intro?.title) ? intro.title : t('home.intro_title')}
                  </h2>
                </div>
                
                <div 
                  className="prose prose-lg dark:prose-invert max-w-none text-emerald-950/70 leading-relaxed font-medium text-justify"
                  dangerouslySetInnerHTML={{ __html: sanitizeHtml((language === 'id' && intro?.content) ? intro.content : t('home.intro_content')) }} 
                />
                
                <div className="pt-8 border-t border-emerald-50">
                  <h4 className="text-2xl font-black text-emerald-950 mb-1">Ir. Yudi A. Idrus, M.M</h4>
                  <p className="text-primary font-black uppercase tracking-widest text-xs">{t('home.director_title')}</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── PENGALAMAN SECTION (TRADITIONAL STYLE) ── */}
      <section className="py-20 bg-white px-6 md:px-12 border-t border-zinc-100" id="pengalaman">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-emerald-950 mb-4">
              {(language === 'id' && trust?.title) ? trust.title : t('home.trust_title')}
            </h2>
            <div className="w-16 h-1 bg-primary mx-auto mb-6"></div>
            <div 
              className="prose dark:prose-invert max-w-none text-zinc-600 text-lg mx-auto"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml((language === 'id' && trust?.content) ? trust.content : t('home.trust_subtitle')) }} 
            />
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => handleScroll(scrollRef, 'left')}
              className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white hover:bg-emerald-700 transition-all shadow-lg active:scale-95 group"
              aria-label="Scroll left"
            >
              <span className="material-symbols-outlined text-2xl group-hover:-translate-x-1 transition-transform">chevron_left</span>
            </button>
            <button
              onClick={() => handleScroll(scrollRef, 'right')}
              className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white hover:bg-emerald-700 transition-all shadow-lg active:scale-95 group"
              aria-label="Scroll right"
            >
              <span className="material-symbols-outlined text-2xl group-hover:translate-x-1 transition-transform">chevron_right</span>
            </button>
          </div>
        </div>

        <div className="relative group mt-12">
          <div
            ref={scrollRef}
            className="flex overflow-x-auto no-scrollbar gap-16 items-center py-4 px-2"
          >
            {[...clients, ...clients, ...clients].map((client, i) => (
              <div key={i} className="bg-white p-6 rounded-[20px] shadow-xl border border-emerald-50/50 flex items-center justify-center shrink-0 w-44 h-24 md:w-60 md:h-32 hover:-translate-y-4 active:-translate-y-1 hover:shadow-2xl transition-all duration-500 cursor-pointer group/card">
                <img src={client.url} className="w-full h-full object-contain transition-transform duration-500 group-hover/card:scale-110" alt={client.name} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── GALLERY / DOCUMENTARY SECTION ── */}
      <section className="py-24 bg-zinc-950 text-white px-6 md:px-12 overflow-hidden relative">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          {galleryList.length > 0 && (
            <img
              src={galleryList[0].url}
              className="w-full h-full object-cover"
              alt="Background Wallpaper"
            />
          )}
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px w-8 bg-primary" />
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary">Documentary</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-6 leading-tight">
                {t('home.gallery_subtitle')}
              </h2>
              <p className="text-zinc-400 italic text-lg">
                {t('home.gallery_quote')}
              </p>
            </div>
            <div className="flex gap-3 mb-2">
              <button
                onClick={() => handleScroll(galleryScrollRef, 'left')}
                className="w-12 h-12 rounded-full border border-zinc-800 flex items-center justify-center hover:bg-primary hover:border-primary transition-all group"
              >
                <span className="material-symbols-outlined text-sm group-hover:scale-110 transition-transform">chevron_left</span>
              </button>
              <button
                onClick={() => handleScroll(galleryScrollRef, 'right')}
                className="w-12 h-12 rounded-full border border-zinc-800 flex items-center justify-center hover:bg-primary hover:border-primary transition-all group"
              >
                <span className="material-symbols-outlined text-sm group-hover:scale-110 transition-transform">chevron_right</span>
              </button>
            </div>
          </div>

          <div 
            ref={galleryScrollRef}
            className="overflow-x-auto no-scrollbar scroll-smooth"
          >
            <div className="flex animate-marquee-slow gap-6 items-center">
              {[...galleryList, ...galleryList, ...galleryList].map((img, i) => (
                <div key={i} className="w-[300px] md:w-[450px] h-72 bg-zinc-900 rounded-sm overflow-hidden group relative shrink-0">
                  <img src={img.url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100" alt={img.title || `Gallery ${i}`} />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-6 left-6 opacity-0 group-hover:opacity-100 transition-opacity">
                    <h3 className="font-bold text-xl">{img.title}</h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
        </>
      )}
    </>
  );
}
