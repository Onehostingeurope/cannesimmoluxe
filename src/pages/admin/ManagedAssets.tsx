import { useState, useEffect } from 'react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { Button } from '../../components/ui/Button';
import { supabase } from '../../lib/supabase';
import { clsx } from 'clsx';
import { useNavigate } from 'react-router-dom';
import { GlobalMap } from '../../components/admin/GlobalMap';

const ManagedAssets = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Custom Portfolio Insertion State
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newAsset, setNewAsset] = useState({
     title: '',
     city: '',
     surface: '',
     ownerName: '',
     ownerEmail: '',
     ownerPhone: '',
     initialNote: ''
  });

  // Interactive Dossier State (Hooks into the invisible Inquiry CRM Ledger)
  const [activeProperty, setActiveProperty] = useState<any | null>(null);
  const [activeLedger, setActiveLedger] = useState<any | null>(null);
  const [logNote, setLogNote] = useState('');
  const [logType, setLogType] = useState('Email');
  const [logging, setLogging] = useState(false);

  useEffect(() => {
    fetchManagedPortfolio();
  }, []);

  const fetchManagedPortfolio = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('mode', 'management')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching management portfolio:', error);
    } else {
      setProperties(data || []);
    }
    setLoading(false);
  };

  const handleCreateAsset = async (e: React.FormEvent) => {
     e.preventDefault();
     setCreating(true);

     const slug = newAsset.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

     // 1. Physically Inject the Property Engine (Invisible from Frontend because mode='management')
     const { data: propData, error: propError } = await supabase
        .from('properties')
        .insert([{
           title: newAsset.title,
           slug,
           ref_id: 'MGMT-' + Math.floor(Math.random() * 9000 + 1000),
           city: newAsset.city,
           surface: newAsset.surface || 0,
           type: 'Estate',
           mode: 'management',
           status: 'reserved'
        }])
        .select()
        .single();

     if (propError) {
        alert('Asset Injection Error: ' + propError.message);
        setCreating(false);
        return;
     }

     // 2. Secretly Construct the Owner Ledger CRM Node
     const { error: ledgerError } = await supabase
        .from('inquiries')
        .insert([{
           property_id: propData.id,
           email: newAsset.ownerEmail || 'no-email@admin.system',
           message: newAsset.initialNote || 'Manual Backend Injection',
           lead_status: 'won', // Pre-secured condition
           tracking_data: {
              category: 'Management Dossier',
              first_name: newAsset.ownerName,
              phone: newAsset.ownerPhone,
              history: []
           }
        }]);

     if (ledgerError) {
        alert('Ledger Linking Failed: ' + ledgerError.message);
     } else {
        setShowCreate(false);
        setNewAsset({ title: '', city: '', surface: '', ownerName: '', ownerEmail: '', ownerPhone: '', initialNote: '' });
        fetchManagedPortfolio();
     }
     setCreating(false);
  };

  // Open the Unified Ledger Dossier
  const openDossier = async (property: any) => {
     setActiveProperty(property);
     // Interrogate the backend for the invisible linked Inquiry CRM payload
     const { data, error } = await supabase
        .from('inquiries')
        .select('*, profiles(*)')
        .eq('property_id', property.id)
        .eq('tracking_data->>category', 'Management Dossier')
        .single();
        
     if (data) {
        setActiveLedger(data);
     } else {
        // Build one instantly if it's missing (legacy handling)
        const { data: newLedger } = await supabase.from('inquiries').insert([{
           property_id: property.id,
           email: 'legacy@system.network',
           lead_status: 'won',
           tracking_data: { category: 'Management Dossier', first_name: 'Unknown', history: [] }
        }]).select().single();
        setActiveLedger(newLedger);
     }
  };

  const handleLogInteraction = async () => {
    if (!activeLedger || !logNote.trim()) return;
    setLogging(true);

    const newLog = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      type: logType,
      note: logNote
    };

    const currentData = activeLedger.tracking_data || {};
    const currentHistory = currentData.history || [];
    
    const updatedLedger = {
      ...currentData,
      history: [newLog, ...currentHistory]
    };

    const { error } = await supabase
      .from('inquiries')
      .update({ tracking_data: updatedLedger })
      .eq('id', activeLedger.id);

    if (!error) {
      setActiveLedger({ ...activeLedger, tracking_data: updatedLedger });
      setLogNote('');
    }
    setLogging(false);
  };

  const handleDeleteAsset = async (id: string, e: React.MouseEvent) => {
     e.stopPropagation();
     if(!window.confirm("WARNING: Trashing this Management Asset permanently destroys all communication ledgers mapped to it.")) return;
     
     // Due to cascades or manual, we kill the property. Inquiry should die or just orphan.
     await supabase.from('properties').delete().eq('id', id);
     fetchManagedPortfolio();
  };

  return (
    <AdminLayout>
      <div className="space-y-12 animate-luxury-fade font-body">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 pb-8 border-b border-outline-variant/20">
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <span className="material-symbols-outlined notranslate text-secondary text-base" translate="no">real_estate_agent</span>
              <p className="font-label text-[10px] tracking-[0.2em] uppercase text-outline">Exclusive Governance</p>
            </div>
            <h2 className="font-headline text-4xl text-primary">Portfolio Management</h2>
            <p className="text-sm text-on-surface-variant max-w-xl opacity-70">
              Your exclusive backend network for properties under direct management. Track ongoing asset requirements and orchestrate direct communication records alongside ownership details.
            </p>
          </div>
          <Button 
            variant="primary" 
            className="w-full md:w-auto"
            onClick={() => setShowCreate(!showCreate)}
          >
            {showCreate ? 'Cancel Operations' : 'Inject Secure Asset'}
          </Button>
        </div>

        {/* Creation Node Modal Layout embedded */}
        {showCreate && (
           <form onSubmit={handleCreateAsset} className="bg-[#f6f3ee] dark:bg-[#1c1b1b] border border-outline-variant/20 p-8 shadow-sm">
              <h3 className="font-headline text-2xl text-primary border-b border-outline-variant/20 pb-4 mb-6">Asset Incorporation Form</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                 {/* Property Physics */}
                 <div className="space-y-6">
                    <span className="font-label text-[10px] uppercase tracking-[0.3em] text-secondary font-bold">Physical Substrate</span>
                    <div className="space-y-2">
                       <input required type="text" placeholder="Internal Designation (e.g. Villa La Californie)" className="w-full bg-white dark:bg-black border border-outline-variant/20 p-3 font-body text-sm" value={newAsset.title} onChange={e => setNewAsset({...newAsset, title: e.target.value})} />
                    </div>
                    <div className="flex gap-4">
                       <input required type="text" placeholder="City Sector" className="w-1/2 bg-white dark:bg-black border border-outline-variant/20 p-3 font-body text-sm" value={newAsset.city} onChange={e => setNewAsset({...newAsset, city: e.target.value})} />
                       <input type="number" placeholder="Surface (m²)" className="w-1/2 bg-white dark:bg-black border border-outline-variant/20 p-3 font-body text-sm" value={newAsset.surface} onChange={e => setNewAsset({...newAsset, surface: e.target.value})} />
                    </div>
                 </div>

                 {/* Administrative Entity */}
                 <div className="space-y-6">
                    <span className="font-label text-[10px] uppercase tracking-[0.3em] text-secondary font-bold">Entity Ownership Payload</span>
                    <div className="space-y-2">
                       <input required type="text" placeholder="Owner Official Name" className="w-full bg-white dark:bg-black border border-outline-variant/20 p-3 font-body text-sm" value={newAsset.ownerName} onChange={e => setNewAsset({...newAsset, ownerName: e.target.value})} />
                    </div>
                    <div className="flex gap-4">
                       <input type="email" placeholder="Direct Email" className="w-1/2 bg-white dark:bg-black border border-outline-variant/20 p-3 font-body text-sm" value={newAsset.ownerEmail} onChange={e => setNewAsset({...newAsset, ownerEmail: e.target.value})} />
                       <input type="tel" placeholder="Secure Telephone" className="w-1/2 bg-white dark:bg-black border border-outline-variant/20 p-3 font-body text-sm" value={newAsset.ownerPhone} onChange={e => setNewAsset({...newAsset, ownerPhone: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                       <input type="text" placeholder="Initial Tactical Requirements" className="w-full bg-white dark:bg-black border border-outline-variant/20 p-3 font-body text-sm" value={newAsset.initialNote} onChange={e => setNewAsset({...newAsset, initialNote: e.target.value})} />
                    </div>
                 </div>
              </div>

              <div className="mt-8 flex justify-end">
                 <button type="submit" disabled={creating} className="px-10 py-4 bg-black dark:bg-white text-white dark:text-black font-label text-[10px] uppercase tracking-widest transition-colors hover:bg-secondary">
                    {creating ? 'Processing...' : 'Synchronize To Network'}
                 </button>
              </div>
           </form>
        )}

        {/* Global Cartographic Registry Matrix */}
        <div className="w-full pt-4 space-y-3">
           <div className="flex flex-wrap items-center gap-4 md:gap-8 px-4 py-3 bg-[#f6f3ee] dark:bg-[#1c1b1b] border border-outline-variant/20 font-label text-[9px] tracking-widest uppercase text-outline">
              <span className="flex items-center gap-2"><div className="w-3 h-3 bg-blue-500 rounded-full shadow-sm border border-white dark:border-black"></div> Managed Properties</span>
           </div>
           <GlobalMap filter="management" />
        </div>

        {/* Global Matrix Tracker */}
        <div className="space-y-6 pt-4">
           {loading ? (
             <div className="py-20 text-center"><div className="w-12 h-12 border-t-2 border-secondary animate-spin rounded-full mx-auto"></div></div>
           ) : properties.length === 0 ? (
             <div className="py-20 text-center bg-[#f6f3ee] dark:bg-[#1c1b1b] border border-dashed border-outline-variant/20">
               <span className="material-symbols-outlined notranslate text-outline/40 text-4xl mb-4" translate="no">real_estate_agent</span>
               <p className="font-label text-[10px] tracking-widest uppercase text-outline">You have 0 Assets under strict Portfolio Management.</p>
             </div>
           ) : (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {properties.map(property => (
                   <div 
                     key={property.id} 
                     onClick={() => openDossier(property)}
                     className="bg-white dark:bg-[#0a0a0a] border border-outline-variant/10 shadow-sm hover:shadow-xl hover:border-secondary transition-all cursor-pointer group"
                   >
                     {/* Asset Banner */}
                     <div className="h-40 bg-zinc-100 dark:bg-zinc-900 border-b border-outline-variant/10 relative overflow-hidden flex items-center justify-center">
                        {property.images?.[0] ? (
                           <img src={property.images[0]} alt="Property Visual" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                        ) : (
                           <span className="material-symbols-outlined notranslate text-outline/20 text-5xl" translate="no">architecture</span>
                        )}
                        <div className="absolute top-4 left-4 bg-black/80 px-2 py-1 flex items-center gap-2">
                           <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span>
                           <span className="font-label text-[8px] uppercase tracking-widest text-white">Active</span>
                        </div>
                     </div>
                     {/* Asset Data */}
                     <div className="p-6 space-y-4">
                        <div>
                           <p className="font-label text-[8px] uppercase tracking-[0.2em] text-outline mb-1">{property.ref_id}</p>
                           <h3 className="font-headline text-main text-xl group-hover:text-secondary transition-colors">{property.title}</h3>
                        </div>
                        <div className="flex justify-between items-center text-[10px] font-label uppercase tracking-widest text-outline pt-4 border-t border-outline-variant/10">
                           <span className="flex items-center gap-1"><span className="material-symbols-outlined notranslate text-sm" translate="no">map</span> {property.city}</span>
                           <span className="flex items-center gap-1"><span className="material-symbols-outlined notranslate text-sm" translate="no">square_foot</span> {property.surface ? `${property.surface} m²` : 'N/A'}</span>
                        </div>
                     </div>
                     <div className="w-full text-center py-3 bg-[#f6f3ee] dark:bg-[#1c1b1b] text-[9px] font-label uppercase tracking-widest text-outline group-hover:text-primary transition-colors flex items-center justify-center gap-2">
                        <span>Access Unified Ledger</span>
                        <span className="material-symbols-outlined notranslate text-[14px]" translate="no">chevron_right</span>
                     </div>
                   </div>
                ))}
             </div>
           )}
        </div>

        {/* Hidden Interactive Dossier Overlay */}
        {activeProperty && activeLedger && (
           <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8 animate-luxury-fade">
              <div className="bg-white dark:bg-[#0a0a0a] border border-outline-variant/20 shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col font-body">
                 
                 {/* Dossier Header */}
                 <div className="flex justify-between items-center p-6 border-b border-outline-variant/20 bg-[#f6f3ee] dark:bg-[#1c1b1b] relative overflow-hidden">
                    <div className="absolute bottom-0 right-0 opacity-5 pointer-events-none transform translate-y-1/4 translate-x-1/4">
                       <span className="material-symbols-outlined notranslate" style={{ fontSize: '300px' }} translate="no">real_estate_agent</span>
                    </div>

                    <div className="flex items-center gap-6 relative z-10 w-full flex-wrap">
                       <div className="w-16 h-16 bg-white dark:bg-black border border-outline-variant/20 flex items-center justify-center font-headline text-3xl text-secondary">
                          {activeLedger.tracking_data?.first_name?.[0] || 'O'}
                       </div>
                       <div className="flex-1">
                          <h2 className="font-headline text-3xl text-primary">{activeProperty.title}</h2>
                          <div className="flex items-center gap-4 text-xs font-label uppercase tracking-widest text-outline mt-1 font-bold">
                             Tracking Client ID: {activeLedger.tracking_data?.first_name || 'System Generated'}
                          </div>
                          <div className="flex items-center gap-4 text-xs font-label uppercase tracking-widest text-outline mt-2">
                             <a href={`mailto:${activeLedger.email}`} className="hover:text-secondary flex gap-2 items-center"><span className="material-symbols-outlined notranslate text-[14px]" translate="no">mail</span> {activeLedger.email}</a>
                             <span>|</span>
                             <span className="flex gap-2 items-center"><span className="material-symbols-outlined notranslate text-[14px]" translate="no">phone</span> {activeLedger.tracking_data?.phone || 'No Auth Phone'}</span>
                          </div>
                       </div>
                       <div className="flex gap-4">
                          <button onClick={(e) => handleDeleteAsset(activeProperty.id, e)} className="px-6 py-3 border border-red-500/30 text-red-500 font-label text-[10px] uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all bg-transparent">Delete Asset</button>
                          <button onClick={() => navigate(`/admin/properties/edit/${activeProperty.id}`)} className="px-6 py-3 border border-outline-variant/30 text-primary font-label text-[10px] uppercase tracking-widest hover:bg-secondary hover:text-white hover:border-secondary transition-all bg-transparent">Technical Editing</button>
                       </div>
                    </div>
                    <button onClick={() => {setActiveProperty(null); setActiveLedger(null)}} className="absolute top-4 right-4 w-10 h-10 border border-outline-variant/20 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors hover:border-red-500 z-20 bg-white dark:bg-black">
                       <span className="material-symbols-outlined notranslate text-lg" translate="no">close</span>
                    </button>
                 </div>

                 {/* Dossier Content Structure */}
                 <div className="flex flex-col lg:flex-row flex-1 overflow-hidden h-full">
                    {/* Log Engine */}
                    <div className="lg:w-1/3 border-r border-outline-variant/20 p-8 flex flex-col bg-[#f6f3ee]/30 dark:bg-[#1c1b1b]/50 overflow-y-auto">
                       <h3 className="font-label text-[10px] uppercase tracking-widest text-primary font-bold mb-8">Deploy Communication Log</h3>
                       <div className="space-y-6">
                            <div className="space-y-3">
                               <label className="font-label text-[9px] uppercase tracking-widest text-outline">Operation Medium</label>
                               <div className="grid grid-cols-2 gap-3">
                                  {['Email', 'Call', 'Contractual', 'Incident'].map(type => (
                                     <button key={type} onClick={() => setLogType(type)} className={clsx("px-4 py-3 border text-[10px] font-label uppercase tracking-widest transition-all", logType === type ? "border-secondary text-secondary bg-secondary/10" : "border-outline-variant/20 text-outline hover:border-primary")}>{type}</button>
                                  ))}
                               </div>
                            </div>
                            <div className="space-y-3">
                               <label className="font-label text-[9px] uppercase tracking-widest text-outline">Management Ledger Notes</label>
                               <textarea rows={6} placeholder="Record maintenance calls, owner reports..." value={logNote} onChange={e => setLogNote(e.target.value)} className="w-full bg-white dark:bg-black border border-outline-variant/20 p-4 font-body text-sm placeholder:text-outline-variant resize-none focus:border-secondary outline-none transition-colors" />
                            </div>
                            <button onClick={handleLogInteraction} disabled={logging || !logNote.trim()} className="w-full py-4 bg-black dark:bg-white text-white dark:text-black font-label text-[10px] uppercase tracking-widest hover:bg-secondary dark:hover:bg-secondary hover:text-white transition-all disabled:opacity-50">
                               {logging ? 'Synchronizing...' : 'Log Operation History'}
                            </button>
                       </div>
                    </div>

                    {/* Timeline Tracker */}
                    <div className="lg:w-2/3 p-8 overflow-y-auto bg-white dark:bg-[#0a0a0a] relative">
                       <h3 className="font-label text-[10px] uppercase tracking-widest text-primary font-bold mb-8 sticky top-0 bg-white dark:bg-[#0a0a0a] pb-4 z-10 border-b border-outline-variant/20">Operational Service Ledger</h3>
                       
                       <div className="space-y-6 relative before:absolute before:inset-0 before:ml-4 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-px before:bg-gradient-to-b before:from-transparent before:via-outline-variant/20 before:to-transparent">
                          {(activeLedger.tracking_data?.history || []).length === 0 ? (
                             <div className="text-center py-20 relative z-10">
                                <span className="material-symbols-outlined notranslate text-outline/30 text-5xl mb-4" translate="no">gavel</span>
                                <p className="font-label text-[10px] tracking-widest uppercase text-outline">No Management Operations Recorded Yet.</p>
                             </div>
                          ) : (
                             (activeLedger.tracking_data.history as any[]).map((log, index) => (
                                <div key={log.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group animate-luxury-fade" style={{animationDelay: `${index * 50}ms`}}>
                                   <div className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-secondary bg-white dark:bg-black text-secondary z-10 shrink-0 mx-auto absolute left-0 md:relative md:left-auto mt-2 md:mt-0 shadow-lg group-hover:scale-110 transition-transform">
                                      <span className="material-symbols-outlined notranslate text-[14px]" translate="no">
                                         {log.type === 'Email' ? 'mail' : log.type === 'Incident' ? 'emergency' : log.type === 'Contractual' ? 'description' : 'call'}
                                      </span>
                                   </div>
                                   
                                   <div className="w-[calc(100%-2rem)] md:w-[calc(50%-2rem)] pl-6 md:pl-0 md:odd:pr-6 md:even:pl-6">
                                      <div className="p-6 bg-[#f6f3ee] dark:bg-[#1c1b1b] border border-outline-variant/10 shadow-sm border-l-4 border-l-secondary inline-block w-full">
                                         <div className="flex justify-between items-start mb-2">
                                            <span className="font-label text-[8px] uppercase tracking-widest text-secondary font-bold px-2 py-0.5 bg-secondary/10">{log.type}</span>
                                            <span className="font-label text-[8px] uppercase tracking-widest text-outline">{new Date(log.date).toLocaleString()}</span>
                                         </div>
                                         <p className="text-sm font-body text-primary leading-relaxed">{log.note}</p>
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

export default ManagedAssets;
