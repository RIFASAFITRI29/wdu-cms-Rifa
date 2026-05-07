import React, { useState, useEffect } from 'react';
import { pageService } from '../services/pageService';
import { useLanguage } from '../context/LanguageContext';
import api from '../services/api';
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
          if (pageData.isPublished === false) {
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


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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
      <style>{`
        .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
        .signature-gradient { background: linear-gradient(135deg, #164220 0%, #2e5a35 100%); }
      `}</style>

      {isNotFound ? (
        <NotFoundPage />
      ) : (
        /* Main body with background color from snippet */
        <div className="bg-[#f8faf8] text-[#191c1b] antialiased selection:bg-[#bdefbe] selection:text-[#164220] min-h-screen">
        
        <main>
          {/* Hero Section */}
          <section className="relative h-[614px] flex items-center overflow-hidden">
            <div className="absolute inset-0 z-0">
              <img alt="Wahana Data Utama Team" className="w-full h-full object-cover brightness-50" src="https://images.openai.com/static-rsc-4/ROSruKSgwX-gLUeGWKH-bQAloTnIgCbske6BHhuTArEG6ADqnpcJvG-Fd8rO_KrWE5vaWOERkiNLAJl6o6V11TQNNNMP69Y1DRMb_HHrBs4j3YzZvZJhe_JVixKhYvs-UYAmrYc3h9xrM6-9aUhljjKfV6jB975NGudtfKcZ6iZe-_sVcMN9jYmMkpkwDP8y?purpose=fullsize"/>
              <div className="absolute inset-0 bg-gradient-to-r from-[#164220]/60 to-transparent"></div>
            </div>
            <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
              <div className="max-w-2xl">
                <span className="inline-block bg-[#bdefbe] text-[#24502c] px-3 py-1 rounded-sm text-xs font-bold tracking-widest uppercase mb-4 reveal-text" style={{ animationDelay: '0.3s' }}>
                  {t('contact.hero_label')}
                </span>
                <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tighter mb-6 leading-none reveal-text">
                   {data?.title || t('contact.hero_title')}
                </h1>
                <p className="text-xl md:text-2xl text-white font-light leading-relaxed max-w-xl opacity-90 reveal-text" style={{ animationDelay: '0.5s' }}>
                    {data?.description || t('contact.hero_description')}
                </p>
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
                        <form onSubmit={handleSubmit} className="space-y-8">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="relative group">
                              <label className="block text-xs font-bold uppercase tracking-widest text-[#414940] mb-2 group-focus-within:text-[#164220] transition-colors">{t('contact.full_name')}</label>
                              <input 
                                required
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full bg-transparent border-0 border-b-2 border-[#c1c9be] focus:border-[#164220] focus:ring-0 px-0 py-3 text-[#191c1b] placeholder-[#414940]/30 transition-all outline-none" 
                                placeholder="John Doe" 
                                type="text"
                              />
                            </div>
                            <div className="relative group">
                              <label className="block text-xs font-bold uppercase tracking-widest text-[#414940] mb-2 group-focus-within:text-[#164220] transition-colors">{t('contact.business_email')}</label>
                              <input 
                                required
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full bg-transparent border-0 border-b-2 border-[#c1c9be] focus:border-[#164220] focus:ring-0 px-0 py-3 text-[#191c1b] placeholder-[#414940]/30 transition-all outline-none" 
                                placeholder="john@company.com" 
                                type="email"
                              />
                            </div>
                          </div>
                          <div className="relative group">
                            <label className="block text-xs font-bold uppercase tracking-widest text-[#414940] mb-2 group-focus-within:text-[#164220] transition-colors">{t('contact.phone_number')}</label>
                            <input 
                              required
                              name="phone"
                              value={formData.phone}
                              onChange={handleChange}
                              className="w-full bg-transparent border-0 border-b-2 border-[#c1c9be] focus:border-[#164220] focus:ring-0 px-0 py-3 text-[#191c1b] placeholder-[#414940]/30 transition-all outline-none" 
                              placeholder="+62 ..." 
                              type="tel"
                            />
                          </div>
                          <div className="relative group">
                            <label className="block text-xs font-bold uppercase tracking-widest text-[#414940] mb-2 group-focus-within:text-[#164220] transition-colors">{t('contact.message')}</label>
                            <textarea 
                              required
                              name="message"
                              value={formData.message}
                              onChange={handleChange}
                              className="w-full bg-transparent border-0 border-b-2 border-[#c1c9be] focus:border-[#164220] focus:ring-0 px-0 py-3 text-[#191c1b] placeholder-[#414940]/30 transition-all outline-none resize-none" 
                              placeholder={t('contact.message_placeholder')} 
                              rows={4}
                            ></textarea>
                          </div>

                          {error && <p className="text-red-500 text-sm font-bold">{error}</p>}

                          <div className="flex flex-col md:flex-row items-center gap-8 pt-4">
                            <button 
                              disabled={loading}
                              className="signature-gradient text-white px-10 py-4 rounded-sm font-bold tracking-tight shadow-lg hover:shadow-[#164220]/20 transition-all w-full md:w-auto flex items-center justify-center gap-2" 
                              type="submit"
                            >
                                {loading ? t('contact.sending') : t('contact.send_button')}
                                {!loading && <span className="material-symbols-outlined">send</span>}
                            </button>
                            <div className="flex items-center gap-3 text-[#414940]">
                              <span className="material-symbols-outlined text-[#2e5a35]">verified</span>
                              <span className="text-xs font-medium">{t('contact.privacy_note')}</span>
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