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
      <div className="max-w-6xl mx-auto space-y-12 pb-20">
        <header className="reveal-up">
          <div className="flex items-center gap-4 mb-4">
             <div className="h-px w-12 bg-primary"></div>
             <p className={`text-[10px] font-black uppercase tracking-[0.5em] ${theme === 'dark' ? 'text-primary' : 'text-green-600'}`}>Editor Workspace</p>
          </div>
          <h1 className={`text-5xl font-black tracking-tighter mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Halo, {user.name.split(' ')[0]}! 👋
          </h1>
          <p className={`text-lg font-medium max-w-2xl leading-relaxed ${theme === 'dark' ? 'text-zinc-400' : 'text-gray-500'}`}>
            Selamat datang di ruang kerja Anda. Pilih salah satu tugas di bawah ini untuk mulai memperbarui konten website Wahana Data Utama.
          </p>
        </header>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           {editorTasks.map((task, i) => (
             <div 
               key={i}
               onClick={() => navigate(task.path)}
               className={`relative overflow-hidden p-10 rounded-[3rem] border transition-all duration-500 hover:-translate-y-2 group cursor-pointer ${
                 theme === 'dark' ? 'bg-zinc-900 border-zinc-800 hover:border-primary/30' : 'bg-white border-gray-100 shadow-2xl shadow-gray-200/50 hover:border-green-200'
               }`}
             >
               {/* Background Glow */}
               <div className={`absolute -right-12 -bottom-12 w-48 h-48 rounded-full blur-[80px] opacity-10 transition-opacity group-hover:opacity-20 bg-gradient-to-br ${task.color}`}></div>

               <div className="relative z-10 flex flex-col h-full">
                 <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 bg-gradient-to-br ${task.color} text-white shadow-xl ${task.shadow} group-hover:scale-110 transition-transform duration-500`}>
                   <span className="material-symbols-outlined text-3xl">{task.icon}</span>
                 </div>

                 <h3 className={`text-2xl font-black mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                   {task.title}
                 </h3>
                 
                 <p className={`text-sm leading-relaxed mb-10 flex-1 ${theme === 'dark' ? 'text-zinc-500' : 'text-gray-500'}`}>
                   {task.description}
                 </p>

                 <div className="flex flex-wrap gap-4 mt-auto">
                    <button 
                      className={`px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest text-white shadow-lg transition-all active:scale-95 bg-zinc-900 group-hover:bg-primary group-hover:text-zinc-950`}
                    >
                      Mulai Kerja
                    </button>
                    
                    {task.secondaryPath && (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(task.secondaryPath!);
                        }}
                        className={`px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all active:scale-95 border ${
                          theme === 'dark' ? 'border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-white' : 'border-gray-100 text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                      >
                        {task.secondaryLabel}
                      </button>
                    )}
                 </div>
               </div>
             </div>
           ))}
         </div>

        <footer className={`p-10 rounded-[3rem] border flex flex-col md:flex-row items-center justify-between gap-8 ${
          theme === 'dark' ? 'bg-zinc-950 border-zinc-900' : 'bg-gray-50 border-gray-100'
        }`}>
          <div className="flex items-center gap-6">
             <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                <span className="material-symbols-outlined">help_outline</span>
             </div>
             <div>
                <p className={`font-bold text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Butuh Bantuan?</p>
                <p className="text-xs text-zinc-500 mt-1">Hubungi Super Admin jika Anda mengalami kendala akses.</p>
             </div>
          </div>
          <button 
            onClick={() => window.location.href = 'mailto:admin@wdu.co.id'}
            className={`px-8 py-3 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all ${
              theme === 'dark' ? 'bg-zinc-900 text-zinc-400 hover:text-white' : 'bg-white text-gray-500 shadow-sm hover:text-green-600'
            }`}
          >
            Kirim Email Support
          </button>
        </footer>
      </div>
    </AdminLayout>
  );
}
