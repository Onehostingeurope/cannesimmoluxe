import { useState, useEffect } from 'react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { supabase } from '../../lib/supabase';
import { clsx } from 'clsx';
import { useAuthStore } from '../../store/useAuthStore';

const Team = () => {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
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
    const { error } = await supabase
      .from('profiles')
      .update({ role: newRole })
      .eq('id', id);

    if (error) {
      alert('Error updating role: ' + error.message);
    } else {
      fetchProfiles();
    }
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
        </div>

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
              <div key={profile.id} className="bg-white dark:bg-[#0a0a0a] border border-outline-variant/10 p-8 flex flex-col lg:flex-row justify-between items-center gap-8 hover:shadow-xl transition-all duration-500 group">
                {/* Visual Bio */}
                <div className="flex items-center gap-8 w-full lg:w-1/3">
                   <div className="w-14 h-14 bg-[#f6f3ee] dark:bg-[#1c1b1b] border border-outline-variant/20 flex items-center justify-center font-headline text-2xl text-primary group-hover:scale-110 transition-transform">
                     {profile.first_name ? profile.first_name[0] : 'U'}
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
                <div className="w-full lg:w-1/4 flex flex-col lg:items-center gap-2 lg:border-l lg:border-outline-variant/10 lg:pl-8">
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
