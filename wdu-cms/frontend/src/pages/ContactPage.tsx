import React, { useState, useEffect } from 'react';
import { pageService } from '../services/pageService';
import { useLanguage } from '../context/LanguageContext';
import api from '../services/api';
import SEO from '../components/SEO';
import NotFoundPage from './NotFoundPage';

export default function ContactPage() {
  const { t } = useLanguage();
  const [data, setData] = useState<any>(() => {
    const stored = localStorage.getItem('wdu_pages');
    if (stored) {
      const pages = JSON.parse(stored);
      return pages.find((p: any) => p.slug === 'contact') || { title: 'Hubungi Kami' };
    }
    return { title: 'Hubungi Kami' };
  });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const [isNotFound, setIsNotFound] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPageData = async () => {
      try {

        const { data: pageData } = await pageService.getBySlug('kontak');
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
        console.error('Failed to fetch contact page content', e);
      }
    };
    fetchPageData();
  }, []);




  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('/contact', {
        ...formData,
        subject: 'General Inquiry'
      });
      setSuccess(true);
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal mengirim pesan. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO 
        title={data?.seoTitle || data?.title || 'Hubungi Kami'} 
        description={data?.seoDescription} 
        slug="kontak" 
      />
      <style>{`
        .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
        .signature-gradient { background: linear-gradient(135deg, #164220 0%, #2e5a35 100%); }
        .reveal-up { animation: revealUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; }
        @keyframes revealUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .form-input-focus {
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .form-input-focus:focus ~ .input-border {
          transform: scaleX(1);
        }
        .input-border {
          height: 2px;
          background: #164220;
          width: 100%;
          transform: scaleX(0);
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          transform-origin: left;
        }
      `}</style>

      {isNotFound ? (
        <NotFoundPage />
      ) : (
        /* Main body with background color from snippet */
        <div className="bg-[#f8faf8] text-[#191c1b] antialiased selection:bg-[#bdefbe] selection:text-[#164220] min-h-screen">
        
        <main>
          {/* Hero Section */}
          <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden bg-zinc-950">
        {/* Background Patterns */}
        <div className="absolute inset-0 z-0 opacity-20">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#15803d 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/10 rounded-full blur-3xl -mr-96 -mt-96"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <div className="reveal-up">

            <h1 className="text-7xl md:text-9xl font-black text-white leading-none tracking-tighter mb-10">
              {data?.title || t('contact.hero_title')}
            </h1>
            <div className="flex justify-center items-center gap-8">
              <div className="h-px w-20 bg-zinc-800"></div>
              <p className="text-zinc-500 text-xs font-black uppercase tracking-[0.4em]">Connect with Experts</p>
              <div className="h-px w-20 bg-zinc-800"></div>
            </div>
          </div>
        </div>
      </section>

          {/* Contact Form & Details Section */}
          <section className="py-24 bg-[#f8faf8]">
            <div className="max-w-7xl mx-auto px-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                {/* Left: Contact Details Grid (Bento Style) */}
                <div className="lg:col-span-5 flex flex-col gap-8">

                  <div className="grid grid-cols-1 gap-4">
                    {/* Address */}
                    <div className="bg-white p-8 rounded-sm border-l-4 border-[#164220] shadow-sm">
                      <div className="flex items-start gap-4">
                        <span className="material-symbols-outlined text-[#164220] text-3xl">location_on</span>
                        <div>
                          <h3 className="text-sm font-bold uppercase tracking-widest text-[#414940] mb-2">
                            {t('contact.address_label')}
                          </h3>
                          <p className="text-[#191c1b] leading-relaxed font-medium">
                            {data?.address || 'Blok AE No. 01, Jl. Terapi Raya, Menteng, Bogor Barat, 16111'}
                          </p>
                        </div>
                      </div>
                    </div>
                    {/* Email */}
                    <div className="bg-white p-8 rounded-sm border-l-4 border-[#164220] shadow-sm">
                      <div className="flex items-start gap-4">
                        <span className="material-symbols-outlined text-[#164220] text-3xl">mail</span>
                        <div>
                          <h3 className="text-sm font-bold uppercase tracking-widest text-[#414940] mb-2">
                            {t('contact.email_label')}
                          </h3>
                          <a className="text-[#191c1b] leading-relaxed font-medium hover:text-[#164220] transition-colors" href={`mailto:${data?.email || 'wahanadata@yahoo.com'}`}>
                            {data?.email || 'wahanadata@yahoo.com'}
                          </a>
                        </div>
                      </div>
                    </div>
                    {/* Phone */}
                    <div className="bg-white p-8 rounded-sm border-l-4 border-[#164220] shadow-sm">
                      <div className="flex items-start gap-4">
                        <span className="material-symbols-outlined text-[#164220] text-3xl">call</span>
                        <div>
                          <h3 className="text-sm font-bold uppercase tracking-widest text-[#414940] mb-2">
                            {t('contact.phone_label')}
                          </h3>
                          <p className="text-[#191c1b] leading-relaxed font-medium">
                            {data?.phone || '(0251) 755 2099'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
                {/* Right: Contact Form */}
                <div className="lg:col-span-7">
                  <div className="bg-white p-10 md:p-16 rounded-sm shadow-[0_20px_40px_rgba(25,28,27,0.06)] relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 opacity-5">
                      <span className="material-symbols-outlined text-[120px] text-[#164220]">chat_bubble</span>
                    </div>
                    <div className="relative z-10">
                      <h2 className="text-4xl font-extrabold tracking-tighter text-[#191c1b] mb-2">
                        {t('contact.form_title')}
                      </h2>
                      <p className="text-[#414940] mb-12 max-w-lg">
                        {t('contact.intro_description')}
                      </p>
                      
                      {success ? (
                        <div className="bg-[#bdefbe]/20 border border-[#bdefbe] p-8 rounded-sm text-center">
                          <span className="material-symbols-outlined text-[#164220] text-5xl mb-4">check_circle</span>
                          <h3 className="text-xl font-bold text-[#164220]">{t('contact.success_title')}</h3>
                          <p className="text-[#414940]">{t('contact.success_message')}</p>
                          <button onClick={() => setSuccess(false)} className="mt-6 text-[#164220] font-bold underline">{t('contact.send_again')}</button>
                        </div>
                      ) : (
                        <form onSubmit={handleSubmit} className="space-y-12" autoComplete="off">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            <div className="relative group">
                              <label className="block text-[10px] font-black uppercase tracking-[0.4em] text-[#414940]/60 mb-1 transition-all group-focus-within:text-[#164220] group-focus-within:translate-x-1">
                                {t('contact.full_name')}
                              </label>
                              <div className="relative">
                                <input 
                                  required
                                  name="id_auth_name"
                                  autoComplete="off"
                                  value={formData.name}
                                  onChange={e => setFormData({...formData, name: e.target.value})}
                                  className="w-full bg-transparent border-b-2 border-[#c1c9be]/30 px-0 py-4 text-xl font-bold text-[#191c1b] placeholder-[#414940]/20 transition-all outline-none focus:placeholder-transparent form-input-focus" 
                                  placeholder="Nama Lengkap Anda" 
                                  type="text"
                                />
                                <div className="input-border absolute bottom-0 left-0"></div>
                              </div>
                            </div>
                            
                            <div className="relative group">
                              <label className="block text-[10px] font-black uppercase tracking-[0.4em] text-[#414940]/60 mb-1 transition-all group-focus-within:text-[#164220] group-focus-within:translate-x-1">
                                {t('contact.business_email')}
                              </label>
                              <div className="relative">
                                <input 
                                  required
                                  name="id_auth_email"
                                  autoComplete="off"
                                  value={formData.email}
                                  onChange={e => setFormData({...formData, email: e.target.value})}
                                  className="w-full bg-transparent border-b-2 border-[#c1c9be]/30 px-0 py-4 text-xl font-bold text-[#191c1b] placeholder-[#414940]/20 transition-all outline-none focus:placeholder-transparent form-input-focus" 
                                  placeholder="email@perusahaan.com" 
                                  type="email"
                                />
                                <div className="input-border absolute bottom-0 left-0"></div>
                              </div>
                            </div>
                          </div>

                          <div className="relative group">
                            <label className="block text-[10px] font-black uppercase tracking-[0.4em] text-[#414940]/60 mb-1 transition-all group-focus-within:text-[#164220] group-focus-within:translate-x-1">
                              {t('contact.phone_number')}
                            </label>
                            <div className="relative">
                              <input 
                                required
                                name="id_auth_tel"
                                autoComplete="new-password"
                                value={formData.phone}
                                onChange={e => setFormData({...formData, phone: e.target.value})}
                                className="w-full bg-transparent border-b-2 border-[#c1c9be]/30 px-0 py-4 text-xl font-bold text-[#191c1b] placeholder-[#414940]/20 transition-all outline-none focus:placeholder-transparent form-input-focus" 
                                placeholder="+62 8..." 
                                type="tel"
                              />
                              <div className="input-border absolute bottom-0 left-0"></div>
                            </div>
                          </div>

                          <div className="relative group">
                            <label className="block text-[10px] font-black uppercase tracking-[0.4em] text-[#414940]/60 mb-1 transition-all group-focus-within:text-[#164220] group-focus-within:translate-x-1">
                              {t('contact.message')}
                            </label>
                            <div className="relative">
                              <textarea 
                                required
                                name="id_auth_msg"
                                autoComplete="off"
                                value={formData.message}
                                onChange={e => setFormData({...formData, message: e.target.value})}
                                className="w-full bg-transparent border-b-2 border-[#c1c9be]/30 px-0 py-4 text-xl font-bold text-[#191c1b] placeholder-[#414940]/20 transition-all outline-none focus:placeholder-transparent form-input-focus resize-none" 
                                placeholder={t('contact.message_placeholder') || 'Bagaimana kami dapat membantu bisnis Anda hari ini?'} 
                                rows={3}
                              ></textarea>
                              <div className="input-border absolute bottom-0 left-0"></div>
                            </div>
                          </div>

                          {error && (
                            <div className="flex items-center gap-2 text-red-600 bg-red-50 p-4 rounded-xl border border-red-100">
                              <span className="material-symbols-outlined text-lg">error</span>
                              <p className="text-xs font-black uppercase tracking-widest">{error}</p>
                            </div>
                          )}

                          <div className="flex flex-col lg:flex-row items-center justify-between gap-10 pt-10">
                            <button 
                              disabled={loading}
                              className="group relative overflow-hidden bg-[#164220] text-white px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-2xl hover:shadow-[#164220]/40 transition-all active:scale-95 disabled:opacity-50 w-full lg:w-auto" 
                              type="submit"
                            >
                                <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                                <span className="relative flex items-center justify-center gap-4">
                                  {loading ? 'Mengirim...' : 'Kirim Pesan'}
                                  {!loading && <span className="material-symbols-outlined transition-transform group-hover:translate-x-2">arrow_forward</span>}
                                </span>
                            </button>
                            
                            <div className="flex items-center gap-4 text-[#414940]/60 bg-gray-50 px-6 py-3 rounded-2xl border border-gray-100">
                              <span className="material-symbols-outlined text-[#164220]">lock</span>
                              <span className="text-[10px] font-black uppercase tracking-widest">Data Anda Aman & Terenkripsi</span>
                            </div>
                          </div>
                        </form>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          
          <div className="max-w-7xl mx-auto px-6">
            <div className="h-px bg-zinc-200 w-full opacity-50"></div>
          </div>

          <section className="py-24 bg-[#f8faf8]">
            <div className="max-w-7xl mx-auto px-6">
              <div className="h-[450px] relative w-full bg-[#e1e3e1] rounded-[3rem] overflow-hidden shadow-2xl border border-white">
                <iframe 
                  title="Google Maps"
                  allowFullScreen 
                  className="w-full h-full contrast-[1.1] brightness-[0.9]" 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade" 
                  src={data?.mapsUrl || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3963.4735398285516!2d106.772594!3d-6.587948299999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69c450f7f2b963%3A0x6d9f9f9f9f9f9f9f!2sJl.%20Terapi%20Raya%2C%20Menteng%2C%20Kec.%20Bogor%20Bar.%2C%20Kota%20Bogor%2C%20Jawa%20Barat%2016111!5e0!3m2!1sen!2sid!4v1710000000000!5m2!1sen!2sid"} 
                  style={{border: 0}}
                ></iframe>
              </div>
            </div>
          </section>
        </main>
      </div>
      )}
    </>
  );
}