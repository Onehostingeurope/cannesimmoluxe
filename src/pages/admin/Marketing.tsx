import { useState, useEffect } from 'react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { Button } from '../../components/ui/Button';
import { supabase } from '../../lib/supabase';
import { clsx } from 'clsx';

const Marketing = () => {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('marketing_campaigns')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching campaigns:', error);
    } else {
      setCampaigns(data || []);
    }
    setLoading(false);
  };

  const createCampaign = async () => {
    const title = prompt('Enter Campaign Title:');
    if (!title) return;

    const { error } = await supabase.from('marketing_campaigns').insert([{
      title,
      type: 'Email Newsletter',
      status: 'draft',
      budget: 0,
      performance_metrics: { open_rate: 0, clicks: 0 }
    }]);

    if (error) {
      alert('Failed to create campaign. Ensure SQL table exists.');
      console.error(error);
    } else {
      fetchCampaigns();
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    const { error } = await supabase
      .from('marketing_campaigns')
      .update({ status: newStatus })
      .eq('id', id);

    if (error) {
      alert('Error updating status: ' + error.message);
    } else {
      fetchCampaigns();
    }
  };

  const deleteCampaign = async (id: string) => {
    if (!confirm('Are you certain you want to redact this campaign?')) return;
    const { error } = await supabase.from('marketing_campaigns').delete().eq('id', id);
    if (!error) fetchCampaigns();
  };

  return (
    <AdminLayout>
      <div className="space-y-12 animate-luxury-fade font-body">
        {/* Header Strip */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 pb-8 border-b border-outline-variant/20">
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <span className="material-symbols-outlined notranslate text-secondary text-base" translate="no">campaign</span>
              <p className="font-label text-[10px] tracking-[0.2em] uppercase text-outline">Outreach Strategy</p>
            </div>
            <h2 className="font-headline text-4xl text-primary">Marketing Orchestrator</h2>
            <p className="text-sm text-on-surface-variant max-w-xl opacity-70">
              Disseminate targeted communications to our exclusive clientele. Track engagement algorithms, conceptualize newsletters, and monitor engagement algorithms.
            </p>
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <Button variant="primary" className="flex-1 md:flex-none" onClick={createCampaign}>Initiate Campaign</Button>
          </div>
        </div>

        {/* Campaign Matrix */}
        <div className="space-y-6">
          {loading ? (
             <div className="py-20 text-center">
                <div className="w-12 h-12 border-t-2 border-secondary animate-spin rounded-full mx-auto"></div>
             </div>
          ) : campaigns.length === 0 ? (
             <div className="py-20 text-center bg-[#f6f3ee] dark:bg-[#1c1b1b] border border-dashed border-outline-variant/20">
                <p className="font-label text-[10px] tracking-widest uppercase text-outline">No active campaigns. Initiate a new strategy to begin.</p>
             </div>
          ) : (
            campaigns.map((campaign) => (
              <div key={campaign.id} className="bg-white dark:bg-[#0a0a0a] border border-outline-variant/10 p-8 flex flex-col lg:flex-row justify-between items-center gap-8 hover:shadow-xl transition-all duration-500 group">
                {/* Visual Bio */}
                <div className="flex items-center gap-8 w-full lg:w-1/3">
                   <div className="w-14 h-14 bg-[#f6f3ee] dark:bg-[#1c1b1b] border border-outline-variant/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                     <span className="material-symbols-outlined notranslate" translate="no">mail</span>
                   </div>
                   <div className="space-y-1">
                      <div className="text-lg font-bold text-primary">{campaign.title}</div>
                      <div className="font-label text-[9px] text-outline uppercase tracking-widest opacity-60">
                         {campaign.type}
                      </div>
                   </div>
                </div>

                {/* Performance Insight */}
                <div className="w-full lg:w-1/4 space-y-2 lg:border-l lg:border-outline-variant/10 lg:pl-8 flex gap-8">
                   <div>
                       <p className="font-label text-[8px] text-outline uppercase tracking-widest opacity-40">Open Rate</p>
                       <div className="text-xl font-headline text-primary group-hover:text-secondary transition-colors">
                          {campaign.performance_metrics?.open_rate || 0}%
                       </div>
                   </div>
                   <div>
                       <p className="font-label text-[8px] text-outline uppercase tracking-widest opacity-40">Click Velocity</p>
                       <div className="text-xl font-headline text-primary group-hover:text-secondary transition-colors">
                          {campaign.performance_metrics?.clicks || 0}
                       </div>
                   </div>
                </div>

                {/* Status Control */}
                <div className="w-full lg:w-1/4 flex flex-col lg:items-center gap-2 lg:border-l lg:border-outline-variant/10 lg:pl-8">
                   <select 
                     value={campaign.status}
                     onChange={(e) => updateStatus(campaign.id, e.target.value)}
                     className={clsx(
                        "font-label text-[10px] font-bold tracking-[0.2em] uppercase bg-transparent border-0 p-0 focus:ring-0 cursor-pointer",
                        campaign.status === 'active' ? 'text-green-500' :
                        campaign.status === 'completed' ? 'text-blue-500' : 'text-gray-500'
                     )}
                   >
                     <option value="draft">Draft</option>
                     <option value="active">Active</option>
                     <option value="completed">Completed</option>
                   </select>
                   <p className="font-label text-[8px] text-outline uppercase tracking-[0.3em] font-medium">Lifecycle State</p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 w-full lg:w-auto lg:justify-end">
                   <button 
                     onClick={() => deleteCampaign(campaign.id)}
                     className="w-12 h-12 flex items-center justify-center bg-[#f6f3ee] dark:bg-[#1c1b1b] border border-outline-variant/10 text-red-500/50 hover:text-red-500 hover:border-red-500 transition-all cursor-pointer"
                   >
                     <span className="material-symbols-outlined notranslate text-xl" translate="no">delete</span>
                   </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default Marketing;
