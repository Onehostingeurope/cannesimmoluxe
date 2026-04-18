import { useState, useEffect } from 'react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { supabase } from '../../lib/supabase';
import { clsx } from 'clsx';
import { useAuthStore } from '../../store/useAuthStore';
import { createClient } from '@supabase/supabase-js';

const Team = () => {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newOperative, setNewOperative] = useState({ email: '', password: '', first_name: '', last_name: '', role: 'user', avatar_url: '' });
  
  const currentUser = useAuthStore(state => state.user);

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching profiles:', error);
    } else {
      setProfiles(data || []);
    }
    setLoading(false);
  };

  const updateRole = async (id: string, newRole: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .update({ role: newRole })
      .eq('id', id)
      .select();

    if (error) {
      alert('Error updating role: ' + error.message);
    } else if (!data || data.length === 0) {
      alert('SECURITY BLOCK: PostgreSQL Row Level Security (RLS) blocked this transaction. You must execute an administrative policy in your SQL Editor to allow directors to modify other roles.');
    } else {
      fetchProfiles();
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOperative.email || !newOperative.password) return;
    setCreating(true);
    
    try {
      // Use isolated client to avoid persisting session and logging out the admin
      const tempClient = createClient(
        import.meta.env.VITE_SUPABASE_URL,
        import.meta.env.VITE_SUPABASE_ANON_KEY,
        { auth: { persistSession: false } }
      );

      const { data, error } = await tempClient.auth.signUp({
        email: newOperative.email,
        password: newOperative.password,
      });

      if (error) throw error;

      if (data?.user?.id) {
        // Wait 1 second to ensure DB trigger completed
        await new Promise(r => setTimeout(r, 1000));
        
        await supabase.from('profiles').update({
          first_name: newOperative.first_name,
          last_name: newOperative.last_name,
          role: newOperative.role,
          avatar_url: newOperative.avatar_url
        }).eq('id', data.user.id);
      }

      setShowCreate(false);
      setNewOperative({ email: '', password: '', first_name: '', last_name: '', role: 'user', avatar_url: '' });
      fetchProfiles();
    } catch (err: any) {
      alert('Creation Error: ' + err.message);
    } finally {
      setCreating(false);
    }
  };


  const deleteProfile = async (id: string) => {
    if (!window.confirm('Are you sure you want to revoke this operative? This will permanently delete their directory profile and revoke all administrative access.')) return;
    
    const { data, error } = await supabase.from('profiles').delete().eq('id', id).select();
    if (error) {
      alert('Error revoking operative: ' + error.message);
    } else if (!data || data.length === 0) {
      alert('SECURITY BLOCK: PostgreSQL Row Level Security (RLS) blocked this transaction. You must execute an administrative policy in your SQL Editor to allow directors to delete other personnel.');
    } else {
      fetchProfiles();
    }
  };

  const handleNewAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_DIM = 250;
        let width = img.width;
        let height = img.height;

        if (width > height && width > MAX_DIM) {
          height *= MAX_DIM / width;
          width = MAX_DIM;
        } else if (height > MAX_DIM) {
          width *= MAX_DIM / height;
          height = MAX_DIM;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        setNewOperative(prev => ({ ...prev, avatar_url: dataUrl }));
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, profileId: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Client-side visual compression matrix
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = async () => {
        const canvas = document.createElement('canvas');
        const MAX_DIM = 250;
        let width = img.width;
        let height = img.height;

        if (width > height && width > MAX_DIM) {
          height *= MAX_DIM / width;
          width = MAX_DIM;
        } else if (height > MAX_DIM) {
          width *= MAX_DIM / height;
          height = MAX_DIM;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        
        // Output as highly optimized jpeg base64
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        
        try {
           const { error } = await supabase.from('profiles').update({ avatar_url: dataUrl }).eq('id', profileId);
           if (error) {
             if (error.message.includes('avatar_url')) {
                alert('CRITICAL: You must execute the SQL Database modification first to enable the avatar_url column.');
             } else {
                throw error;
             }
           } else {
             fetchProfiles();
           }
        } catch(err: any) {
           alert('Transmission Error: ' + err.message);
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  return (
    <AdminLayout>
      <div className="space-y-12 animate-luxury-fade font-body">
        {/* Header Strip */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 pb-8 border-b border-outline-variant/20">
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <span className="material-symbols-outlined text-secondary text-base">groups</span>
              <p className="font-label text-[10px] tracking-[0.2em] uppercase text-outline">Executive Core</p>
            </div>
            <h2 className="font-headline text-4xl text-primary">Executive Directory</h2>
            <p className="text-sm text-on-surface-variant max-w-xl opacity-70">
              Manage the credentials and hierarchical roles of your organization's core operators. Ensure the utmost security by verifying administrative privileges.
            </p>
          </div>
          {currentUser && (
            <div className="flex gap-4 w-full md:w-auto mt-6 md:mt-0">
               <button 
                 onClick={() => setShowCreate(!showCreate)}
                 className="px-6 py-3 bg-primary text-white font-label text-[10px] tracking-widest uppercase hover:bg-secondary transition-colors"
               >
                 {showCreate ? 'Cancel Deployment' : 'Deploy New Operative'}
               </button>
            </div>
          )}
        </div>

        {showCreate && (
          <form onSubmit={handleCreate} className="bg-white dark:bg-[#0a0a0a] border border-outline-variant/10 p-8 space-y-6">
             <h3 className="font-headline text-xl text-primary border-b border-outline-variant/10 pb-4">New Operative Credentials</h3>
             
             {/* Dynamic Avatar UI Dropzone */}
             <div className="flex justify-center mb-8 pt-4">
                <div className="relative w-24 h-24 group/newavatar cursor-pointer shrink-0 rounded-full border border-outline-variant/20 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300">
                   {newOperative.avatar_url ? (
                      <img src={newOperative.avatar_url} alt="Profile Template" className="w-full h-full object-cover group-hover/newavatar:opacity-50 transition-opacity" />
                   ) : (
                      <div className="w-full h-full bg-[#f6f3ee] dark:bg-[#1c1b1b] flex flex-col items-center justify-center text-outline group-hover/newavatar:scale-110 transition-transform">
                        <span className="material-symbols-outlined text-3xl mb-1 opacity-70">add_photo_alternate</span>
                        <span className="text-[7px] font-label uppercase tracking-widest opacity-50">Upload</span>
                      </div>
                   )}
                   <input 
                      type="file" 
                      accept="image/*" 
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                      onChange={handleNewAvatarUpload}
                   />
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                   <label className="font-label text-[9px] tracking-widest uppercase text-outline opacity-50">First Name</label>
                   <input required type="text" className="w-full bg-[#f6f3ee] dark:bg-[#1c1b1b] border-outline-variant/20 p-3 font-body text-sm" value={newOperative.first_name} onChange={e => setNewOperative({...newOperative, first_name: e.target.value})} />
                </div>
                <div className="space-y-2">
                   <label className="font-label text-[9px] tracking-widest uppercase text-outline opacity-50">Last Name</label>
                   <input type="text" className="w-full bg-[#f6f3ee] dark:bg-[#1c1b1b] border-outline-variant/20 p-3 font-body text-sm" value={newOperative.last_name} onChange={e => setNewOperative({...newOperative, last_name: e.target.value})} />
                </div>
                <div className="space-y-2">
                   <label className="font-label text-[9px] tracking-widest uppercase text-outline opacity-50">Email Access</label>
                   <input required type="email" className="w-full bg-[#f6f3ee] dark:bg-[#1c1b1b] border-outline-variant/20 p-3 font-body text-sm" value={newOperative.email} onChange={e => setNewOperative({...newOperative, email: e.target.value})} />
                </div>
                <div className="space-y-2">
                   <label className="font-label text-[9px] tracking-widest uppercase text-outline opacity-50">Initial Password</label>
                   <input required type="text" className="w-full bg-[#f6f3ee] dark:bg-[#1c1b1b] border-outline-variant/20 p-3 font-body text-sm" value={newOperative.password} onChange={e => setNewOperative({...newOperative, password: e.target.value})} />
                </div>
                <div className="space-y-2 md:col-span-2">
                   <label className="font-label text-[9px] tracking-widest uppercase text-outline opacity-50">System Clearance Level</label>
                   <select required className="w-full bg-[#f6f3ee] dark:bg-[#1c1b1b] border-outline-variant/20 p-3 font-body text-sm" value={newOperative.role} onChange={e => setNewOperative({...newOperative, role: e.target.value})}>
                      <option value="user">Agent (Standard Operative)</option>
                      <option value="admin">Director (System Administrator)</option>
                   </select>
                </div>
             </div>
             <div className="flex justify-end pt-4">
               <button 
                 type="submit" 
                 disabled={creating}
                 className="px-8 py-3 bg-secondary text-white font-label text-[10px] tracking-widest uppercase hover:bg-secondary/90 transition-colors disabled:opacity-50"
               >
                 {creating ? 'Authenticating...' : 'Sign Up Operative'}
               </button>
             </div>
          </form>
        )}

        {/* Directory Matrix */}
        <div className="space-y-6">
          {loading ? (
             <div className="py-20 text-center">
                <div className="w-12 h-12 border-t-2 border-secondary animate-spin rounded-full mx-auto"></div>
             </div>
          ) : profiles.length === 0 ? (
             <div className="py-20 text-center bg-[#f6f3ee] dark:bg-[#1c1b1b] border border-dashed border-outline-variant/20">
                <p className="font-label text-[10px] tracking-widest uppercase text-outline">No personnel found.</p>
             </div>
          ) : (
            profiles.map((profile) => (
              <div key={profile.id} className="bg-white dark:bg-[#0a0a0a] border border-outline-variant/10 p-8 flex flex-col lg:flex-row justify-between items-center gap-8 hover:shadow-xl transition-all duration-500 group relative">
                {/* Visual Bio with Hidden File Uploader */}
                <div className="flex items-center gap-8 w-full lg:w-1/3">
                   <div className="relative w-14 h-14 group/avatar cursor-pointer shrink-0">
                      {profile.avatar_url ? (
                         <img src={profile.avatar_url} alt={profile.first_name} className="w-full h-full object-cover shadow-md group-hover/avatar:opacity-50 transition-opacity" />
                      ) : (
                         <div className="w-full h-full bg-[#f6f3ee] dark:bg-[#1c1b1b] border border-outline-variant/20 flex items-center justify-center font-headline text-2xl text-primary group-hover/avatar:scale-110 transition-transform">
                           {profile.first_name ? profile.first_name[0] : 'U'}
                         </div>
                      )}
                      
                      {/* Upload Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity bg-black/50 overflow-hidden">
                          <span className="material-symbols-outlined text-white text-sm">photo_camera</span>
                      </div>
                      <input 
                         type="file" 
                         accept="image/*" 
                         className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                         onChange={(e) => handleFileUpload(e, profile.id)}
                      />
                   </div>
                   <div className="space-y-1">
                      <div className="text-lg font-bold text-primary">
                          {profile.first_name ? `${profile.first_name} ${profile.last_name || ''}` : 'Anonymous Operative'}
                      </div>
                      <div className="font-label text-[9px] text-outline uppercase tracking-widest opacity-60">
                         {profile.phone || 'No direct contact data'}
                      </div>
                   </div>
                </div>

                {/* Status Bio */}
                <div className="w-full lg:w-1/4 space-y-2 lg:border-l lg:border-outline-variant/10 lg:pl-8 flex flex-col justify-center">
                    <p className="font-label text-[8px] text-outline uppercase tracking-widest opacity-40">Operating Node</p>
                    <div className="text-sm font-headline text-primary group-hover:text-secondary transition-colors">
                        {profile.city || 'Cannes'} - {profile.country || 'France'}
                    </div>
                </div>

                {/* Role Status Control */}
                <div className="w-full lg:w-1/4 flex flex-col lg:items-center gap-2 lg:border-l lg:border-outline-variant/10 lg:pl-8 relative group/actions">
                   <select 
                     value={profile.role}
                     onChange={(e) => updateRole(profile.id, e.target.value)}
                     disabled={profile.id === currentUser?.id}
                     className={clsx(
                        "font-label text-[10px] font-bold tracking-[0.2em] uppercase bg-transparent border-0 p-0 focus:ring-0 cursor-pointer",
                        profile.role === 'admin' ? 'text-secondary' : 'text-outline',
                        profile.id === currentUser?.id ? 'opacity-50 cursor-not-allowed' : ''
                     )}
                   >
                     <option value="user">Agent (User)</option>
                     <option value="admin">Director (Admin)</option>
                   </select>
                   <p className="font-label text-[8px] text-outline uppercase tracking-[0.3em] font-medium">Clearance Level</p>
                   
                   {profile.id !== currentUser?.id && (
                     <button 
                       onClick={() => deleteProfile(profile.id)}
                       title="Revoke Operative"
                       className="absolute top-1/2 -translate-y-1/2 right-0 lg:right-auto lg:-right-6 opacity-0 group-hover/actions:opacity-100 material-symbols-outlined text-outline hover:text-red-500 transition-all font-bold"
                     >
                       delete
                     </button>
                   )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default Team;
