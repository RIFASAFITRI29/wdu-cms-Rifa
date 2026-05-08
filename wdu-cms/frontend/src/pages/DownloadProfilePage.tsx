import * as React from 'react';

import api from '../services/api';
import SEO from '../components/SEO';

export default function DownloadProfilePage() {

  const [companyProfileUrl, setCompanyProfileUrl] = React.useState<string>('');
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchConfig = async () => {
      try {
        const { data } = await api.get('/config');
        if (data && Array.isArray(data)) {
          const profileItem = data.find((item: any) => item.key === 'company_profile_url');
          if (profileItem) {
            setCompanyProfileUrl(profileItem.value);
          }
        }
      } catch (error) {
        console.error('Failed to fetch config:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchConfig();
  }, []);

  return (
    <div className="bg-[#f8faf8] text-[#191c1b] antialiased selection:bg-[#bdefbe] selection:text-[#164220] min-h-screen flex flex-col items-center justify-center py-20 px-6">
      <SEO 
        title="Unduh Profil Perusahaan" 
        description="Dapatkan dokumen profil resmi Wahana Data Utama. Pelajari kapabilitas dan rekam jejak kami." 
        slug="unduh-profil"
      />
      <div className="max-w-4xl w-full text-center">
        <div className="mb-12 flex flex-col items-center">
           <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-[2rem] flex items-center justify-center mb-10 animate-bounce">
              <span className="material-symbols-outlined text-5xl">description</span>
           </div>
           <span className="text-[10px] font-black uppercase tracking-[0.5em] text-emerald-600 mb-6 block">Company Credentials</span>
           <h1 className="text-5xl md:text-7xl font-black text-emerald-950 tracking-tighter mb-8 leading-tight">
              Profil Perusahaan<br/>Wahana Data Utama
           </h1>
           <p className="text-xl text-emerald-950/60 font-medium leading-relaxed max-w-2xl mx-auto mb-16">
              Pelajari lebih dalam mengenai kapabilitas, rekam jejak, dan metodologi kerja kami dalam mengolah data menjadi solusi cerdas melalui dokumen profil perusahaan resmi kami.
           </p>
        </div>

        <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
           {isLoading ? (
             <div className="text-emerald-950/40 font-black uppercase tracking-widest text-xs animate-pulse">Menghubungkan ke pusat data...</div>
           ) : companyProfileUrl ? (
             <>
               <a 
                 href={companyProfileUrl} 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="bg-emerald-950 text-white px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-800 transition-all shadow-2xl flex items-center gap-4 active:scale-95"
               >
                  UNDUH PROFIL (PDF)
                  <span className="material-symbols-outlined text-lg">download</span>
               </a>
               <a 
                 href={companyProfileUrl} 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="bg-white text-emerald-950 px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-zinc-50 transition-all border border-emerald-100 flex items-center gap-4 active:scale-95"
               >
                  LIHAT ONLINE
                  <span className="material-symbols-outlined text-lg">open_in_new</span>
               </a>
             </>
           ) : (
             <div className="bg-white p-12 rounded-[3rem] shadow-xl border border-zinc-100 max-w-lg">
                <span className="material-symbols-outlined text-4xl text-zinc-300 mb-6">cloud_off</span>
                <p className="text-zinc-500 font-medium mb-8">Maaf, dokumen profil perusahaan sedang dalam proses pembaruan oleh tim administrasi kami.</p>
                <a href="/kontak" className="text-emerald-600 font-black uppercase tracking-widest text-xs hover:underline italic">Minta via Email &rarr;</a>
             </div>
           )}
        </div>

        <div className="mt-32 pt-12 border-t border-zinc-200 grid grid-cols-2 md:grid-cols-4 gap-8 text-left opacity-60">
           <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-emerald-950 mb-2">Version</p>
              <p className="text-sm font-bold">2026.1 Enterprise</p>
           </div>
           <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-emerald-950 mb-2">Format</p>
              <p className="text-sm font-bold">Digital PDF</p>
           </div>
           <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-emerald-950 mb-2">Security</p>
              <p className="text-sm font-bold">Encrypted</p>
           </div>
           <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-emerald-950 mb-2">Language</p>
              <p className="text-sm font-bold">ID / EN</p>
           </div>
        </div>
      </div>
    </div>
  );
}
