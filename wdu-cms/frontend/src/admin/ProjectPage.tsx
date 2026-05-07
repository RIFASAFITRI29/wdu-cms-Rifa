import { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import { projectService, Project } from '../services/projectService';
import { useTheme } from '../context/ThemeContext';

export default function ProjectPage() {
  const { theme } = useTheme();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState<Partial<Project>>({
    title: '', client: '', category: '', year: new Date().getFullYear(), description: '', isHighlight: false, order: 0
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      const { data } = await projectService.getAll();
      setProjects(data);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = (project: Project | null = null) => {
    if (project) {
      setEditingProject(project);
      setFormData(project);
    } else {
      setEditingProject(null);
      setFormData({
        title: '', client: '', category: '', year: new Date().getFullYear(), description: '', isHighlight: false, order: projects.length + 1
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProject(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProject) {
        await projectService.update(editingProject.id, formData);
      } else {
        await projectService.create(formData);
      }
      fetchProjects();
      handleCloseModal();
      alert('Perubahan berhasil disimpan!');
    } catch (error) {
      console.error('Failed to save project:', error);
      fetchProjects();
      handleCloseModal();
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Hapus project ini?')) {
      try {
        await projectService.delete(id);
        fetchProjects();
      } catch (error) {
        console.error('Failed to delete project:', error);
        fetchProjects();
      }
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8 max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
           <div>
              <h1 className={`text-3xl font-black tracking-tight ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Project Management</h1>
              <p className={`text-sm font-medium mt-1 ${theme === 'dark' ? 'text-zinc-500' : 'text-gray-500'}`}>Kelola portofolio dan hasil kolaborasi Wahana Data Utama.</p>
           </div>
           <button 
             onClick={() => handleOpenModal()}
             className="bg-primary text-white dark:text-zinc-950 px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-green-700 transition-all shadow-lg active:scale-95"
           >
             <span className="material-symbols-outlined text-lg">add</span>
             Project Baru
           </button>
        </div>

        <div className={`rounded-2xl border overflow-hidden transition-all duration-500 ${
          theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-gray-100 shadow-sm'
        }`}>
           <div className="overflow-x-auto">
              <table className="w-full text-left">
                 <thead>
                    <tr className={`border-b ${theme === 'dark' ? 'bg-zinc-800/50 border-zinc-800' : 'bg-gray-50 border-gray-100'}`}>
                       <th className={`px-8 py-5 text-[10px] font-black uppercase tracking-widest ${theme === 'dark' ? 'text-zinc-500' : 'text-gray-400'}`}>Informasi Project</th>
                       <th className={`px-8 py-5 text-[10px] font-black uppercase tracking-widest ${theme === 'dark' ? 'text-zinc-500' : 'text-gray-400'}`}>Klien & Tahun</th>
                       <th className={`px-8 py-5 text-[10px] font-black uppercase tracking-widest text-center ${theme === 'dark' ? 'text-zinc-500' : 'text-gray-400'}`}>Status</th>
                       <th className={`px-8 py-5 text-[10px] font-black uppercase tracking-widest text-right ${theme === 'dark' ? 'text-zinc-500' : 'text-gray-400'}`}>Aksi</th>
                    </tr>
                 </thead>
                 <tbody className={`divide-y ${theme === 'dark' ? 'divide-zinc-800' : 'divide-gray-50'}`}>
                    {isLoading ? (
                      <tr><td colSpan={4} className="text-center py-20 text-zinc-500 font-bold uppercase tracking-widest text-xs">Menyelaraskan data...</td></tr>
                    ) : projects.length === 0 ? (
                      <tr><td colSpan={4} className="text-center py-20 text-zinc-500 font-bold uppercase tracking-widest text-xs">Belum ada project</td></tr>
                    ) : projects.map(project => (
                      <tr key={project.id} className={`transition-colors ${theme === 'dark' ? 'hover:bg-zinc-800/50' : 'hover:bg-gray-50/50'}`}>
                         <td className="px-8 py-5">
                            <div>
                               <p className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{project.title}</p>
                               <p className={`text-[10px] font-black uppercase tracking-widest mt-0.5 ${theme === 'dark' ? 'text-primary' : 'text-green-600'}`}>{project.category}</p>
                            </div>
                         </td>
                         <td className="px-8 py-5">
                            <p className={`text-sm font-bold ${theme === 'dark' ? 'text-zinc-300' : 'text-gray-700'}`}>{project.client}</p>
                            <p className="text-xs text-zinc-500 mt-0.5 font-medium">{project.year}</p>
                         </td>
                         <td className="px-8 py-5 text-center">
                            {project.isHighlight && (
                               <span className={`px-2 py-1 rounded text-[9px] font-black uppercase tracking-widest border ${
                                 theme === 'dark' ? 'bg-primary/10 text-primary border-primary/20' : 'bg-amber-50 text-amber-700 border-amber-100'
                               }`}>Highlight</span>
                            )}
                         </td>
                         <td className="px-8 py-5 text-right">
                            <div className="flex justify-end gap-2">
                               <button 
                                 onClick={() => handleOpenModal(project)} 
                                 className={`p-2 rounded-xl transition-all ${
                                   theme === 'dark' ? 'text-primary hover:bg-primary/10' : 'text-blue-600 hover:bg-blue-50'
                                 }`}
                               >
                                 <span className="material-symbols-outlined text-xl">edit</span>
                               </button>
                               <button 
                                 onClick={() => handleDelete(project.id)} 
                                 className={`p-2 rounded-xl transition-all ${
                                   theme === 'dark' ? 'text-zinc-500 hover:text-red-500 hover:bg-red-500/10' : 'text-red-600 hover:bg-red-50'
                                 }`}
                               >
                                 <span className="material-symbols-outlined text-xl">delete</span>
                               </button>
                            </div>
                         </td>
                      </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <div className={`rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden reveal-up ${
            theme === 'dark' ? 'bg-zinc-900 border border-zinc-800' : 'bg-white'
          }`}>
            <div className={`px-8 py-6 border-b flex justify-between items-center ${
              theme === 'dark' ? 'bg-zinc-800/50 border-zinc-800' : 'bg-gray-50/50 border-gray-50'
            }`}>
              <h3 className={`font-black uppercase tracking-tight ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{editingProject ? 'Edit Project' : 'Project Baru'}</h3>
              <button onClick={handleCloseModal} className="text-zinc-500 hover:text-zinc-300 transition-colors"><span className="material-symbols-outlined">close</span></button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="space-y-1">
                 <label className={`text-[10px] font-black uppercase tracking-widest ${theme === 'dark' ? 'text-zinc-500' : 'text-gray-400'}`}>Judul Project</label>
                 <input 
                   required
                   className={`w-full px-4 py-3 rounded-xl outline-none transition-all text-sm font-medium ${
                     theme === 'dark' ? 'bg-zinc-950 border border-zinc-800 focus:border-primary text-white' : 'bg-gray-50 border border-gray-100 focus:bg-white focus:border-green-500'
                   }`}
                   value={formData.title}
                   onChange={e => setFormData({...formData, title: e.target.value})}
                 />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className={`text-[10px] font-black uppercase tracking-widest ${theme === 'dark' ? 'text-zinc-500' : 'text-gray-400'}`}>Klien</label>
                  <input 
                    required
                    className={`w-full px-4 py-3 rounded-xl outline-none transition-all text-sm font-medium ${
                      theme === 'dark' ? 'bg-zinc-950 border border-zinc-800 focus:border-primary text-white' : 'bg-gray-50 border border-gray-100 focus:bg-white focus:border-green-500'
                    }`}
                    value={formData.client}
                    onChange={e => setFormData({...formData, client: e.target.value})}
                  />
                </div>
                <div className="space-y-1">
                  <label className={`text-[10px] font-black uppercase tracking-widest ${theme === 'dark' ? 'text-zinc-500' : 'text-gray-400'}`}>Tahun</label>
                  <input 
                    type="number"
                    required
                    className={`w-full px-4 py-3 rounded-xl outline-none transition-all text-sm font-medium ${
                      theme === 'dark' ? 'bg-zinc-950 border border-zinc-800 focus:border-primary text-white' : 'bg-gray-50 border border-gray-100 focus:bg-white focus:border-green-500'
                    }`}
                    value={formData.year}
                    onChange={e => setFormData({...formData, year: parseInt(e.target.value)})}
                  />
                </div>
              </div>
              <div className="space-y-1">
                 <label className={`text-[10px] font-black uppercase tracking-widest ${theme === 'dark' ? 'text-zinc-500' : 'text-gray-400'}`}>Kategori</label>
                 <input 
                   required
                   className={`w-full px-4 py-3 rounded-xl outline-none transition-all text-sm font-medium ${
                     theme === 'dark' ? 'bg-zinc-950 border border-zinc-800 focus:border-primary text-white' : 'bg-gray-50 border border-gray-100 focus:bg-white focus:border-green-500'
                   }`}
                   value={formData.category}
                   onChange={e => setFormData({...formData, category: e.target.value})}
                 />
              </div>
              <div className="flex items-center gap-3 py-2">
                 <input 
                   type="checkbox"
                   id="isHighlight"
                   checked={formData.isHighlight}
                   onChange={e => setFormData({...formData, isHighlight: e.target.checked})}
                   className={`w-5 h-5 rounded-lg border-none transition-all ${theme === 'dark' ? 'bg-zinc-800 accent-primary' : 'bg-gray-100 accent-green-600'}`}
                 />
                 <label htmlFor="isHighlight" className={`text-sm font-bold ${theme === 'dark' ? 'text-zinc-400' : 'text-gray-600'}`}>Tampilkan sebagai Highlight</label>
              </div>
              <div className="pt-4 flex justify-end gap-4">
                 <button type="button" onClick={handleCloseModal} className="px-6 py-3 text-xs font-black uppercase text-zinc-500 hover:text-zinc-300 tracking-widest">Batal</button>
                 <button type="submit" className="px-8 py-3 bg-primary text-white dark:text-zinc-950 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-green-700 transition-all shadow-lg">Simpan Perubahan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
