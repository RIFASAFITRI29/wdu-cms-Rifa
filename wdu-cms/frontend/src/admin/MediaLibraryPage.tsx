import * as React from 'react';
import AdminLayout from './AdminLayout';
import { mediaService, MediaFile } from '../services/mediaService';
import { useTheme } from '../context/ThemeContext';

export default function MediaLibraryPage() {
  const { theme } = useTheme();
  const [files, setFiles] = React.useState<MediaFile[]>(() => {
    const stored = localStorage.getItem('wdu_media');
    return stored ? JSON.parse(stored) : [];
  });
  const [isLoading, setIsLoading] = React.useState(false);
  const [isUploading, setIsUploading] = React.useState(false);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [previewFile, setPreviewFile] = React.useState<MediaFile | null>(null);
  
  const [filter, setFilter] = React.useState('all');
  const [formData, setFormData] = React.useState({
    filename: '',
    url: '',
    mimeType: 'image/png',
    size: 0
  });
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [deleteTargetId, setDeleteTargetId] = React.useState<string | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);


  const fileInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    try {
      const { data } = await mediaService.getAll();
      setFiles(data);
    } catch (error) {
      console.error('Failed to fetch media:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;
    
    try {
      setIsUploading(true);
      await mediaService.upload(selectedFile, formData.filename);
      await fetchMedia();
      setIsModalOpen(false);
      setFormData({ filename: '', url: '', mimeType: 'image/png', size: 0 });
      setSelectedFile(null);
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Gagal mengunggah aset.');
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
      setIsDeleting(true);
      await mediaService.delete(deleteTargetId);
      await fetchMedia();
      if (previewFile?.id === deleteTargetId) setPreviewFile(null);
      setDeleteTargetId(null);
    } catch (error) {
      console.error('Delete failed:', error);
    } finally {
      setIsDeleting(false);
    }
  };


  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <AdminLayout>
      <div className="space-y-12 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
           <div className="reveal-up">
              <h1 className={`text-4xl md:text-5xl font-black tracking-tight ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Media Library</h1>
              <p className={`text-sm font-bold mt-2 uppercase tracking-[0.3em] ${theme === 'dark' ? 'text-primary' : 'text-green-600'}`}>Intelligence Asset Repository</p>
           </div>
           
           <div className="flex items-center gap-4">
              <div className={`p-1.5 rounded-2xl border flex items-center ${
                theme === 'dark' ? 'bg-zinc-950 border-zinc-800' : 'bg-gray-50 border-gray-100'
              }`}>
                 {['all', 'image', 'pdf'].map((t) => (
                   <button 
                     key={t}
                     onClick={() => setFilter(t)}
                     className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                       filter === t 
                        ? 'bg-primary text-zinc-950 shadow-lg' 
                        : 'text-zinc-500 hover:text-primary'
                     }`}
                   >
                      {t}
                   </button>
                 ))}
              </div>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="bg-primary text-white dark:text-zinc-950 px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 hover:bg-green-700 transition-all shadow-[0_10px_30px_rgba(21,128,61,0.2)] active:scale-95"
              >
                <span className="material-symbols-outlined text-xl">cloud_upload</span>
                Unggah File
              </button>
           </div>
        </div>

        {/* Assets Grid Section */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-8">
           {/* Upload Placeholder Card */}
           <div 
             onClick={() => setIsModalOpen(true)}
             className={`aspect-square rounded-[2rem] border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all duration-500 group ${
               theme === 'dark' ? 'border-zinc-800 text-zinc-600 hover:border-primary hover:text-primary hover:bg-primary/5' : 'border-gray-200 text-gray-400 hover:border-green-400 hover:text-green-600 hover:bg-green-50/50'
             }`}
           >
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-all duration-500 group-hover:scale-110 group-hover:rotate-12 ${
                theme === 'dark' ? 'bg-zinc-800' : 'bg-gray-50'
              }`}>
                <span className="material-symbols-outlined text-4xl text-primary">add_photo_alternate</span>
              </div>
              <span className="text-[9px] font-black uppercase tracking-[0.2em]">Tambah Aset</span>
           </div>

           {isLoading ? (
             <div className="col-span-full py-32 text-center text-zinc-500 font-bold uppercase tracking-widest text-xs animate-pulse">Menyelaraskan Repository...</div>
           ) : files.filter(f => filter === 'all' || f.mimeType.includes(filter)).length === 0 ? (
             <div className="col-span-full py-32 text-center text-zinc-500 font-bold uppercase tracking-widest text-xs">Repository Kosong untuk kategori ini</div>
           ) : files.filter(f => filter === 'all' || f.mimeType.includes(filter)).map(file => (
             <div 
               key={file.id} 
               onClick={() => setPreviewFile(file)}
               className={`group aspect-square rounded-[2rem] border overflow-hidden relative cursor-pointer transition-all duration-700 hover:shadow-2xl hover:-translate-y-2 ${
                 theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-gray-100 shadow-sm'
               }`}
             >
                {file.mimeType.startsWith('image/') ? (
                  <img 
                    src={file.url} 
                    alt={file.filename} 
                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110" 
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Found';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center">
                    <span className={`material-symbols-outlined text-5xl mb-3 transition-colors ${theme === 'dark' ? 'text-zinc-700 group-hover:text-primary' : 'text-gray-200 group-hover:text-green-600'}`}>
                      {file.mimeType.includes('pdf') ? 'picture_as_pdf' : 'description'}
                    </span>
                    <span className="text-[8px] font-black uppercase tracking-widest opacity-40">{file.mimeType.split('/')[1]}</span>
                  </div>
                )}
                
                {/* Information Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-6">
                   <p className="text-white text-[10px] font-black uppercase tracking-widest mb-1 truncate">{file.filename}</p>
                   <p className="text-white/60 text-[8px] font-bold uppercase tracking-widest">{formatSize(file.size)}</p>
                </div>
                
                {/* Quick Actions */}
                <div className="absolute top-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100">
                  <button 
                    onClick={(e) => { 
                      e.stopPropagation(); 
                      navigator.clipboard.writeText(file.url); 
                      alert('URL disalin ke clipboard!'); 
                    }}
                    className="w-8 h-8 bg-black/40 backdrop-blur-md text-white rounded-full flex items-center justify-center hover:bg-primary transition-all"
                    title="Salin URL"
                  >
                     <span className="material-symbols-outlined text-[14px]">content_copy</span>
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleDelete(file.id); }}
                    className="w-8 h-8 bg-black/40 backdrop-blur-md text-white rounded-full flex items-center justify-center hover:bg-red-500 transition-all"
                    title="Hapus File"
                  >
                     <span className="material-symbols-outlined text-[16px]">delete</span>
                  </button>
                </div>
             </div>
           ))}
        </div>
      </div>

      {/* Upload Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
           <div className={`rounded-[2.5rem] w-full max-w-lg shadow-[0_0_50px_rgba(0,0,0,0.3)] overflow-hidden reveal-up ${
             theme === 'dark' ? 'bg-zinc-900 border border-zinc-800' : 'bg-white'
           }`}>
              <div className={`px-10 py-8 border-b flex justify-between items-center ${
                theme === 'dark' ? 'border-zinc-800 bg-zinc-800/30' : 'border-gray-50 bg-gray-50/30'
              }`}>
                 <div>
                    <h3 className={`font-black text-xl tracking-tight ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Unggah Aset</h3>
                    <p className={`text-[10px] font-black uppercase tracking-widest mt-1 ${theme === 'dark' ? 'text-zinc-500' : 'text-gray-400'}`}>Tambahkan file ke perpustakaan media</p>
                 </div>
                 <button 
                   onClick={() => {
                     setIsModalOpen(false);
                     setFormData({ filename: '', url: '', mimeType: 'image/png', size: 0 });
                   }} 
                   className="w-10 h-10 rounded-full flex items-center justify-center text-zinc-500 hover:bg-red-500/10 hover:text-red-500 transition-all"
                 >
                    <span className="material-symbols-outlined">close</span>
                 </button>
              </div>

              <div className="p-10 space-y-8">
                 {!formData.url ? (
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      onDragOver={(e) => {
                        e.preventDefault();
                        e.currentTarget.classList.add('border-primary', 'bg-primary/5');
                      }}
                      onDragLeave={(e) => {
                        e.preventDefault();
                        e.currentTarget.classList.remove('border-primary', 'bg-primary/5');
                      }}
                      onDrop={(e) => {
                        e.preventDefault();
                        e.currentTarget.classList.remove('border-primary', 'bg-primary/5');
                        const file = e.dataTransfer.files?.[0];
                        if (file) {
                          setSelectedFile(file);
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setFormData({
                              filename: file.name,
                              url: reader.result as string,
                              mimeType: file.type,
                              size: file.size
                            });
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className={`border-2 border-dashed rounded-[2.5rem] p-16 text-center cursor-pointer transition-all hover:scale-[0.98] active:scale-95 group ${
                        theme === 'dark' ? 'border-zinc-800 bg-zinc-950/50 hover:bg-zinc-800/50 hover:border-primary' : 'border-gray-100 bg-gray-50 hover:bg-white hover:border-green-400 shadow-inner'
                      }`}
                    >
                       <input 
                         type="file" 
                         ref={fileInputRef} 
                         className="hidden" 
                         accept="image/*,application/pdf" 
                         onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                               setSelectedFile(file);
                               const reader = new FileReader();
                               reader.onloadend = () => {
                                  setFormData({
                                     filename: file.name,
                                     url: reader.result as string,
                                     mimeType: file.type,
                                     size: file.size
                                  });
                               };
                               reader.readAsDataURL(file);
                            }
                         }} 
                       />
                       <div className={`w-24 h-24 rounded-[2rem] mx-auto mb-8 flex items-center justify-center transition-all duration-500 group-hover:rotate-12 ${
                         theme === 'dark' ? 'bg-zinc-800 text-primary group-hover:bg-primary group-hover:text-zinc-950' : 'bg-white text-green-600 shadow-xl group-hover:bg-green-600 group-hover:text-white'
                       }`}>
                          <span className="material-symbols-outlined text-5xl">cloud_upload</span>
                       </div>
                       <p className={`font-black uppercase tracking-widest text-sm ${theme === 'dark' ? 'text-white' : 'text-emerald-950'}`}>Klik untuk Pilih File</p>
                       <p className={`text-xs mt-3 font-medium ${theme === 'dark' ? 'text-zinc-500' : 'text-gray-400'}`}>PNG, JPG, WEBP, atau PDF hingga 10MB</p>
                    </div>
                 ) : (
                    <div className="space-y-8 animate-fade-in">
                       <div className="relative rounded-[2.5rem] overflow-hidden aspect-video border-4 border-white dark:border-zinc-800 group shadow-2xl transition-transform hover:scale-[1.02] flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
                          {formData.mimeType.startsWith('image/') ? (
                             <img src={formData.url} className="w-full h-full object-cover" alt="Preview" />
                          ) : (
                             <div className="flex flex-col items-center justify-center text-primary">
                                <span className="material-symbols-outlined text-6xl mb-3">picture_as_pdf</span>
                                <span className="text-[10px] font-black uppercase tracking-widest">{formData.filename}</span>
                             </div>
                          )}
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                             <button 
                               onClick={() => setFormData({ filename: '', url: '', mimeType: 'image/png', size: 0 })}
                               className="w-16 h-16 bg-white/20 backdrop-blur-xl text-white rounded-full flex items-center justify-center hover:bg-red-500 transition-all hover:scale-110"
                             >
                                <span className="material-symbols-outlined text-3xl">delete</span>
                             </button>
                          </div>
                       </div>
                       <div className="space-y-2 px-2">
                          <label className={`text-[10px] font-black uppercase tracking-widest ml-1 ${theme === 'dark' ? 'text-zinc-600' : 'text-gray-400'}`}>Nama File</label>
                          <input 
                            className={`w-full px-6 py-4 rounded-2xl outline-none transition-all text-sm font-bold ${
                              theme === 'dark' ? 'bg-zinc-950 border border-zinc-800 focus:border-primary text-white shadow-inner' : 'bg-gray-50 border border-gray-100 focus:bg-white focus:border-green-500 shadow-sm'
                            }`}
                            value={formData.filename}
                            onChange={e => setFormData({...formData, filename: e.target.value})}
                          />
                       </div>
                       <div className="pt-4 flex gap-4">
                          <button 
                            onClick={() => {
                              setIsModalOpen(false);
                              setFormData({ filename: '', url: '', mimeType: 'image/png', size: 0 });
                            }} 
                            className="flex-1 py-4 text-xs font-black uppercase text-zinc-500 hover:text-zinc-300 tracking-widest transition-colors"
                          >
                             Batal
                          </button>
                          <button 
                            onClick={handleUpload}
                            disabled={isUploading}
                            className="flex-[2] py-5 bg-primary text-white dark:text-zinc-950 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-green-700 transition-all shadow-[0_10px_30px_rgba(21,128,61,0.3)] active:scale-95 disabled:opacity-50"
                          >
                             {isUploading ? 'MENGUNGGAH...' : 'KONFIRMASI UNGGAH'}
                          </button>
                       </div>
                    </div>
                 )}
              </div>
           </div>
        </div>
      )}

      {/* Detail Preview Modal */}
      {previewFile && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-8 bg-zinc-950/95 backdrop-blur-xl animate-fade-in">
           <button 
             onClick={() => setPreviewFile(null)}
             className="absolute top-8 right-8 w-12 h-12 rounded-full flex items-center justify-center bg-white/10 text-white hover:bg-red-500 transition-all hover:rotate-90"
           >
              <span className="material-symbols-outlined text-2xl">close</span>
           </button>
           
           <div className="max-w-4xl w-full flex flex-col items-center gap-10 reveal-up">
              <div className={`p-4 rounded-[3rem] shadow-2xl relative overflow-hidden group transition-all duration-700 hover:scale-[1.02] ${
                theme === 'dark' ? 'bg-zinc-900 border border-zinc-800' : 'bg-white'
              }`}>
                 {previewFile.mimeType.startsWith('image/') ? (
                   <img src={previewFile.url} alt={previewFile.filename} className="max-w-full max-h-[60vh] rounded-[2.5rem] object-contain shadow-2xl" />
                 ) : (
                   <div className="w-80 h-80 flex flex-col items-center justify-center text-primary">
                      <span className="material-symbols-outlined text-8xl mb-6">
                         {previewFile.mimeType.includes('pdf') ? 'picture_as_pdf' : 'description'}
                      </span>
                      <p className="font-black text-xl tracking-tight text-center px-8">{previewFile.filename}</p>
                   </div>
                 )}
              </div>
              
              <div className="text-center space-y-4">
                 <h3 className="text-4xl font-black tracking-tight text-white">{previewFile.filename}</h3>
                 <div className="flex gap-8 justify-center">
                    <div className="flex flex-col items-center">
                       <span className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-500">Tipe</span>
                       <span className="text-xs font-bold text-white mt-1">{previewFile.mimeType}</span>
                    </div>
                    <div className="w-px h-8 bg-zinc-800 mt-2"></div>
                    <div className="flex flex-col items-center">
                       <span className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-500">Ukuran</span>
                       <span className="text-xs font-bold text-white mt-1">{formatSize(previewFile.size)}</span>
                    </div>
                    <div className="w-px h-8 bg-zinc-800 mt-2"></div>
                    <div className="flex flex-col items-center">
                       <span className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-500">Diunggah</span>
                       <span className="text-xs font-bold text-white mt-1">{new Date(previewFile.createdAt || '').toLocaleDateString()}</span>
                    </div>
                 </div>
              </div>

              <div className="flex flex-wrap gap-6 justify-center">
                 <button 
                   onClick={() => {
                     navigator.clipboard.writeText(previewFile.url);
                     alert('URL disalin ke clipboard!');
                   }}
                   className="px-12 py-5 bg-primary text-zinc-950 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-green-400 transition-all shadow-xl flex items-center gap-2"
                 >
                    <span className="material-symbols-outlined text-lg">content_copy</span>
                    Salin URL
                 </button>
                 <a 
                   href={previewFile.url} 
                   target="_blank" 
                   rel="noreferrer"
                   className="px-12 py-5 bg-white text-zinc-950 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-zinc-200 transition-all shadow-xl"
                 >
                    Buka Original
                 </a>
                 <button 
                   onClick={() => handleDelete(previewFile.id)}
                   className="px-12 py-5 bg-red-500/10 text-red-500 border border-red-500/20 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all"
                 >
                    Hapus File
                 </button>
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
                 <h2 className={`text-2xl font-black mb-3 ${theme === 'dark' ? 'text-white' : 'text-zinc-900'}`}>Hapus Aset?</h2>
                 <p className="text-sm font-medium text-zinc-500 leading-relaxed">
                    Tindakan ini akan menghapus file media ini secara permanen dari server.
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
                   disabled={isDeleting}
                   className="flex-1 py-4 bg-red-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-red-500 transition-all shadow-lg shadow-red-600/20 disabled:opacity-50"
                 >
                    {isDeleting ? 'MENGHAPUS...' : 'YA, HAPUS'}
                 </button>
              </div>
           </div>
        </div>
      )}
    </AdminLayout>

  );
}
