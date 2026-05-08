import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

export default function NotFoundPage() {
  const { theme } = useTheme();

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-8 transition-colors duration-500 ${
      theme === 'dark' ? 'bg-zinc-950 text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      <div className="relative text-center reveal-up">
        {/* Decorative Element */}
        <div className={`absolute -top-24 left-1/2 -translate-x-1/2 text-[15rem] font-black opacity-[0.03] select-none ${
          theme === 'dark' ? 'text-white' : 'text-zinc-950'
        }`}>
          404
        </div>

        <h1 className="text-9xl font-black tracking-tighter mb-4 relative z-10">
          4<span className="text-primary">0</span>4
        </h1>
        
        <div className="space-y-4 relative z-10">
          <h2 className="text-2xl md:text-3xl font-black uppercase tracking-[0.2em]">HALAMAN TIDAK TERSEDIA SEMENTARA</h2>
          <p className={`text-sm md:text-base font-medium max-w-lg mx-auto ${theme === 'dark' ? 'text-zinc-500' : 'text-gray-500'}`}>
            Halaman ini sedang dalam proses pemeliharaan dan pembaruan sistem untuk meningkatkan kualitas layanan. Terima kasih atas pengertian Anda.
          </p>
        </div>

        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6 relative z-10">
          <Link 
            to="/" 
            className="bg-primary text-zinc-950 px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-green-400 transition-all shadow-[0_20px_40px_rgba(21,128,61,0.2)] active:scale-95"
          >
            Kembali ke Beranda
          </Link>
          <Link 
            to="/kontak" 
            className={`px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all border ${
              theme === 'dark' ? 'border-zinc-800 text-white hover:bg-zinc-900' : 'border-gray-200 text-gray-900 hover:bg-gray-100'
            }`}
          >
            Hubungi Support
          </Link>
        </div>
      </div>

    </div>
  );
}
