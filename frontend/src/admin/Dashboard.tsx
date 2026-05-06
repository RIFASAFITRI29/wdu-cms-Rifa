import * as React from 'react';
import AdminLayout from './AdminLayout';
import { useNavigate } from 'react-router-dom';
import { contactService } from '../services/contactService';
import { experiencePartnerService } from '../services/experiencePartnerService';
import { serviceDataService } from '../services/serviceDataService';
import { mediaService } from '../services/mediaService';
import { useTheme } from '../context/ThemeContext';
import { useUser } from '../context/UserContext';

export default function AdminDashboard() {
  const { theme } = useTheme();
  const { user } = useUser();
  const navigate = useNavigate();
  
  const [stats, setStats] = React.useState([
    { label: 'Total Project', value: '0', icon: 'inventory_2', color: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400', trend: '...', path: '/admin/experience' },
    { label: 'Layanan Aktif', value: '0', icon: 'settings_suggest', color: 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400', trend: '...', path: '/admin/services' },
    { label: 'Pesan Belum Dibaca', value: '0', icon: 'mail', color: 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400', trend: '...', path: '/admin/contact' },
    { label: 'Aset Media', value: '0', icon: 'photo_library', color: 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400', trend: 'Repository', path: '/admin/media' },
  ]);

  const [partnerStats, setPartnerStats] = React.useState<{year: string, count: number}[]>([]);
  const [messageStats, setMessageStats] = React.useState({ read: 0, unread: 0, total: 0 });
  const [recentMedia, setRecentMedia] = React.useState<any[]>([]);
  const [auditLogs, setAuditLogs] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const [experienceRes, servicesRes, messagesRes, mediaRes] = await Promise.all([
        experiencePartnerService.getAll(),
        serviceDataService.getAll(),
        contactService.getAll(),
        mediaService.getAll()
      ]);

      const partners = (experienceRes?.data || []) as any[];
      const servicesList = (servicesRes?.data || []) as any[];
      const messagesList = (messagesRes?.data || []) as any[];
      const mediaList = (mediaRes?.data || []) as any[];
      
      const unreadCount = messagesList.filter(m => m && m.isRead === false).length;
      const readCount = messagesList.length - unreadCount;
      const activeServices = servicesList.filter(s => s && s.isActive === true).length;

      setStats([
        { 
          label: 'Total Project', 
          value: partners.length.toString(), 
          icon: 'inventory_2', 
          color: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400', 
          trend: partners.length > 0 ? 'Tersinkron' : 'Kosong', 
          path: '/admin/experience' 
        },
        { 
          label: 'Layanan Aktif', 
          value: activeServices.toString(), 
          icon: 'settings_suggest', 
          color: 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400', 
          trend: `${servicesList.length} Total`, 
          path: '/admin/services' 
        },
        { 
          label: 'Pesan Belum Dibaca', 
          value: unreadCount.toString(), 
          icon: 'mail', 
          color: 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400', 
          trend: messagesList.length.toString() + ' Total', 
          path: '/admin/contact' 
        },
        { 
          label: 'Aset Media', 
          value: mediaList.length.toString(), 
          icon: 'photo_library', 
          color: 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400', 
          trend: 'Repository', 
          path: '/admin/media' 
        },
      ]);

      // Calculate Partner Stats for Chart (Ensuring 2020-2024 range)
      const targetYears = ['2020', '2021', '2022', '2023', '2024'];
      const yearCounts: Record<string, number> = {};
      
      // Initialize with zeros
      targetYears.forEach(y => yearCounts[y] = 0);
      
      // Fill with actual data
      if (Array.isArray(partners)) {
        partners.forEach(p => {
          if (p && p.year && yearCounts.hasOwnProperty(p.year)) {
            yearCounts[p.year] += 1;
          }
        });
      }

      const sortedYears = targetYears.map(year => ({
        year,
        count: yearCounts[year] || 0
      }));
      setPartnerStats(sortedYears);
      setMessageStats({ read: readCount, unread: unreadCount, total: messagesList.length });

      const allActivities: any[] = [
        ...(Array.isArray(messagesList) ? messagesList : []).map(m => ({
          id: m.id,
          type: 'message',
          action: 'Pesan Masuk',
          target: m.name,
          time: m.createdAt,
          icon: 'mail',
          color: 'bg-amber-500 text-white',
          isRead: m.isRead
        })),
        ...(Array.isArray(servicesList) ? servicesList.slice(0, 5) : []).map(s => ({
          id: s.id,
          type: 'service',
          action: 'Update Layanan',
          target: s.title,
          time: s.updatedAt || s.createdAt || new Date().toISOString(),
          icon: s.icon || 'settings_suggest',
          color: 'bg-emerald-500 text-white',
          image: null
        })),
        ...(Array.isArray(mediaList) ? mediaList.slice(0, 5) : []).map(m => ({
          id: m.id,
          type: 'media',
          action: 'Aset Baru',
          target: m.filename,
          time: m.createdAt,
          icon: 'photo_library',
          color: 'bg-purple-500 text-white',
          image: m.url
        })),
        ...(Array.isArray(partners) ? partners.slice(0, 5) : []).map(p => ({
          id: p.id,
          type: 'experience',
          action: 'Partner Baru',
          target: `Tahun ${p.year}`,
          time: p.createdAt || new Date().toISOString(),
          icon: 'inventory_2',
          color: 'bg-blue-500 text-white',
          image: p.logoUrl
        })),
      ].sort((a, b) => {
        const timeA = a.time ? new Date(a.time).getTime() : 0;
        const timeB = b.time ? new Date(b.time).getTime() : 0;
        return timeB - timeA;
      })

        .map(act => ({ ...act, time: formatRelativeTime(act.time) }));


      setAuditLogs(allActivities);
      setRecentMedia(mediaList);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatRelativeTime = (dateStr: any) => {
    if (!dateStr) return 'Waktu tidak tersedia';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return 'Format waktu salah';
    
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    // Check if it's today
    const isToday = date.toDateString() === now.toDateString();
    
    // Check if it's yesterday
    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);
    const isYesterday = date.toDateString() === yesterday.toDateString();

    const timeStr = date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

    if (isToday) {
        if (diffInSeconds < 60) return 'Baru saja';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} menit lalu`;
        return `Hari ini, jam ${timeStr}`;
    }
    
    if (isYesterday) {
        return `Kemarin, jam ${timeStr}`;
    }
    
    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const maxPartnerCount = Math.max(...partnerStats.map(s => s.count), 1);

  return (
    <AdminLayout>
      <div className="relative min-h-screen">
        {/* Background Decorative Blobs */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -z-10 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[100px] -z-10"></div>
        
        <div className="space-y-12 pb-20 max-w-7xl mx-auto relative z-10">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="reveal-up">
            <h1 className={`text-5xl md:text-6xl font-black tracking-tighter ${theme === 'dark' ? 'text-white' : 'text-gray-950'}`}>
              Halo, <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-400">{user.name.split(' ')[0]}</span>! 👋
            </h1>
            <p className={`text-[10px] font-black mt-4 uppercase tracking-[0.6em] ${theme === 'dark' ? 'text-primary/60' : 'text-emerald-700/60'}`}>Intelligence Data Hub v2.0</p>
          </div>
          
          <div className="flex flex-wrap gap-4">
             <button 
               onClick={() => navigate('/admin/pages')}
               className="bg-zinc-800 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-primary hover:text-zinc-950 transition-all shadow-xl flex items-center gap-3 active:scale-95"
             >
                <span className="material-symbols-outlined text-xl">edit_document</span>
                Edit Beranda
             </button>
             <button 
               onClick={() => navigate('/admin/media')}
               className="bg-zinc-800 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-primary hover:text-zinc-950 transition-all shadow-xl flex items-center gap-3 active:scale-95"
             >
                <span className="material-symbols-outlined text-xl">cloud_upload</span>
                Upload Company Profile
             </button>
             <button 
               onClick={() => navigate('/admin/contact')}
               className="bg-primary text-zinc-950 px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-green-400 transition-all shadow-[0_20px_40px_rgba(21,128,61,0.15)] flex items-center gap-3 active:scale-95"
             >
                <span className="material-symbols-outlined text-xl">mail</span>
                Lihat Pesan
             </button>
           </div>
        </header>

        {/* Quick Insights Banner */}
        <div className={`p-1 rounded-[2.5rem] bg-gradient-to-r from-emerald-600 via-primary to-green-400 shadow-2xl shadow-primary/20 reveal-up`} style={{ animationDelay: '0.1s' }}>
           <div className={`px-10 py-12 rounded-[2.4rem] flex flex-col md:flex-row items-center justify-between gap-8 ${theme === 'dark' ? 'bg-zinc-900/90' : 'bg-white/90'} backdrop-blur-md`}>
              <div className="max-w-xl">
                 <h2 className={`text-3xl font-black tracking-tight mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Analisis Performa <span className="text-primary italic">Real-time</span>
                 </h2>
                 <p className={`text-sm font-medium leading-relaxed ${theme === 'dark' ? 'text-zinc-400' : 'text-gray-500'}`}>
                    Sistem Anda saat ini memiliki <span className="font-black text-primary">{stats[1].value} layanan aktif</span> dan sedang memproses data intelijen secara otomatis. Gunakan menu navigasi untuk mengelola seluruh aspek website Anda.
                 </p>
              </div>
              <div className="flex items-center gap-6 shrink-0">
                 <div className="text-center">
                    <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${theme === 'dark' ? 'text-zinc-500' : 'text-gray-400'}`}>UPTIME</p>
                    <p className={`text-2xl font-black ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>99.9%</p>
                 </div>
                 <div className="w-px h-10 bg-zinc-200 dark:bg-zinc-800"></div>
                 <div className="text-center">
                    <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${theme === 'dark' ? 'text-zinc-500' : 'text-gray-400'}`}>SISTEM</p>
                    <div className="flex items-center gap-2">
                       <div className="w-2 h-2 bg-primary rounded-full animate-ping"></div>
                       <p className={`text-2xl font-black ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>STABIL</p>
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* Top Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, i) => (
            <div 
              key={i} 
              onClick={() => navigate(stat.path)}
              className={`relative overflow-hidden p-8 rounded-[2.5rem] border transition-all duration-500 hover:-translate-y-2 group cursor-pointer ${
                theme === 'dark' 
                  ? 'bg-zinc-900/50 backdrop-blur-xl border-zinc-800 hover:border-primary/50 shadow-2xl shadow-black/20' 
                  : 'bg-white border-gray-100 shadow-xl shadow-zinc-200/30 hover:border-green-200'
              }`}
            >
              {/* Background Decorative Element */}
              <div className={`absolute -right-6 -bottom-6 w-24 h-24 rounded-full blur-[40px] opacity-10 transition-all duration-700 group-hover:scale-150 group-hover:opacity-20 ${
                stat.color.split(' ')[1].replace('text-', 'bg-')
              }`}></div>

              <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                   <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:rotate-[10deg] group-hover:scale-110 shadow-lg ${
                     theme === 'dark' ? 'bg-zinc-800 text-primary shadow-black/40' : 'bg-green-50 text-green-600 shadow-green-100'
                   }`}>
                      <span className="material-symbols-outlined text-3xl">{stat.icon}</span>
                   </div>
                   <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border transition-colors ${
                     theme === 'dark' ? 'bg-zinc-950/50 border-zinc-800' : 'bg-gray-50 border-gray-100'
                   }`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${stat.trend.includes('Baru') || stat.trend === '0' ? 'bg-amber-500' : 'bg-emerald-500'}`}></div>
                      <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500">
                         {stat.trend}
                      </span>
                   </div>
                </div>
                
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500/80 mb-2">{stat.label}</p>
                <div className="flex items-baseline gap-2">
                  <h3 className={`text-4xl font-black tracking-tighter ${theme === 'dark' ? 'text-white' : 'text-gray-950'}`}>{stat.value}</h3>
                  <span className="material-symbols-outlined text-zinc-400 text-lg opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">arrow_forward</span>
                </div>

                {/* Bottom Progress Bar Decoration */}
                <div className="mt-6 h-1 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                   <div 
                     className={`h-full transition-all duration-1000 delay-300 ${
                       stat.color.split(' ')[1].replace('text-', 'bg-')
                     }`}
                     style={{ width: stat.value === '0' ? '5%' : '65%' }}
                   ></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts & Visualization Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
           {/* Partner Growth Chart */}
           <div className={`lg:col-span-8 p-10 rounded-[3rem] border ${
             theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-gray-100 shadow-xl shadow-zinc-200/40'
           }`}>
              <div className="flex justify-between items-center mb-12">
                 <div>
                    <h3 className={`text-2xl font-black ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Pertumbuhan Partner</h3>
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mt-1">Distribusi Partner Per Tahun</p>
                 </div>
                 <div className="flex gap-2">
                    <span className="w-3 h-3 bg-primary rounded-full"></span>
                    <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Total Logo</span>
                 </div>
              </div>

              {/* Custom Bar Chart */}
              <div className="h-64 flex items-end justify-between gap-4 px-4">
                 {partnerStats.length > 0 ? partnerStats.map((item, i) => (
                   <div key={i} className="flex-1 flex flex-col items-center group">
                      <div className="relative w-full flex justify-center">
                         {/* Bar */}
                         <div 
                           className="w-full max-w-[40px] bg-gradient-to-t from-primary/20 to-primary rounded-t-xl transition-all duration-1000 ease-out group-hover:brightness-110 cursor-pointer shadow-[0_0_20px_rgba(21,128,61,0.1)]"
                           style={{ height: `${(item.count / maxPartnerCount) * 200}px` }}
                         >
                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-zinc-900 text-white text-[10px] font-black px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 border border-zinc-800">
                               {item.count} Partner
                            </div>
                         </div>
                      </div>
                      <p className="mt-6 text-[10px] font-black text-zinc-500 uppercase tracking-widest">{item.year}</p>
                   </div>
                 )) : (
                   <div className="w-full h-full flex items-center justify-center text-zinc-500 text-xs font-bold uppercase tracking-widest italic opacity-50">
                      Data tidak tersedia
                   </div>
                 )}
              </div>
           </div>

           {/* Message Status Chart (Radial-ish) */}
           <div className={`lg:col-span-4 p-10 rounded-[3rem] border flex flex-col items-center justify-center text-center ${
             theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-gray-100 shadow-xl shadow-zinc-200/40'
           }`}>
              <h3 className={`text-xl font-black mb-8 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Respon Klien</h3>
              
              <div className="relative w-40 h-40 mb-10">
                 <svg className="w-full h-full transform -rotate-90">
                    <circle 
                       cx="80" cy="80" r="70" 
                       fill="transparent" 
                       stroke="currentColor" 
                       strokeWidth="12" 
                       className="text-zinc-100 dark:text-zinc-800"
                    />
                    <circle 
                       cx="80" cy="80" r="70" 
                       fill="transparent" 
                       stroke="currentColor" 
                       strokeWidth="12" 
                       strokeDasharray={440}
                       strokeDashoffset={440 - (440 * (messageStats.total > 0 ? (messageStats.read / messageStats.total) : 0))}
                       strokeLinecap="round"
                       className="text-primary transition-all duration-1000 ease-in-out"
                    />
                 </svg>
                 <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={`text-4xl font-black tracking-tighter ${theme === 'dark' ? 'text-white' : 'text-gray-950'}`}>
                       {messageStats.total > 0 ? Math.round((messageStats.read / messageStats.total) * 100) : 0}%
                    </span>
                    <span className="text-[8px] font-black text-zinc-500 uppercase tracking-[0.3em] mt-1">Selesai</span>
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-8 w-full border-t border-zinc-50 dark:border-zinc-800 pt-8">
                 <div>
                    <p className="text-[8px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-1">DIBACA</p>
                    <p className={`text-xl font-black ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{messageStats.read}</p>
                 </div>
                 <div>
                    <p className="text-[8px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-1">PENDING</p>
                    <p className="text-xl font-black text-amber-500">{messageStats.unread}</p>
                 </div>
              </div>
           </div>
        </div>

        {/* Latest Activity & Messages */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Latest Messages */}
          <div className="lg:col-span-2 space-y-8">
             <div className="flex justify-between items-end px-4">
                <div>
                   <h3 className={`text-3xl font-black ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Pesan Terbaru</h3>
                   <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mt-2">Log Interaksi Masuk</p>
                </div>
                <button 
                  onClick={() => navigate('/admin/contact')}
                  className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline font-bold"
                >
                   Semua Pesan →
                </button>
             </div>
             
             <div className="space-y-4">
                {isLoading ? (
                  <div className="py-20 text-center animate-pulse text-zinc-500 font-black text-xs uppercase tracking-widest">Sinkronisasi Data...</div>
                ) : auditLogs.filter(a => a.type === 'message' && !a.isRead).length > 0 ? (
                  auditLogs.filter(a => a.type === 'message' && !a.isRead).slice(0, 3).map((msg, i) => (
                    <div 
                      key={i}
                      className={`p-8 rounded-[2.5rem] border flex items-center gap-8 transition-all hover:translate-x-3 ${
                        theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-gray-100 shadow-xl shadow-zinc-200/20'
                      }`}
                    >
                       <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${
                         theme === 'dark' ? 'bg-zinc-800 text-zinc-400' : 'bg-gray-50 text-gray-400'
                       }`}>
                          <span className="material-symbols-outlined text-2xl">mail</span>
                       </div>
                       <div className="flex-1 min-w-0">
                          <p className={`font-black text-lg truncate ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{msg.target}</p>
                          <p className="text-sm text-zinc-500 truncate font-medium mt-1">Mengirim pesan baru melalui website</p>
                       </div>
                       <div className="text-right hidden sm:block">
                          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">{msg.time}</p>
                          {!msg.isRead && (
                            <span className="inline-block mt-2 w-2 h-2 bg-primary rounded-full shadow-[0_0_10px_#16a34a] animate-pulse"></span>
                          )}
                          {msg.isRead && (
                            <span className="material-symbols-outlined text-xs text-zinc-600 mt-2">done_all</span>
                          )}
                       </div>
                    </div>
                  ))
                ) : (
                   <div className={`p-20 rounded-[3rem] border text-center ${theme === 'dark' ? 'border-zinc-800' : 'border-gray-50'}`}>
                      <span className="material-symbols-outlined text-6xl text-zinc-800 mb-6">inbox</span>
                      <p className="text-zinc-500 font-black uppercase tracking-widest text-xs">Kotak masuk bersih</p>
                   </div>
                )}
             </div>
          </div>

          {/* Activity Log */}
          <div className="space-y-6">
            <h3 className={`text-2xl font-black px-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Log Aktivitas</h3>
            <div className={`rounded-[2.5rem] border overflow-hidden p-8 ${
              theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-gray-100 shadow-lg shadow-zinc-200/20'
            }`}>
              <div className="space-y-6 relative">
                {auditLogs.slice(0, 6).map((activity, i) => (
                  <div key={i} className="flex gap-6 relative group">
                    {/* Vertical Line Connector */}
                    {i !== auditLogs.length - 1 && (
                      <div className={`absolute left-[13px] top-8 w-0.5 h-10 ${theme === 'dark' ? 'bg-zinc-800' : 'bg-zinc-100'}`}></div>
                    )}
                    
                    <div className={`w-7 h-7 rounded-full shrink-0 z-10 flex items-center justify-center shadow-lg transition-all group-hover:scale-125 ${activity.color || 'bg-primary'}`}>
                       <span className="material-symbols-outlined text-[12px] font-black">
                          {activity.icon}
                       </span>
                    </div>
                    <div className="pb-6">
                      <div className="flex items-center gap-3">
                         <span className={`text-[8px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded-md ${
                           activity.type === 'message' ? 'bg-amber-500/10 text-amber-500' :
                           activity.type === 'media' ? 'bg-purple-500/10 text-purple-500' :
                           activity.type === 'service' ? 'bg-emerald-500/10 text-emerald-500' :
                           'bg-blue-500/10 text-blue-500'
                         }`}>
                           {activity.action}
                         </span>
                         <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">{activity.time}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        {activity.image && (
                          <div className={`w-10 h-10 rounded-lg overflow-hidden border shrink-0 ${theme === 'dark' ? 'border-zinc-800' : 'border-zinc-100'}`}>
                            <img src={activity.image} className="w-full h-full object-cover" alt="Preview" />
                          </div>
                        )}
                        <p className={`text-xs font-bold leading-relaxed transition-colors truncate ${
                          theme === 'dark' ? 'text-zinc-300 group-hover:text-white' : 'text-gray-700 group-hover:text-black'
                        }`}>
                          {activity.target}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}

              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section: Media Preview Grid */}
        <div className="reveal-up mt-12" style={{ animationDelay: '0.4s' }}>
           <div className={`p-10 rounded-[2.5rem] border ${
             theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-gray-100 shadow-sm'
           }`}>
              <div className="flex justify-between items-center mb-10">
                 <div>
                    <h3 className={`text-xl font-black tracking-tight ${theme === 'dark' ? 'text-white' : 'text-zinc-900'}`}>Aset Media Terbaru</h3>
                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mt-1">Pratinjau galeri Anda</p>
                 </div>
                 <button 
                   onClick={() => navigate('/admin/media')}
                   className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline"
                 >
                    Lihat Semua Library
                 </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                 {recentMedia.slice(0, 12).map((item) => (
                    <div 
                      key={item.id} 
                      className={`aspect-square rounded-2xl overflow-hidden border group relative cursor-pointer transition-transform hover:scale-105 ${
                        theme === 'dark' ? 'border-zinc-800 bg-zinc-950' : 'border-gray-100 bg-gray-50'
                      }`}
                      onClick={() => navigate('/admin/media')}
                    >
                       <img 
                         src={item.url} 
                         className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                         alt={item.filename} 
                       />
                       <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                          <p className="text-[8px] font-black text-white uppercase truncate w-full">{item.filename}</p>
                       </div>
                    </div>
                 ))}
                 {recentMedia.length === 0 && (
                    <div className="col-span-full py-20 text-center border-2 border-dashed border-zinc-100 dark:border-zinc-800 rounded-3xl">
                       <span className="material-symbols-outlined text-4xl text-zinc-300 mb-4">image_not_supported</span>
                       <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Belum ada aset media.</p>
                    </div>
                 )}
              </div>
           </div>
        </div>
        </div>
      </div>
    </AdminLayout>
  );
}
