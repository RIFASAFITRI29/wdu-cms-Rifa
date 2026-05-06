import * as React from 'react';
import AdminLayout from './AdminLayout';
import { authService } from '../services/authService';
import { useTheme } from '../context/ThemeContext';
import { useUser } from '../context/UserContext';

export default function SettingsPage() {
  const { theme } = useTheme();
  const { user, updateUser } = useUser();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const [passwordData, setPasswordData] = React.useState({
    current: '',
    new: '',
    confirm: ''
  });

  const [isSavingProfile, setIsSavingProfile] = React.useState(false);
  const [isSavingPassword, setIsSavingPassword] = React.useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    // In real app, call API here
    setTimeout(() => {
      setIsSavingProfile(false);
      alert('Profil berhasil diperbarui!');
    }, 1000);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateUser({ avatar: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.new !== passwordData.confirm) {
      alert('Password baru dan konfirmasi tidak cocok!');
      return;
    }
    setIsSavingPassword(true);
    setTimeout(() => {
      setIsSavingPassword(false);
      setPasswordData({ current: '', new: '', confirm: '' });
      alert('Password berhasil diubah!');
    }, 1000);
  };

  const handleLogout = () => {
    if (window.confirm('Apakah Anda yakin ingin keluar dari sistem?')) {
      authService.logout();
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-5xl space-y-10 pb-20 mx-auto">
        <div>
          <h1 className={`text-3xl font-black tracking-tight ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Pengaturan Akun</h1>
          <p className={`text-sm font-medium mt-1 ${theme === 'dark' ? 'text-zinc-500' : 'text-gray-500'}`}>Kelola profil pribadi dan keamanan akun admin Anda.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
           {/* Sidebar Info */}
           <div className="md:col-span-1 space-y-8">
              <div className={`p-10 rounded-[2rem] border flex flex-col items-center text-center space-y-6 transition-all duration-500 ${
                theme === 'dark' ? 'bg-zinc-900 border-zinc-800 shadow-none' : 'bg-white border-gray-100 shadow-sm'
              }`}>
                 <div className="relative group">
                    <div className="w-32 h-32 rounded-[2rem] flex items-center justify-center text-white text-3xl font-black shadow-2xl group-hover:scale-105 transition-transform rotate-3 group-hover:rotate-0 duration-500 overflow-hidden bg-green-800">
                       {user.avatar ? (
                          <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                       ) : (
                          user.name.split(' ').map(n => n[0]).join('')
                       )}
                    </div>
                    <button 
                      onClick={triggerFileSelect}
                      className={`absolute -bottom-2 -right-2 w-12 h-12 rounded-2xl shadow-xl flex items-center justify-center transition-all z-10 ${
                        theme === 'dark' ? 'bg-zinc-800 text-primary border border-zinc-700 hover:bg-zinc-700' : 'bg-white text-green-600 border border-gray-100 hover:bg-gray-50'
                      }`}
                    >
                       <span className="material-symbols-outlined text-xl">photo_camera</span>
                    </button>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      className="hidden" 
                      accept="image/*" 
                      onChange={handleAvatarChange} 
                    />
                 </div>
                 <div>
                    <h3 className={`font-black text-xl ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{user.name}</h3>
                    <p className={`text-[10px] font-black uppercase tracking-[0.2em] mt-2 ${theme === 'dark' ? 'text-primary' : 'text-zinc-500'}`}>{user.role}</p>
                 </div>
                 <div className={`pt-8 w-full border-t ${theme === 'dark' ? 'border-zinc-800' : 'border-gray-50'}`}>
                    <button 
                      onClick={handleLogout}
                      className={`w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                        theme === 'dark' ? 'bg-zinc-950 text-red-400 border border-zinc-800 hover:bg-red-500/10' : 'bg-red-50 text-red-600 hover:bg-red-600 hover:text-white'
                      }`}
                    >
                       Keluar Sistem
                    </button>
                 </div>
              </div>

              <div className={`p-8 rounded-[2rem] border space-y-3 transition-all duration-500 ${
                theme === 'dark' ? 'bg-amber-900/5 border-amber-900/10' : 'bg-amber-50/50 border-amber-100'
              }`}>
                 <div className="flex items-center gap-2 text-amber-600">
                    <span className="material-symbols-outlined text-lg">info</span>
                    <span className="text-[10px] font-black uppercase tracking-widest">Pusat Keamanan</span>
                 </div>
                 <p className={`text-xs leading-relaxed font-medium ${theme === 'dark' ? 'text-zinc-500' : 'text-amber-900/60'}`}>Jangan bagikan password Anda kepada siapapun. Gunakan minimal 8 karakter dengan kombinasi angka dan simbol.</p>
              </div>
           </div>

           {/* Main Content */}
           <div className="md:col-span-2 space-y-10">
              {/* Profile Form */}
              <div className={`p-10 rounded-[2rem] border transition-all duration-500 ${
                theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-gray-100 shadow-sm'
              }`}>
                 <h3 className={`font-black text-lg mb-8 pb-4 border-b ${theme === 'dark' ? 'text-white border-zinc-800' : 'text-gray-900 border-gray-50'}`}>Profil Pribadi</h3>
                 <form onSubmit={handleSaveProfile} className="space-y-6">
                    <div className="space-y-1">
                       <label className={`text-[10px] font-black uppercase tracking-widest ml-1 ${theme === 'dark' ? 'text-zinc-500' : 'text-gray-400'}`}>Nama Lengkap</label>
                       <input 
                         className={`w-full px-4 py-3 rounded-xl outline-none transition-all text-sm font-medium ${
                           theme === 'dark' ? 'bg-zinc-950 border border-zinc-800 focus:border-primary text-white' : 'bg-gray-50 border border-gray-100 focus:bg-white focus:border-green-500'
                         }`}
                         value={user.name}
                         onChange={e => updateUser({ name: e.target.value })}
                       />
                    </div>
                    <div className="space-y-1">
                       <label className={`text-[10px] font-black uppercase tracking-widest ml-1 ${theme === 'dark' ? 'text-zinc-500' : 'text-gray-400'}`}>Alamat Email</label>
                       <input 
                         className={`w-full px-4 py-3 rounded-xl outline-none transition-all text-sm font-medium ${
                           theme === 'dark' ? 'bg-zinc-950 border border-zinc-800 focus:border-primary text-white' : 'bg-gray-50 border border-gray-100 focus:bg-white focus:border-green-500'
                         }`}
                         value={user.email}
                         onChange={e => updateUser({ email: e.target.value })}
                       />
                    </div>
                    <div className="pt-4 flex justify-end">
                       <button 
                         type="submit" 
                         disabled={isSavingProfile}
                         className="bg-primary text-white dark:text-zinc-950 px-10 py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-green-700 shadow-lg active:scale-95 transition-all disabled:opacity-50"
                       >
                          {isSavingProfile ? 'Menyimpan...' : 'Perbarui Profil'}
                       </button>
                    </div>
                 </form>
              </div>

              {/* Security Form */}
              <div className={`p-10 rounded-[2rem] border transition-all duration-500 ${
                theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-gray-100 shadow-sm'
              }`}>
                 <h3 className={`font-black text-lg mb-8 pb-4 border-b ${theme === 'dark' ? 'text-white border-zinc-800' : 'text-gray-900 border-gray-50'}`}>Ganti Password</h3>
                 <form onSubmit={handleSavePassword} className="space-y-6">
                    <div className="space-y-1">
                       <label className={`text-[10px] font-black uppercase tracking-widest ml-1 ${theme === 'dark' ? 'text-zinc-500' : 'text-gray-400'}`}>Password Sekarang</label>
                       <input 
                         type="password"
                         className={`w-full px-4 py-3 rounded-xl outline-none transition-all text-sm font-medium ${
                           theme === 'dark' ? 'bg-zinc-950 border border-zinc-800 focus:border-primary text-white' : 'bg-gray-50 border border-gray-100 focus:bg-white focus:border-green-500'
                         }`}
                         placeholder="••••••••"
                         value={passwordData.current}
                         onChange={e => setPasswordData({...passwordData, current: e.target.value})}
                       />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div className="space-y-1">
                          <label className={`text-[10px] font-black uppercase tracking-widest ml-1 ${theme === 'dark' ? 'text-zinc-500' : 'text-gray-400'}`}>Password Baru</label>
                          <input 
                            type="password"
                            className={`w-full px-4 py-3 rounded-xl outline-none transition-all text-sm font-medium ${
                              theme === 'dark' ? 'bg-zinc-950 border border-zinc-800 focus:border-primary text-white' : 'bg-gray-50 border border-gray-100 focus:bg-white focus:border-green-500'
                            }`}
                            placeholder="••••••••"
                            value={passwordData.new}
                            onChange={e => setPasswordData({...passwordData, new: e.target.value})}
                          />
                       </div>
                       <div className="space-y-1">
                          <label className={`text-[10px] font-black uppercase tracking-widest ml-1 ${theme === 'dark' ? 'text-zinc-500' : 'text-gray-400'}`}>Konfirmasi Password</label>
                          <input 
                            type="password"
                            className={`w-full px-4 py-3 rounded-xl outline-none transition-all text-sm font-medium ${
                              theme === 'dark' ? 'bg-zinc-950 border border-zinc-800 focus:border-primary text-white' : 'bg-gray-50 border border-gray-100 focus:bg-white focus:border-green-500'
                            }`}
                            placeholder="••••••••"
                            value={passwordData.confirm}
                            onChange={e => setPasswordData({...passwordData, confirm: e.target.value})}
                          />
                       </div>
                    </div>
                    <div className="pt-4 flex justify-end">
                       <button 
                         type="submit" 
                         disabled={isSavingPassword}
                         className={`px-10 py-4 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg transition-all active:scale-95 disabled:opacity-50 ${
                           theme === 'dark' ? 'bg-zinc-950 text-white border border-zinc-800 hover:bg-zinc-800' : 'bg-gray-800 text-white hover:bg-black'
                         }`}
                       >
                          {isSavingPassword ? 'Memproses...' : 'Ubah Password'}
                       </button>
                    </div>
                 </form>
              </div>
           </div>
        </div>
      </div>
    </AdminLayout>
  );
}
