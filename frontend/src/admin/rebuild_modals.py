
import re

path = r'c:\Users\Rifa Safitri\Downloads\rifa (pkl)\wdu-cms\frontend\src\admin\PagesManagementPage.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# The mess starts inside the Create New Page Modal form
# We need to replace the content of that form with the correct fields (title and slug)
# and then correctly place the editingPage modal.

create_modal_pattern = r'\{isCreateModalOpen && \(.*?<\/form>\s+<\/div>\s+<\/div>\s+\)}'

# We also need to find where the editingPage modal SHOULD BE.
# Usually it's after the Create Modal.

# Let's rebuild the modal section from line 339 to the end of the file.
# The end of the file currently starts with the broken Create Modal and then continues into more mess.

# Looking at the file content:
# Line 340: isCreateModalOpen starts
# Line 352: form starts
# Line 353: the mess starts

# Let's find the end of the broken form.
# The broken form seems to contain a lot of nested divs and the ternary.
# It ends with </div> </form> </div> </div>

# Actually, the simplest way is to replace from line 339 to line 759 with the correct logic.

correct_modals = '''
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
                  onChange={(e) => setNewPageData({...newPageData, title: e.target.value, slug: e.target.value.toLowerCase().replace(/\\s+/g, '-')})}
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
                     onChange={(e) => setNewPageData({...newPageData, slug: e.target.value.toLowerCase().replace(/\\s+/g, '-')})}
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
                         {editingPage.slug === 'home' ? 'home_app_logo' : editingPage.slug === 'contact' ? 'contact_mail' : 'article'}
                       </span>
                       <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
                         {editingPage.slug === 'home' ? 'PENGATURAN HERO & TENTANG KAMI' : editingPage.slug === 'contact' ? 'INFORMASI KONTAK PERUSAHAAN' : 'KONTEN UTAMA HALAMAN'}
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
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                                         <img src={dir.image} className="w-full h-full object-cover" />
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
                    ) : editingPage.slug === 'contact' ? (
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
                   onClick={() => window.open(editingPage.slug === 'home' ? '/' : `/${editingPage.slug}`, '_blank')}
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
'''

# The Delete Modal starts around line 761.
delete_modal = '''
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
'''

# Find everything from line 339 to line 794
# and replace it with correct_modals + delete_modal

# Let's find the position of the modals start
start_pos = content.find('{/* Create New Page Modal */}')
end_pos = content.find('    </AdminLayout>')

if start_pos != -1 and end_pos != -1:
    new_content = content[:start_pos] + correct_modals + delete_modal + content[end_pos:]
    with open(path, 'w', encoding='utf-8') as f:
        f.write(new_content)
else:
    print("Could not find positions")
