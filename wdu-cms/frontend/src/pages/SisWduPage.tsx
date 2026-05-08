import SEO from '../components/SEO';

export default function SisWduPage() {
  return (
    <div className="bg-[#f8faf8] text-[#191c1b] antialiased selection:bg-[#bdefbe] selection:text-[#164220] min-h-screen">
      <SEO 
        title="SIS-WDU Intelligence" 
        description="Sistem Informasi Survei Wahana Data Utama. Platform analitik terpadu untuk pengumpulan data real-time." 
        slug="sis-wdu"
      />
      {/* ── HERO SECTION ── */}
      <section className="relative h-[80vh] min-h-[600px] flex items-center overflow-hidden bg-zinc-950">
        <style>{`
          .reveal-up { animation: revealUp 1s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
          @keyframes revealUp {
            from { opacity: 0; transform: translateY(40px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
        <div className="absolute inset-0 z-0">
          <img 
            alt="SIS-WDU System" 
            className="w-full h-full object-cover opacity-30 scale-110" 
            src="https://images.unsplash.com/photo-1551288049-bbbda546697a?auto=format&fit=crop&q=80" 
          />
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/60 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
          <div className="max-w-4xl reveal-up">

            <h1 className="text-6xl md:text-9xl font-black text-white tracking-tighter mb-10 leading-[0.85]">
               SIS-WDU<br/>
               <span className="text-primary">INTELLIGENCE.</span>
            </h1>
            <p className="text-xl md:text-2xl text-zinc-400 font-medium leading-relaxed max-w-2xl mb-12">
               Sistem Informasi Survei Wahana Data Utama. Platform analitik terpadu untuk pengumpulan, pengolahan, dan visualisasi data survei secara real-time.
            </p>
            <div className="flex gap-6">
               <a 
                 href="https://sis.wahanadata.co.id/login" 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="bg-primary text-emerald-950 px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white transition-all shadow-2xl flex items-center gap-4 active:scale-95"
               >
                  LAUNCH SYSTEM
                  <span className="material-symbols-outlined text-lg">rocket_launch</span>
               </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES SECTION ── */}
      <section className="py-32 relative overflow-hidden">
         <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
               <div className="bg-white p-12 rounded-[3rem] shadow-xl border border-zinc-50 group hover:-translate-y-4 transition-all duration-700">
                  <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-10 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-500">
                     <span className="material-symbols-outlined text-4xl">analytics</span>
                  </div>
                  <h3 className="text-2xl font-black text-emerald-950 mb-4 uppercase tracking-tighter">Real-Time Analytics</h3>
                  <p className="text-emerald-950/60 font-medium leading-relaxed">Dashboard interaktif yang menyajikan data langsung dari lapangan dengan validasi otomatis.</p>
               </div>
               <div className="bg-white p-12 rounded-[3rem] shadow-xl border border-zinc-50 group hover:-translate-y-4 transition-all duration-700">
                  <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-10 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-500">
                     <span className="material-symbols-outlined text-4xl">map</span>
                  </div>
                  <h3 className="text-2xl font-black text-emerald-950 mb-4 uppercase tracking-tighter">Geospatial Mapping</h3>
                  <p className="text-emerald-950/60 font-medium leading-relaxed">Integrasi GIS untuk memetakan sebaran responden dan hasil survei secara spasial dan presisi.</p>
               </div>
               <div className="bg-white p-12 rounded-[3rem] shadow-xl border border-zinc-50 group hover:-translate-y-4 transition-all duration-700">
                  <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-10 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-500">
                     <span className="material-symbols-outlined text-4xl">shield</span>
                  </div>
                  <h3 className="text-2xl font-black text-emerald-950 mb-4 uppercase tracking-tighter">Secure Protocol</h3>
                  <p className="text-emerald-950/60 font-medium leading-relaxed">Keamanan data tingkat tinggi dengan enkripsi end-to-end dan manajemen akses berbasis peran.</p>
               </div>
            </div>
         </div>
      </section>

      {/* ── CTA SECTION ── */}
      <section className="py-32 bg-white px-6">
         <div className="max-w-5xl mx-auto bg-emerald-50 rounded-[4rem] p-12 md:p-24 text-center border border-emerald-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-100/50 rounded-full blur-3xl -mr-32 -mt-32"></div>
            <h2 className="text-4xl md:text-6xl font-black text-emerald-950 tracking-tighter mb-8 leading-none relative z-10">
               Siap Mengoptimalkan<br/>Data Anda?
            </h2>
            <p className="text-xl text-emerald-900/60 font-medium max-w-2xl mx-auto mb-12 relative z-10">
               Hubungi kami untuk mendapatkan demonstrasi lengkap dan konsultasi integrasi sistem SIS-WDU ke dalam operasional bisnis Anda.
            </p>
            <div className="flex flex-col md:flex-row gap-4 justify-center relative z-10">
               <a href="/kontak" className="bg-emerald-950 text-white px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-800 transition-all active:scale-95">HUBUNGI KAMI</a>
               <a href="https://sis.wahanadata.co.id/login" target="_blank" rel="noopener noreferrer" className="bg-white text-emerald-950 px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-zinc-50 transition-all border border-emerald-100 active:scale-95">PORTAL LOGIN</a>
            </div>
         </div>
      </section>
    </div>
  );
}
