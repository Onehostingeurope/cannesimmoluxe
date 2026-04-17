import { useState } from 'react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { Button } from '../../components/ui/Button';
import { clsx } from 'clsx';

const CRM = () => {
  const [selectedStatus, setSelectedStatus] = useState('All');

  const leads = [
    { id: '1', name: 'Julianne de Beauvoir', contact: '+33 6 12 34 56 78', property: 'Villa Azurite', status: 'Qualified', intensity: 'High', date: 'Oct 17, 14:22', initial: 'J' },
    { id: '2', name: 'Marcus Aurelius', contact: 'ma@rome.it', property: 'Penthouse Croisette', status: 'New', intensity: 'Medium', date: 'Oct 17, 10:05', initial: 'M' },
    { id: '3', name: 'Sarah Jenkins', contact: '+44 7700 900000', property: 'Domaine de la Mer', status: 'Contacted', intensity: 'Low', date: 'Oct 16, 18:30', initial: 'S' },
    { id: '4', name: 'Victor Hugo', contact: 'victor@lesmis.fr', property: 'Waterfront Penthouse', status: 'Visit Scheduled', intensity: 'High', date: 'Oct 15, 09:12', initial: 'V' },
    { id: '5', name: 'Marie Antoinette', contact: 'marie@versailles.fr', property: 'Historical Estate', status: 'Offer In Progress', intensity: 'Critical', date: 'Oct 14, 16:45', initial: 'M' },
  ];

  const statuses = ['All', 'New', 'Contacted', 'Qualified', 'Visit Scheduled', 'Offer In Progress'];

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
          <div className="flex gap-4 w-full md:w-auto">
            <Button variant="outline" className="flex-1 md:flex-none">Export Registry</Button>
            <Button variant="primary" className="flex-1 md:flex-none">Create Lead</Button>
          </div>
        </div>

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
          {leads.map((lead) => (
            <div key={lead.id} className="bg-white dark:bg-[#0a0a0a] border border-outline-variant/10 p-8 flex flex-col lg:flex-row justify-between items-center gap-8 hover:shadow-xl transition-all duration-500 group">
              {/* Profile Bio */}
              <div className="flex items-center gap-8 w-full lg:w-1/3">
                 <div className="w-14 h-14 bg-[#f6f3ee] dark:bg-[#1c1b1b] border border-outline-variant/20 flex items-center justify-center font-headline italic text-2xl text-primary group-hover:scale-110 transition-transform">
                   {lead.initial}
                 </div>
                 <div className="space-y-1">
                    <div className="text-lg font-bold text-primary">{lead.name}</div>
                    <div className="font-label text-[9px] text-outline uppercase tracking-widest opacity-60 flex items-center gap-2">
                       <span className="material-symbols-outlined text-sm">alternate_email</span>
                       {lead.contact}
                    </div>
                 </div>
              </div>

              {/* Engagement Insight */}
              <div className="w-full lg:w-1/4 space-y-2 lg:border-l lg:border-outline-variant/10 lg:pl-8">
                 <p className="font-label text-[8px] text-outline uppercase tracking-widest opacity-40">Portfolio Focus</p>
                 <div className="text-sm font-headline text-primary group-hover:text-secondary transition-colors">{lead.property}</div>
                 <p className="text-[10px] text-on-surface-variant opacity-60 italic">{lead.date}</p>
              </div>

              {/* Status Matrix */}
              <div className="w-full lg:w-1/4 flex flex-col lg:items-center gap-2 lg:border-l lg:border-outline-variant/10 lg:pl-8">
                 <div className="flex items-center gap-3">
                    <span className={clsx(
                      "w-2 h-2 rounded-full",
                      lead.intensity === 'Critical' ? 'bg-red-500 animate-pulse' : 
                      lead.intensity === 'High' ? 'bg-orange-500' : 'bg-green-500'
                    )}></span>
                    <span className="font-label text-[10px] font-bold tracking-[0.2em] uppercase text-primary">{lead.status}</span>
                 </div>
                 <p className="font-label text-[8px] text-outline uppercase tracking-[0.3em] font-medium">{lead.intensity} ENGAGEMENT</p>
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
          ))}
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
