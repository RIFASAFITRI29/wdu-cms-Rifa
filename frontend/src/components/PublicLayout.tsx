import { Outlet, Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import api from '../services/api';
import { useLanguage } from '../context/LanguageContext';

interface SiteConfig {
  address?: string;
  phone?: string;
  email?: string;
  copyright?: string;
  logo_url?: string;
  company_profile_url?: string;
}

export default function PublicLayout() {
  const [config, setConfig] = useState<SiteConfig>({
    address: 'Blok AE No. 01, Jl. Terapi Raya, Menteng, Bogor Barat, 16111',
    phone: '(0251) 7552099',
    email: 'wahanadata@yahoo.com',
    copyright: '© 2026 Wahana Data Utama. All rights reserved.',
    logo_url: 'https://imd2022.wahanadata.co.id/img/WDU_02.png',
    company_profile_url: ''
  });
  const { language, setLanguage, t } = useLanguage();
  const location = useLocation();

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const { data } = await api.get('/config');
        if (data && Array.isArray(data)) {
          const configObj: any = {};
          data.forEach((item: any) => {
            if (item.key && item.value) {
              configObj[item.key] = item.value;
            }
          });
          setConfig(prev => ({ ...prev, ...configObj }));
        }
      } catch (error) {
        console.error('Failed to fetch site config', error);
      }
    };
    fetchConfig();
  }, []);

  const navLinkClass = (path: string) => {
    const isActive = location.pathname === path;
    return `text-[10px] uppercase font-bold tracking-widest relative group whitespace-nowrap ${
      isActive 
        ? 'text-emerald-950' 
        : 'text-zinc-500 hover:text-emerald-800'
    }`;
  };

  return (
    <div className="min-h-screen flex flex-col font-inter text-on-surface bg-white selection:bg-primary-fixed selection:text-on-primary-fixed">
      {/* ── NAVIGATION ── */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-zinc-50">
        <nav className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center shrink-0">
            <img 
              alt="Wahana Data Utama Logo" 
              src={config.logo_url} 
              className="h-5 w-auto object-contain" 
            />
          </Link>
          
          {/* Nav Links - Centered & Balanced */}
          <div className="hidden md:flex flex-1 justify-center items-center gap-6 lg:gap-8">
            {[
              { name: t('nav.home'), path: '/' },
              { name: t('nav.about'), path: '/tentang-kami' },
              { name: t('nav.services'), path: '/layanan' },
              { name: t('nav.experience'), path: '/pengalaman' },
              { name: 'SIS-WDU', path: 'https://sis.wahanadata.co.id/login', isExternal: true },
              { name: t('nav.contact'), path: '/kontak' }
            ].map((link) => (
              link.isExternal ? (
                <a 
                  key={link.path} 
                  href={link.path} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={navLinkClass(link.path)}
                >
                  {link.name}
                  <span className="absolute -bottom-2 left-0 h-[2px] bg-primary w-0 group-hover:w-full transition-all"></span>
                </a>
              ) : (
                <Link key={link.path} to={link.path} className={navLinkClass(link.path)}>
                  {link.name}
                  <span className={`absolute -bottom-2 left-0 h-[2px] bg-primary ${
                    location.pathname === link.path ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}></span>
                </Link>
              )
            ))}
          </div>

          <div className="flex items-center shrink-0 hidden md:flex gap-4">
            {/* Language Dropdown */}
            <div className="relative group">
              <button className="text-[10px] font-black uppercase tracking-widest text-emerald-950 px-4 py-2 rounded-full border border-emerald-50 hover:bg-emerald-50 transition-all flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px]">language</span>
                {language.toUpperCase()}
              </button>
              
              <div className="absolute top-full right-0 mt-2 w-40 bg-white rounded-2xl shadow-xl border border-zinc-50 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-[100] max-h-64 overflow-y-auto">
                {[
                  { code: 'id', label: 'Indonesia' },
                  { code: 'en', label: 'English' },
                  { code: 'jp', label: '日本語' },
                  { code: 'zh', label: '中文 (Mandarin)' },
                  { code: 'es', label: 'Español' },
                  { code: 'ar', label: 'العربية' },
                  { code: 'fr', label: 'Français' }
                ].map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => setLanguage(lang.code as any)}
                    className={`w-full text-left px-4 py-2 text-[10px] font-black uppercase tracking-widest hover:bg-emerald-50 transition-colors ${
                      language === lang.code ? 'text-primary' : 'text-emerald-950/40'
                    }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            </div>

            <Link
              to="/company-profile-not-found"
              className="bg-emerald-950 text-white px-5 py-2 rounded-full text-[10px] font-bold tracking-widest uppercase hover:bg-primary transition-all duration-300 flex items-center gap-2 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0"
            >
              <span className="material-symbols-outlined text-[14px]">download</span>
              {t('nav.download_profile')}
            </Link>
          </div>
          
          {/* Mobile Language Selector */}
          <div className="md:hidden flex items-center gap-2">
             <select 
              value={language}
              onChange={(e) => setLanguage(e.target.value as any)}
              className="text-[10px] font-black uppercase tracking-widest text-emerald-950 bg-transparent border border-emerald-50 px-2 py-1 rounded-lg outline-none"
            >
              <option value="id">ID</option>
              <option value="en">EN</option>
              <option value="jp">JP</option>
              <option value="zh">ZH</option>
              <option value="es">ES</option>
              <option value="ar">AR</option>
              <option value="fr">FR</option>
            </select>
          </div>
        </nav>
      </header>

      <main className="flex-1 pt-16">
        <Outlet />
      </main>

      {/* ── FOOTER ── */}
      <footer className="bg-emerald-950 text-emerald-50 py-6 px-6 md:px-12">
        <div className="max-w-7xl mx-auto mb-8">
          <img 
            src={config.logo_url} 
            alt="Wahana Data Utama" 
            className="h-6 w-auto object-contain"
          />
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-16">

          
          {/* Column 2: Alamat */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="text-white font-bold tracking-widest uppercase text-[9px]">{t('footer.address')}</h4>
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-white text-xl">location_on</span>
              <span className="text-xs font-bold tracking-tight leading-relaxed text-emerald-100/60">{t('footer.address_text')}</span>
            </div>
          </div>

          {/* Column 3: Kontak Kami */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="text-white font-bold tracking-widest uppercase text-[9px]">{t('footer.contact')}</h4>
            <ul className="flex flex-col gap-3 text-emerald-100/60 font-medium">
              <li className="flex items-center gap-3">
                <span className="material-symbols-outlined text-white text-xl">call</span>
                <span className="text-xs font-bold tracking-tight">{config.phone}</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="material-symbols-outlined text-white text-xl">mail</span>
                <span className="text-xs font-bold tracking-tight">{config.email}</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Social Media */}
          <div className="md:col-span-4 flex flex-col items-start md:items-end space-y-4">
            <h4 className="text-white font-bold tracking-widest uppercase text-[9px]">{t('footer.social')}</h4>
            <div className="flex gap-4">
              <a href="https://www.instagram.com/wahanadatautama/" target="_blank" rel="noopener noreferrer" className="group">
                <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all duration-300">
                  <svg className="w-4 h-4 fill-white group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4s1.791-4 4-4 4 1.791 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </div>
              </a>
              <a href="https://www.youtube.com/@wahanadatautama" target="_blank" rel="noopener noreferrer" className="group">
                <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all duration-300">
                  <svg className="w-4 h-4 fill-white/60 group-hover:fill-white" viewBox="0 0 24 24">
                    <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                  </svg>
                </div>
              </a>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-6 pt-6 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[9px] uppercase tracking-[0.2em] text-emerald-100/30">
            {t('footer.copyright')}
          </p>
          <div className="flex gap-6 text-[9px] uppercase tracking-[0.2em] text-emerald-100/30">
            <Link to="#" className="hover:text-white">{t('footer.privacy')}</Link>
            <Link to="#" className="hover:text-white">{t('footer.terms')}</Link>
            <Link to="#" className="hover:text-white">{t('footer.cookies')}</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}