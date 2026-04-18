import { useState, useEffect } from 'react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { Button } from '../../components/ui/Button';
import { supabase } from '../../lib/supabase';
import { clsx } from 'clsx';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalValue: 0,
    activeLeads: 0,
    efficiency: '12h',
    momentum: '+14.2%'
  });
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [recentProfiles, setRecentProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    
    // 1. Fetch Stats
    const { data: properties } = await supabase.from('properties').select('price');
    const { count: inquiriesCount } = await supabase.from('inquiries').select('*', { count: 'exact', head: true });
    
    const totalValue = properties?.reduce((sum, p) => sum + (p.price || 0), 0) || 0;
    
    // 2. Fetch Recent Activities (Inquiries)
    const { data: recentInquiries } = await supabase
      .from('inquiries')
      .select('*, profiles(first_name, last_name), properties(title)')
      .order('created_at', { ascending: false })
      .limit(5);

    // 3. Fetch Recent User Registrations (Profiles)
    const { data: fetchedProfiles } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);

    setStats(prev => ({
      ...prev,
      totalValue,
      activeLeads: inquiriesCount || 0
    }));

    setRecentActivities(recentInquiries || []);
    setRecentProfiles(fetchedProfiles || []);
    setLoading(false);
  };

  return (
    <AdminLayout>
      <div className="space-y-12 animate-luxury-fade font-body">
        {/* Executive Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 pb-8 border-b border-outline-variant/20">
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <span className="material-symbols-outlined text-secondary text-base">monitoring</span>
              <p className="font-label text-[10px] tracking-[0.2em] uppercase text-outline">Executive Intelligence</p>
            </div>
            <h2 className="font-headline text-4xl text-primary">Control Center</h2>
            <p className="text-sm text-on-surface-variant max-w-xl opacity-70">
              Real-time orchestration of the French Riviera's most prestigious real estate operations. Monitor the technical sales funnel and editorial lifecycle.
            </p>
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <Button variant="outline" className="flex-1 md:flex-none">Download Report</Button>
            <Button 
                variant="primary" 
                className="flex-1 md:flex-none"
                onClick={() => navigate('/admin/properties/new')}
            >
                Deploy Asset
            </Button>
          </div>
        </div>

        {/* Technical KPI Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: 'Portfolio Valuation', value: `€${(stats.totalValue / 1000000).toFixed(1)}M`, icon: 'account_balance_wallet', trend: stats.momentum },
            { label: 'Active Intelligence', value: stats.activeLeads.toString(), icon: 'psychology', trend: '+5 new' },
            { label: 'Response Velocity', value: stats.efficiency, icon: 'speed', trend: '-2h from avg' },
            { label: 'Conversion Delta', value: '24.8%', icon: 'trending_up', trend: '+2.1%' },
          ].map((kpi, idx) => (
            <div key={idx} className="bg-white dark:bg-[#0a0a0a] p-8 border border-outline-variant/10 group hover:border-secondary transition-all duration-500">
               <div className="flex justify-between items-start mb-6">
                  <span className="material-symbols-outlined text-secondary text-2xl group-hover:scale-110 transition-transform">{kpi.icon}</span>
                  <span className="text-[10px] font-label tracking-widest text-green-500 dark:text-green-400 font-bold">{kpi.trend}</span>
               </div>
               <div className="space-y-1">
                  <p className="font-label text-[9px] tracking-[0.2em] uppercase text-outline opacity-60">{kpi.label}</p>
                  <p className="font-headline text-3xl text-primary">{kpi.value}</p>
               </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Real-time Activity Matrix */}
          <div className="lg:col-span-8 space-y-8">
             <div className="flex justify-between items-center pb-4 border-b border-outline-variant/20">
                <h3 className="font-headline text-2xl text-primary">Technical Activity Ledger</h3>
                <button 
                  onClick={() => navigate('/admin/crm')}
                  className="font-label text-[10px] tracking-widest uppercase text-outline hover:text-secondary transition-colors"
                >
                  View Full Registry
                </button>
             </div>

             <div className="space-y-1">
                {loading ? (
                   <div className="py-20 text-center">
                      <div className="w-10 h-10 border-t-2 border-secondary animate-spin rounded-full mx-auto"></div>
                   </div>
                ) : recentActivities.length === 0 ? (
                  <div className="p-12 text-center bg-[#f6f3ee] dark:bg-[#1c1b1b] border border-dashed border-outline-variant/20">
                     <p className="font-label text-[10px] tracking-widest uppercase text-outline">No recent telemetry detected.</p>
                  </div>
                ) : (
                  recentActivities.map((activity) => (
                    <div key={activity.id} className="p-6 bg-[#f6f3ee] dark:bg-[#1c1b1b] border-l-2 border-transparent hover:border-secondary hover:bg-white dark:hover:bg-black transition-all group flex items-center justify-between">
                       <div className="flex items-center gap-6">
                          <div className="w-10 h-10 bg-white dark:bg-black border border-outline-variant/20 flex items-center justify-center font-headline italic text-lg text-primary">
                             {activity.profiles?.first_name?.[0] || 'L'}
                          </div>
                          <div>
                             <p className="font-label text-[10px] tracking-widest uppercase text-primary font-bold">
                                {activity.profiles ? `${activity.profiles.first_name} ${activity.profiles.last_name || ''}` : 'New Inquiry'}
                             </p>
                             <p className="text-[11px] text-on-surface-variant opacity-70">
                                Interested in <span className="text-secondary font-medium">{activity.properties?.title || 'Portfolio'}</span>
                             </p>
                          </div>
                       </div>
                       <div className="text-right">
                          <p className="font-label text-[9px] tracking-widest uppercase text-outline mb-1">{new Date(activity.created_at).toLocaleTimeString()}</p>
                          <span className={clsx(
                            "px-2 py-0.5 text-[8px] tracking-widest uppercase font-bold",
                            activity.lead_status === 'new' ? "bg-secondary text-white" : "bg-outline-variant/20 text-outline"
                          )}>
                             {activity.lead_status}
                          </span>
                       </div>
                    </div>
              </div>

             <div className="flex justify-between items-center pb-4 pt-12 border-b border-outline-variant/20">
                <h3 className="font-headline text-2xl text-primary">Client Registry</h3>
             </div>

             <div className="space-y-1">
                {loading ? (
                   <div className="py-20 text-center">
                      <div className="w-10 h-10 border-t-2 border-secondary animate-spin rounded-full mx-auto"></div>
                   </div>
                ) : recentProfiles.length === 0 ? (
                  <div className="p-12 text-center bg-[#f6f3ee] dark:bg-[#1c1b1b] border border-dashed border-outline-variant/20">
                     <p className="font-label text-[10px] tracking-widest uppercase text-outline">No user registrations detected.</p>
                  </div>
                ) : (
                  recentProfiles.map((profile) => (
                    <div key={profile.id} className="p-6 bg-[#f6f3ee] dark:bg-[#1c1b1b] border-l-2 border-transparent hover:border-secondary hover:bg-white dark:hover:bg-black transition-all group flex items-center justify-between">
                       <div className="flex items-center gap-6">
                          <div className="w-10 h-10 bg-white dark:bg-black border border-outline-variant/20 flex items-center justify-center font-headline italic text-lg text-primary">
                             {profile.first_name?.[0] || 'U'}
                          </div>
                          <div>
                             <p className="font-label text-[10px] tracking-widest uppercase text-primary font-bold">
                                {profile.first_name || 'Anonymous'} {profile.last_name || ''}
                             </p>
                             <p className="text-[11px] text-on-surface-variant opacity-70">
                                Global Clearance: <span className="text-secondary font-medium">{profile.role || 'user'}</span>
                             </p>
                          </div>
                       </div>
                       <div className="text-right">
                          <p className="font-label text-[9px] tracking-widest uppercase text-outline mb-1">
                            {profile.created_at ? new Date(profile.created_at).toLocaleDateString() : 'Active'}
                          </p>
                          <span className={clsx(
                            "px-2 py-0.5 text-[8px] tracking-widest uppercase font-bold",
                            profile.role === 'admin' ? "bg-red-500 text-white" : "bg-outline-variant/20 text-outline"
                          )}>
                             {profile.role || 'client'}
                          </span>
                       </div>
                    </div>
                  ))
                )}
             </div>

          </div>

          {/* System Health & Briefing */}
          <div className="lg:col-span-4 space-y-8">
             <div className="bg-black dark:bg-[#1c1b1b] text-white p-10 space-y-8">
                <div className="space-y-2">
                   <p className="font-label text-[9px] tracking-widest uppercase text-secondary font-bold">Curator's Briefing</p>
                   <h4 className="font-headline text-2xl">Daily Intel</h4>
                </div>
                <div className="space-y-6 text-sm opacity-80 leading-relaxed font-body italic">
                   "Inventory momentum is strong in the Croisette sector. Technical inquiries have surged by 15% following the 'Art of Living' editorial deployment. Recommend updating the Villa Azurite technical dossier."
                </div>
                <div className="pt-8 border-t border-white/10 flex justify-between items-center">
                   <div className="flex -space-x-3">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="w-8 h-8 rounded-full border-2 border-black bg-outline-variant overflow-hidden">
                           <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="Agent" className="w-full h-full object-cover" />
                        </div>
                      ))}
                   </div>
                   <p className="font-label text-[9px] tracking-widest uppercase text-secondary">3 Agents Online</p>
                </div>
             </div>
             
             <div className="p-8 border border-outline-variant/20 space-y-6">
                <h4 className="font-label text-[10px] tracking-widest uppercase text-primary font-bold">Global Status</h4>
                <div className="space-y-4">
                   {[
                     { label: 'Cloud Persistence', status: 'Operational' },
                     { label: 'Asset CDN', status: 'Operational' },
                     { label: 'CRM API Cluster', status: 'Optimal' },
                   ].map((sys, sIdx) => (
                     <div key={sIdx} className="flex justify-between items-center">
                        <span className="text-[10px] font-label tracking-widest uppercase text-outline">{sys.label}</span>
                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                     </div>
                   ))}
                </div>
             </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
