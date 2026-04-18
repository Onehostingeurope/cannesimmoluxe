import { useState, useEffect } from 'react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { Button } from '../../components/ui/Button';
import { supabase } from '../../lib/supabase';
import { clsx } from 'clsx';

const CRM = () => {
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newLead, setNewLead] = useState({ email: '', message: '', intensity: 'Low' });

  const statuses = ['All', 'new', 'contacted', 'qualified', 'visit', 'offer', 'won', 'lost'];

  useEffect(() => {
    fetchLeads();
  }, [selectedStatus]);

  const fetchLeads = async () => {
    setLoading(true);
    let query = supabase
      .from('inquiries')
      .select('*, profiles(first_name, last_name, phone), properties(title)')
      .order('created_at', { ascending: false });

    if (selectedStatus !== 'All') {
      query = query.eq('lead_status', selectedStatus);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching leads:', error);
    } else {
      setLeads(data || []);
    }
    setLoading(false);
  };

  const updateLeadStatus = async (id: string, newStatus: string) => {
    const { error } = await supabase
      .from('inquiries')
      .update({ lead_status: newStatus })
      .eq('id', id);

    if (error) alert('Error updating lead status: ' + error.message);
    else fetchLeads();
  };

  const handleCreatePrompt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLead.email) return;
    
    setCreating(true);
    const { error } = await supabase.from('inquiries').insert([{
      email: newLead.email,
      message: newLead.message,
      lead_status: 'new',
      intensity: newLead.intensity,
    }]);

    if (error) {
      alert('Error creating lead: ' + error.message);
    } else {
      setNewLead({ email: '', message: '', intensity: 'Low' });
      setShowCreate(false);
      fetchLeads();
    }
    setCreating(false);
  };

  return (
    <AdminLayout>
      <div className="space-y-12 animate-luxury-fade font-body">
        {/* Header Strip */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 pb-8 border-b border-outline-variant/20">
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <span className="material-symbols-outlined text-secondary text-base">diversity_3</span>
              <p className="font-label text-[10px] tracking-[0.2em] uppercase text-outline">Client Intelligence</p>
            </div>
            <h2 className="font-headline text-4xl text-primary">Lead Orchestration</h2>
            <p className="text-sm text-on-surface-variant max-w-xl opacity-70">
              Manage the life-cycle of your high-net-worth individual leads. Track engagement intensity, schedule private viewings, and move prospects through the technical sales funnel.
            </p>
          </div>
          <div className="flex gap-4 w-full md:w-auto mt-6 md:mt-0">
            <Button variant="outline" className="flex-1 md:flex-none" onClick={() => alert("CSV Export pipeline requires Data Warehouse coupling.")}>Export Registry</Button>
            <Button variant="primary" className="flex-1 md:flex-none" onClick={() => setShowCreate(!showCreate)}>
               {showCreate ? 'Cancel' : 'Create Lead'}
            </Button>
          </div>
        </div>

        {/* Lead Insertion Panel */}
        {showCreate && (
          <form onSubmit={handleCreatePrompt} className="bg-white dark:bg-[#0a0a0a] border border-outline-variant/10 p-8 space-y-6">
             <h3 className="font-headline text-xl text-primary border-b border-outline-variant/10 pb-4">Manual Lead Injection</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                   <label className="font-label text-[9px] tracking-widest uppercase text-outline opacity-50">Direct Access Email</label>
                   <input required type="email" className="w-full bg-[#f6f3ee] dark:bg-[#1c1b1b] border-outline-variant/20 p-3 font-body text-sm" value={newLead.email} onChange={e => setNewLead({...newLead, email: e.target.value})} />
                </div>
                <div className="space-y-2">
                   <label className="font-label text-[9px] tracking-widest uppercase text-outline opacity-50">Engagement Intensity</label>
                   <select className="w-full bg-[#f6f3ee] dark:bg-[#1c1b1b] border-outline-variant/20 p-3 font-body text-sm" value={newLead.intensity} onChange={e => setNewLead({...newLead, intensity: e.target.value})}>
                      <option value="Low">Low Priority</option>
                      <option value="High">High Visibility</option>
                      <option value="Critical">Critical Acquisition</option>
                   </select>
                </div>
                <div className="space-y-2 md:col-span-2">
                   <label className="font-label text-[9px] tracking-widest uppercase text-outline opacity-50">Initial Profile Notes</label>
                   <textarea rows={3} className="w-full bg-[#f6f3ee] dark:bg-[#1c1b1b] border-outline-variant/20 p-3 font-body text-sm" value={newLead.message} onChange={e => setNewLead({...newLead, message: e.target.value})} />
                </div>
             </div>
             <div className="flex justify-end pt-4">
               <button type="submit" disabled={creating} className="px-8 py-3 bg-secondary text-white font-label text-[10px] tracking-widest uppercase hover:bg-secondary/90 transition-colors disabled:opacity-50">
                 {creating ? 'Injecting...' : 'Deploy To Registry'}
               </button>
             </div>
          </form>
        )}

        {/* Global Controls & Filters */}
        <div className="flex flex-col md:flex-row gap-8 items-center py-4 bg-[#f6f3ee] dark:bg-[#1c1b1b] px-6 border border-outline-variant/10">
           <div className="flex items-center gap-8 overflow-x-auto w-full md:w-auto no-scrollbar pb-2 md:pb-0">
            {statuses.map(status => (
              <button 
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={clsx(
                  "font-label text-[10px] tracking-[0.2em] uppercase whitespace-nowrap transition-all duration-300 outline-none border-b-2 pb-1",
                  selectedStatus === status 
                    ? "text-primary font-bold border-secondary" 
                    : "text-outline border-transparent hover:text-primary"
                )}
              >
                {status}
              </button>
            ))}
          </div>
          
          <div className="relative flex-grow group w-full md:w-auto border-l-0 md:border-l border-outline-variant/20 pl-0 md:pl-8">
            <span className="material-symbols-outlined absolute left-0 md:left-8 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">person_search</span>
            <input 
              type="text" 
              placeholder="SEARCH THE REGISTRY..." 
              className="bg-transparent border-0 border-b border-outline-variant/20 w-full pl-10 pr-4 py-2 text-[10px] tracking-[0.2em] uppercase outline-none focus:border-primary transition-all placeholder:text-outline/40" 
            />
          </div>
        </div>

        {/* Lead Registry Matrix */}
        <div className="space-y-6">
          {loading ? (
             <div className="py-20 text-center">
                <div className="w-12 h-12 border-t-2 border-secondary animate-spin rounded-full mx-auto"></div>
             </div>
          ) : leads.length === 0 ? (
             <div className="py-20 text-center bg-[#f6f3ee] dark:bg-[#1c1b1b] border border-dashed border-outline-variant/20">
                <p className="font-label text-[10px] tracking-widest uppercase text-outline">No active leads matching current filters.</p>
             </div>
          ) : (
            leads.map((lead) => (
              <div key={lead.id} className="bg-white dark:bg-[#0a0a0a] border border-outline-variant/10 p-8 flex flex-col lg:flex-row justify-between items-center gap-8 hover:shadow-xl transition-all duration-500 group">
                {/* Profile Bio */}
                <div className="flex items-center gap-8 w-full lg:w-1/3">
                   <div className="w-14 h-14 bg-[#f6f3ee] dark:bg-[#1c1b1b] border border-outline-variant/20 flex items-center justify-center font-headline italic text-2xl text-primary group-hover:scale-110 transition-transform">
                     {lead.profiles?.first_name?.[0] || 'L'}
                   </div>
                   <div className="space-y-1">
                      <div className="text-lg font-bold text-primary">
                        {lead.profiles ? `${lead.profiles.first_name} ${lead.profiles.last_name || ''}` : 'Anonymous Lead'}
                      </div>
                      <div className="font-label text-[9px] text-outline uppercase tracking-widest opacity-60 flex items-center gap-2">
                         <span className="material-symbols-outlined text-sm">alternate_email</span>
                         {lead.profiles?.phone || lead.profiles?.email || 'No Contact Data'}
                      </div>
                   </div>
                </div>

                {/* Engagement Insight */}
                <div className="w-full lg:w-1/4 space-y-2 lg:border-l lg:border-outline-variant/10 lg:pl-8">
                   <p className="font-label text-[8px] text-outline uppercase tracking-widest opacity-40">Portfolio Focus</p>
                   <div className="text-sm font-headline text-primary group-hover:text-secondary transition-colors">
                      {lead.properties?.title || 'General Inquiry'}
                   </div>
                   <p className="text-[10px] text-on-surface-variant opacity-60 italic">
                      Received {new Date(lead.created_at).toLocaleDateString()}
                   </p>
                </div>

                {/* Status Matrix */}
                <div className="w-full lg:w-1/4 flex flex-col lg:items-center gap-2 lg:border-l lg:border-outline-variant/10 lg:pl-8">
                   <div className="flex items-center gap-3">
                      <span className={clsx(
                        "w-2 h-2 rounded-full",
                        lead.intensity === 'Critical' ? 'bg-red-500 animate-pulse' : 
                        lead.intensity === 'High' ? 'bg-orange-500' : 'bg-green-500'
                      )}></span>
                      <select 
                        value={lead.lead_status}
                        onChange={(e) => updateLeadStatus(lead.id, e.target.value)}
                        className="font-label text-[10px] font-bold tracking-[0.2em] uppercase text-primary bg-transparent border-0 p-0 focus:ring-0 cursor-pointer"
                      >
                         {statuses.filter(s => s !== 'All').map(s => (
                           <option key={s} value={s}>{s}</option>
                         ))}
                      </select>
                   </div>
                   <p className="font-label text-[8px] text-outline uppercase tracking-[0.3em] font-medium">{lead.intensity || 'LOW'} ENGAGEMENT</p>
                </div>

                {/* Orchestration Actions */}
                <div className="flex items-center gap-3 w-full lg:w-auto lg:justify-end">
                   {[
                     { icon: 'forum', title: 'Open Conversation' },
                     { icon: 'call', title: 'Initiate Call' },
                     { icon: 'event', title: 'Schedule Visit' },
                   ].map((action, aIdx) => (
                     <button 
                       key={aIdx}
                       title={action.title}
                       className="w-12 h-12 flex items-center justify-center bg-[#f6f3ee] dark:bg-[#1c1b1b] border border-outline-variant/10 text-outline hover:text-secondary hover:border-secondary transition-all"
                     >
                       <span className="material-symbols-outlined text-xl">{action.icon}</span>
                     </button>
                   ))}
                   <div className="w-px h-10 bg-outline-variant/20 mx-2 hidden lg:block" />
                   <button className="w-12 h-12 flex items-center justify-center bg-black dark:bg-white text-white dark:text-black hover:bg-secondary hover:text-white transition-all">
                      <span className="material-symbols-outlined text-xl">arrow_forward_ios</span>
                   </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Intelligence Statistics */}
        <div className="pt-12 border-t border-outline-variant/20 flex flex-col md:flex-row justify-between items-center gap-10">
           <div className="flex items-center gap-3 opacity-60">
              <span className="material-symbols-outlined text-secondary">cloud_sync</span>
              <p className="font-label text-[10px] tracking-widest uppercase text-outline">Real-time sync with executive cluster — {leads.length} active leads</p>
           </div>
           
           <div className="flex gap-16">
              <div className="text-center group">
                 <div className="font-headline text-3xl text-primary group-hover:text-secondary transition-colors">84%</div>
                 <p className="font-label text-[9px] text-outline uppercase tracking-widest mt-1">Conversion Momentum</p>
              </div>
              <div className="text-center group">
                 <div className="font-headline text-3xl text-primary group-hover:text-secondary transition-colors">12h</div>
                 <p className="font-label text-[9px] text-outline uppercase tracking-widest mt-1">Efficiency Metric</p>
              </div>
           </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default CRM;
;
