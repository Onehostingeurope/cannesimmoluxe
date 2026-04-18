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
  const [activeDossier, setActiveDossier] = useState<any | null>(null);
  const [logType, setLogType] = useState('Call');
  const [logNote, setLogNote] = useState('');
  const [logging, setLogging] = useState(false);

  const [availableProperties, setAvailableProperties] = useState<any[]>([]);
  const [newLead, setNewLead] = useState({ 
    email: '', 
    first_name: '', 
    last_name: '', 
    phone: '', 
    message: '', 
    intensity: 'Low',
    property_id: ''
  });

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

    const { data: props } = await supabase.from('properties').select('id, title').order('title');
    if (props) setAvailableProperties(props);

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
    if (!newLead.email || !newLead.property_id) {
       alert("Email and Property Association are strictly required payload attributes.");
       return;
    }
    
    setCreating(true);
    const { error } = await supabase.from('inquiries').insert([{
      property_id: newLead.property_id,
      message: newLead.message,
      lead_status: 'new',
      tracking_data: {
         email: newLead.email,
         first_name: newLead.first_name,
         last_name: newLead.last_name,
         phone: newLead.phone,
         intensity: newLead.intensity
      }
    }]);

    if (error) {
      alert('Error creating lead: ' + error.message);
    } else {
      setNewLead({ email: '', first_name: '', last_name: '', phone: '', message: '', intensity: 'Low', property_id: '' });
      setShowCreate(false);
      fetchLeads();
    }
    setCreating(false);
  };

  const handleLogInteraction = async () => {
    if (!activeDossier || !logNote.trim()) return;
    setLogging(true);

    const newLog = {
       id: Math.random().toString(36).substring(2),
       date: new Date().toISOString(),
       type: logType,
       note: logNote.trim(),
       admin_id: 'admin' // In a full scalable backend, you'd pull this from useAuthStore if needed
    };

    const currentTracking = activeDossier.tracking_data || {};
    const currentHistory = currentTracking.history || [];
    const updatedHistory = [newLog, ...currentHistory];

    const updatedTracking = {
       ...currentTracking,
       history: updatedHistory
    };

    const { error } = await supabase
       .from('inquiries')
       .update({ tracking_data: updatedTracking })
       .eq('id', activeDossier.id);

    if (error) {
       alert("Telemetry Sync Failed: " + error.message);
    } else {
       // Update localized state instantly
       const updatedLead = { ...activeDossier, tracking_data: updatedTracking };
       setActiveDossier(updatedLead);
       setLeads(prev => prev.map(l => l.id === updatedLead.id ? updatedLead : l));
       setLogNote('');
    }
    setLogging(false);
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
                   <label className="font-label text-[9px] tracking-widest uppercase text-outline opacity-50">First Name</label>
                   <input type="text" className="w-full bg-[#f6f3ee] dark:bg-[#1c1b1b] border-outline-variant/20 p-3 font-body text-sm" value={newLead.first_name} onChange={e => setNewLead({...newLead, first_name: e.target.value})} />
                </div>
                <div className="space-y-2">
                   <label className="font-label text-[9px] tracking-widest uppercase text-outline opacity-50">Last Name</label>
                   <input type="text" className="w-full bg-[#f6f3ee] dark:bg-[#1c1b1b] border-outline-variant/20 p-3 font-body text-sm" value={newLead.last_name} onChange={e => setNewLead({...newLead, last_name: e.target.value})} />
                </div>
                <div className="space-y-2">
                   <label className="font-label text-[9px] tracking-widest uppercase text-outline opacity-50">Direct Access Email *</label>
                   <input required type="email" className="w-full bg-[#f6f3ee] dark:bg-[#1c1b1b] border-outline-variant/20 p-3 font-body text-sm" value={newLead.email} onChange={e => setNewLead({...newLead, email: e.target.value})} />
                </div>
                <div className="space-y-2">
                   <label className="font-label text-[9px] tracking-widest uppercase text-outline opacity-50">Secure Phone Matrix</label>
                   <input type="tel" className="w-full bg-[#f6f3ee] dark:bg-[#1c1b1b] border-outline-variant/20 p-3 font-body text-sm" value={newLead.phone} onChange={e => setNewLead({...newLead, phone: e.target.value})} />
                </div>
                <div className="space-y-2">
                   <label className="font-label text-[9px] tracking-widest uppercase text-outline opacity-50">Target Property Association *</label>
                   <select required className="w-full bg-[#f6f3ee] dark:bg-[#1c1b1b] border-outline-variant/20 p-3 font-body text-sm" value={newLead.property_id} onChange={e => setNewLead({...newLead, property_id: e.target.value})}>
                      <option value="" disabled>Select Target Asset</option>
                      {availableProperties.map(p => (
                         <option key={p.id} value={p.id}>{p.title}</option>
                      ))}
                   </select>
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
                     {lead.profiles?.first_name?.[0] || lead.tracking_data?.first_name?.[0] || 'L'}
                   </div>
                   <div className="space-y-1">
                      <div className="text-lg font-bold text-primary">
                        {lead.profiles ? `${lead.profiles.first_name || ''} ${lead.profiles.last_name || ''}` : lead.tracking_data?.first_name ? `${lead.tracking_data.first_name} ${lead.tracking_data.last_name || ''}` : 'Anonymous Lead'}
                      </div>
                      <div className="font-label text-[9px] text-outline uppercase tracking-widest opacity-60 flex items-center gap-2">
                         <span className="material-symbols-outlined text-sm">alternate_email</span>
                         {lead.profiles?.phone || lead.profiles?.email || lead.tracking_data?.phone || lead.tracking_data?.email || 'No Contact Data'}
                      </div>
                   </div>
                </div>

                {/* Engagement Insight */}
                <div className="w-full lg:w-1/4 space-y-2 lg:border-l lg:border-outline-variant/10 lg:pl-8">
                   <p className="font-label text-[8px] text-outline uppercase tracking-widest opacity-40">Portfolio Focus</p>
                   <div className="text-sm font-headline text-primary group-hover:text-secondary transition-colors line-clamp-1">
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
                        "w-2 h-2 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.5)]",
                        lead.tracking_data?.intensity === 'Critical' ? 'bg-red-500 animate-pulse' : 
                        lead.tracking_data?.intensity === 'High' ? 'bg-orange-500' : 'bg-green-500'
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

                {/* Dossier Gateway */}
                <div className="flex items-center gap-3 w-full lg:w-auto lg:justify-end">
                   <button 
                     onClick={() => setActiveDossier(lead)}
                     className="px-6 py-3 flex items-center justify-center gap-3 bg-black dark:bg-white text-white dark:text-black font-label text-[10px] uppercase tracking-widest hover:bg-secondary hover:text-white transition-all shadow-[0_0_15px_rgba(212,175,55,0.1)]"
                   >
                     <span>Open Dossier</span>
                     <span className="material-symbols-outlined text-sm">arrow_forward_ios</span>
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

         {/* Interactive Fullscreen Dossier Overlay */}
         {activeDossier && (
            <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8 animate-luxury-fade">
               <div className="bg-white dark:bg-[#0a0a0a] border border-outline-variant/20 shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col font-body">
                  
                  {/* Dossier Header */}
                  <div className="flex justify-between items-center p-6 border-b border-outline-variant/20 bg-[#f6f3ee] dark:bg-[#1c1b1b]">
                     <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-white dark:bg-black flex items-center justify-center font-headline text-3xl italic text-secondary border border-outline-variant/10">
                           {activeDossier.profiles?.first_name?.[0] || activeDossier.tracking_data?.first_name?.[0] || 'L'}
                        </div>
                        <div>
                           <h2 className="font-headline text-3xl text-primary mb-1">
                              {activeDossier.profiles ? `${activeDossier.profiles.first_name || ''} ${activeDossier.profiles.last_name || ''}` : activeDossier.tracking_data?.first_name ? `${activeDossier.tracking_data.first_name} ${activeDossier.tracking_data.last_name || ''}` : 'Anonymous Prospect'}
                           </h2>
                           <div className="flex items-center gap-4 text-xs font-label uppercase tracking-widest text-outline">
                              <span className="flex items-center gap-1">
                                 <span className="material-symbols-outlined text-[14px]">alternate_email</span>
                                 <a 
                                    href={`mailto:${activeDossier.profiles?.email || activeDossier.tracking_data?.email}`} 
                                    className="hover:text-secondary underline decoration-outline-variant/40 underline-offset-4"
                                 >
                                    {activeDossier.profiles?.email || activeDossier.tracking_data?.email || 'N/A'}
                                 </a>
                              </span>
                              |
                              <span className="flex items-center gap-1">
                                 <span className="material-symbols-outlined text-[14px]">phone</span>
                                 {activeDossier.profiles?.phone || activeDossier.tracking_data?.phone || 'No Phone Data'}
                              </span>
                           </div>
                        </div>
                     </div>
                     <button onClick={() => setActiveDossier(null)} className="w-12 h-12 border border-outline-variant/20 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors hover:border-red-500 text-outline">
                        <span className="material-symbols-outlined text-xl">close</span>
                     </button>
                  </div>

                  {/* Dossier Content Structure */}
                  <div className="flex flex-col lg:flex-row flex-1 overflow-hidden h-full">
                     
                     {/* Left Panel: Log Interaction Engine */}
                     <div className="lg:w-1/3 border-r border-outline-variant/20 p-8 flex flex-col bg-[#f6f3ee]/30 dark:bg-[#1c1b1b]/50 overflow-y-auto">
                        <h3 className="font-label text-[10px] uppercase tracking-widest text-primary font-bold mb-8">Deploy Engagement Log</h3>
                        <div className="space-y-6">
                           <div className="space-y-3">
                              <label className="font-label text-[9px] uppercase tracking-widest text-outline">Interaction Medium</label>
                              <div className="grid grid-cols-2 gap-3">
                                 {['Email', 'Call', 'Meeting', 'On-site Viewing'].map(type => (
                                    <button 
                                      key={type}
                                      onClick={() => setLogType(type)}
                                      className={clsx(
                                         "px-4 py-3 border text-[10px] font-label uppercase tracking-widest transition-all",
                                         logType === type ? "border-secondary text-secondary bg-secondary/10" : "border-outline-variant/20 text-outline hover:border-primary"
                                      )}
                                    >
                                       {type}
                                    </button>
                                 ))}
                              </div>
                           </div>
                           <div className="space-y-3">
                              <label className="font-label text-[9px] uppercase tracking-widest text-outline">Executive Intelligence Notes</label>
                              <textarea 
                                 rows={6}
                                 placeholder="Log critical discussion points, budget adjustments, or requests..."
                                 value={logNote}
                                 onChange={e => setLogNote(e.target.value)}
                                 className="w-full bg-white dark:bg-black border border-outline-variant/20 p-4 font-body text-sm placeholder:text-outline-variant resize-none focus:border-secondary outline-none transition-colors"
                              />
                           </div>
                           <button 
                              onClick={handleLogInteraction}
                              disabled={logging || !logNote.trim()}
                              className="w-full py-4 bg-black dark:bg-white text-white dark:text-black font-label text-[10px] uppercase tracking-widest hover:bg-secondary dark:hover:bg-secondary hover:text-white transition-all disabled:opacity-50"
                           >
                              {logging ? 'Committing to Ledger...' : 'Persist Intelligence Timeline'}
                           </button>
                        </div>

                        <div className="mt-8 pt-8 border-t border-outline-variant/20">
                           <h3 className="font-label text-[10px] uppercase tracking-widest text-outline mb-4">Initial Message Ledger</h3>
                           <p className="text-sm font-body text-on-surface-variant leading-relaxed opacity-80 italic">
                              "{activeDossier.message || 'No initial message attached to target constraint.'}"
                           </p>
                        </div>
                     </div>

                     {/* Right Panel: Continuous Timeline Ledger */}
                     <div className="lg:w-2/3 p-8 overflow-y-auto bg-white dark:bg-[#0a0a0a] relative">
                        <h3 className="font-label text-[10px] uppercase tracking-widest text-primary font-bold mb-8 sticky top-0 bg-white dark:bg-[#0a0a0a] pb-4 z-10 border-b border-outline-variant/20">
                           Complete Chronological Timeline
                        </h3>
                        
                        <div className="space-y-6 relative before:absolute before:inset-0 before:ml-4 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-px before:bg-gradient-to-b before:from-transparent before:via-outline-variant/20 before:to-transparent">
                           {(activeDossier.tracking_data?.history || []).length === 0 ? (
                              <div className="text-center py-20 relative z-10">
                                 <span className="material-symbols-outlined text-outline/30 text-5xl mb-4">history_toggle_off</span>
                                 <p className="font-label text-[10px] tracking-widest uppercase text-outline">Intelligence timeline is currently empty.</p>
                              </div>
                           ) : (
                              (activeDossier.tracking_data.history as any[]).map((log, index) => (
                                 <div key={log.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active animate-luxury-fade" style={{animationDelay: `${index * 50}ms`}}>
                                    
                                    {/* Timeline Node Point */}
                                    <div className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-secondary bg-white dark:bg-black text-secondary z-10 shrink-0 mx-auto absolute left-0 md:relative md:left-auto mt-2 md:mt-0 transition-transform group-hover:scale-125">
                                       <span className="material-symbols-outlined text-[14px]">
                                          {log.type === 'Email' ? 'mail' : log.type === 'Meeting' ? 'groups' : log.type === 'On-site Viewing' ? 'key' : 'call'}
                                       </span>
                                    </div>
                                    
                                    {/* Interaction Block */}
                                    <div className="w-[calc(100%-2rem)] md:w-[calc(50%-2rem)] pl-6 md:pl-0 md:odd:pr-6 md:even:pl-6">
                                       <div className="p-6 bg-[#f6f3ee] dark:bg-[#1c1b1b] border border-outline-variant/10 shadow-sm hover:shadow-lg transition-all border-l-4 border-l-transparent hover:border-l-secondary inline-block w-full">
                                          <div className="flex justify-between items-start mb-2">
                                             <span className="font-label text-[8px] uppercase tracking-widest text-secondary font-bold px-2 py-0.5 bg-secondary/10">
                                                {log.type}
                                             </span>
                                             <span className="font-label text-[8px] uppercase tracking-widest text-outline">
                                                {new Date(log.date).toLocaleString()}
                                             </span>
                                          </div>
                                          <p className="text-sm font-body text-primary leading-relaxed">
                                             {log.note}
                                          </p>
                                       </div>
                                    </div>
                                 </div>
                              ))
                           )}
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         )}
      </div>
    </AdminLayout>
   );
};

export default CRM;
