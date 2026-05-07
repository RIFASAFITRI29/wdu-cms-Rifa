import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export default function CollaborationDetailPage() {
  const { t } = useLanguage();

  return (
    <div className="bg-white">
      {/* ── HERO SECTION (CLEAN WHITE/GREEN) ── */}
      <section className="relative h-[400px] flex items-center overflow-hidden bg-emerald-950">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg" 
            className="w-full h-full object-cover opacity-30"
            alt="Project Detail"
          />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 w-full text-center">
          <Link to="/pengalaman" className="inline-flex items-center gap-2 text-white/60 hover:text-primary transition-colors mb-8">
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            <span className="text-xs font-bold uppercase tracking-widest">{t('project.back_to_experience')}</span>
          </Link>
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase">
            {t('project.hero_title')}
          </h1>
          <div className="w-20 h-1 bg-primary mx-auto mt-6"></div>
        </div>
      </section>

      {/* ── CONTENT SECTION ── */}
      <section className="py-24 px-6 md:px-12">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            {/* Left: Description */}
            <div className="lg:col-span-8">
              <h2 className="text-3xl font-black text-emerald-950 mb-8 tracking-tight">{t('project.info_title')}</h2>
              <div className="space-y-6 text-lg text-emerald-950/70 leading-relaxed font-medium">
                <p>
                  <span className="font-bold text-black">{t('common.company_name')}</span> {t('project.desc_1')}
                </p>
                <p>
                  {t('project.desc_2')}
                </p>
              </div>
            </div>

            {/* Right: Specs Card */}
            <div className="lg:col-span-4">
              <div className="bg-emerald-50 p-10 rounded-[30px] border border-emerald-100">
                <h3 className="text-xl font-black text-emerald-950 mb-6">{t('project.quick_info')}</h3>
                <div className="space-y-6">
                  <div>
                    <span className="text-xs font-black text-primary uppercase tracking-widest block mb-1">{t('project.category_label')}</span>
                    <span className="text-emerald-950 font-bold">{t('category.Research & Development')}</span>
                  </div>
                  <div>
                    <span className="text-xs font-black text-primary uppercase tracking-widest block mb-1">{t('project.year_label')}</span>
                    <span className="text-emerald-950 font-bold">2024</span>
                  </div>
                  <div>
                    <span className="text-xs font-black text-primary uppercase tracking-widest block mb-1">{t('project.status_label')}</span>
                    <span className="text-emerald-950 font-bold">{t('project.status_done')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── RELATED SECTION ── */}
      <section className="py-24 bg-zinc-50 border-t border-zinc-100 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-12">
             <div>
               <h2 className="text-3xl font-black text-emerald-950 tracking-tighter">{t('project.other_title')}</h2>
               <div className="w-12 h-1 bg-primary mt-4"></div>
             </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
             {[
               "https://wahanadata.co.id/wp-content/uploads/2025/01/bpk-150x150.png",
               "https://wahanadata.co.id/wp-content/uploads/2025/01/bpom-1-768x524.png",
               "https://wahanadata.co.id/wp-content/uploads/2025/01/bkpm-1-768x524.png",
               "https://wahanadata.co.id/wp-content/uploads/2025/01/Kominfo-e1737704377593.png",
               "https://wahanadata.co.id/wp-content/uploads/2025/01/paljaya-768x768.png",
               "https://wahanadata.co.id/wp-content/uploads/2025/01/paljaya-300x300.png",
               "https://wahanadata.co.id/wp-content/uploads/2025/01/kominfo-old-square-300x300.png",
               "https://wahanadata.co.id/wp-content/uploads/2025/01/bpk-square-300x300.png",
               "https://wahanadata.co.id/wp-content/uploads/2025/01/stm-yogya-square-300x300.png",
               "https://wahanadata.co.id/wp-content/uploads/2025/01/transpakuan-square-resized-300x300.png"
             ].map((logo, i) => (
               <div key={i} className="bg-white p-6 md:p-8 rounded-[24px] shadow-sm border border-emerald-50 flex items-center justify-center transition-all cursor-pointer hover:shadow-xl hover:-translate-y-2 active:-translate-y-4 active:shadow-2xl duration-300">
                  <img 
                    src={logo} 
                    className="max-h-20 w-auto opacity-60 hover:opacity-100 transition-opacity"
                    alt={`Partner ${i}`}
                  />
               </div>
             ))}
          </div>
        </div>
      </section>
    </div>
  );
}