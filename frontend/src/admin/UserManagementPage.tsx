import React, { useState, useEffect, useMemo } from 'react';
import AdminLayout from './AdminLayout';
import { userService, AdminUser } from '../services/userService';
import { useTheme } from '../context/ThemeContext';
import { useUser } from '../context/UserContext';
import { Navigate } from 'react-router-dom';

export default function UserManagementPage() {
  const { theme } = useTheme();
  const { user: currentUser } = useUser();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
   const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
   const [formData, setFormData] = useState({ 
     name: '', 
     email: '', 
     role: 'EDITOR' as 'EDITOR' | 'SUPER_ADMIN' 
   });

  if (currentUser.role !== 'SUPER_ADMIN') {
    return <Navigate to="/admin/editor-dashboard" replace />;
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const { data } = await userService.getAll();
      setUsers(data || []);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter(u => 
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [users, searchQuery]);

  const stats = {
    total: users.length,
    superAdmins: users.filter(u => u.role === 'SUPER_ADMIN').length,
    editors: users.filter(u => u.role === 'EDITOR').length
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingUser) {
        await userService.update(editingUser.id, formData);
      } else {
        await userService.create(formData);
      }
      fetchUsers();
      closeModal();
    } catch (error) {
      alert('Gagal menyimpan user.');
    }
  };

  const openEditModal = (user: AdminUser) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
    setFormData({ name: '', email: '', role: 'EDITOR' });
  };

  const handleResetPassword = async (id: string) => {
    if (window.confirm('Reset password user ini menjadi "WDU12345!"?')) {
      try {
        await userService.update(id, { password: 'NewPasswordSimulated' });
        alert('Password berhasil direset ke default.');
      } catch (error) {
        alert('Gagal mereset password.');
      }
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirmId) return;
    try {
      await userService.delete(deleteConfirmId);
      setDeleteConfirmId(null);
      fetchUsers();
    } catch (error) {
      console.error('Delete failed:', error);
      alert('Gagal menghapus user.');
    }
  };

  const userToDelete = users.find(u => u.id === deleteConfirmId);

  return (
    <AdminLayout>
      <div className="space-y-12 max-w-7xl mx-auto pb-20">
        {/* Header & Stats Section */}
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-10">
           <div className="reveal-up space-y-4">
              <h1 className={`text-5xl md:text-6xl font-black tracking-tight ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Users
              </h1>
              <p className={`text-sm font-bold uppercase tracking-[0.4em] ${theme === 'dark' ? 'text-primary' : 'text-green-600'}`}>Security & Access Control</p>
              
              <div className="flex flex-wrap gap-4 pt-4">
                <div className={`px-6 py-3 rounded-2xl border ${theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-gray-100 shadow-sm'}`}>
                  <p className="text-[9px] font-black uppercase tracking-widest text-zinc-500 mb-1">Total Admin</p>
                  <p className={`text-2xl font-black ${theme === 'dark' ? 'text-white' : 'text-zinc-950'}`}>{stats.total}</p>
                </div>
                <div className={`px-6 py-3 rounded-2xl border ${theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-gray-100 shadow-sm'}`}>
                  <p className="text-[9px] font-black uppercase tracking-widest text-zinc-500 mb-1">Super Admin</p>
                  <p className="text-2xl font-black text-amber-500">{stats.superAdmins}</p>
                </div>
                <div className={`px-6 py-3 rounded-2xl border ${theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-gray-100 shadow-sm'}`}>
                  <p className="text-[9px] font-black uppercase tracking-widest text-zinc-500 mb-1">Editor</p>
                  <p className="text-2xl font-black text-primary">{stats.editors}</p>
                </div>
              </div>
           </div>

           <div className="flex flex-col md:flex-row items-center gap-4 w-full xl:w-auto">
             <div className={`relative w-full md:w-80 group ${theme === 'dark' ? 'text-white' : 'text-zinc-950'}`}>
               <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-primary transition-colors">search</span>
               <input 
                 type="text"
                 placeholder="Search administrator..."
                 className={`w-full pl-12 pr-6 py-4 rounded-2xl outline-none transition-all text-sm font-bold ${
                   theme === 'dark' ? 'bg-zinc-900 border border-zinc-800 focus:border-primary' : 'bg-white border border-gray-100 shadow-sm focus:border-green-500'
                 }`}
                 value={searchQuery}
                 onChange={e => setSearchQuery(e.target.value)}
               />
             </div>
             <button 
               onClick={() => setIsModalOpen(true)}
               className="w-full md:w-auto bg-primary text-zinc-950 px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-green-400 transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3"
             >
               <span className="material-symbols-outlined">person_add</span>
               New Access
             </button>
           </div>
        </div>

        {/* Users Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           {isLoading ? (
             <div className="col-span-full py-20 text-center">
               <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
               <p className="text-zinc-500 font-black uppercase tracking-widest text-[10px]">Synchronizing Security Layers...</p>
             </div>
           ) : filteredUsers.length === 0 ? (
             <div className="col-span-full py-20 text-center bg-zinc-50/50 dark:bg-zinc-900/50 rounded-[3rem] border border-dashed border-zinc-200 dark:border-zinc-800">
                <span className="material-symbols-outlined text-6xl text-zinc-300 dark:text-zinc-700 mb-4">person_search</span>
                <p className="text-zinc-500 font-bold">No administrators found matching your search.</p>
             </div>
           ) : filteredUsers.map(user => (
             <div 
               key={user.id} 
               className={`p-10 rounded-[3rem] border group transition-all duration-500 hover:-translate-y-4 relative overflow-hidden ${
                 theme === 'dark' ? 'bg-zinc-900 border-zinc-800 hover:border-primary/40' : 'bg-white border-gray-100 shadow-lg hover:shadow-2xl'
               }`}
             >
                {/* Decorative Background Accent */}
                <div className={`absolute top-0 right-0 w-32 h-32 blur-3xl rounded-full -mr-16 -mt-16 opacity-0 group-hover:opacity-20 transition-opacity duration-700 ${
                  user.role === 'SUPER_ADMIN' ? 'bg-amber-500' : 'bg-primary'
                }`}></div>

                <div className="flex justify-between items-start mb-10 relative z-10">
                   <div className={`w-20 h-20 rounded-3xl flex items-center justify-center font-black text-3xl shadow-inner transition-transform group-hover:scale-110 duration-500 ${
                     theme === 'dark' ? 'bg-zinc-950 text-primary' : 'bg-green-50 text-green-600'
                   }`}>
                      {user.name[0]}
                   </div>
                   <div className="flex flex-col items-end gap-3">
                      <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                        user.role === 'SUPER_ADMIN' 
                          ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' 
                          : 'bg-primary/10 text-primary border-primary/20'
                      }`}>
                         {user.role}
                      </div>
                      
                      <div className="flex gap-2 bg-zinc-50 dark:bg-zinc-950 p-2 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                         <button 
                            onClick={() => openEditModal(user)}
                            title="Edit User"
                            className="w-10 h-10 rounded-xl flex items-center justify-center text-zinc-500 hover:bg-blue-500 hover:text-white transition-all"
                         >
                            <span className="material-symbols-outlined text-lg">edit</span>
                         </button>
                         <button 
                            onClick={() => handleResetPassword(user.id)}
                            title="Reset Password"
                            className="w-10 h-10 rounded-xl flex items-center justify-center text-zinc-500 hover:bg-amber-500 hover:text-white transition-all"
                         >
                            <span className="material-symbols-outlined text-lg">lock_reset</span>
                         </button>
                         {user.id !== currentUser.id && (
                           <button 
                             onClick={() => setDeleteConfirmId(user.id)}
                             title="Delete Access"
                             className="w-10 h-10 rounded-xl flex items-center justify-center text-zinc-500 hover:bg-red-500 hover:text-white transition-all"
                           >
                              <span className="material-symbols-outlined text-lg">person_remove</span>
                           </button>
                         )}
                      </div>
                   </div>
                </div>

                <div className="relative z-10">
                   <p className={`font-black text-2xl tracking-tight leading-none ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{user.name}</p>
                   <p className="text-sm text-zinc-500 font-medium mt-3 flex items-center gap-2">
                     <span className="material-symbols-outlined text-xs">mail</span>
                     {user.email}
                   </p>
                   
                   <div className="mt-10 pt-6 border-t border-dashed border-zinc-200 dark:border-zinc-800 flex justify-between items-center">
                     <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Security Clearance</p>
                     <div className="flex -space-x-2">
                        {[1,2,3].map(i => (
                          <div key={i} className={`w-2 h-2 rounded-full border-2 border-white dark:border-zinc-900 ${
                            i <= (user.role === 'SUPER_ADMIN' ? 3 : 1) ? 'bg-emerald-500' : 'bg-zinc-300 dark:bg-zinc-800'
                          }`}></div>
                        ))}
                     </div>
                   </div>
                </div>
             </div>
           ))}
        </div>
      </div>

      {/* Access Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-black/60 backdrop-blur-xl transition-all duration-500">
           <div className={`rounded-[3rem] w-full max-w-lg p-12 border shadow-2xl reveal-up ${
             theme === 'dark' ? 'bg-zinc-950 border-zinc-800' : 'bg-white border-gray-100'
           }`}>
              <div className="flex justify-between items-center mb-10">
                <h3 className={`font-black text-3xl tracking-tight ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {editingUser ? 'Update Security' : 'Provision Access'}
                </h3>
                <button onClick={closeModal} className="text-zinc-500 hover:rotate-90 transition-transform">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] ml-2 text-zinc-500">Legal Name</label>
                    <input 
                      required
                      placeholder="e.g. Adhi Wangsa"
                      className={`w-full px-8 py-5 rounded-2xl outline-none transition-all text-sm font-bold ${
                        theme === 'dark' ? 'bg-zinc-900 border border-zinc-800 focus:border-primary text-white' : 'bg-gray-50 border border-gray-100 focus:bg-white focus:border-green-500'
                      }`}
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] ml-2 text-zinc-500">Intelligence ID (Email)</label>
                    <input 
                      required
                      type="email"
                      placeholder="id@wahanadata.co.id"
                      className={`w-full px-8 py-5 rounded-2xl outline-none transition-all text-sm font-bold ${
                        theme === 'dark' ? 'bg-zinc-900 border border-zinc-800 focus:border-primary text-white' : 'bg-gray-50 border border-gray-100 focus:bg-white focus:border-green-500'
                      }`}
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] ml-2 text-zinc-500">Access Level</label>
                    <div className="grid grid-cols-2 gap-4">
                      {['EDITOR', 'SUPER_ADMIN'].map(role => (
                        <button
                          key={role}
                          type="button"
                          onClick={() => setFormData({...formData, role: role as any})}
                          className={`py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                            formData.role === role
                              ? 'bg-primary text-zinc-950 border-primary'
                              : (theme === 'dark' ? 'bg-zinc-900 border-zinc-800 text-zinc-500' : 'bg-gray-50 border-gray-100 text-gray-400')
                          }`}
                        >
                          {role.replace('_', ' ')}
                        </button>
                      ))}
                    </div>
                 </div>
                 <div className="pt-8 flex flex-col sm:flex-row gap-4">
                    <button type="submit" className="flex-[2] bg-primary text-zinc-950 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-green-400 shadow-xl shadow-primary/10 transition-all active:scale-95">
                      {editingUser ? 'Synchronize Updates' : 'Grant Access Now'}
                    </button>
                 </div>
                 {!editingUser && (
                   <p className="text-[10px] text-zinc-500 text-center italic font-medium pt-4 border-t border-dashed border-zinc-800 mt-6">
                     *Default password will be encrypted and sent to user.
                   </p>
                 )}
              </form>
           </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 bg-red-950/20 backdrop-blur-xl transition-all duration-500">
          <div className={`rounded-[3rem] w-full max-w-md p-12 border shadow-2xl reveal-up ${
            theme === 'dark' ? 'bg-zinc-950 border-zinc-800' : 'bg-white border-gray-100'
          }`}>
             <div className="text-center space-y-6">
                <div className="w-20 h-20 bg-red-500/10 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-8">
                   <span className="material-symbols-outlined text-4xl">warning</span>
                </div>
                <h3 className={`font-black text-3xl tracking-tight ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                   Revoke Access?
                </h3>
                <p className="text-sm text-zinc-500 font-medium leading-relaxed">
                   Are you sure you want to permanently delete <span className="font-black text-red-500">{userToDelete?.name}</span>? This action cannot be undone.
                </p>
                <div className="pt-8 flex flex-col gap-4">
                   <button 
                      onClick={handleDelete}
                      className="bg-red-500 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-red-600 shadow-xl shadow-red-500/20 transition-all active:scale-95"
                   >
                      Confirm Deletion
                   </button>
                   <button 
                      onClick={() => setDeleteConfirmId(null)}
                      className="text-zinc-500 font-black text-xs uppercase tracking-widest py-2"
                   >
                      Keep Access
                   </button>
                </div>
             </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

