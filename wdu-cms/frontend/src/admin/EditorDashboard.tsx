import { useNavigate } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import { useTheme } from '../context/ThemeContext';
import { useUser } from '../context/UserContext';

export default function EditorDashboard() {
  const { theme } = useTheme();
  const { user } = useUser();
  const navigate = useNavigate();

  const editorTasks = [
    {
      title: 'Manajemen Halaman',
      description: 'Perbarui konten teks dan informasi pada halaman Beranda, Tentang Kami, dll.',
      icon: 'description',
      path: '/admin/pages?edit=home',
      color: 'from-blue-600 to-indigo-700',
      shadow: 'shadow-blue-500/20'
    },
    {
      title: 'Layanan & Pengalaman',
      description: 'Kelola daftar layanan perusahaan dan portofolio proyek (Pengalaman).',
      icon: 'settings_suggest',
      path: '/admin/services',
      secondaryPath: '/admin/experience',
      secondaryLabel: 'Kelola Pengalaman',
      color: 'from-emerald-600 to-teal-700',
      shadow: 'shadow-emerald-500/20'
    },
    {
      title: 'Media & Galeri',
      description: 'Upload foto kegiatan terbaru ke galeri atau kelola aset media website.',
      icon: 'collections',
      path: '/admin/gallery',
      secondaryPath: '/admin/media',
      secondaryLabel: 'Media Library',
      color: 'from-purple-600 to-fuchsia-700',
      shadow: 'shadow-purple-500/20'
    },
    {
      title: 'Konfigurasi Situs',
      description: 'Kelola informasi kontak, sosial media, dan unggah file Company Profile perusahaan.',
      icon: 'settings_input_component',
      path: '/admin/config',
      color: 'from-rose-500 to-red-600',
      shadow: 'shadow-red-500/20'
    },
    {
      title: 'Inbox Pesan',
      description: 'Lihat dan baca pesan masuk dari pengunjung website melalui form kontak.',
      icon: 'mail',
      path: '/admin/contact',
      color: 'from-amber-500 to-orange-600',
      shadow: 'shadow-amber-500/20'
    }
  ];

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto space-y-12 pb-24 px-4">
        {/* --- LUXURY HEADER --- */}
        <header className="relative py-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="h-px w-8 bg-primary"></span>
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Intelligence Console</span>
              </div>
              <h1 className={`text-6xl md:text-8xl font-black tracking-tighter leading-[0.8] ${theme === 'dark' ? 'text-white' : 'text-emerald-950'}`}>
                WDU <span className="text-primary">CORE.</span>
              </h1>
              <p className={`text-lg font-medium max-w-lg leading-relaxed opacity-60 ${theme === 'dark' ? 'text-zinc-400' : 'text-emerald-900/60'}`}>
                Sistem kendali terpadu untuk manajemen ekosistem digital Wahana Data Utama.
              </p>
            </div>
            
            <div className={`p-8 rounded-[3rem] border backdrop-blur-2xl flex items-center gap-6 group transition-all hover:border-primary/30 ${
              theme === 'dark' ? 'bg-zinc-900/40 border-zinc-800' : 'bg-white border-emerald-100 shadow-2xl shadow-emerald-900/5'
            }`}>
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-primary border border-primary/20">
                  <span className="material-symbols-outlined text-3xl animate-spin-slow">settings_heart</span>
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full border-4 border-zinc-900 animate-pulse"></div>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Identity</p>
                <p className={`text-xl font-black tracking-tight ${theme === 'dark' ? 'text-white' : 'text-emerald-950'}`}>{user.name}</p>
              </div>
            </div>
          </div>
        </header>

        {/* --- BENTO GRID SYSTEM --- */}
        <div className="grid grid-cols-1 md:grid-cols-6 grid-rows-2 gap-6 min-h-[700px]">
          
          {/* Main Task: Pages (Large Bento) */}
          <div 
            onClick={() => navigate(editorTasks[0].path)}
            className={`md:col-span-4 md:row-span-1 group relative p-12 rounded-[4rem] border cursor-pointer overflow-hidden transition-all duration-700 hover:scale-[0.98] ${
              theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-emerald-50 shadow-xl'
            }`}
          >
            <div className={`absolute top-0 right-0 w-full h-full bg-gradient-to-br ${editorTasks[0].color} opacity-0 group-hover:opacity-5 transition-opacity duration-700`}></div>
            <div className="relative z-10 flex flex-col h-full">
              <div className={`w-20 h-20 rounded-[2.5rem] bg-gradient-to-br ${editorTasks[0].color} text-white flex items-center justify-center shadow-2xl mb-12`}>
                <span className="material-symbols-outlined text-4xl">{editorTasks[0].icon}</span>
              </div>
              <h3 className={`text-4xl font-black mb-4 tracking-tighter ${theme === 'dark' ? 'text-white' : 'text-emerald-950'}`}>{editorTasks[0].title}</h3>
              <p className={`text-lg font-medium max-w-md ${theme === 'dark' ? 'text-zinc-500' : 'text-emerald-900/50'}`}>{editorTasks[0].description}</p>
              
              <div className="mt-auto flex items-center gap-4">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Enter Workspace</span>
                <span className="material-symbols-outlined text-primary group-hover:translate-x-2 transition-transform">arrow_forward</span>
              </div>
            </div>
          </div>

          {/* Task: Services (Medium Bento) */}
          <div 
            onClick={() => navigate(editorTasks[1].path)}
            className={`md:col-span-2 md:row-span-2 group relative p-10 rounded-[4rem] border cursor-pointer overflow-hidden transition-all duration-700 hover:scale-[0.98] ${
              theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-emerald-950 border-emerald-900 text-white'
            }`}
          >
            <div className="relative z-10 flex flex-col h-full">
               <div className="w-16 h-16 rounded-3xl bg-white/10 backdrop-blur-md flex items-center justify-center mb-10 border border-white/10">
                 <span className="material-symbols-outlined text-3xl">{editorTasks[1].icon}</span>
               </div>
               <h3 className="text-3xl font-black mb-6 tracking-tighter">{editorTasks[1].title}</h3>
               <p className="text-sm font-medium opacity-60 leading-relaxed mb-8">{editorTasks[1].description}</p>
               
               <div className="mt-auto space-y-4">
                  <div className="p-6 rounded-3xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                     <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-2">Main Link</p>
                     <p className="font-bold">Layanan Bisnis</p>
                  </div>
                  <div 
                    onClick={(e) => { e.stopPropagation(); navigate(editorTasks[1].secondaryPath!); }}
                    className="p-6 rounded-3xl bg-primary/20 border border-primary/20 hover:bg-primary text-primary hover:text-emerald-950 transition-all"
                  >
                     <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-2">Secondary</p>
                     <p className="font-bold">{editorTasks[1].secondaryLabel}</p>
                  </div>
               </div>
            </div>
          </div>

          {/* Task: Media (Small Bento) */}
          <div 
            onClick={() => navigate(editorTasks[2].path)}
            className={`md:col-span-2 md:row-span-1 group relative p-10 rounded-[4rem] border cursor-pointer overflow-hidden transition-all duration-700 hover:scale-[0.98] ${
              theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-emerald-50 shadow-xl'
            }`}
          >
             <div className="relative z-10 flex flex-col h-full">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${editorTasks[2].color} text-white flex items-center justify-center mb-6`}>
                   <span className="material-symbols-outlined text-2xl">{editorTasks[2].icon}</span>
                </div>
                <h3 className={`text-2xl font-black mb-2 tracking-tighter ${theme === 'dark' ? 'text-white' : 'text-emerald-950'}`}>{editorTasks[2].title}</h3>
                <p className={`text-xs font-medium opacity-50 ${theme === 'dark' ? 'text-zinc-500' : 'text-emerald-900'}`}>Library & Assets</p>
             </div>
          </div>

          {/* Task: Inbox (Small Bento) */}
          <div 
            onClick={() => navigate(editorTasks[4].path)}
            className={`md:col-span-2 md:row-span-1 group relative p-10 rounded-[4rem] border cursor-pointer overflow-hidden transition-all duration-700 hover:scale-[0.98] ${
              theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-emerald-50 shadow-xl'
            }`}
          >
             <div className="relative z-10 flex flex-col h-full">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${editorTasks[4].color} text-white flex items-center justify-center mb-6`}>
                   <span className="material-symbols-outlined text-2xl">{editorTasks[4].icon}</span>
                </div>
                <h3 className={`text-2xl font-black mb-2 tracking-tighter ${theme === 'dark' ? 'text-white' : 'text-emerald-950'}`}>{editorTasks[4].title}</h3>
                <div className="mt-auto flex items-center gap-2">
                   <div className="w-2 h-2 bg-amber-500 rounded-full animate-ping"></div>
                   <span className="text-[10px] font-black uppercase tracking-widest text-amber-600">Pesan Masuk</span>
                </div>
             </div>
          </div>

        </div>

        {/* --- QUICK ACTION FOOTER --- */}
        <div className={`rounded-[4rem] p-12 border relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-10 ${
          theme === 'dark' ? 'bg-zinc-950 border-zinc-900' : 'bg-zinc-900 text-white border-zinc-800 shadow-2xl'
        }`}>
           <div className="flex items-center gap-8">
              <div className="w-20 h-20 rounded-[2.5rem] bg-white/5 border border-white/10 flex items-center justify-center">
                 <span className="material-symbols-outlined text-4xl text-primary">security</span>
              </div>
              <div>
                 <h4 className="text-2xl font-black tracking-tight">Butuh Konfigurasi Lanjutan?</h4>
                 <p className="text-sm font-medium opacity-50">Lakukan pengaturan global melalui menu Site Config atau hubungi admin.</p>
              </div>
           </div>
           <button 
             onClick={() => navigate(editorTasks[3].path)}
             className="px-10 py-5 bg-primary text-emerald-950 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] hover:bg-white transition-all active:scale-95 shadow-2xl shadow-primary/20"
           >
             Buka Site Config
           </button>
        </div>
      </div>
    </AdminLayout>
  );
}
