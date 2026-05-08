import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { useTheme } from '../context/ThemeContext';
import { useUser } from '../context/UserContext';
import { useLanguage } from '../context/LanguageContext';
export default function LoginPage() {
  const { theme, toggleTheme } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { updateUser } = useUser();
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  // Clear everything on mount to prevent browser from "helping" with old data
  useEffect(() => {
    localStorage.clear();
    sessionStorage.clear();
    // Also try to clear any autofill by resetting state
    setEmail('');
    setPassword('');
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const data = await authService.login(email, password);
      const userRole = data.user.role;
      
      updateUser({
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        role: data.user.role
      });
      
      if (userRole === 'SUPER_ADMIN') {
        navigate('/admin/dashboard');
      } else {
        navigate('/admin/editor-dashboard');
      }
    } catch (err: any) {
      console.error('Login failed:', err);
      setError('Email atau kata sandi salah. Akses ditolak.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex transition-colors duration-500 relative overflow-hidden ${
      theme === 'dark' ? 'bg-zinc-950' : 'bg-gray-50'
    }`}>
      {/* --- LEFT SIDE: IMMERSIVE VISUAL --- */}
      <div className="hidden lg:flex lg:w-2/3 relative overflow-hidden bg-emerald-950">
        <div className="absolute inset-0 z-0">
          <img 
            src="/brain/bd22b2e2-7772-4373-b00d-06e6f1ad557e/login_bg_abstract_data_1777962575994.png" 
            className="w-full h-full object-cover opacity-60 mix-blend-overlay"
            alt="Data Abstract"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-950 via-emerald-950/40 to-transparent"></div>
        </div>
        
        <div className="relative z-10 p-16 flex flex-col justify-between w-full h-full">
          <div>
            <div className="flex items-center gap-4 mb-12">
               <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-[0_0_30px_rgba(34,197,94,0.3)]">
                  <span className="material-symbols-outlined text-zinc-950 font-bold">query_stats</span>
               </div>
               <span className="text-white text-xl font-black tracking-tighter uppercase">Intelijen WDU</span>
            </div>
            
            <h1 className="text-6xl xl:text-7xl font-black text-white leading-[0.85] tracking-tighter mb-8">
              DATA ADALAH BISNIS KAMI.
            </h1>
            <p className="text-emerald-100/60 text-xl max-w-lg font-medium leading-relaxed">
              {t('common.empowering')}
            </p>
          </div>
          
          <div className="flex items-center gap-10">
            <div className="flex flex-col">
               <span className="text-primary text-4xl font-black">18+</span>
               <span className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em]">Tahun Pengalaman</span>
            </div>
            <div className="w-px h-10 bg-white/10"></div>
            <div className="flex flex-col">
               <span className="text-primary text-4xl font-black">500+</span>
               <span className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em]">Proyek Selesai</span>
            </div>
            <div className="w-px h-10 bg-white/10"></div>
            <div className="flex flex-col">
               <span className="text-primary text-4xl font-black">24/7</span>
               <span className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em]">Analitik Real-time</span>
            </div>
          </div>
        </div>
      </div>

      {/* --- RIGHT SIDE: LOGIN FORM --- */}
      <div className="w-full lg:w-[30%] flex flex-col relative z-10">
        {/* Toggles */}
        <div className="p-6 flex justify-end gap-3">


          <button 
            onClick={toggleTheme}
            className={`p-3 rounded-2xl border transition-all hover:scale-110 active:scale-95 ${
              theme === 'dark' ? 'bg-zinc-900 border-zinc-800 text-primary shadow-[0_0_20px_rgba(21,128,61,0.1)]' : 'bg-white border-gray-100 text-gray-400 shadow-sm'
            }`}
          >
            <span className="material-symbols-outlined text-2xl">
              {theme === 'dark' ? 'light_mode' : 'dark_mode'}
            </span>
          </button>
        </div>

        <div className="flex-1 flex items-center justify-center px-10 pb-10">
          <div className="max-w-[320px] w-full space-y-6">
            <div>
              <div className="lg:hidden flex items-center gap-3 mb-8">
                 <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                    <span className="material-symbols-outlined text-zinc-950 text-xl font-bold">query_stats</span>
                 </div>
                 <span className={`text-lg font-black tracking-tighter uppercase ${theme === 'dark' ? 'text-white' : 'text-emerald-950'}`}>WDU</span>
              </div>
              
              <h1 className={`text-4xl font-black tracking-tighter mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-950'}`}>
                Portal Admin
              </h1>
              <p className={`text-sm font-bold uppercase tracking-[0.4em] mb-12 ${theme === 'dark' ? 'text-primary' : 'text-green-600'}`}>
                Wahana Data Utama
              </p>

              <form onSubmit={handleLogin} className="space-y-6" autoComplete="off">
                <div className="space-y-4 group">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 ml-1">Email Administrator</label>
                  <div className="relative">
                    <input 
                      type="email"
                      required
                      name="login_identifier_v2"
                      autoComplete="off"
                      className={`w-full px-6 py-4 rounded-2xl outline-none border transition-all font-bold ${
                        theme === 'dark' ? 'bg-zinc-950 border-zinc-800 focus:border-primary text-white' : 'bg-gray-50 border-gray-100 focus:bg-white focus:border-green-500'
                      }`}
                      placeholder="admin@wahanadata.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <span className="absolute right-6 top-1/2 -translate-y-1/2 material-symbols-outlined text-zinc-500 text-xl">alternate_email</span>
                  </div>
                </div>

                <div className="space-y-4 group">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 ml-1">Kata Sandi</label>
                  <div className="relative">
                    <input 
                      type="password"
                      required
                      name="security_key_v2"
                      autoComplete="new-password"
                      className={`w-full px-6 py-4 rounded-2xl outline-none border transition-all font-bold ${
                        theme === 'dark' ? 'bg-zinc-950 border-zinc-800 focus:border-primary text-white' : 'bg-gray-50 border-gray-100 focus:bg-white focus:border-green-500'
                      }`}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <span className="absolute right-6 top-1/2 -translate-y-1/2 material-symbols-outlined text-zinc-500 text-xl">lock</span>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 animate-shake">
                    <span className="material-symbols-outlined text-lg">error</span>
                    Email atau kata sandi tidak valid. Silakan coba lagi.
                  </div>
                )}

                <button 
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 bg-primary text-zinc-950 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] hover:bg-green-400 transition-all shadow-[0_15px_30px_rgba(21,128,61,0.2)] active:scale-95 disabled:opacity-50 mt-2"
                >
                  {isLoading ? 'MENGOTORISASI...' : 'MASUK KE DASHBOARD'}
                </button>
              </form>

              <div className="mt-16 pt-12 border-t border-gray-100 dark:border-zinc-900 text-center">
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                  Portal Aman © 2026 Wahana Data Utama
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
