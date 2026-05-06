import * as React from 'react';
import AdminLayout from './AdminLayout';
import { clientService, ClientLogo } from '../services/clientService';
import { useTheme } from '../context/ThemeContext';

export default function ClientManagementPage() {
  const { theme } = useTheme();
  const [clients, setClients] = React.useState<ClientLogo[]>(() => {
    const stored = localStorage.getItem('wdu_clients');
    return stored ? JSON.parse(stored) : [];
  });
  const [isLoading, setIsLoading] = React.useState(false);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isUploading, setIsUploading] = React.useState(false);
  
  const [formData, setFormData] = React.useState({
    name: '',
    url: ''
  });
  const [deleteTargetId, setDeleteTargetId] = React.useState<string | null>(null);


  const fileInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const { data } = await clientService.getAll();
      setClients(data);
    } catch (error) {
      console.error('Failed to fetch clients:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          name: file.name.split('.')[0].toUpperCase(),
          url: reader.result as string
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddClient = async () => {
    if (!formData.name || !formData.url) return;
    try {
      setIsUploading(true);
      await clientService.add(formData);
      await fetchClients();
      setIsModalOpen(false);
      setFormData({ name: '', url: '' });
    } catch (error) {
      alert('Gagal menambah klien.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = (id: string) => {
    setDeleteTargetId(id);
  };

  const confirmDelete = async () => {
    if (!deleteTargetId) return;
    try {
      setIsUploading(true);
      await clientService.delete(deleteTargetId);
      await fetchClients();
      setDeleteTargetId(null);
    } catch (error) {
      alert('Gagal menghapus klien.');
    } finally {
      setIsUploading(false);
    }
  };


  const handleReset = async () => {
    if (window.confirm('Sinkronkan ulang logo dengan data resmi pengalaman web? Semua logo tambahan Anda akan terhapus.')) {
      const { data } = await clientService.resetToDefault();
      setClients(data);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-12 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
           <div className="reveal-up">
              <h1 className={`text-4xl md:text-5xl font-black tracking-tight ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Klien & Partner</h1>
              <p className={`text-sm font-bold mt-2 uppercase tracking-[0.3em] ${theme === 'dark' ? 'text-primary' : 'text-green-600'}`}>Manajemen Kolaborasi Strategis</p>
           </div>
           <div className="flex gap-4">
              <button 
                onClick={handleReset}
                className={`px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest border transition-all ${
                  theme === 'dark' ? 'border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-white' : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                }`}
              >
                Reset Ke Default
              </button>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="bg-primary text-white dark:text-zinc-950 px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 hover:bg-green-700 transition-all shadow-[0_10px_30px_rgba(21,128,61,0.2)] active:scale-95"
              >
                <span className="material-symbols-outlined text-xl">add_circle</span>
                Tambah Klien
              </button>
           </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
           {isLoading ? (
             <div className="col-span-full py-32 text-center text-zinc-500 font-bold uppercase tracking-widest text-xs animate-pulse">Memuat Data Klien...</div>
           ) : clients.map(client => (
             <div 
               key={client.id} 
               className={`group aspect-[4/3] rounded-[2rem] border p-8 flex flex-col items-center justify-center relative transition-all duration-700 hover:shadow-2xl hover:-translate-y-2 ${
                 theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-gray-100 shadow-sm'
               }`}
             >
                <img 
                  src={client.url} 
                  alt={client.name} 
                  className="max-w-full max-h-full object-contain transition-all duration-500" 
                />
                
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col items-center justify-center rounded-[2rem] p-4 text-center">
                   <p className="text-white text-[10px] font-black uppercase tracking-widest mb-4 px-2">{client.name}</p>
                   <button 
                     onClick={() => handleDelete(client.id)}
                     className="w-10 h-10 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-all hover:scale-110"
                   >
                      <span className="material-symbols-outlined">delete</span>
                   </button>
                </div>
             </div>
           ))}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
           <div className={`rounded-[2.5rem] w-full max-w-lg shadow-[0_0_50px_rgba(0,0,0,0.3)] overflow-hidden reveal-up ${
             theme === 'dark' ? 'bg-zinc-900 border border-zinc-800' : 'bg-white'
           }`}>
              <div className={`px-10 py-8 border-b flex justify-between items-center ${
                theme === 'dark' ? 'border-zinc-800 bg-zinc-800/30' : 'border-gray-50 bg-gray-50/30'
              }`}>
                 <div>
                    <h3 className={`font-black text-xl tracking-tight ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Tambah Logo Klien</h3>
                    <p className={`text-[10px] font-black uppercase tracking-widest mt-1 ${theme === 'dark' ? 'text-zinc-500' : 'text-gray-400'}`}>Gunakan logo resolusi tinggi (PNG/SVG)</p>
                 </div>
                 <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 rounded-full flex items-center justify-center text-zinc-500 hover:text-red-500 transition-all">
                    <span className="material-symbols-outlined">close</span>
                 </button>
              </div>

              <div className="p-10 space-y-8">
                 {!formData.url ? (
                    <div className="space-y-6">
                       <div 
                         onClick={() => fileInputRef.current?.click()}
                         className={`border-2 border-dashed rounded-[2.5rem] p-10 text-center cursor-pointer transition-all hover:scale-[0.98] active:scale-95 group ${
                           theme === 'dark' ? 'border-zinc-800 bg-zinc-950/50 hover:bg-zinc-800/50 hover:border-primary' : 'border-gray-100 bg-gray-50 hover:bg-white hover:border-green-400 shadow-inner'
                         }`}
                       >
                          <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileSelect} />
                          <div className={`w-16 h-16 rounded-[1.5rem] mx-auto mb-4 flex items-center justify-center transition-all duration-500 group-hover:rotate-12 ${
                            theme === 'dark' ? 'bg-zinc-800 text-primary group-hover:bg-primary group-hover:text-zinc-950' : 'bg-white text-green-600 shadow-xl group-hover:bg-green-600 group-hover:text-white'
                          }`}>
                             <span className="material-symbols-outlined text-3xl">upload_file</span>
                          </div>
                          <p className={`font-black uppercase tracking-widest text-sm ${theme === 'dark' ? 'text-white' : 'text-emerald-950'}`}>Unggah dari Komputer</p>
                       </div>

                       <div className="flex items-center gap-4">
                         <div className={`h-px flex-1 ${theme === 'dark' ? 'bg-zinc-800' : 'bg-gray-200'}`}></div>
                         <span className={`text-[10px] font-black uppercase tracking-widest ${theme === 'dark' ? 'text-zinc-600' : 'text-gray-400'}`}>ATAU</span>
                         <div className={`h-px flex-1 ${theme === 'dark' ? 'bg-zinc-800' : 'bg-gray-200'}`}></div>
                       </div>

                       <div className="space-y-2 px-2">
                         <label className={`text-[10px] font-black uppercase tracking-widest ml-1 ${theme === 'dark' ? 'text-zinc-600' : 'text-gray-400'}`}>Tempel URL dari Media Library</label>
                         <input 
                           type="url"
                           placeholder="https://..."
                           className={`w-full px-6 py-4 rounded-2xl outline-none transition-all text-sm font-medium ${
                             theme === 'dark' ? 'bg-zinc-950 border border-zinc-800 focus:border-primary text-white shadow-inner' : 'bg-gray-50 border border-gray-100 focus:bg-white focus:border-green-500 shadow-sm'
                           }`}
                           onBlur={(e) => {
                             if (e.target.value) {
                               setFormData({ ...formData, url: e.target.value, name: 'PERUSAHAAN BARU' });
                             }
                           }}
                           onKeyDown={(e) => {
                             if (e.key === 'Enter' && e.currentTarget.value) {
                               e.preventDefault();
                               setFormData({ ...formData, url: e.currentTarget.value, name: 'PERUSAHAAN BARU' });
                             }
                           }}
                         />
                       </div>
                    </div>
                 ) : (
                    <div className="space-y-8 animate-fade-in">
                       <div className="relative rounded-[2.5rem] overflow-hidden aspect-video border p-12 bg-white flex items-center justify-center group shadow-2xl">
                          <img src={formData.url} className="max-w-full max-h-full object-contain" alt="Preview" />
                          <button 
                            onClick={() => setFormData({ name: '', url: '' })}
                            className="absolute top-4 right-4 w-10 h-10 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-red-500 transition-all"
                          >
                             <span className="material-symbols-outlined">delete</span>
                          </button>
                       </div>
                       <div className="space-y-2 px-2">
                          <label className={`text-[10px] font-black uppercase tracking-widest ml-1 ${theme === 'dark' ? 'text-zinc-600' : 'text-gray-400'}`}>Nama Perusahaan</label>
                          <input 
                            className={`w-full px-6 py-4 rounded-2xl outline-none transition-all text-sm font-bold ${
                              theme === 'dark' ? 'bg-zinc-950 border border-zinc-800 focus:border-primary text-white' : 'bg-gray-50 border border-gray-100 focus:bg-white focus:border-green-500'
                            }`}
                            value={formData.name}
                            onChange={e => setFormData({...formData, name: e.target.value.toUpperCase()})}
                          />
                       </div>
                       <div className="pt-4 flex gap-4">
                          <button onClick={() => setIsModalOpen(false)} className="flex-1 py-4 text-xs font-black uppercase text-zinc-500 tracking-widest transition-colors">Batal</button>
                          <button 
                            onClick={handleAddClient}
                            disabled={isUploading}
                            className="flex-[2] py-5 bg-primary text-white dark:text-zinc-950 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-green-700 transition-all shadow-lg disabled:opacity-50"
                          >
                             {isUploading ? 'MENYIMPAN...' : 'SIMPAN LOGO'}
                          </button>
                       </div>
                    </div>
                 )}
              </div>
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
                 <h2 className={`text-2xl font-black mb-3 ${theme === 'dark' ? 'text-white' : 'text-zinc-900'}`}>Hapus Klien?</h2>
                 <p className="text-sm font-medium text-zinc-500 leading-relaxed">
                    Tindakan ini akan menghapus logo klien ini secara permanen.
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
                   disabled={isUploading}
                   className="flex-1 py-4 bg-red-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-red-500 transition-all shadow-lg shadow-red-600/20 disabled:opacity-50"
                 >
                    {isUploading ? 'MENGHAPUS...' : 'YA, HAPUS'}
                 </button>
              </div>
           </div>
        </div>
      )}
    </AdminLayout>

  );
}
