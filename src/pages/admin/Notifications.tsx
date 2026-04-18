import React, { useState, useEffect } from 'react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { supabase } from '../../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';

export const Notifications = () => {
  const [leads, setLeads] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    
    // Fetch unread CRM inquiries
    const { data: leadData } = await supabase
      .from('inquiries')
      .select('*, properties(title)')
      .eq('lead_status', 'new')
      .order('created_at', { ascending: false });
      
    // Fetch newly registered users (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'user')
      .gte('created_at', sevenDaysAgo.toISOString())
      .order('created_at', { ascending: false });

    if (leadData) setLeads(leadData);
    if (profileData) setProfiles(profileData);
    
    setLoading(false);
  };

  const markLeadAsRead = async (id: string, e: React.MouseEvent) => {
     e.stopPropagation();
     await supabase.from('inquiries').update({ lead_status: 'contacted' }).eq('id', id);
     fetchData();
  };

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto animate-luxury-fade font-body pb-24">
         <div className="border-b border-outline-variant/20 pb-8 mb-12">
            <h2 className="font-headline text-4xl text-primary mb-2">Notification Control Center</h2>
            <p className="text-on-surface-variant font-label text-[10px] uppercase tracking-widest">Global Stream of Organic Activity</p>
         </div>

         {loading ? (
             <div className="flex justify-center py-20">
               <div className="w-12 h-12 border-t-2 border-secondary animate-spin rounded-full"></div>
             </div>
         ) : (
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                 
                 {/* Left Column: CRM Leads */}
                 <div className="space-y-8">
                     <div className="flex items-center justify-between border-b border-outline-variant/10 pb-4">
                        <div className="flex items-center gap-3">
                           <span className="material-symbols-outlined notranslate text-secondary" translate="no">support_agent</span>
                           <h3 className="font-headline text-xl text-primary">Unread CRM Requests</h3>
                        </div>
                        <span className="bg-red-600/10 text-red-600 font-bold px-3 py-1 rounded-full text-[10px] tracking-widest">{leads.length} Pending</span>
                     </div>

                     {leads.length === 0 ? (
                        <div className="p-12 text-center bg-[#f6f3ee] dark:bg-[#1c1b1b] border border-dashed border-outline-variant/20">
                           <p className="font-label text-[9px] uppercase tracking-widest text-outline">Zero unread inquiries.</p>
                        </div>
                     ) : (
                        <div className="space-y-4">
                           {leads.map(lead => (
                              <div key={lead.id} onClick={() => navigate('/admin/crm')} className="bg-white dark:bg-[#0a0a0a] border border-outline-variant/10 p-6 flex flex-col gap-4 cursor-pointer hover:shadow-lg transition-all group relative overflow-hidden">
                                 <div className="absolute top-0 right-0 w-2 h-full bg-secondary"></div>
                                 <div className="flex justify-between items-start">
                                    <div>
                                       <h4 className="font-headline text-lg text-primary">{lead.first_name} {lead.last_name}</h4>
                                       <p className="font-label text-[9px] tracking-widest uppercase text-outline opacity-60 mt-1">{lead.inquiry_type} • {new Date(lead.created_at).toLocaleDateString()}</p>
                                    </div>
                                    <button onClick={(e) => markLeadAsRead(lead.id, e)} className="text-[10px] font-label uppercase tracking-widest px-4 py-2 bg-[#f6f3ee] dark:bg-[#1c1b1b] text-outline hover:bg-secondary hover:text-white transition-colors">
                                       Mark Read
                                    </button>
                                 </div>
                                 <p className="text-sm text-on-surface-variant italic border-l-2 border-outline-variant/20 pl-4 py-1 line-clamp-2">"{lead.message}"</p>
                                 <div className="text-[10px] text-secondary font-label uppercase tracking-widest pt-2 border-t border-outline-variant/10">
                                    Target Asset: {lead.properties?.title || 'General Agency Contact'}
                                 </div>
                              </div>
                           ))}
                        </div>
                     )}
                 </div>

                 {/* Right Column: New Registrations */}
                 <div className="space-y-8">
                     <div className="flex items-center justify-between border-b border-outline-variant/10 pb-4">
                        <div className="flex items-center gap-3">
                           <span className="material-symbols-outlined notranslate text-secondary" translate="no">how_to_reg</span>
                           <h3 className="font-headline text-xl text-primary">New Client Registrations</h3>
                        </div>
                        <span className="bg-secondary/10 text-secondary font-bold px-3 py-1 rounded-full text-[10px] tracking-widest">{profiles.length} Past 7 Days</span>
                     </div>

                     {profiles.length === 0 ? (
                        <div className="p-12 text-center bg-[#f6f3ee] dark:bg-[#1c1b1b] border border-dashed border-outline-variant/20">
                           <p className="font-label text-[9px] uppercase tracking-widest text-outline">Zero new organic registrations.</p>
                        </div>
                     ) : (
                        <div className="space-y-4">
                           {profiles.map(profile => (
                              <div key={profile.id} className="bg-white dark:bg-[#0a0a0a] border border-outline-variant/10 p-6 flex items-center justify-between group hover:shadow-md transition-all">
                                 <div className="flex items-center gap-4">
                                     <div className="flex-shrink-0 w-12 h-12 bg-[#f6f3ee] dark:bg-[#1c1b1b] flex items-center justify-center font-headline text-2xl text-secondary">
                                        {profile.first_name ? profile.first_name[0] : 'U'}
                                     </div>
                                     <div>
                                        <h4 className="font-headline text-lg text-primary">{profile.first_name} {profile.last_name}</h4>
                                        <div className="flex gap-4 mt-1">
                                           <span className="font-label text-[9px] tracking-widest uppercase text-outline opacity-60">{profile.email}</span>
                                           <span className="font-label text-[9px] tracking-widest uppercase text-outline opacity-60 text-secondary">{profile.city}, {profile.country}</span>
                                        </div>
                                     </div>
                                 </div>
                                 <div className="text-right">
                                    <p className="font-label text-[9px] tracking-widest uppercase text-outline">Linked On</p>
                                    <p className="text-sm font-bold text-primary mt-1">{new Date(profile.created_at).toLocaleDateString()}</p>
                                 </div>
                              </div>
                           ))}
                        </div>
                     )}
                 </div>

             </div>
         )}
      </div>
    </AdminLayout>
  );
};
