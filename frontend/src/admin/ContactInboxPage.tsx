import { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import { contactService, ContactMessage } from '../services/contactService';
import { useTheme } from '../context/ThemeContext';
import { useUser } from '../context/UserContext';

export default function ContactInboxPage() {
  const { theme } = useTheme();
  const { user } = useUser();
  const [messages, setMessages] = useState<ContactMessage[]>(() => {
    const stored = localStorage.getItem('wdu_messages');
    return stored ? JSON.parse(stored) : [];
  });
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const { data } = await contactService.getAll();
      setMessages(data);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRead = async (msg: ContactMessage) => {
    setSelectedMessage(msg);
    if (!msg.isRead) {
      try {
        await contactService.markAsRead(msg.id);
        setMessages(messages.map(m => m.id === msg.id ? { ...m, isRead: true } : m));
      } catch (error) {
        console.error('Failed to mark as read:', error);
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Hapus pesan ini?')) {
      try {
        await contactService.delete(id);
        fetchMessages();
        if (selectedMessage?.id === id) setSelectedMessage(null);
      } catch (error) {
        console.error('Failed to delete message:', error);
        fetchMessages();
      }
    }
  };

  return (
    <AdminLayout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {/* Message List */}
        <div className="lg:col-span-1 space-y-6">
           <div className="flex justify-between items-center mb-4">
              <h1 className={`text-3xl font-black tracking-tight ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Inbox</h1>
              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                theme === 'dark' ? 'bg-primary/20 text-primary' : 'bg-green-100 text-green-700'
              }`}>
                {messages.filter(m => !m.isRead).length} Baru
              </span>
           </div>
           
           <div className="space-y-3 max-h-[calc(100vh-220px)] overflow-y-auto pr-2 custom-scrollbar">
              {isLoading ? (
                <div className="text-center py-20 text-zinc-500 font-bold uppercase tracking-widest text-xs">Sinkronisasi pesan...</div>
              ) : messages.length === 0 ? (
                <div className="text-center py-20 text-zinc-500 font-bold uppercase tracking-widest text-xs">Kotak masuk kosong</div>
              ) : messages.map(msg => (
                <div 
                  key={msg.id}
                  onClick={() => handleRead(msg)}
                  className={`p-5 rounded-2xl border cursor-pointer transition-all duration-300 relative overflow-hidden group ${
                    selectedMessage?.id === msg.id 
                      ? theme === 'dark' ? 'bg-primary/10 border-primary shadow-[0_0_20px_rgba(21,128,61,0.1)]' : 'bg-green-50 border-green-200 shadow-sm' 
                      : msg.isRead 
                        ? theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-gray-100' 
                        : theme === 'dark' ? 'bg-zinc-900 border-primary shadow-lg' : 'bg-white border-green-400 shadow-md'
                  }`}
                >
                    {!msg.isRead && <div className="absolute top-0 right-0 w-3 h-3 bg-primary rounded-bl-xl shadow-lg shadow-primary/20 animate-pulse"></div>}
                    <div className="flex justify-between items-start mb-2">
                       <div className="flex items-center gap-2 max-w-[70%]">
                          <p className={`text-sm font-black truncate ${
                            msg.isRead 
                              ? theme === 'dark' ? 'text-zinc-500' : 'text-gray-500' 
                              : theme === 'dark' ? 'text-white' : 'text-emerald-900'
                          }`}>{msg.name}</p>
                          {!msg.isRead && (
                             <span className="text-[7px] font-black uppercase tracking-tighter px-1.5 py-0.5 rounded-full bg-primary text-zinc-950">Baru</span>
                          )}
                          {msg.isRead && (
                             <span className={`text-[7px] font-black uppercase tracking-tighter px-1.5 py-0.5 rounded border ${
                               theme === 'dark' ? 'bg-zinc-800 text-zinc-500 border-zinc-700' : 'bg-gray-50 text-gray-400 border-gray-100'
                             }`}>Dibaca</span>
                          )}
                       </div>
                       <div className="flex flex-col items-end">
                          <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">{new Date(msg.createdAt).toLocaleDateString()}</span>
                          <span className="text-[7px] text-zinc-600 font-medium">{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                       </div>
                    </div>
                   <p className={`text-xs font-bold truncate mb-2 ${
                     msg.isRead 
                       ? theme === 'dark' ? 'text-zinc-600' : 'text-gray-400' 
                       : theme === 'dark' ? 'text-zinc-300' : 'text-gray-700'
                   }`}>{msg.subject || 'Tanpa Subjek'}</p>
                   <p className={`text-xs line-clamp-1 italic ${theme === 'dark' ? 'text-zinc-600' : 'text-gray-400'}`}>{msg.message}</p>
                </div>
              ))}
           </div>
        </div>

        {/* Message Detail */}
        <div className={`lg:col-span-2 rounded-[2rem] border flex flex-col h-[calc(100vh-160px)] transition-all duration-500 overflow-hidden ${
          theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-gray-100 shadow-sm'
        }`}>
           {selectedMessage ? (
             <>
               <div className={`p-8 border-b flex justify-between items-center ${theme === 'dark' ? 'border-zinc-800 bg-zinc-800/50' : 'border-gray-50 bg-gray-50/30'}`}>
                  <div className="flex items-center gap-5">
                     <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl shadow-lg transition-transform hover:scale-110 ${
                       theme === 'dark' ? 'bg-zinc-800 text-primary' : 'bg-gray-100 text-gray-500'
                     }`}>
                        {selectedMessage.name[0]}
                     </div>
                     <div>
                        <div className="flex items-center gap-2">
                           <h3 className={`font-black text-lg tracking-tight ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{selectedMessage.name}</h3>
                           {selectedMessage.isRead && (
                              <div className="flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                                 <span className="material-symbols-outlined text-[10px]">done_all</span>
                                 Dibaca
                              </div>
                           )}
                        </div>
                        <p className={`text-xs font-medium ${theme === 'dark' ? 'text-zinc-500' : 'text-gray-500'}`}>{selectedMessage.email}</p>
                     </div>
                  </div>
                  {(user?.role === 'SUPER_ADMIN') && (
                    <button 
                      onClick={() => handleDelete(selectedMessage.id)}
                      className={`p-3 rounded-xl transition-all ${
                        theme === 'dark' ? 'text-zinc-500 hover:text-red-500 hover:bg-red-500/10' : 'text-gray-400 hover:text-red-600 hover:bg-red-50'
                      }`}
                    >
                       <span className="material-symbols-outlined text-2xl">delete</span>
                    </button>
                  )}
               </div>
               <div className="p-10 flex-1 overflow-y-auto space-y-10 custom-scrollbar">
                  <div>
                     <span className={`text-[10px] font-black uppercase tracking-widest ${theme === 'dark' ? 'text-zinc-600' : 'text-gray-300'}`}>Subjek Pesan</span>
                     <p className={`text-2xl font-black mt-2 tracking-tight ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>{selectedMessage.subject || 'Tanpa Subjek'}</p>
                  </div>
                  <div>
                     <span className={`text-[10px] font-black uppercase tracking-widest ${theme === 'dark' ? 'text-zinc-600' : 'text-gray-300'}`}>Isi Pesan</span>
                     <div className={`mt-4 p-8 rounded-3xl border leading-relaxed font-medium transition-all ${
                       theme === 'dark' ? 'bg-zinc-950 border-zinc-800 text-zinc-300' : 'bg-gray-50 border-gray-100 text-gray-600'
                     }`}>
                        {selectedMessage.message}
                     </div>
                  </div>
                  {selectedMessage.phone && (
                    <div className={`p-6 rounded-2xl border inline-block ${theme === 'dark' ? 'bg-zinc-950 border-zinc-800' : 'bg-emerald-50/30 border-emerald-100'}`}>
                       <span className={`text-[9px] font-black uppercase tracking-widest ${theme === 'dark' ? 'text-zinc-600' : 'text-green-800/40'}`}>Nomor Telepon</span>
                       <p className={`text-sm font-black mt-1 ${theme === 'dark' ? 'text-primary' : 'text-green-800'}`}>{selectedMessage.phone}</p>
                    </div>
                  )}
               </div>
                {user?.role === 'SUPER_ADMIN' && (
                  <div className={`p-8 border-t ${theme === 'dark' ? 'border-zinc-800 bg-zinc-800/20' : 'bg-gray-50/50 border-gray-50'} flex flex-wrap gap-4`}>
                    <div className="flex-1 flex gap-2">
                      <a 
                        href={`https://mail.google.com/mail/?view=cm&fs=1&to=${selectedMessage.email}&su=Balasan: ${selectedMessage.subject || 'Pesan dari Wahana Data Utama'}`} 
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 bg-red-600 text-white text-center py-4 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-red-700 transition-all shadow-lg flex items-center justify-center gap-2"
                      >
                        <span className="material-symbols-outlined text-sm">mail</span>
                        Balas via Gmail
                      </a>
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText(selectedMessage.email);
                          alert('Email berhasil disalin ke clipboard!');
                        }}
                        className={`px-4 rounded-xl border transition-all ${
                          theme === 'dark' ? 'border-zinc-800 text-zinc-500 hover:text-white' : 'border-gray-200 text-gray-400 hover:bg-gray-100'
                        }`}
                        title="Salin Alamat Email"
                      >
                        <span className="material-symbols-outlined text-sm">content_copy</span>
                      </button>
                    </div>

                    {selectedMessage.phone && (
                      <a 
                        href={`https://wa.me/${selectedMessage.phone.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-emerald-600 text-white px-6 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg flex items-center justify-center gap-2"
                      >
                        <span className="material-symbols-outlined text-sm">chat</span>
                        WhatsApp
                      </a>
                    )}

                    <button className={`px-6 py-4 rounded-xl border font-black text-[10px] uppercase tracking-widest transition-all ${
                      theme === 'dark' ? 'border-zinc-800 text-zinc-500 hover:text-white' : 'border-gray-200 text-gray-400 hover:bg-gray-100'
                    }`}>Arsipkan</button>
                  </div>
                )}

             </>
           ) : (
             <div className="flex-1 flex flex-col items-center justify-center space-y-6">
                <div className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-700 ${
                  theme === 'dark' ? 'bg-zinc-800 text-primary animate-pulse' : 'bg-emerald-50 text-emerald-200'
                }`}>
                   <span className="material-symbols-outlined text-5xl">mark_email_unread</span>
                </div>
                <div className="text-center">
                   <p className={`font-black text-xl tracking-tight ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Pilih pesan untuk membacanya</p>
                   <p className={`text-sm font-medium mt-1 ${theme === 'dark' ? 'text-zinc-600' : 'text-gray-400'}`}>Semua data komunikasi Anda aman dan terenkripsi.</p>
                </div>
             </div>
           )}
        </div>
      </div>
    </AdminLayout>
  );
}
