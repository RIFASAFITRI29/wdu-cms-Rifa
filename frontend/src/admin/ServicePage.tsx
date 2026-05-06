import * as React from 'react';
import AdminLayout from './AdminLayout';
import { serviceDataService, Service } from '../services/serviceDataService';
import { useTheme } from '../context/ThemeContext';

export default function ServicePage() {
  const { theme } = useTheme();
  const [services, setServices] = React.useState<Service[]>(() => {
    const stored = localStorage.getItem('wdu_services');
    return stored ? JSON.parse(stored) : [];
  });
  const [isLoading, setIsLoading] = React.useState(false);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingService, setEditingService] = React.useState<Service | null>(null);
  const [formData, setFormData] = React.useState<Partial<Service>>({
    title: '', description: '', icon: 'settings_suggest', isActive: true, order: 0
  });

  const [deleteTargetId, setDeleteTargetId] = React.useState<string | null>(null);
  const [isSaving, setIsSaving] = React.useState(false);
  const [draggedIndex, setDraggedIndex] = React.useState<number | null>(null);


  React.useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const { data } = await serviceDataService.getAll();
      setServices(data);
    } catch (error) {
      console.error('Failed to fetch services:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = (service: Service | null = null) => {
    if (service) {
      setEditingService(service);
      setFormData(service);
    } else {
      setEditingService(null);
      setFormData({
        title: '', description: '', icon: 'settings_suggest', isActive: true, order: services.length + 1
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingService(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      if (editingService) {
        await serviceDataService.update(editingService.id, formData);
      } else {
        await serviceDataService.create(formData);
      }
      await fetchServices();
      handleCloseModal();
    } catch (error) {
      console.error('Failed to save service:', error);
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
      await serviceDataService.delete(deleteTargetId);
      await fetchServices();
      setDeleteTargetId(null);
    } catch (error) {
      console.error('Failed to delete service:', error);
    } finally {
      setIsSaving(false);
    }
  };
 
   const handleDragStart = (index: number) => {
     setDraggedIndex(index);
   };
 
   const handleDragOver = (e: React.DragEvent) => {
     e.preventDefault();
   };
 
   const handleDrop = async (index: number) => {
     if (draggedIndex === null || draggedIndex === index) return;
 
     const newServices = [...services];
     const draggedItem = newServices[draggedIndex];
     newServices.splice(draggedIndex, 1);
     newServices.splice(index, 0, draggedItem);
 
     setServices(newServices);
     setDraggedIndex(null);
 
     const reorderItems = newServices.map((s, i) => ({
       id: s.id,
       order: i + 1
     }));
 
     try {
       await serviceDataService.reorder(reorderItems);
     } catch (error) {
       console.error('Failed to reorder services');
       fetchServices();
     }
   };


  return (
    <AdminLayout>
      <div className="space-y-12 max-w-7xl mx-auto pb-20">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
           <div className="reveal-up">
              <h1 className={`text-4xl md:text-5xl font-black tracking-tight ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Layanan</h1>
              <p className={`text-sm font-bold mt-2 uppercase tracking-[0.3em] ${theme === 'dark' ? 'text-primary' : 'text-green-600'}`}>Manajemen Solusi & Kapabilitas</p>
           </div>
           <button 
             onClick={() => handleOpenModal()}
             className="bg-primary text-white dark:text-zinc-950 px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 hover:bg-green-700 transition-all shadow-[0_10px_30px_rgba(21,128,61,0.2)] active:scale-95"
           >
             <span className="material-symbols-outlined text-xl">add_circle</span>
             Tambah Layanan
           </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
           {isLoading ? (
             <div className="col-span-full py-20 text-center text-zinc-500 font-bold uppercase tracking-widest text-xs animate-pulse">Menyelaraskan Portofolio Layanan...</div>
           ) : services.map((service, index) => (
             <div key={service.id} draggable onDragStart={() => handleDragStart(index)} onDragOver={handleDragOver} onDrop={() => handleDrop(index)} className={`p-10 rounded-[3rem] border transition-all duration-500 group relative overflow-hidden ${
               theme === 'dark' ? 'bg-zinc-900 border-zinc-800 hover:border-primary/50' : 'bg-white border-gray-100 shadow-xl hover:shadow-2xl'
             }`}>

                <div className="flex justify-between items-start mb-10 relative z-10">
                   <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center transition-all duration-500 shadow-inner ${
                     theme === 'dark' ? 'bg-zinc-950 text-primary group-hover:bg-primary group-hover:text-zinc-950' : 'bg-green-50 text-green-700 group-hover:bg-green-700 group-hover:text-white'
                   }`}>
                      <span className="material-symbols-outlined text-4xl">{service.icon}</span>
                   </div>
                   <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all translate-y-[-10px] group-hover:translate-y-0">
                      <button onClick={() => handleOpenModal(service)} className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${theme === 'dark' ? 'bg-zinc-800 text-primary hover:bg-primary hover:text-zinc-950' : 'bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white'}`}><span className="material-symbols-outlined text-lg">edit</span></button>
                      <button onClick={() => handleDelete(service.id)} className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${theme === 'dark' ? 'bg-zinc-800 text-zinc-500 hover:bg-red-500 hover:text-white' : 'bg-red-50 text-red-600 hover:bg-red-600 hover:text-white'}`}><span className="material-symbols-outlined text-lg">delete</span></button>
                   </div>
                </div>
                <div className="relative z-10">
                   <h3 className={`font-black text-2xl mb-4 tracking-tight ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{service.title}</h3>
                   <p className={`text-sm line-clamp-3 leading-relaxed mb-10 font-medium ${theme === 'dark' ? 'text-zinc-500' : 'text-gray-500'}`}>{service.description}</p>
                   <div className={`flex items-center justify-between pt-6 border-t ${theme === 'dark' ? 'border-zinc-800' : 'border-gray-50'}`}>
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${service.isActive ? 'bg-primary' : 'bg-zinc-700'}`}></span>
                        <span className={`text-[10px] font-black uppercase tracking-widest ${theme === 'dark' ? 'text-zinc-600' : 'text-gray-400'}`}>{service.isActive ? 'Aktif' : 'Non-aktif'}</span>
                      </div>
                      <span className="text-[10px] font-black text-zinc-700 uppercase tracking-widest">Order: #{index + 1}</span>
                   </div>
                </div>
             </div>
           ))}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <div className={`rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden reveal-up ${
            theme === 'dark' ? 'bg-zinc-900 border border-zinc-800' : 'bg-white border border-gray-100'
          }`}>
            <div className={`px-8 py-6 border-b flex justify-between items-center ${
              theme === 'dark' ? 'bg-zinc-800/50 border-zinc-800' : 'bg-gray-50/50 border-gray-50'
            }`}>
              <h3 className={`font-black uppercase tracking-tighter ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{editingService ? 'Edit Layanan' : 'Layanan Baru'}</h3>
              <button onClick={handleCloseModal} className="text-zinc-500 hover:text-zinc-300 transition-colors"><span className="material-symbols-outlined">close</span></button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="space-y-1">
                 <label className={`text-[10px] font-black uppercase tracking-widest ml-1 ${theme === 'dark' ? 'text-zinc-500' : 'text-gray-400'}`}>Nama Layanan</label>
                 <input 
                   required
                   className={`w-full px-4 py-3 rounded-xl outline-none transition-all text-sm font-medium ${
                     theme === 'dark' ? 'bg-zinc-950 border border-zinc-800 focus:border-primary text-white' : 'bg-gray-50 border border-gray-100 focus:bg-white focus:border-green-500'
                   }`}
                   value={formData.title}
                   onChange={e => setFormData({...formData, title: e.target.value})}
                 />
              </div>
              <div className="space-y-1">
                 <label className={`text-[10px] font-black uppercase tracking-widest ml-1 ${theme === 'dark' ? 'text-zinc-500' : 'text-gray-400'}`}>Ikon (Material Symbol)</label>
                 <div className="relative">
                    <span className={`material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-xl ${theme === 'dark' ? 'text-zinc-600' : 'text-gray-400'}`}>{formData.icon}</span>
                    <input 
                      required
                      className={`w-full pl-12 pr-4 py-3 rounded-xl outline-none transition-all text-sm font-medium ${
                        theme === 'dark' ? 'bg-zinc-950 border border-zinc-800 focus:border-primary text-white' : 'bg-gray-50 border border-gray-100 focus:bg-white focus:border-green-500'
                      }`}
                      placeholder="e.g. bar_chart"
                      value={formData.icon}
                      onChange={e => setFormData({...formData, icon: e.target.value})}
                    />
                 </div>
              </div>
              <div className="space-y-1">
                 <label className={`text-[10px] font-black uppercase tracking-widest ml-1 ${theme === 'dark' ? 'text-zinc-500' : 'text-gray-400'}`}>Deskripsi</label>
                 <textarea 
                   required
                   rows={4}
                   className={`w-full px-4 py-3 rounded-xl outline-none transition-all text-sm font-medium resize-none ${
                     theme === 'dark' ? 'bg-zinc-950 border border-zinc-800 focus:border-primary text-white' : 'bg-gray-50 border border-gray-100 focus:bg-white focus:border-green-500'
                   }`}
                   value={formData.description}
                   onChange={e => setFormData({...formData, description: e.target.value})}
                 />
              </div>
              <div className="flex items-center gap-3 py-2">
                 <input 
                   type="checkbox"
                   id="isActive"
                   checked={formData.isActive}
                   onChange={e => setFormData({...formData, isActive: e.target.checked})}
                   className={`w-5 h-5 rounded-lg border-none transition-all ${theme === 'dark' ? 'bg-zinc-800 accent-primary' : 'bg-gray-100 accent-green-600'}`}
                 />
                 <label htmlFor="isActive" className={`text-xs font-black uppercase tracking-widest ${theme === 'dark' ? 'text-zinc-500' : 'text-gray-600'}`}>Layanan Aktif</label>
              </div>
              <div className="pt-6 flex justify-end gap-4">
                 <button type="button" onClick={handleCloseModal} className="px-6 py-3 text-xs font-black uppercase text-zinc-500 hover:text-zinc-300 tracking-widest transition-colors">Batal</button>
                 <button type="submit" className="px-10 py-3 bg-primary text-white dark:text-zinc-950 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-green-700 transition-all shadow-lg active:scale-95">Simpan Layanan</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Delete Confirmation Modal */}
      {deleteTargetId && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md animate-fade-in">
           <div className={`rounded-[2.5rem] w-full max-w-sm overflow-hidden flex flex-col reveal-up border shadow-2xl ${
             theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-gray-100'
           }`}>
              <div className="p-10 text-center">
                 <div className="w-20 h-20 bg-red-500/10 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-6 animate-pulse">
                    <span className="material-symbols-outlined text-4xl">delete_forever</span>
                 </div>
                 <h2 className={`text-2xl font-black mb-3 ${theme === 'dark' ? 'text-white' : 'text-zinc-900'}`}>Hapus Layanan?</h2>
                 <p className="text-sm font-medium text-zinc-500 leading-relaxed">
                    Tindakan ini akan menghapus data layanan ini secara permanen dari website.
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
