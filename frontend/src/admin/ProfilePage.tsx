import * as React from 'react';
import AdminLayout from './AdminLayout';
import { useTheme } from '../context/ThemeContext';
import { useUser } from '../context/UserContext';

export default function ProfilePage() {
  const { theme } = useTheme();
  const { user, updateUser } = useUser();
  const [isSaving, setIsSaving] = React.useState(false);
  const [showSuccess, setShowSuccess] = React.useState(false);
  
  const [formData, setFormData] = React.useState({
    name: user.name,
    email: user.email,
    newPassword: '',
    confirmPassword: ''
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      alert('Konfirmasi password tidak cocok.');
      return;
    }

    try {
      setIsSaving(true);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      updateUser({
        name: formData.name,
        email: formData.email
      });
      
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      setFormData(prev => ({ ...prev, newPassword: '', confirmPassword: '' }));
    } catch (error) {
      alert('Gagal memperbarui profil.');
    } finally {
      setIsSaving(false);
    }
  };

  const initials = formData.name
    ? formData.name.split(' ').filter(Boolean).map(n => n[0]).join('').toUpperCase()
    : 'A';

  return (
    <AdminLayout>
      <div className="space-y-12 max-w-7xl mx-auto pb-20">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
           <div className="reveal-up">
              <h1 className={`text-4xl md:text-5xl font-black tracking-tight ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Profil Saya</h1>
              <p className={`text-sm font-bold mt-2 uppercase tracking-[0.3em] ${theme === 'dark' ? 'text-primary' : 'text-green-600'}`}>Pengaturan Keamanan & Akun</p>
           </div>
           
           {showSuccess && (
              <div className="animate-fade-in bg-green-500/10 border border-green-500/20 text-green-500 px-6 py-3 rounded-2xl flex items-center gap-3">
                 <span className="material-symbols-outlined text-lg">check_circle</span>
                 <span className="text-xs font-black uppercase tracking-widest">Profil Berhasil Disimpan</span>
              </div>
           )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
           {/* Sidebar Profile Card */}
           <div className="lg:col-span-1 space-y-8">
              <div className={`p-10 rounded-[3rem] border flex flex-col items-center text-center transition-all duration-500 ${
                theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-gray-100 shadow-xl'
              }`}>
                 <div className={`w-32 h-32 rounded-[2.5rem] flex items-center justify-center text-4xl font-black mb-8 shadow-2xl relative group overflow-hidden ${
                   theme === 'dark' ? 'bg-zinc-800 text-primary' : 'bg-green-600 text-white'
                 }`}>
                    {initials}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                       <span className="material-symbols-outlined text-white">photo_camera</span>
                    </div>
                 </div>
                 <h3 className={`text-2xl font-black mb-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{user.name}</h3>
                 <p className="text-xs font-black uppercase tracking-widest text-zinc-500 mb-6">{user.role}</p>
                 <div className={`w-full h-px mb-6 ${theme === 'dark' ? 'bg-zinc-800' : 'bg-gray-50'}`} />
                 <p className={`text-sm font-medium ${theme === 'dark' ? 'text-zinc-400' : 'text-gray-600'}`}>Terakhir login: Hari ini, 10:42</p>
              </div>

              <div className={`p-8 rounded-[2rem] border ${theme === 'dark' ? 'bg-amber-500/5 border-amber-500/10' : 'bg-amber-50 border-amber-100'}`}>
                 <div className="flex gap-4 items-start">
                    <span className="material-symbols-outlined text-amber-500">verified_user</span>
                    <div>
                       <p className={`text-xs font-black uppercase tracking-widest ${theme === 'dark' ? 'text-amber-500' : 'text-amber-900'}`}>Keamanan Akun</p>
                       <p className={`text-xs mt-2 font-medium leading-relaxed ${theme === 'dark' ? 'text-zinc-500' : 'text-amber-800/70'}`}>Pastikan password Anda memiliki minimal 8 karakter dengan kombinasi angka dan simbol.</p>
                    </div>
                 </div>
              </div>
           </div>

           {/* Main Form Area */}
           <form onSubmit={handleSave} className={`lg:col-span-2 rounded-[3rem] border overflow-hidden p-10 md:p-16 space-y-12 ${
             theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-gray-100 shadow-xl'
           }`}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                 <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 ml-1">Nama Lengkap</label>
                    <input 
                      type="text"
                      required
                      className={`w-full px-8 py-5 rounded-3xl outline-none border transition-all font-bold ${
                        theme === 'dark' ? 'bg-zinc-950 border-zinc-800 focus:border-primary text-white' : 'bg-gray-50 border-gray-100 focus:bg-white focus:border-green-500'
                      }`}
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                    />
                 </div>
                 <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 ml-1">Email Administrator</label>
                    <input 
                      type="email"
                      required
                      className={`w-full px-8 py-5 rounded-3xl outline-none border transition-all font-bold ${
                        theme === 'dark' ? 'bg-zinc-950 border-zinc-800 focus:border-primary text-white' : 'bg-gray-50 border-gray-100 focus:border-green-500'
                      }`}
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                    />
                 </div>
              </div>

              <div className={`w-full h-px ${theme === 'dark' ? 'bg-zinc-800' : 'bg-gray-50'}`} />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                   <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 ml-1">Password Baru</label>
                      <input 
                        type="password"
                        className={`w-full px-8 py-5 rounded-3xl outline-none border transition-all font-bold ${
                          theme === 'dark' ? 'bg-zinc-950 border-zinc-800 focus:border-primary text-white' : 'bg-gray-50 border-gray-100 focus:border-green-500'
                        }`}
                        placeholder="••••••••"
                        value={formData.newPassword}
                        onChange={e => setFormData({...formData, newPassword: e.target.value})}
                      />
                   </div>
                   <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 ml-1">Konfirmasi Password</label>
                      <input 
                        type="password"
                        className={`w-full px-8 py-5 rounded-3xl outline-none border transition-all font-bold ${
                          theme === 'dark' ? 'bg-zinc-950 border-zinc-800 focus:border-primary text-white' : 'bg-gray-50 border-gray-100 focus:border-green-500'
                        }`}
                        placeholder="••••••••"
                        value={formData.confirmPassword}
                        onChange={e => setFormData({...formData, confirmPassword: e.target.value})}
                      />
                   </div>
                </div>

                {(user.role === 'SUPER_ADMIN') && (
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 ml-1">Role (Simulasi Hak Akses)</label>
                    <select 
                      className={`w-full px-8 py-5 rounded-3xl outline-none border transition-all font-bold appearance-none cursor-pointer ${
                        theme === 'dark' ? 'bg-zinc-950 border-zinc-800 focus:border-primary text-white' : 'bg-gray-50 border-gray-100 focus:bg-white focus:border-green-500'
                      }`}
                      value={user.role}
                      onChange={e => updateUser({ role: e.target.value })}
                    >
                        <option value="SUPER_ADMIN">SUPER_ADMIN (Kuasa Penuh)</option>
                        <option value="EDITOR">EDITOR (Hanya Konten)</option>
                    </select>
                    <p className="text-[10px] text-zinc-500 italic ml-2">* Ganti Role untuk mengetes pembatasan menu Admin (Editor vs Super Admin).</p>
                  </div>
                )}

              <div className="pt-8 flex flex-col md:flex-row gap-6">
                 <button 
                   type="submit"
                   disabled={isSaving}
                   className="flex-[2] py-6 bg-primary text-zinc-950 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] hover:bg-green-400 transition-all shadow-[0_20px_40px_rgba(21,128,61,0.2)] active:scale-95 disabled:opacity-50"
                 >
                    {isSaving ? 'MEMPROSES...' : 'PERBARUI PROFIL'}
                 </button>
                 <button 
                   type="button"
                   onClick={() => setFormData({ name: user.name, email: user.email, newPassword: '', confirmPassword: '' })}
                   className={`flex-1 py-6 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] transition-all border ${
                     theme === 'dark' ? 'border-zinc-800 text-zinc-500 hover:bg-zinc-800' : 'border-gray-100 text-gray-400 hover:bg-gray-50'
                   }`}
                 >
                    BATAL
                 </button>
              </div>
           </form>
        </div>
      </div>
    </AdminLayout>
  );
}
