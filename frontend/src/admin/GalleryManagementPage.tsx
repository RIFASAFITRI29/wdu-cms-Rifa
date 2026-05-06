import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import { useTheme } from '../context/ThemeContext';
import { galleryService, GalleryImage } from '../services/galleryService';

export default function GalleryManagementPage() {
  const { theme } = useTheme();
  const [images, setImages] = useState<GalleryImage[]>(() => {
    const stored = localStorage.getItem('wdu_gallery');
    return stored ? JSON.parse(stored) : [];
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [newImage, setNewImage] = useState({ title: '', url: '' });
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);




  const fetchImages = async () => {
    try {
      const res = await galleryService.getAll();
      setImages([...(res?.data || [])].sort((a, b) => (a.order || 0) - (b.order || 0)));
    } catch (err: any) {

      setError(err.message || 'Failed to fetch gallery images');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newImage.url || !newImage.title) return;
    try {
      setIsSaving(true);
      if (editingImage) {
        await galleryService.update(editingImage.id, newImage);
      } else {
        await galleryService.add({ ...newImage, isActive: true, order: images.length + 1 });
      }
      setShowAddModal(false);
      setNewImage({ title: '', url: '' });
      setEditingImage(null);
      fetchImages();
    } catch (err: any) {
      setError(err.message || 'Failed to save image');
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (img: GalleryImage) => {
    setEditingImage(img);
    setNewImage({ title: img.title, url: img.url });
    setShowAddModal(true);
  };


  const handleDelete = (id: string) => {
    setDeleteTargetId(id);
  };

  const confirmDelete = async () => {
    if (!deleteTargetId) return;
    try {
      setIsDeleting(true);
      await galleryService.delete(deleteTargetId);
      await fetchImages();
      setDeleteTargetId(null);
    } catch (err: any) {
      setError(err.message || 'Failed to delete image');
    } finally {
      setIsDeleting(false);
    }
  };


  const handleToggleActive = async (image: GalleryImage) => {
    try {
      await galleryService.update(image.id, { isActive: !image.isActive });
      fetchImages();
    } catch (err: any) {
      setError(err.message || 'Failed to update image status');
    }
  };

  const handleReset = async () => {
    // For simplicity, we can use a small prompt here or another modal, 
    // but the user mostly hates the browser's confirm.
    setDeleteTargetId('RESET_GALLERY');
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (index: number) => {
    if (draggedIndex === null || draggedIndex === index) return;

    const newImages = [...images];
    const draggedItem = newImages[draggedIndex];
    newImages.splice(draggedIndex, 1);
    newImages.splice(index, 0, draggedItem);

    // Update locally for instant feedback
    setImages(newImages);
    setDraggedIndex(null);

    // Prepare items for backend update
    const reorderItems = newImages.map((img, i) => ({
      id: img.id,
      order: i + 1
    }));

    try {
      await galleryService.reorder(reorderItems);
    } catch (err: any) {
      setError('Gagal menyimpan urutan baru.');
      fetchImages(); // Rollback if failed
    }
  };



  return (
    <AdminLayout>
      <div className="p-8 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">Manajemen Galeri / Potret</h1>
            <p className={`text-sm ${theme === 'dark' ? 'text-zinc-400' : 'text-gray-500'}`}>
              Kelola foto dokumentasi kegiatan yang tampil di Beranda
            </p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={handleReset}
              className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 border transition-all ${
                theme === 'dark' 
                  ? 'border-red-900/30 text-red-400 hover:bg-red-900/20' 
                  : 'border-red-200 text-red-600 hover:bg-red-50'
              }`}
            >
              <span className="material-symbols-outlined text-lg">restart_alt</span>
              Reset Data
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-primary text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-emerald-700 transition-colors shadow-lg shadow-primary/20"
            >
              <span className="material-symbols-outlined text-lg">add_photo_alternate</span>
              Tambah Foto
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-6 text-sm font-medium">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {images.map((img, index) => (
              <div 
                key={img.id} 
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(index)}
                className={`rounded-2xl overflow-hidden border transition-all group cursor-grab active:cursor-grabbing relative ${
                  theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-gray-200 shadow-sm'
                } ${img.isActive === false ? 'opacity-50' : ''} ${draggedIndex === index ? 'opacity-20 scale-95' : ''}`}
              >
                <div className="absolute top-3 left-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                   <div className="bg-black/50 backdrop-blur-md text-white/50 p-1.5 rounded-lg">
                      <span className="material-symbols-outlined text-xs">drag_indicator</span>
                   </div>
                </div>
                <div className="h-48 w-full relative bg-black/5 flex items-center justify-center p-4">

                  <img src={img.url} alt={img.title} className="max-w-full max-h-full object-contain" />
                  
                  {/* Overlay actions */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-sm">
                    <button
                      onClick={() => handleToggleActive(img)}
                      title={img.isActive === false ? 'Tampilkan di Beranda' : 'Sembunyikan dari Beranda'}
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-white transition-transform hover:scale-110 ${
                        img.isActive === false ? 'bg-zinc-600 hover:bg-zinc-500' : 'bg-primary hover:bg-emerald-500'
                      }`}
                    >
                      <span className="material-symbols-outlined text-sm">
                        {img.isActive === false ? 'visibility_off' : 'visibility'}
                      </span>
                    </button>
                    <button
                      onClick={() => handleEdit(img)}
                      title="Edit Foto"
                      className="w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-500 flex items-center justify-center text-white transition-transform hover:scale-110"
                    >
                      <span className="material-symbols-outlined text-sm">edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(img.id)}

                      title="Hapus Foto"
                      className="w-10 h-10 rounded-full bg-red-600 hover:bg-red-500 flex items-center justify-center text-white transition-transform hover:scale-110"
                    >
                      <span className="material-symbols-outlined text-sm">delete</span>
                    </button>
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="font-bold text-sm mb-1 truncate" title={img.title}>{img.title}</h3>
                  <div className="flex items-center justify-between mt-3">
                    <span className={`text-[10px] font-bold px-3 py-1 rounded-full ${

                      img.isActive !== false ? 'bg-emerald-100 text-emerald-700' : 'bg-zinc-100 text-zinc-500'
                    }`}>
                      {img.isActive !== false ? 'AKTIF' : 'NONAKTIF'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            
            {images.length === 0 && (
              <div className="col-span-full py-20 text-center text-zinc-500 font-medium">
                Belum ada foto galeri. Silakan tambahkan foto baru.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`w-full max-w-lg rounded-2xl p-6 ${theme === 'dark' ? 'bg-zinc-900 border border-zinc-800' : 'bg-white'}`}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">{editingImage ? 'Edit Foto' : 'Tambah Foto Baru'}</h2>
              <button onClick={() => { setShowAddModal(false); setEditingImage(null); setNewImage({ title: '', url: '' }); }} className="text-zinc-500 hover:text-zinc-700">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">
                  Judul Foto
                </label>
                <input
                  type="text"
                  required
                  value={newImage.title}
                  onChange={e => setNewImage({ ...newImage, title: e.target.value })}
                  className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-primary/20 outline-none transition-all ${
                    theme === 'dark' ? 'bg-zinc-950 border-zinc-800' : 'bg-white border-gray-200'
                  }`}
                  placeholder="Contoh: Kegiatan Sosialisasi 2025"
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">
                  URL Gambar
                </label>
                <input
                  type="url"
                  required
                  value={newImage.url}
                  onChange={e => setNewImage({ ...newImage, url: e.target.value })}
                  className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-primary/20 outline-none transition-all ${
                    theme === 'dark' ? 'bg-zinc-950 border-zinc-800' : 'bg-white border-gray-200'
                  }`}
                  placeholder="https://..."
                />
                <p className="text-xs text-zinc-500 mt-2">
                  Tips: Anda bisa menyalin URL gambar dari menu Media Library.
                </p>
              </div>



              {newImage.url && (
                <div className="mt-4 p-4 border rounded-xl border-dashed flex justify-center bg-zinc-50/50">
                  <img src={newImage.url} alt="Preview" className="max-h-32 object-contain" onError={(e) => (e.currentTarget.style.display = 'none')} />
                </div>
              )}

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => { setShowAddModal(false); setEditingImage(null); setNewImage({ title: '', url: '' }); }}
                  className={`px-6 py-2.5 rounded-xl font-bold text-sm ${
                    theme === 'dark' ? 'bg-zinc-800 hover:bg-zinc-700' : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="bg-primary text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-emerald-700 shadow-lg shadow-primary/20 disabled:opacity-50"
                >
                  {isSaving ? 'Menyimpan...' : editingImage ? 'Update Foto' : 'Simpan Foto'}
                </button>
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
                    <span className="material-symbols-outlined text-4xl">
                      {deleteTargetId === 'RESET_GALLERY' ? 'restart_alt' : 'delete_forever'}
                    </span>
                 </div>
                 <h2 className={`text-2xl font-black mb-3 ${theme === 'dark' ? 'text-white' : 'text-zinc-900'}`}>
                   {deleteTargetId === 'RESET_GALLERY' ? 'Reset Galeri?' : 'Hapus Foto?'}
                 </h2>
                 <p className="text-sm font-medium text-zinc-500 leading-relaxed">
                    {deleteTargetId === 'RESET_GALLERY' 
                      ? 'Tindakan ini akan mengembalikan semua foto ke data default. Semua foto tambahan Anda akan terhapus.' 
                      : 'Tindakan ini akan menghapus foto ini secara permanen dari galeri website.'}
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
                   onClick={deleteTargetId === 'RESET_GALLERY' ? async () => {
                     try {
                       setIsDeleting(true);
                       await galleryService.resetToDefault();
                       await fetchImages();
                       setDeleteTargetId(null);
                     } catch(err:any) { setError(err.message); }
                     finally { setIsDeleting(false); }
                   } : confirmDelete}
                   disabled={isDeleting}
                   className="flex-1 py-4 bg-red-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-red-500 transition-all shadow-lg shadow-red-600/20 disabled:opacity-50"
                 >
                    {isDeleting ? 'PROSES...' : 'YA, LANJUT'}
                 </button>
              </div>
           </div>
        </div>
      )}
    </AdminLayout>

  );
}
