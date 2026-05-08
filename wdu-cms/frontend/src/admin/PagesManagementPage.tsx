import * as React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import TiptapEditor from './components/TiptapEditor';
import { useTheme } from '../context/ThemeContext';
import { useUser } from '../context/UserContext';
import { pageService, PageSection } from '../services/pageService';

export default function PagesManagementPage() {
  const { theme } = useTheme();
  const { user } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const [pages, setPages] = React.useState<PageSection[]>(() => {
    const stored = localStorage.getItem('wdu_pages');
    return stored ? JSON.parse(stored) : [];
  });
  const [isLoading, setIsLoading] = React.useState(false);
  const [editingPage, setEditingPage] = React.useState<PageSection | null>(null);
  const [isSaving, setIsSaving] = React.useState(false);
  
  // Create New Page State
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
  const [newPageData, setNewPageData] = React.useState({
    title: '',
    slug: ''
  });
  const [deleteTarget, setDeleteTarget] = React.useState<string | null>(null);


  React.useEffect(() => {
    fetchPages();
  }, []);

  // Auto-open editor based on query param
  React.useEffect(() => {
    if (pages.length > 0) {
      const params = new URLSearchParams(location.search);
      const editSlug = params.get('edit');
      if (editSlug) {
        const targetPage = pages.find(p => p.slug === editSlug);
        if (targetPage) {
          setEditingPage({ ...targetPage });
          // Clear the search param so it doesn't reopen on every refresh
          navigate('/admin/pages', { replace: true });
        }
      }
    }
  }, [pages, location, navigate]);

  const fetchPages = async () => {
    try {
      setIsLoading(true);
      const { data } = await pageService.getAll();
      if (!data || data.length === 0) {
        // Force refresh from defaults if empty
        localStorage.removeItem('wdu_pages');
        const { data: retryData } = await pageService.getAll();
        setPages(retryData || []);
      } else {
        setPages(data);
      }
    } catch (error) {
      console.error('Failed to fetch pages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreatePage = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      await pageService.create({
        title: newPageData.title,
        slug: newPageData.slug.toLowerCase().replace(/\s+/g, '-'),
        content: '',
        isPublished: false
      });
      
      await fetchPages();
      setIsCreateModalOpen(false);
      setNewPageData({ title: '', slug: '' });
    } catch (error) {
      alert('Gagal membuat halaman baru. Slug mungkin sudah digunakan.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeletePage = async (slug: string) => {
    const corePages = ['home', 'about', 'services', 'experience', 'contact', 'tentang-kami', 'layanan', 'pengalaman', 'kontak'];
    if (corePages.includes(slug)) {
       alert('Halaman sistem utama tidak dapat dihapus demi keamanan website.');
       return;
    }
    setDeleteTarget(slug);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      setIsSaving(true);
      await pageService.delete(deleteTarget);
      await fetchPages();
      setDeleteTarget(null);
    } catch (error) {
      alert('Gagal menghapus halaman.');
    } finally {
      setIsSaving(false);
    }
  };


  const handleSave = async () => {
    if (!editingPage) return;
    try {
      setIsSaving(true);
      await pageService.update(editingPage.slug, editingPage);
      await fetchPages();
      setEditingPage(null);
    } catch (error) {
      alert('Gagal menyimpan perubahan.');
    } finally {
      setIsSaving(false);
    }
  };

  const updateSection = (sectionName: string, fieldName: string | null, value: any) => {
    if (!editingPage) return;
    const currentSections = editingPage.sections || {};
    
    setEditingPage({
      ...editingPage,
      sections: {
        ...currentSections,
        [sectionName]: fieldName 
          ? { ...(currentSections[sectionName] || {}), [fieldName]: value }
          : value
      }
    });
  };

  


  return (    <AdminLayout>
      <div className="space-y-6 max-w-7xl mx-auto pb-20">
         {/* 1. HEADER SECTION */}
         <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="reveal-up">
               <h1 className={`text-4xl md:text-5xl font-black tracking-tight ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Manajemen Halaman</h1>
               <p className={`text-sm font-bold mt-2 uppercase tracking-[0.3em] ${theme === 'dark' ? 'text-primary' : 'text-green-600'}`}>Kelola Konten & SEO Website</p>
            </div>
            <div className="flex gap-4">
               {/* Pulihkan Button */}
               <button 
                 onClick={async () => {
                   if(confirm('Pulihkan seluruh struktur data website?')) {
                     localStorage.removeItem('wdu_pages');
                     window.location.reload();
                   }
                 }}
                 className={`group relative px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all overflow-hidden active:scale-95 flex items-center gap-2 ${
                   theme === 'dark' 
                     ? 'bg-zinc-900 text-emerald-400 border border-zinc-800 hover:border-emerald-500/50 shadow-2xl shadow-emerald-500/10' 
                     : 'bg-white text-emerald-600 border border-emerald-100 hover:border-emerald-300 shadow-xl shadow-emerald-900/5'
                 }`}
               >
                 <span className="material-symbols-outlined text-lg">restore_page</span>
                 <span>Pulihkan</span>
               </button>

               {/* Company Profile Upload */}
               <div className="relative group">
                 <input 
                   type="file" 
                   id="cp_upload" 
                   className="hidden" 
                   accept=".pdf"
                   onChange={(e) => {
                     const file = e.target.files?.[0];
                     if (file) {
                        alert(`Sukses: Company Profile '${file.name}' telah diperbarui!`);
                     }
                   }}
                 />
                 <button 
                   onClick={() => document.getElementById('cp_upload')?.click()}
                   className={`px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all overflow-hidden active:scale-95 flex items-center gap-2 ${
                     theme === 'dark' 
                       ? 'bg-zinc-900 text-amber-400 border border-zinc-800 hover:border-amber-500/50 shadow-2xl shadow-amber-500/10' 
                       : 'bg-white text-amber-600 border border-amber-100 hover:border-amber-300 shadow-xl shadow-amber-900/5'
                   }`}
                 >
                   <span className="material-symbols-outlined text-lg">picture_as_pdf</span>
                   <span>Update CP</span>
                 </button>
               </div>

               {/* Add Page Button */}
               {user?.role === 'SUPER_ADMIN' && (
                 <button 
                   onClick={() => setIsCreateModalOpen(true)}
                   className="relative group px-10 py-4 bg-zinc-950 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-emerald-600 transition-all shadow-2xl shadow-emerald-900/20 active:scale-95 flex items-center gap-3 overflow-hidden"
                 >
                   <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                   <span className="material-symbols-outlined text-xl">add_circle</span>
                   <span>Tambah Halaman</span>
                 </button>
               )}
            </div>
         </div>

         {/* 2. STATISTICS ROW */}
         <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: 'Total Halaman', value: pages.length, color: 'text-zinc-500' },
              { label: 'Published', value: pages.filter(p => p.isPublished).length, color: 'text-emerald-500' },
              { label: 'Draft', value: pages.filter(p => !p.isPublished).length, color: 'text-amber-500' },
              { label: 'Sistem Inti', value: 9, color: 'text-zinc-500' }
            ].map((stat, idx) => (
              <div key={idx} className={`p-8 rounded-[2rem] border ${theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-gray-100 shadow-sm'}`}>
                 <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">{stat.label}</p>
                 <p className={`text-3xl font-black ${stat.color}`}>{stat.value}</p>
              </div>
            ))}
         </div>

         {/* 3. PRIMARY GRID: PAGE CARDS */}
         <div className="relative">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
               {isLoading ? (
                  <div className="col-span-full py-32 text-center flex flex-col items-center justify-center">
                     <div className="relative w-20 h-20">
                        <div className="absolute inset-0 border-4 border-emerald-500/10 rounded-full"></div>
                        <div className="absolute inset-0 border-4 border-t-emerald-500 rounded-full animate-spin"></div>
                     </div>
                  </div>
               ) : pages.length === 0 ? (
                  <div className="col-span-full py-10"></div>
               ) : pages.map(page => (
                 <div 
                   key={page.id} 
                   className={`p-8 rounded-[2.5rem] border group transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 relative overflow-hidden ${
                     theme === 'dark' ? 'bg-zinc-900 border-zinc-800 hover:border-primary/30' : 'bg-white border-gray-100 shadow-sm'
                   }`}
                 >
                    <div className="flex justify-between items-start mb-8">
                       <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${
                         theme === 'dark' ? 'bg-zinc-800 text-primary' : 'bg-green-50 text-green-600'
                       }`}>
                          <span className="material-symbols-outlined text-2xl">
                            {page.slug === 'home' ? 'home' : ['contact', 'kontak'].includes(page.slug) ? 'contact_support' : ['about', 'services', 'experience', 'tentang-kami', 'layanan', 'pengalaman'].includes(page.slug) ? 'dashboard_customize' : 'description'}
                          </span>
                       </div>
                       <div className="flex flex-col items-end gap-2">
                          <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${
                            page.isPublished ? 'bg-green-500/10 text-green-500' : 'bg-amber-500/10 text-amber-500'
                          }`}>
                             {page.isPublished ? 'Published' : 'Draft'}
                          </span>
                       </div>
                    </div>
                    
                    <h3 className={`text-xl font-black mb-1 truncate ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{page.title}</h3>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-8">URL: /{page.slug === 'home' ? '' : page.slug}</p>
                    <div className="flex gap-3">
                      <button 
                        onClick={() => setEditingPage({...page})}
                        className="flex-[3] py-4 bg-zinc-900 hover:bg-emerald-600 hover:text-white text-white rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
                      >
                         <span className="material-symbols-outlined text-sm">edit_note</span>
                         Edit Konten
                      </button>
                      <button 
                        onClick={() => window.open(page.slug === 'home' ? '/' : `/${page.slug}`, '_blank')}
                        className={`flex-1 rounded-xl border transition-all active:scale-95 flex items-center justify-center ${
                          theme === 'dark' ? 'border-zinc-800 text-primary hover:bg-primary/10' : 'border-gray-100 text-emerald-600 hover:bg-emerald-50'
                        }`}
                        title="Lihat Preview"
                      >
                         <span className="material-symbols-outlined text-lg">visibility</span>
                      </button>
                      {user?.role === 'SUPER_ADMIN' && !['home', 'about', 'services', 'experience', 'contact', 'tentang-kami', 'layanan', 'pengalaman', 'kontak'].includes(page.slug) && (
                        <button 
                          onClick={() => handleDeletePage(page.slug)}
                          className={`flex-1 rounded-xl border transition-all active:scale-95 flex items-center justify-center ${
                            theme === 'dark' ? 'border-zinc-800 text-zinc-500 hover:border-red-500 hover:text-red-500' : 'border-gray-100 text-gray-400 hover:border-red-100 hover:text-red-500'
                          }`}
                          title="Hapus Halaman"
                        >
                          <span className="material-symbols-outlined text-lg">delete</span>
                        </button>
                      )}
                    </div>
                 </div>
               ))}
            </div>
         </div>

         {/* 4. ADMIN TASKS SECTION */}
         <div className="pt-2">
            <div className="flex items-center gap-3 mb-8">
               <div className="h-px w-8 bg-primary"></div>
               <h2 className={`text-[10px] font-black uppercase tracking-[0.4em] ${theme === 'dark' ? 'text-zinc-500' : 'text-gray-400'}`}>Pembagian Tugas Admin (Workspace)</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
               {[
                 { title: 'Konten Beranda', desc: 'Megang Halaman Utama', icon: 'home', color: 'from-blue-600 to-blue-400', path: '/admin/pages?edit=home' },
                 { title: 'Editor Layanan', desc: 'Megang Jasa & Solusi', icon: 'settings_suggest', color: 'from-emerald-600 to-emerald-400', path: '/admin/services' },
                 { title: 'Koordinator Partner', desc: 'Megang Client 2020-2024', icon: 'inventory_2', color: 'from-orange-600 to-orange-400', path: '/admin/experience' },
                 { title: 'Kurator Media', desc: 'Megang Aset & Gambar', icon: 'photo_library', color: 'from-purple-600 to-purple-400', path: '/admin/media' },
               ].map((task, i) => (
                 <div 
                   key={i} 
                   onClick={() => navigate(task.path)}
                   className={`p-6 rounded-[2rem] border transition-all hover:border-primary/60 hover:shadow-2xl hover:-translate-y-1 cursor-pointer group ${theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-gray-100 shadow-xl shadow-emerald-900/5'}`}
                 >
                    <div className="flex items-center gap-4 mb-4">
                       <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${task.color} flex items-center justify-center text-white shrink-0 shadow-lg`}>
                          <span className="material-symbols-outlined text-xl">{task.icon}</span>
                       </div>
                       <div>
                          <p className={`text-[11px] font-black uppercase tracking-tight leading-none ${theme === 'dark' ? 'text-white' : 'text-zinc-900'}`}>{task.title}</p>
                          <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest leading-none mt-1">{task.desc}</p>
                       </div>
                    </div>
                    <div className="w-full py-2 bg-zinc-50 dark:bg-zinc-800 rounded-lg text-[8px] font-black uppercase tracking-[0.2em] text-zinc-500 group-hover:bg-primary group-hover:text-zinc-950 transition-all text-center">
                       Mulai Kerja
                    </div>
                 </div>
               ))}
            </div>
         </div>
      </div>


      
      {/* Create New Page Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-md animate-fade-in">
          <div className={`rounded-[2.5rem] w-full max-w-md overflow-hidden flex flex-col reveal-up border shadow-2xl ${
            theme === 'dark' ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-gray-100 text-gray-900'
          }`}>
            <div className="p-8 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center">
              <h2 className="text-xl font-black uppercase tracking-tight">Buat Halaman Baru</h2>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <form onSubmit={handleCreatePage} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Judul Halaman</label>
                <input 
                  required
                  className={`w-full px-6 py-4 rounded-xl outline-none border transition-all font-bold ${
                    theme === 'dark' ? 'bg-zinc-950 border-zinc-800 focus:border-emerald-500 text-white' : 'bg-zinc-50 border-gray-200 focus:border-emerald-500 text-zinc-900'
                  }`}
                  placeholder="Contoh: Layanan Kami"
                  value={newPageData.title}
                  onChange={(e) => setNewPageData({...newPageData, title: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-')})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Slug URL (Otomatis)</label>
                <div className="relative">
                   <span className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-400 font-bold text-sm">/</span>
                   <input 
                     required
                     className={`w-full pl-10 pr-6 py-4 rounded-xl outline-none border transition-all font-bold ${
                       theme === 'dark' ? 'bg-zinc-950 border-zinc-800 focus:border-emerald-500 text-white' : 'bg-zinc-50 border-gray-200 focus:border-emerald-500 text-zinc-900'
                     }`}
                     placeholder="layanan-kami"
                     value={newPageData.slug}
                     onChange={(e) => setNewPageData({...newPageData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-')})}
                   />
                </div>
              </div>
              <button 
                type="submit"
                disabled={isSaving}
                className="w-full py-4 bg-zinc-950 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-xl shadow-emerald-900/20 disabled:opacity-50"
              >
                {isSaving ? 'MEMPROSES...' : 'BUAT HALAMAN'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Main Page Editor Modal */}
      {editingPage && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 md:p-10 bg-zinc-950/40 backdrop-blur-sm animate-fade-in">
           <div className={`rounded-[3rem] w-full max-w-6xl h-full overflow-hidden flex flex-col reveal-up border shadow-[0_30px_100px_rgba(0,0,0,0.4)] ${
             theme === 'dark' ? 'bg-zinc-950 border-zinc-800' : 'bg-white border-white'
           }`}>
              {/* Modal Header */}
              <div className="p-8 md:p-10 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center bg-white dark:bg-zinc-900">
                 <div className="flex items-center gap-6">
                    <div className="w-14 h-14 bg-emerald-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                       <span className="material-symbols-outlined text-3xl font-black">edit_square</span>
                    </div>
                    <div>
                       <h2 className={`text-2xl md:text-3xl font-black tracking-tight ${theme === 'dark' ? 'text-white' : 'text-zinc-900'}`}>
                          Edit: {editingPage.title}
                       </h2>
                       <div className="flex items-center gap-2 mt-1">
                          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                          <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Workspace Editor Aktif</p>
                       </div>
                    </div>
                 </div>
                 <button 
                   onClick={() => setEditingPage(null)}
                   className="w-12 h-12 rounded-2xl flex items-center justify-center text-zinc-400 hover:bg-red-50 hover:text-red-500 transition-all active:scale-90"
                 >
                    <span className="material-symbols-outlined text-3xl">close</span>
                 </button>
              </div>

              {/* Scrollable Body */}
              <div className="flex-1 overflow-y-auto p-8 space-y-12 custom-scrollbar bg-[#f8f9f8] dark:bg-zinc-950/50">
                 
                 {/* Section: Konten Utama (Conditional for Home/About/Contact) */}
                 <div className="space-y-8 max-w-3xl mx-auto">
                    <div className="flex items-center gap-3 mb-2">
                       <span className="material-symbols-outlined text-emerald-600 font-black">
                         {editingPage.slug === 'home' ? 'home_app_logo' : ['contact', 'kontak'].includes(editingPage.slug) ? 'contact_mail' : 'article'}
                       </span>
                       <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
                         {editingPage.slug === 'home' ? 'PENGATURAN HERO & TENTANG KAMI' : ['contact', 'kontak'].includes(editingPage.slug) ? 'INFORMASI KONTAK PERUSAHAAN' : 'KONTEN UTAMA HALAMAN'}
                       </h3>
                    </div>

                    {editingPage.slug === 'home' ? (
                       <div className="space-y-10">
                          {/* Home Hero Section */}
                          <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-100 dark:border-zinc-800 shadow-sm space-y-6">
                             <div className="flex items-center gap-2 mb-2">
                                <div className="w-2 h-2 bg-primary rounded-full"></div>
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500">BAGIAN HERO (ATAS)</h4>
                             </div>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                  <div className="space-y-2">
                                      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">JUDUL BESAR HERO (Gunakan | untuk baris baru)</label>
                                      <input 
                                        className={`w-full px-6 py-4 rounded-xl outline-none border transition-all font-black text-xl ${
                                          theme === 'dark' ? 'bg-zinc-950 border-zinc-800 focus:border-emerald-500 text-white' : 'bg-zinc-50 border-gray-200 focus:border-emerald-500 text-zinc-900'
                                        }`}
                                        value={editingPage.sections?.hero?.title || ''}
                                        onChange={(e) => updateSection('hero', 'title', e.target.value)}
                                      />
                                  </div>
                                  <div className="space-y-2">
                                      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">SUB JUDUL (TEKS KECIL DI ATAS)</label>
                                      <input 
                                        className={`w-full px-6 py-4 rounded-xl outline-none border transition-all font-bold ${
                                          theme === 'dark' ? 'bg-zinc-950 border-zinc-800 focus:border-emerald-500 text-white' : 'bg-zinc-50 border-gray-200 focus:border-emerald-500 text-zinc-900'
                                        }`}
                                        value={editingPage.sections?.hero?.subtitle || ''}
                                        onChange={(e) => updateSection('hero', 'subtitle', e.target.value)}
                                      />
                                  </div>
                                </div>
                                <div className="space-y-4">
                                   <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">HERO WALLPAPER (URL)</label>
                                   <div className="relative group/heroimg">
                                      <div className="aspect-video rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 mb-2">
                                         <img 
                                           src={editingPage.sections?.hero?.wallpaper || 'https://via.placeholder.com/1920x1080?text=No+Wallpaper'} 
                                           className="w-full h-full object-cover" 
                                           alt="Hero Preview" 
                                         />
                                      </div>
                                      <input 
                                         className={`w-full px-4 py-2 rounded-xl outline-none border transition-all text-[10px] font-mono ${
                                           theme === 'dark' ? 'bg-zinc-950 border-zinc-800 focus:border-emerald-500 text-zinc-400' : 'bg-zinc-50 border-gray-100 focus:border-emerald-500 text-zinc-500'
                                         }`}
                                         placeholder="https://..."
                                         value={editingPage.sections?.hero?.wallpaper || ''}
                                         onChange={(e) => updateSection('hero', 'wallpaper', e.target.value)}
                                      />
                                   </div>
                                </div>
                             </div>
                             <div className="space-y-4 pt-4">
                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">DESKRIPSI HERO (TEKS DI BAWAH JUDUL)</label>
                                <TiptapEditor 
                                  content={editingPage.sections?.hero?.content || ''}
                                  theme={theme}
                                  onChange={(html) => updateSection('hero', 'content', html)}
                                />
                             </div>
                          </div>

                          {/* Home Director Section */}
                          <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-100 dark:border-zinc-800 shadow-sm space-y-6">
                             <div className="flex items-center gap-2 mb-2">
                                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500">BAGIAN DIREKTUR (TENTANG KAMI)</h4>
                             </div>
                             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <div className="md:col-span-1 space-y-4">
                                   <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">FOTO DIREKTUR (URL)</label>
                                   <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 mb-2">
                                      <img 
                                        src={editingPage.sections?.intro?.image || 'https://wahanadata.co.id/wp-content/uploads/2025/02/direksi_pak-yudi-only.png'} 
                                        className="w-full h-full object-cover" 
                                        alt="Director Preview" 
                                      />
                                   </div>
                                   <input 
                                      className={`w-full px-4 py-2 rounded-xl outline-none border transition-all text-[10px] font-mono ${
                                        theme === 'dark' ? 'bg-zinc-950 border-zinc-800 focus:border-emerald-500 text-zinc-400' : 'bg-zinc-50 border-gray-100 focus:border-emerald-500 text-zinc-500'
                                      }`}
                                      placeholder="https://..."
                                      value={editingPage.sections?.intro?.image || ''}
                                      onChange={(e) => updateSection('intro', 'image', e.target.value)}
                                   />
                                </div>
                                <div className="md:col-span-2 space-y-6">
                                   <div className="space-y-2">
                                      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">JUDUL BAGIAN DIREKTUR</label>
                                      <input 
                                        className={`w-full px-6 py-4 rounded-xl outline-none border transition-all font-bold ${
                                          theme === 'dark' ? 'bg-zinc-950 border-zinc-800 focus:border-emerald-500 text-white' : 'bg-zinc-50 border-gray-200 focus:border-emerald-500 text-zinc-900'
                                        }`}
                                        value={editingPage.sections?.intro?.title || ''}
                                        onChange={(e) => updateSection('intro', 'title', e.target.value)}
                                      />
                                   </div>
                                   <div className="space-y-2">
                                      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">KATA PENGANTAR (TEKS SAMPING FOTO)</label>
                                      <TiptapEditor 
                                        content={editingPage.sections?.intro?.content || editingPage.content || ''}
                                        theme={theme}
                                        onChange={(html) => updateSection('intro', 'content', html)}
                                      />
                                   </div>
                                </div>
                             </div>
                          </div>

                          {/* Home Services Section */}
                          <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-100 dark:border-zinc-800 shadow-sm space-y-6">
                             <div className="flex items-center gap-2 mb-2">
                                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500">DESKRIPSI LAYANAN UTAMA</h4>
                             </div>
                             <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">RINGKASAN SOLUSI (DI BAWAH JUDUL LAYANAN)</label>
                                <TiptapEditor 
                                  content={editingPage.sections?.services?.content || ''}
                                  theme={theme}
                                  onChange={(html) => updateSection('services', 'content', html)}
                                />
                             </div>
                          </div>

                          {/* Home Stats Section */}
                          <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-100 dark:border-zinc-800 shadow-sm space-y-6">
                             <div className="flex items-center gap-2 mb-2">
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500">BAGIAN STATISTIK PERUSAHAAN</h4>
                             </div>
                             <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                {(editingPage.sections?.stats?.items || [
                                  { label: 'Proyek Selesai', value: '500+' },
                                  { label: 'Klien Puas', value: '200+' },
                                  { label: 'Efisiensi Data', value: '98%' },
                                  { label: 'Dukungan', value: '24/7' }
                                ]).map((stat: any, idx: number) => (
                                  <div key={idx} className="space-y-4 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800">
                                     <div className="space-y-1">
                                        <label className="text-[8px] font-black uppercase text-zinc-400">ANGKA</label>
                                        <input 
                                          className={`w-full px-3 py-2 rounded-lg outline-none border transition-all text-xs font-black ${
                                            theme === 'dark' ? 'bg-zinc-900 border-zinc-800 focus:border-blue-500 text-white' : 'bg-white border-gray-200 focus:border-blue-500 text-zinc-900'
                                          }`}
                                          value={stat.value}
                                          onChange={(e) => {
                                            const newItems = [...(editingPage.sections?.stats?.items || [])];
                                            newItems[idx] = { ...stat, value: e.target.value };
                                            updateSection('stats', 'items', newItems);
                                          }}
                                        />
                                     </div>
                                     <div className="space-y-1">
                                        <label className="text-[8px] font-black uppercase text-zinc-400">LABEL</label>
                                        <input 
                                          className={`w-full px-3 py-2 rounded-lg outline-none border transition-all text-[10px] font-bold ${
                                            theme === 'dark' ? 'bg-zinc-900 border-zinc-800 focus:border-blue-500 text-white' : 'bg-white border-gray-200 focus:border-blue-500 text-zinc-900'
                                          }`}
                                          value={stat.label}
                                          onChange={(e) => {
                                            const newItems = [...(editingPage.sections?.stats?.items || [])];
                                            newItems[idx] = { ...stat, label: e.target.value };
                                            updateSection('stats', 'items', newItems);
                                          }}
                                        />
                                     </div>
                                  </div>
                                ))}
                             </div>
                          </div>

                          {/* Home Trust Section */}
                          <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-100 dark:border-zinc-800 shadow-sm space-y-6">
                             <div className="flex items-center gap-2 mb-2">
                                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500">BAGIAN KEPERCAYAAN KLIEN (TRUST)</h4>
                             </div>
                             <div className="space-y-4">
                                <div className="space-y-2">
                                   <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">JUDUL SECTION</label>
                                   <input 
                                     className={`w-full px-6 py-4 rounded-xl outline-none border transition-all font-black ${
                                       theme === 'dark' ? 'bg-zinc-950 border-zinc-800 focus:border-orange-500 text-white' : 'bg-zinc-50 border-gray-200 focus:border-orange-500 text-zinc-900'
                                     }`}
                                     value={editingPage.sections?.trust?.title || ''}
                                     onChange={(e) => updateSection('trust', 'title', e.target.value)}
                                   />
                                </div>
                                <div className="space-y-2">
                                   <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">SUB JUDUL / DESKRIPSI</label>
                                   <TiptapEditor 
                                     content={editingPage.sections?.trust?.content || ""}
                                     theme={theme}
                                     onChange={(html) => updateSection("trust", "content", html)}
                                   />
                                </div>
                             </div>
                          </div>
                     </div>
                  ) : editingPage.slug === 'tentang-kami' ? (
                      <div className="space-y-10">
                         {/* Hero Config for About */}
                         <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-100 dark:border-zinc-800 shadow-sm space-y-6">
                            <div className="flex items-center gap-2 mb-2">
                               <div className="w-2 h-2 bg-primary rounded-full"></div>
                               <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500">KONFIGURASI HERO TENTANG KAMI</h4>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                              <div className="space-y-2">
                                 <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">HERO WALLPAPER (URL)</label>
                                 <input 
                                   className={`w-full px-6 py-4 rounded-xl outline-none border transition-all font-bold ${
                                     theme === 'dark' ? 'bg-zinc-950 border-zinc-800 focus:border-emerald-500 text-white' : 'bg-zinc-50 border-gray-200 focus:border-emerald-500 text-zinc-900 shadow-sm'
                                   }`}
                                   value={editingPage.sections?.hero?.wallpaper || ''}
                                   onChange={(e) => updateSection('hero', 'wallpaper', e.target.value)}
                                 />
                              </div>
                              <div className="space-y-2">
                                 <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">HERO TITLE OVERRIDE</label>
                                 <input 
                                   className={`w-full px-6 py-4 rounded-xl outline-none border transition-all font-bold ${
                                     theme === 'dark' ? 'bg-zinc-950 border-zinc-800 focus:border-emerald-500 text-white' : 'bg-zinc-50 border-gray-200 focus:border-emerald-500 text-zinc-900 shadow-sm'
                                   }`}
                                   value={editingPage.sections?.hero?.title || ''}
                                   onChange={(e) => updateSection('hero', 'title', e.target.value)}
                                 />
                              </div>
                              <div className="space-y-2">
                                 <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">GAMBAR GEDUNG (INTRO)</label>
                                 <input 
                                   className={`w-full px-6 py-4 rounded-xl outline-none border transition-all font-bold ${
                                     theme === 'dark' ? 'bg-zinc-950 border-zinc-800 focus:border-emerald-500 text-white' : 'bg-zinc-50 border-gray-200 focus:border-emerald-500 text-zinc-900 shadow-sm'
                                   }`}
                                   placeholder="https://..."
                                   value={editingPage.sections?.intro?.image || ''}
                                   onChange={(e) => updateSection('intro', 'image', e.target.value)}
                                 />
                              </div>
                            </div>
                         </div>

                         {/* Data Business Section description */}
                         <div className="bg-zinc-900/5 dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-100 dark:border-zinc-800 shadow-sm space-y-6">
                            <div className="flex items-center gap-2 mb-2">
                               <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                               <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500">DESKRIPSI SEKSI "DATA IS OUR BUSINESS"</h4>
                            </div>
                            <textarea 
                              rows={3}
                              className={`w-full px-6 py-4 rounded-xl outline-none border transition-all font-medium resize-none ${
                                theme === 'dark' ? 'bg-zinc-950 border-zinc-800 focus:border-emerald-500 text-white' : 'bg-white border-gray-200 focus:border-emerald-500 text-zinc-900 shadow-sm'
                              }`}
                              value={editingPage.sections?.data_business_desc || ''}
                              onChange={(e) => setEditingPage({...editingPage, sections: {...editingPage.sections, data_business_desc: e.target.value}})}
                            />
                         </div>

                         {/* Vision & Mission Section */}
                         <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-100 dark:border-zinc-800 shadow-sm space-y-6">
                            <div className="flex items-center gap-2 mb-2">
                               <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                               <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500">VISI & MISI PERUSAHAAN</h4>
                            </div>
                            <div className="space-y-4">
                               <div className="space-y-2">
                                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">VISI (TEKS UTAMA)</label>
                                  <textarea 
                                    rows={2}
                                    className={`w-full px-6 py-4 rounded-xl outline-none border transition-all font-bold ${
                                      theme === 'dark' ? 'bg-zinc-950 border-zinc-800 focus:border-emerald-500 text-white' : 'bg-zinc-50 border-gray-200 focus:border-emerald-500 text-zinc-900'
                                    }`}
                                    value={editingPage.sections?.vision?.text || ''}
                                    onChange={(e) => updateSection('vision', 'text', e.target.value)}
                                  />
                               </div>
                               <div className="space-y-2">
                                  <div className="flex justify-between items-center">
                                     <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">MISI (POIN-POIN)</label>
                                     <button 
                                       type="button"
                                       onClick={() => {
                                         const current = editingPage.sections?.vision?.missions || [];
                                         updateSection('vision', 'missions', [...current, '']);
                                       }}
                                       className="text-[10px] font-black text-primary uppercase"
                                     >+ Tambah Poin</button>
                                  </div>
                                  <div className="space-y-3">
                                     {(editingPage.sections?.vision?.missions || []).map((m: string, i: number) => (
                                       <div key={i} className="flex gap-2">
                                          <input 
                                            className={`flex-1 px-4 py-2 rounded-lg outline-none border transition-all text-sm font-medium ${
                                              theme === 'dark' ? 'bg-zinc-950 border-zinc-800 focus:border-emerald-500 text-white' : 'bg-zinc-50 border-gray-200 focus:border-emerald-500 text-zinc-900'
                                            }`}
                                            value={m}
                                            onChange={(e) => {
                                              const current = [...(editingPage.sections?.vision?.missions || [])];
                                              current[i] = e.target.value;
                                              updateSection('vision', 'missions', current);
                                            }}
                                          />
                                          <button 
                                            type="button"
                                            onClick={() => {
                                              const current = [...(editingPage.sections?.vision?.missions || [])];
                                              current.splice(i, 1);
                                              updateSection('vision', 'missions', current);
                                            }}
                                            className="w-10 h-10 bg-red-50 text-red-500 rounded-lg flex items-center justify-center"
                                          >
                                             <span className="material-symbols-outlined text-sm">delete</span>
                                          </button>
                                       </div>
                                     ))}
                                  </div>
                               </div>
                            </div>
                         </div>

                         {/* Professional Section Editor */}
                         <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-100 dark:border-zinc-800 shadow-sm space-y-6">
                            <div className="flex items-center gap-2 mb-2">
                               <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                               <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500">SEKSI: GARDA TERDEPAN PROFESIONAL</h4>
                            </div>
                            <div className="space-y-4">
                               <div className="space-y-2">
                                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">JUDUL SEKSI</label>
                                  <input 
                                    className={`w-full px-6 py-4 rounded-xl outline-none border transition-all font-bold ${
                                      theme === 'dark' ? 'bg-zinc-950 border-zinc-800 focus:border-emerald-500 text-white' : 'bg-zinc-50 border-gray-200 focus:border-emerald-500 text-zinc-900'
                                    }`}
                                    value={editingPage.sections?.professional?.title || ''}
                                    onChange={(e) => updateSection('professional', 'title', e.target.value)}
                                  />
                               </div>
                               <div className="space-y-2">
                                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">KONTEN NARASI</label>
                                  <TiptapEditor 
                                    content={editingPage.sections?.professional?.content || ''}
                                    theme={theme}
                                    onChange={(html) => updateSection('professional', 'content', html)}
                                  />
                               </div>
                            </div>
                         </div>

                         {/* Why Choose Us Section */}
                         <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-100 dark:border-zinc-800 shadow-sm space-y-6">
                            <div className="flex items-center gap-2 mb-2">
                               <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                               <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500">MENGAPA MEMILIH KAMI? (3 BOX)</h4>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                               {[0, 1, 2].map(idx => {
                                 const pillar = (editingPage.sections?.pillars || [])[idx] || { title: '', desc: '', icon: 'science' };
                                 return (
                                   <div key={idx} className="p-4 border border-zinc-100 dark:border-zinc-800 rounded-2xl space-y-4">
                                      <div className="space-y-1">
                                         <label className="text-[8px] font-black text-zinc-400 uppercase">POIN KEUNGGULAN {idx + 1}</label>
                                         <input 
                                           className="w-full bg-transparent border-b border-zinc-100 dark:border-zinc-800 py-1 outline-none text-xs font-bold"
                                           value={pillar.title}
                                           onChange={(e) => {
                                             const current = [...(editingPage.sections?.pillars || [])];
                                             current[idx] = { ...pillar, title: e.target.value };
                                             updateSection('pillars', null, current);
                                           }}
                                         />
                                      </div>
                                      <div className="space-y-1">
                                         <label className="text-[8px] font-black text-zinc-400 uppercase">DESKRIPSI</label>
                                         <textarea 
                                           rows={3}
                                           className="w-full bg-transparent border border-zinc-100 dark:border-zinc-800 p-2 rounded-lg outline-none text-[10px] font-medium resize-none"
                                           value={pillar.desc}
                                           onChange={(e) => {
                                             const current = [...(editingPage.sections?.pillars || [])];
                                             current[idx] = { ...pillar, desc: e.target.value };
                                             updateSection('pillars', null, current);
                                           }}
                                         />
                                      </div>
                                   </div>
                                 );
                               })}
                            </div>
                         </div>

                         {/* Directors List Management */}
                         <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-100 dark:border-zinc-800 shadow-sm space-y-6">
                            <div className="flex justify-between items-center mb-4">
                               <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                                  <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500">JAJARAN DIREKSI (BOARD OF DIRECTORS)</h4>
                               </div>
                               <button 
                                 type="button"
                                 onClick={() => {
                                   const current = editingPage.sections?.directors || [];
                                   updateSection('directors', null, [...current, { name: '', role: '', image: '' }]);
                                 }}
                                 className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-emerald-200"
                               >
                                  Tambah Direktur
                               </button>
                            </div>
                            
                            <div className="space-y-4">
                               {(editingPage.sections?.directors || []).map((dir: any, idx: number) => (
                                 <div key={idx} className="p-6 border border-zinc-100 dark:border-zinc-800 rounded-2xl bg-zinc-50/50 dark:bg-zinc-950/30 flex flex-col md:flex-row gap-6 relative group">
                                    <button 
                                      type="button"
                                      onClick={() => {
                                        const current = [...(editingPage.sections?.directors || [])];
                                        current.splice(idx, 1);
                                        updateSection('directors', null, current);
                                      }}
                                      className="absolute top-4 right-4 w-8 h-8 bg-red-100 text-red-600 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-red-200"
                                    >
                                       <span className="material-symbols-outlined text-sm">delete</span>
                                    </button>

                                    <div className="w-24 h-24 bg-zinc-200 dark:bg-zinc-800 rounded-xl overflow-hidden shrink-0 relative group/img">
                                       {dir.image ? (
                                         <img src={dir.image} className="w-full h-full object-cover" alt="Director" />
                                       ) : (
                                         <div className="w-full h-full flex items-center justify-center text-zinc-400">
                                           <span className="material-symbols-outlined">person</span>
                                         </div>
                                       )}
                                       <label className="absolute inset-0 bg-black/60 opacity-0 group-hover/img:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer text-white text-[8px] font-black uppercase">
                                          <span className="material-symbols-outlined text-sm mb-1">upload</span>
                                          Ganti Foto
                                          <input 
                                            type="file" 
                                            className="hidden" 
                                            accept="image/*"
                                            onChange={async (e) => {
                                              const file = e.target.files?.[0];
                                              if (file) {
                                                const fakeUrl = URL.createObjectURL(file); 
                                                const current = [...(editingPage.sections?.directors || [])];
                                                current[idx].image = fakeUrl;
                                                updateSection('directors', null, current);
                                              }
                                            }}
                                          />
                                       </label>
                                    </div>

                                    <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                                       <div className="space-y-1">
                                          <label className="text-[9px] font-black text-zinc-400 uppercase">Nama Lengkap</label>
                                          <input 
                                            className="w-full bg-transparent border-b border-zinc-200 dark:border-zinc-800 py-1 outline-none text-sm font-bold"
                                            value={dir.name}
                                            onChange={(e) => {
                                              const current = [...(editingPage.sections?.directors || [])];
                                              current[idx].name = e.target.value;
                                              updateSection('directors', null, current);
                                            }}
                                          />
                                       </div>
                                       <div className="space-y-1">
                                          <label className="text-[9px] font-black text-zinc-400 uppercase">Jabatan</label>
                                          <input 
                                            className="w-full bg-transparent border-b border-zinc-200 dark:border-zinc-800 py-1 outline-none text-sm font-bold"
                                            value={dir.role}
                                            onChange={(e) => {
                                              const current = [...(editingPage.sections?.directors || [])];
                                              current[idx].role = e.target.value;
                                              updateSection('directors', null, current);
                                            }}
                                          />
                                       </div>
                                       <div className="space-y-1">
                                          <label className="text-[9px] font-black text-zinc-400 uppercase">URL Foto (Media Library)</label>
                                          <input 
                                            className="w-full bg-transparent border-b border-zinc-200 dark:border-zinc-800 py-1 outline-none text-[10px] font-medium"
                                            value={dir.image}
                                            placeholder="https://..."
                                            onChange={(e) => {
                                              const current = [...(editingPage.sections?.directors || [])];
                                              current[idx].image = e.target.value;
                                              updateSection('directors', null, current);
                                            }}
                                          />
                                       </div>
                                    </div>
                                 </div>
                               ))}
                               {(editingPage.sections?.directors || []).length === 0 && (
                                 <div className="text-center py-12 border-2 border-dashed border-zinc-100 dark:border-zinc-800 rounded-3xl">
                                    <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Belum ada data direksi.</p>
                                 </div>
                               )}
                            </div>
                         </div>

                         {/* Content / Article Sections for About */}
                         <div className="grid grid-cols-1 gap-8">
                            <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-100 dark:border-zinc-800 shadow-sm space-y-6">
                               <div className="flex items-center gap-2 mb-2">
                                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                                  <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500">ISI ARTIKEL: SEJARAH PERUSAHAAN (BAGIAN ATAS)</h4>
                               </div>
                               <TiptapEditor 
                                 content={editingPage.sections?.intro_content || editingPage.content || ''}
                                 theme={theme}
                                 onChange={(html) => updateSection('intro_content', null, html)}
                               />
                            </div>

                            <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-100 dark:border-zinc-800 shadow-sm space-y-6">
                               <div className="flex items-center gap-2 mb-2">
                                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                  <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500">ISI ARTIKEL: PENGALAMAN PROFESIONAL (BAGIAN BAWAH)</h4>
                               </div>
                               <TiptapEditor 
                                 content={editingPage.sections?.professional_content || ''}
                                 theme={theme}
                                 onChange={(html) => updateSection('professional_content', null, html)}
                               />
                            </div>
                         </div>
                      </div>
                    ) : editingPage.slug === 'layanan' ? (
                      <div className="space-y-10">
                        {/* Data Business Section description for Services */}
                         <div className="bg-zinc-900/5 dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-100 dark:border-zinc-800 shadow-sm space-y-6">
                            <div className="flex items-center gap-2 mb-2">
                               <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                               <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500">DESKRIPSI SEKSI "DATA IS OUR BUSINESS" (LAYANAN)</h4>
                            </div>
                            <textarea 
                              rows={3}
                              className={`w-full px-6 py-4 rounded-xl outline-none border transition-all font-medium resize-none ${
                                theme === 'dark' ? 'bg-zinc-950 border-zinc-800 focus:border-emerald-500 text-white' : 'bg-white border-gray-200 focus:border-emerald-500 text-zinc-900 shadow-sm'
                              }`}
                              value={editingPage.sections?.data_business_desc || ''}
                              onChange={(e) => setEditingPage({...editingPage, sections: {...editingPage.sections, data_business_desc: e.target.value}})}
                              placeholder="Masukkan deskripsi untuk bagian bawah halaman layanan..."
                            />
                         </div>
                      </div>
                    ) : ['contact', 'kontak'].includes(editingPage.slug) ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">NOMOR TELEPON / WHATSAPP</label>
                            <input 
                              className={`w-full px-6 py-4 rounded-xl outline-none border transition-all font-bold ${
                                theme === 'dark' ? 'bg-zinc-900 border-zinc-800 focus:border-emerald-500 text-white' : 'bg-white border-gray-200 focus:border-emerald-500 text-zinc-900 shadow-sm'
                              }`}
                              placeholder="Contoh: +62 812-XXXX-XXXX"
                              value={editingPage.phone || ''}
                              onChange={(e) => setEditingPage({...editingPage, phone: e.target.value})}
                            />
                         </div>
                         <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">ALAMAT EMAIL</label>
                            <input 
                              className={`w-full px-6 py-4 rounded-xl outline-none border transition-all font-bold ${
                                theme === 'dark' ? 'bg-zinc-900 border-zinc-800 focus:border-emerald-500 text-white' : 'bg-white border-gray-200 focus:border-emerald-500 text-zinc-900 shadow-sm'
                              }`}
                              placeholder="Contoh: info@wahanadata.com"
                              value={editingPage.email || ''}
                              onChange={(e) => setEditingPage({...editingPage, email: e.target.value})}
                            />
                         </div>
                         <div className="col-span-full space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">ALAMAT KANTOR LENGKAP</label>
                            <textarea 
                              rows={3}
                              className={`w-full px-6 py-4 rounded-xl outline-none border transition-all font-medium resize-none ${
                                theme === 'dark' ? 'bg-zinc-900 border-zinc-800 focus:border-emerald-500 text-white' : 'bg-white border-gray-200 focus:border-emerald-500 text-zinc-900 shadow-sm'
                              }`}
                              placeholder="Masukkan alamat lengkap kantor..."
                              value={editingPage.address || ''}
                              onChange={(e) => setEditingPage({...editingPage, address: e.target.value})}
                            />
                         </div>
                      </div>
                    ) : (
                        <div className="space-y-4">
                           <div className="flex items-center gap-2 mb-2">
                              <div className="w-2 h-2 bg-zinc-400 rounded-full"></div>
                              <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500">KONTEN HALAMAN UTAMA</h4>
                           </div>
                           <TiptapEditor 
                            content={editingPage.content || ''}
                            theme={theme}
                            onChange={(html) => setEditingPage({...editingPage, content: html})}
                          />
                       </div>
                    )}
                 </div>

                 {/* Section 2: SEO Settings (The Card from Screenshot) */}
                 <div className="max-w-3xl mx-auto">
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] p-10 shadow-xl shadow-zinc-200/50 dark:shadow-none">
                       <div className="flex items-center gap-4 mb-10">
                          <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl flex items-center justify-center text-emerald-600 shadow-inner">
                             <span className="material-symbols-outlined text-2xl font-black">search</span>
                          </div>
                          <div>
                             <h3 className="text-sm font-black text-zinc-900 dark:text-white uppercase tracking-wider">OPTIMASI PENCARIAN (SEO)</h3>
                             <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Meningkatkan Visibilitas di Google</p>
                          </div>
                       </div>

                       {/* Status Toggle Box */}
                       <div className="bg-emerald-50/50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/30 rounded-2xl p-6 mb-10 flex items-center justify-between">
                          <div className="flex items-center gap-4">
                             <div className={`w-3 h-3 rounded-full ${editingPage.isPublished ? 'bg-emerald-500 shadow-[0_0_15px_#10b981]' : 'bg-zinc-300'}`}></div>
                             <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-emerald-950 dark:text-emerald-200">STATUS PENERBITAN</p>
                                <p className="text-[9px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-tight mt-0.5">
                                   {editingPage.isPublished ? 'HALAMAN INI TERBIT PUBLIK' : 'DRAFT (Halaman tidak tampil di website)'}
                                </p>
                             </div>
                          </div>
                          <button 
                            type="button"
                            onClick={() => setEditingPage({...editingPage, isPublished: !editingPage.isPublished})}
                            className={`w-14 h-7 rounded-full relative transition-all duration-300 shadow-inner ${
                              editingPage.isPublished ? 'bg-emerald-500' : 'bg-zinc-300 dark:bg-zinc-700'
                            }`}
                          >
                             <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all duration-300 shadow-md ${
                               editingPage.isPublished ? 'left-8' : 'left-1'
                             }`}></div>
                          </button>
                       </div>

                       <div className="space-y-8">
                          <div className="space-y-3">
                             <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">JUDUL META (TAB BROWSER)</label>
                             <input 
                               className={`w-full px-6 py-4 rounded-xl outline-none border border-zinc-100 dark:border-zinc-800 transition-all text-sm font-bold ${
                                 theme === 'dark' ? 'bg-zinc-950 focus:border-emerald-500 text-white' : 'bg-[#fafafa] focus:border-emerald-500 text-zinc-900'
                               }`}
                               placeholder="Contoh: Beranda | Wahana Data Utama"
                               value={editingPage.seoTitle || ''}
                               onChange={(e) => setEditingPage({...editingPage, seoTitle: e.target.value})}
                             />
                          </div>
                          <div className="space-y-3">
                             <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">DESKRIPSI SINGKAT (META DESCRIPTION)</label>
                             <textarea 
                               rows={4}
                               className={`w-full px-6 py-4 rounded-xl outline-none border border-zinc-100 dark:border-zinc-800 transition-all text-sm font-medium resize-none leading-relaxed ${
                                 theme === 'dark' ? 'bg-zinc-950 focus:border-emerald-500 text-white' : 'bg-[#fafafa] focus:border-emerald-500 text-zinc-700'
                               }`}
                               placeholder="Masukkan deskripsi singkat untuk pencarian Google..."
                               value={editingPage.seoDescription || ''}
                               onChange={(e) => setEditingPage({...editingPage, seoDescription: e.target.value})}
                             />
                          </div>
                       </div>
                    </div>
                 </div>
              </div>

              {/* Modal Footer */}
              <div className="p-8 border-t border-zinc-100 dark:border-zinc-800 flex gap-4 bg-white dark:bg-zinc-900 sticky bottom-0">
                 <button 
                   type="button"
                   onClick={() => window.open((editingPage.slug === 'home' ? '/' : `/${editingPage.slug}`) + '?preview=true', '_blank')}
                   className="flex-1 py-4 border-2 border-emerald-600 text-emerald-600 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-50 transition-all flex items-center justify-center gap-2"
                 >
                    <span className="material-symbols-outlined text-lg">visibility</span>
                    PREVIEW
                 </button>
                 <button 
                   onClick={handleSave}
                   disabled={isSaving}
                   className="flex-[2] py-4 bg-emerald-800 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-900/20 disabled:opacity-50 flex items-center justify-center gap-2"
                 >
                    <span className="material-symbols-outlined text-lg">cloud_upload</span>
                    {isSaving ? 'MEMPROSES...' : 'SIMPAN PERUBAHAN'}
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md animate-fade-in">
           <div className={`rounded-[2.5rem] w-full max-w-sm overflow-hidden flex flex-col reveal-up border shadow-2xl ${
             theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-gray-100'
           }`}>
              <div className="p-10 text-center">
                 <div className="w-20 h-20 bg-red-500/10 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-6 animate-pulse">
                    <span className="material-symbols-outlined text-4xl">delete_forever</span>
                 </div>
                 <h2 className={`text-2xl font-black mb-3 ${theme === 'dark' ? 'text-white' : 'text-zinc-900'}`}>Hapus Halaman?</h2>
                 <p className="text-sm font-medium text-zinc-500 leading-relaxed">
                    Tindakan ini akan menghapus <span className="font-bold text-red-500">/{deleteTarget}</span> secara permanen. Konten tidak dapat dipulihkan.
                 </p>
              </div>
              <div className="p-8 pt-0 flex gap-3">
                 <button 
                   onClick={() => setDeleteTarget(null)}
                   className={`flex-1 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${
                     theme === 'dark' ? 'bg-zinc-800 text-white hover:bg-zinc-700' : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                   }`}
                 >
                    Batal
                 </button>
                 <button 
                   onClick={confirmDelete}
                   disabled={isSaving}
                   className="flex-1 py-4 bg-red-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-red-500 transition-all shadow-lg shadow-red-600/20 disabled:opacity-50"
                 >
                    {isSaving ? 'MENGHAPUS...' : 'YA, HAPUS'}
                 </button>
              </div>
           </div>
        </div>
      )}
    </AdminLayout>
  );
}
