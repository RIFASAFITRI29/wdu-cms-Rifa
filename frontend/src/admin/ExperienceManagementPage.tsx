import * as React from 'react';
import AdminLayout from './AdminLayout';
import { useTheme } from '../context/ThemeContext';
import { useUser } from '../context/UserContext';
import { experiencePartnerService, ExperiencePartner } from '../services/experiencePartnerService';

export default function ExperienceManagementPage() {
  const { theme } = useTheme();
  const { user } = useUser();
  const [partners, setPartners] = React.useState<ExperiencePartner[]>(() => {
    const stored = localStorage.getItem('wdu_experience_partners');
    return stored ? JSON.parse(stored) : [];
  });
  const [isLoading, setIsLoading] = React.useState(false);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingPartner, setEditingPartner] = React.useState<ExperiencePartner | null>(null);
  const [isSaving, setIsSaving] = React.useState(false);
  
  // Search and Filter states
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedYear, setSelectedYear] = React.useState('All');

  const [formData, setFormData] = React.useState({
    year: '',
    logoUrl: '',
    category: 'Partner'
  });
  const [deleteTargetId, setDeleteTargetId] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = React.useState(false);
  const [draggedId, setDraggedId] = React.useState<string | null>(null);


  const fetchPartners = async () => {
    try {
      const { data } = await experiencePartnerService.getAll();
      setPartners(data);
    } catch (error) {
      console.error('Failed to fetch partners:', error);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchPartners();
  }, []);

  const handleOpenModal = (partner: ExperiencePartner | null = null) => {
    if (partner) {
      setEditingPartner(partner);
      setFormData({
        year: partner.year,
        logoUrl: partner.logoUrl,
        category: 'Partner'
      });
    } else {
      setEditingPartner(null);
      setFormData({
        year: new Date().getFullYear().toString(),
        logoUrl: '',
        category: 'Partner'
      });
    }
    setIsModalOpen(true);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          logoUrl: reader.result as string
        });
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      if (editingPartner) {
        await experiencePartnerService.update(editingPartner.id, formData);
      } else {
        await experiencePartnerService.create(formData);
      }
      await fetchPartners();
      setSearchTerm('');
      setSelectedYear('All');
      setIsModalOpen(false);
    } catch (error) {
      alert('Gagal menyimpan data.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = (id: string) => {
    setDeleteTargetId(id);
  };

  const confirmDelete = async () => {
    if (!deleteTargetId) return;
    try {
      setIsSaving(true);
      await experiencePartnerService.delete(deleteTargetId);
      await fetchPartners();
      setDeleteTargetId(null);
    } catch (error) {
      alert('Gagal menghapus data.');
    } finally {
      setIsSaving(false);
    }
  };
 
   const handleDragStart = (id: string) => {
     setDraggedId(id);
   };
 
   const handleDragOver = (e: React.DragEvent) => {
     e.preventDefault();
   };
 
   const handleDrop = async (targetId: string, year: string) => {
     if (!draggedId || draggedId === targetId) return;
 
     const yearPartners = [...groupedPartners[year]];
     const draggedIndex = yearPartners.findIndex(p => p.id === draggedId);
     const targetIndex = yearPartners.findIndex(p => p.id === targetId);
 
     if (draggedIndex === -1 || targetIndex === -1) return;
 
     const newYearPartners = [...yearPartners];
     const [draggedItem] = newYearPartners.splice(draggedIndex, 1);
     newYearPartners.splice(targetIndex, 0, draggedItem);
 
     // Update globally
     const newAllPartners = partners.map(p => {
       if (p.year === year) {
         const found = newYearPartners.find(np => np.id === p.id);
         return found || p;
       }
       return p;
     });
 
     setPartners(newAllPartners);
     setDraggedId(null);
 
     // Reorder logic (simplified: all items in that year get new order)
     const reorderItems = newYearPartners.map((p, i) => ({
       id: p.id,
       order: i + 1
     }));
 
     try {
       await experiencePartnerService.reorder(reorderItems);
     } catch (error) {
       console.error('Failed to reorder');
       fetchPartners();
     }
   };


  // Filter partners based on search and year
  const filteredPartners = partners.filter(p => {
    // Search by Year if category is gone
    const matchesSearch = p.year.includes(searchTerm);
    const matchesYear = selectedYear === 'All' || p.year === selectedYear;
    return matchesSearch && matchesYear;
  });

  // Group partners by year for display
  const groupedPartners = filteredPartners.reduce((acc, curr) => {
    if (!acc[curr.year]) acc[curr.year] = [];
    acc[curr.year].push(curr);
    return acc;
  }, {} as Record<string, ExperiencePartner[]>);

  // Dynamic year list from data merged with defaults
  const defaultYears = ['2024', '2023', '2022', '2021', '2020'];
  const dataYears = Array.from(new Set(partners.map(p => p.year)));
  const allYears = Array.from(new Set([...defaultYears, ...dataYears])).sort((a, b) => b.localeCompare(a));
  
  const years = selectedYear === 'All' 
    ? allYears.filter(y => groupedPartners[y] && groupedPartners[y].length > 0)
    : [selectedYear].filter(y => groupedPartners[y] && groupedPartners[y].length > 0);

  return (
    <AdminLayout>
      <div className="space-y-12 max-w-7xl mx-auto pb-20">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
           <div className="reveal-up">
              <h1 className={`text-4xl md:text-5xl font-black tracking-tight ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Manajemen Pengalaman</h1>
              <p className={`text-sm font-bold mt-2 uppercase tracking-[0.3em] ${theme === 'dark' ? 'text-primary' : 'text-green-600'}`}>Kelola Portofolio & Partner Perusahaan</p>
           </div>
           <button 
             onClick={() => handleOpenModal()}
             className="bg-primary text-zinc-950 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-green-400 transition-all shadow-lg active:scale-95 flex items-center gap-2"
           >
             <span className="material-symbols-outlined text-xl">add_circle</span>
             Tambah Logo Baru
           </button>
        </div>

        {/* Filters and Search */}
        <div className={`p-8 rounded-[2.5rem] border flex flex-col md:flex-row gap-6 items-center ${theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-gray-100 shadow-sm'}`}>
           <div className="relative flex-1 w-full">
              <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400">search</span>
              <input 
                type="text"
                placeholder="Cari tahun..."
                className={`w-full pl-14 pr-6 py-4 rounded-2xl outline-none border transition-all font-bold text-sm ${
                  theme === 'dark' ? 'bg-zinc-950 border-zinc-800 focus:border-emerald-500 text-white' : 'bg-gray-50 border-gray-100 focus:border-emerald-500 text-gray-900'
                }`}
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
           </div>
           <div className="flex items-center gap-4 w-full md:w-auto">
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 whitespace-nowrap">Filter Tahun:</span>
              <select 
                className={`px-6 py-4 rounded-2xl outline-none border transition-all font-black text-xs uppercase tracking-widest ${
                  theme === 'dark' ? 'bg-zinc-950 border-zinc-800 focus:border-emerald-500 text-white' : 'bg-gray-50 border-gray-100 focus:border-emerald-500 text-gray-900'
                }`}
                value={selectedYear}
                onChange={e => setSelectedYear(e.target.value)}
              >
                 <option value="All">Semua Tahun</option>
                 {allYears.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
           </div>
        </div>

        {isLoading ? (
          <div className="py-20 text-center text-zinc-500 font-bold uppercase tracking-widest text-xs animate-pulse">Menghubungkan ke pusat data...</div>
        ) : years.length === 0 ? (
          <div className={`p-20 text-center rounded-[3rem] border-2 border-dashed ${theme === 'dark' ? 'bg-zinc-900/50 border-zinc-800' : 'bg-gray-50 border-gray-200'}`}>
             <span className="material-symbols-outlined text-6xl text-zinc-300 mb-4">manage_search</span>
             <p className="text-zinc-500 font-bold">Tidak ada data yang sesuai dengan pencarian Anda.</p>
             <button onClick={() => {setSearchTerm(''); setSelectedYear('All')}} className="mt-4 text-primary font-black uppercase tracking-widest text-[10px] hover:underline">Reset Filter</button>
          </div>
        ) : (
          <div className="space-y-12">
            {years.map(year => {
              return (
                <div key={year} className={`p-10 rounded-[3rem] border ${
                  theme === 'dark' ? 'bg-zinc-900 border-zinc-800 shadow-2xl' : 'bg-white border-gray-100 shadow-xl shadow-zinc-200/40'
                }`}>
                   <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                      <div>
                         <h2 className={`text-4xl font-black ${theme === 'dark' ? 'text-white' : 'text-zinc-900'}`}>{year}</h2>
                      </div>
                      <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800">
                         <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{groupedPartners[year].length} Logo</span>
                      </div>
                   </div>

                   <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8">
                     {groupedPartners[year].map(partner => (
                       <div 
                         key={partner.id} 
                         draggable
                         onDragStart={() => handleDragStart(partner.id)}
                         onDragOver={handleDragOver}
                         onDrop={() => handleDrop(partner.id, year)}
                         className={`group aspect-square rounded-[2rem] border transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 relative overflow-hidden flex flex-col items-center justify-center p-6 cursor-grab active:cursor-grabbing ${
                           theme === 'dark' ? 'bg-zinc-950 border-zinc-800 hover:border-primary/30' : 'bg-gray-50 border-zinc-100 shadow-inner'
                         } ${draggedId === partner.id ? 'opacity-20 scale-95' : ''}`}
                       >
                          <div className="absolute top-2 left-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                             <span className="material-symbols-outlined text-xs text-zinc-500">drag_indicator</span>
                          </div>
                          {partner.logoUrl?.includes('application/pdf') || partner.logoUrl?.includes('data:application/pdf') ? (
                            <div className="flex flex-col items-center justify-center text-primary">
                               <span className="material-symbols-outlined text-5xl">picture_as_pdf</span>
                               <span className="text-[8px] font-bold mt-2 uppercase tracking-widest text-zinc-500">Document</span>
                            </div>
                          ) : (
                            <img 
                              src={partner.logoUrl} 
                              alt="Logo" 
                              className="max-h-full max-w-full object-contain transition-all duration-500" 
                            />
                          )}
                          
                          <div className="absolute inset-0 bg-zinc-900/90 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-4">
                             <button 
                               onClick={() => handleOpenModal(partner)}
                               className="w-full py-2 bg-white text-zinc-900 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-primary hover:text-zinc-950 transition-all"
                             >
                                Edit
                             </button>
                             {user?.role === 'SUPER_ADMIN' && (
                               <button 
                                 onClick={() => handleDelete(partner.id)}
                                 className="w-full py-2 bg-red-500 text-white rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-red-600 transition-all"
                               >
                                  Hapus
                               </button>
                             )}
                          </div>
                       </div>
                     ))}
                   </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-zinc-950/40 backdrop-blur-sm animate-fade-in">
           <div className={`rounded-[2.5rem] w-full max-w-lg overflow-hidden border shadow-2xl ${
             theme === 'dark' ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-gray-100 text-gray-900'
           }`}>
              <div className="p-8 border-b border-zinc-50 dark:border-zinc-800 flex justify-between items-center">
                 <h2 className="text-xl font-black uppercase tracking-tight">{editingPartner ? 'Edit Logo' : 'Tambah Logo'}</h2>
                 <button onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-zinc-600 transition-colors">
                    <span className="material-symbols-outlined">close</span>
                 </button>
              </div>

               <form onSubmit={handleSubmit} className="p-8 space-y-6">
                  <div className="space-y-4">
                     <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">TAHUN</label>
                        <input 
                          required
                          className={`w-full px-5 py-3 rounded-xl outline-none border transition-all font-bold ${
                            theme === 'dark' ? 'bg-zinc-950 border-zinc-800 focus:border-emerald-500 text-white' : 'bg-gray-50 border-gray-200 focus:border-emerald-500 text-gray-900'
                          }`}
                          value={formData.year}
                          onChange={e => setFormData({...formData, year: e.target.value})}
                          placeholder="Contoh: 2025"
                        />
                     </div>

                     <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">UNGGAH FILE (IMG/PDF)</label>
                        <div 
                          onClick={() => !isUploading && fileInputRef.current?.click()}
                          className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all hover:bg-zinc-50 dark:hover:bg-zinc-800/50 ${
                            theme === 'dark' ? 'border-zinc-800' : 'border-zinc-200'
                          } ${isUploading ? 'opacity-50 cursor-wait' : ''}`}
                        >
                           <input type="file" ref={fileInputRef} className="hidden" accept="image/*,application/pdf" onChange={handleFileSelect} />
                           <span className={`material-symbols-outlined text-3xl text-zinc-400 mb-2 ${isUploading ? 'animate-spin' : ''}`}>
                              {isUploading ? 'sync' : 'upload_file'}
                           </span>
                           <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                              {isUploading ? 'Memproses File...' : 'Klik untuk Pilih File'}
                           </p>
                        </div>
                     </div>

                     <div className="relative py-2">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-zinc-100 dark:border-zinc-800"></div></div>
                        <div className="relative flex justify-center text-[10px]"><span className="px-2 bg-white dark:bg-zinc-900 text-zinc-400 font-black uppercase tracking-widest text-zinc-500">Atau</span></div>
                     </div>

                     <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">LINK URL LOGO</label>
                        <input 
                          className={`w-full px-5 py-3 rounded-xl outline-none border transition-all font-bold ${
                            theme === 'dark' ? 'bg-zinc-950 border-zinc-800 focus:border-emerald-500 text-white' : 'bg-gray-50 border-gray-200 focus:border-emerald-500 text-gray-900'
                          }`}
                          value={formData.logoUrl}
                          onChange={e => setFormData({...formData, logoUrl: e.target.value})}
                          placeholder="https://..."
                        />
                     </div>
                  </div>

                  <div className="pt-4 flex gap-4">
                     <button 
                       type="button" 
                       onClick={() => setIsModalOpen(false)}
                       className="flex-1 py-4 border-2 border-zinc-200 dark:border-zinc-800 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all text-zinc-500"
                     >
                        BATAL
                     </button>
                     <button 
                       type="submit"
                       disabled={isSaving}
                       className="flex-[2] py-4 bg-emerald-800 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-900/20 disabled:opacity-50"
                     >
                        {isSaving ? 'MEMPROSES...' : editingPartner ? 'UPDATE DATA' : 'TAMBAH DATA'}
                     </button>
                  </div>
               </form>
           </div>
        </div>
      )}
      {/* Delete Confirmation Modal */}
      {deleteTargetId && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md animate-fade-in">
           <div className={`rounded-[2.5rem] w-full max-sm overflow-hidden flex flex-col reveal-up border shadow-2xl ${
             theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-gray-100'
           }`}>
              <div className="p-10 text-center">
                 <div className="w-20 h-20 bg-red-500/10 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-6 animate-pulse">
                    <span className="material-symbols-outlined text-4xl">delete_forever</span>
                 </div>
                 <h2 className={`text-2xl font-black mb-3 ${theme === 'dark' ? 'text-white' : 'text-zinc-900'}`}>Hapus Data?</h2>
                 <p className="text-sm font-medium text-zinc-500 leading-relaxed">
                    Tindakan ini akan menghapus data pengalaman ini secara permanen dari website.
                 </p>
              </div>
              <div className="p-8 pt-0 flex gap-3">
                 <button 
                   onClick={() => setDeleteTargetId(null)}
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
