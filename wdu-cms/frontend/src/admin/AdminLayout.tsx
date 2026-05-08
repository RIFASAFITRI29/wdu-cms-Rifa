import { ReactNode, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useUser } from '../context/UserContext';
import { contactService } from '../services/contactService';
import { authService } from '../services/authService';
import toast from 'react-hot-toast';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { user } = useUser();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Welcome Toast - Only once per session
    const hasWelcomed = sessionStorage.getItem('hasWelcomed');
    
    if (!hasWelcomed) {
      toast.success(`Selamat datang, ${user.name}!`, {
        id: 'welcome-toast',
        style: {
          borderRadius: '1.5rem',
          background: theme === 'dark' ? '#18181b' : '#fff',
          color: theme === 'dark' ? '#fff' : '#000',
          border: theme === 'dark' ? '1px solid #27272a' : '1px solid #f3f4f6',
          fontWeight: 'bold',
          fontSize: '12px',
          padding: '16px 24px'
        },
        iconTheme: {
          primary: '#22c55e',
          secondary: '#fff',
        },
      });
      sessionStorage.setItem('hasWelcomed', 'true');
    }
  }, [user.name, theme]); // Added dependencies for correct theme/user rendering if it changes

  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const { data } = await contactService.getAll();
        const count = data.filter(m => !m.isRead).length;
        
        // Show notification if there are NEW unread messages
        if (count > unreadCount && unreadCount !== 0) {
          toast('Anda memiliki pesan masuk baru!', {
            icon: '📩',
            style: {
              borderRadius: '1.5rem',
              background: '#22c55e',
              color: '#fff',
              fontWeight: 'bold',
              fontSize: '12px',
              padding: '16px 24px'
            }
          });
        }
        
        setUnreadCount(count);
      } catch (error) {
        console.error('Failed to fetch unread count', error);
      }
    };
    fetchUnread();
    
    // Listen for manual refresh events
    window.addEventListener('refreshUnread', fetchUnread);
    
    // Refresh every 30 seconds for real-time feel
    const interval = setInterval(fetchUnread, 30000);
    return () => {
      clearInterval(interval);
      window.removeEventListener('refreshUnread', fetchUnread);
    };
  }, [location.pathname]); // Re-fetch on navigation

  const allNavItems = [
    { 
      name: 'Dashboard', 
      path: '/admin/dashboard', 
      icon: 'dashboard' 
    },
    { name: 'Manajemen Halaman', path: '/admin/pages', icon: 'description' },
    { name: 'Manajemen Layanan', path: '/admin/services', icon: 'settings_suggest' },
    { name: 'Manajemen Pengalaman', path: '/admin/experience', icon: 'inventory_2' },
    { name: 'Manajemen Klien', path: '/admin/clients', icon: 'business_center' },
    { name: 'Manajemen Galeri', path: '/admin/gallery', icon: 'collections' },
    { name: 'Media Library', path: '/admin/media', icon: 'photo_library' },
    { name: 'Pesan Kontak', path: '/admin/contact', icon: 'mail' },
    { name: 'Pengaturan Situs', path: '/admin/config', icon: 'tune', requiresSuperAdmin: true },
    { name: 'Manajemen User', path: '/admin/users', icon: 'group', requiresSuperAdmin: true },
    { name: 'Profil Saya', path: '/admin/profile', icon: 'account_circle' },
  ];

  const isSuperAdmin = user.role === 'SUPER_ADMIN';
  const navItems = allNavItems.filter(item => !item.requiresSuperAdmin || isSuperAdmin);

  const initials = user.name.split(' ').map(n => n[0]).join('');

  return (
    <div className={`min-h-screen transition-colors duration-500 flex ${theme === 'dark' ? 'bg-zinc-950 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Sidebar */}
      <aside className={`w-56 border-r flex flex-col fixed h-full z-40 transition-colors duration-500 ${
        theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-gray-200'
      }`}>
        <div className="p-6">
          <Link to="/admin" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-white/10 p-2 flex items-center justify-center transition-all group-hover:scale-110 shadow-lg border border-white/5">
              <img src="https://wahanadata.co.id/img/wdu-ijo.png" alt="WDU Logo" className="w-full h-full object-contain" />
            </div>
            <div className="flex flex-col">
              <span className={`text-sm font-black tracking-tighter leading-none ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {isSuperAdmin ? 'ADMIN CMS' : 'EDITOR HUB'}
              </span>
              <span className={`text-[8px] font-black uppercase tracking-[0.3em] mt-1 ${theme === 'dark' ? 'text-primary' : 'text-green-600'}`}>
                Wahana Data Utama
              </span>
            </div>
          </Link>
        </div>
        <nav className="flex-1 px-4 py-4 space-y-8 overflow-y-auto custom-scrollbar">
          {/* Main Group */}
          <div>
            <p className="px-4 mb-4 text-[9px] font-black uppercase tracking-[0.3em] text-zinc-500">Ringkasan</p>
            <div className="space-y-1">
              {navItems.filter(i => ['Dashboard', 'Profil Saya'].includes(i.name)).map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${
                      isActive
                        ? theme === 'dark' ? 'bg-primary/20 text-primary font-bold shadow-[0_0_20px_rgba(21,128,61,0.1)]' : 'bg-green-50 text-green-700 font-bold'
                        : theme === 'dark' ? 'text-zinc-400 hover:bg-zinc-800 hover:text-primary' : 'text-gray-500 hover:bg-gray-50 hover:text-green-600'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                      isActive ? 'bg-primary text-zinc-950 shadow-lg' : 'bg-zinc-800/50 text-zinc-500 group-hover:bg-primary/20 group-hover:text-primary'
                    }`}>
                      <span className="material-symbols-outlined text-lg">{item.icon}</span>
                    </div>
                    <span className="text-xs font-bold">{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Content Group */}
          <div>
            <p className="px-4 mb-4 text-[9px] font-black uppercase tracking-[0.3em] text-zinc-500">Manajemen Konten</p>
            <div className="space-y-1">
              {navItems.filter(i => !['Dashboard', 'Profil Saya', 'Manajemen User', 'Pengaturan Situs'].includes(i.name)).map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all group ${
                      isActive
                        ? theme === 'dark' ? 'bg-primary/20 text-primary font-bold shadow-[0_0_20px_rgba(21,128,61,0.1)]' : 'bg-green-50 text-green-700 font-bold'
                        : theme === 'dark' ? 'text-zinc-400 hover:bg-zinc-800 hover:text-primary' : 'text-gray-500 hover:bg-gray-50 hover:text-green-600'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                      isActive ? 'bg-primary text-zinc-950 shadow-lg' : 'bg-zinc-800/50 text-zinc-500 group-hover:bg-primary/20 group-hover:text-primary'
                    }`}>
                      <span className="material-symbols-outlined text-lg">{item.icon}</span>
                    </div>
                    <span className="text-xs font-bold">{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* System Group (Only for Super Admin) */}
          {isSuperAdmin && (
            <div>
              <p className="px-4 mb-4 text-[9px] font-black uppercase tracking-[0.3em] text-zinc-500">Konfigurasi</p>
              <div className="space-y-1">
                {navItems.filter(i => ['Manajemen User', 'Pengaturan Situs'].includes(i.name)).map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all group ${
                        isActive
                          ? theme === 'dark' ? 'bg-primary/20 text-primary font-bold shadow-[0_0_20px_rgba(21,128,61,0.1)]' : 'bg-green-50 text-green-700 font-bold'
                          : theme === 'dark' ? 'text-zinc-400 hover:bg-zinc-800 hover:text-primary' : 'text-gray-500 hover:bg-gray-50 hover:text-green-600'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                        isActive ? 'bg-primary text-zinc-950 shadow-lg' : 'bg-zinc-800/50 text-zinc-500 group-hover:bg-primary/20 group-hover:text-primary'
                      }`}>
                        <span className="material-symbols-outlined text-lg">{item.icon}</span>
                      </div>
                      <span className="text-xs font-bold">{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </nav>
        <div className={`p-6 border-t space-y-4 ${theme === 'dark' ? 'border-zinc-800' : 'border-gray-100'}`}>
          <Link to="/" className={`flex items-center gap-2 text-xs font-bold transition-colors ${theme === 'dark' ? 'text-zinc-500 hover:text-primary' : 'text-gray-400 hover:text-green-600'}`}>
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Back to Website
          </Link>
          <button 
            onClick={() => authService.logout()}
            className={`w-full flex items-center gap-2 text-xs font-bold transition-colors ${theme === 'dark' ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-700'}`}
          >
            <span className="material-symbols-outlined text-sm">logout</span>
            Keluar / Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 ml-56 flex flex-col">
        {/* Header */}
        <header className={`h-16 border-b flex items-center justify-between px-6 sticky top-0 z-30 transition-colors duration-500 backdrop-blur-md ${
          theme === 'dark' ? 'bg-zinc-950/80 border-zinc-800' : 'bg-white/80 border-gray-100'
        }`}>
          <div className="flex items-center gap-4">
             <button 
               onClick={() => window.history.back()}
               className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all border ${
                 theme === 'dark' 
                   ? 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-primary' 
                   : 'bg-gray-50 text-gray-400 border-gray-100 hover:bg-green-50 hover:text-green-700'
               }`}
             >
                <span className="material-symbols-outlined text-xl">arrow_back</span>
             </button>
             <div>
                <h2 className={`font-black capitalize tracking-tight ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                   {location.pathname.split('/').pop() || 'Dashboard'}
                </h2>
                <div className="flex items-center gap-1">
                   <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Admin</span>
                   <span className="text-[9px] font-bold text-zinc-500">/</span>
                   <span className={`text-[9px] font-bold uppercase tracking-widest ${theme === 'dark' ? 'text-primary' : 'text-green-600'}`}>
                      {location.pathname.split('/').pop() || 'Dashboard'}
                   </span>
                </div>
             </div>
          </div>
          <div className="flex items-center gap-4">
             {/* Theme Toggle */}
             <button 
               onClick={toggleTheme}
               className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all ${
                 theme === 'dark' ? 'bg-zinc-900 text-amber-400 border border-zinc-800 hover:bg-zinc-800' : 'bg-gray-50 text-gray-500 border border-gray-100 hover:bg-gray-100'
               }`}
             >
                <span className="material-symbols-outlined">{theme === 'dark' ? 'light_mode' : 'dark_mode'}</span>
             </button>

             {/* Notifications */}
             <div className="relative group">
                <Link 
                  to="/admin/contact"
                  className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all relative ${
                    theme === 'dark' ? 'text-zinc-400 hover:bg-zinc-900 hover:text-primary' : 'text-gray-400 hover:bg-gray-50 hover:text-green-600'
                  }`}
                >
                   <span className="material-symbols-outlined">notifications</span>
                   {unreadCount > 0 && (
                      <span className="absolute top-2 right-2 w-4 h-4 bg-red-500 text-white text-[8px] font-black flex items-center justify-center rounded-full border-2 border-white dark:border-zinc-950 animate-bounce">
                         {unreadCount}
                      </span>
                   )}
                </Link>
                
                {/* Notification Tooltip/Dropdown Preview */}
                {unreadCount > 0 && (
                   <div className={`absolute right-0 mt-2 w-64 p-4 rounded-2xl border shadow-2xl opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 pointer-events-none group-hover:pointer-events-auto transition-all duration-300 z-50 ${
                     theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-gray-100'
                   }`}>
                      <p className={`text-[10px] font-black uppercase tracking-widest mb-3 ${theme === 'dark' ? 'text-zinc-500' : 'text-gray-400'}`}>Pesan Baru ({unreadCount})</p>
                      <div className="space-y-3">
                         <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center">
                               <span className="material-symbols-outlined text-sm">mail</span>
                            </div>
                            <p className="text-[10px] font-bold leading-tight">Anda memiliki {unreadCount} pesan yang belum dibaca di Inbox.</p>
                         </div>
                         <Link to="/admin/contact" className="block text-center py-2 rounded-lg bg-primary/10 text-primary text-[9px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all">Lihat Semua</Link>
                      </div>
                   </div>
                )}
             </div>

             <div className={`h-8 w-px mx-2 ${theme === 'dark' ? 'bg-zinc-800' : 'bg-gray-100'}`}></div>
             <Link to="/admin/profile" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                <div className="text-right hidden sm:block">
                   <p className={`text-xs font-black leading-none ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{user.name}</p>
                   <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mt-1">{user.role}</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-green-800 flex items-center justify-center text-white text-sm font-black shadow-lg overflow-hidden">
                   {user.avatar ? (
                      <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                   ) : (
                      initials
                   )}
                </div>
             </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
