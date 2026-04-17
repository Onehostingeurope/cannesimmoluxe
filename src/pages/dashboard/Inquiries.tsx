import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { clsx } from 'clsx';

const Inquiries = () => {
  const inquiries = [
    {
      id: '1',
      property: 'Villa Azurite',
      date: 'Oct 12, 2026',
      status: 'Active Consultation',
      intensity: 'High',
      message: 'I would like to schedule a private viewing for next Thursday afternoon.',
      icon: 'schedule_send'
    },
    {
      id: '2',
      property: 'Penthouse Croisette',
      date: 'Oct 05, 2026',
      status: 'Documents Prepared',
      intensity: 'Medium',
      message: 'Requested technical specifications and CAD floor plans for the master suite.',
      icon: 'description'
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-12 animate-luxury-fade font-body pb-20">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 pb-8 border-b border-outline-variant/20">
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <span className="material-symbols-outlined text-secondary text-base">hub</span>
              <p className="font-label text-[10px] tracking-[0.2em] uppercase text-outline">Engagement Log</p>
            </div>
            <h2 className="font-headline text-4xl text-primary">Consultation History</h2>
            <p className="text-sm text-on-surface-variant max-w-xl opacity-70">
              Track your interactions with our concierge team. Every request is managed with the highest level of discretion and precision.
            </p>
          </div>
          <div className="flex gap-4">
            <span className="font-label text-[10px] tracking-widest uppercase text-outline">Active Requests: 2</span>
          </div>
        </div>

        <div className="space-y-6">
          {inquiries.map((inquiry) => (
            <div key={inquiry.id} className="bg-white dark:bg-[#0a0a0a] border border-outline-variant/10 p-8 flex flex-col lg:flex-row justify-between items-center gap-8 hover:shadow-xl transition-all duration-500 group">
              <div className="flex items-center gap-8 w-full lg:w-1/3">
                 <div className="w-14 h-14 bg-[#f6f3ee] dark:bg-[#1c1b1b] border border-outline-variant/20 flex items-center justify-center text-secondary group-hover:scale-110 transition-transform">
                   <span className="material-symbols-outlined text-2xl">{inquiry.icon}</span>
                 </div>
                 <div className="space-y-1">
                    <div className="font-label text-[9px] text-outline uppercase tracking-widest opacity-60 mb-1">{inquiry.date}</div>
                    <div className="text-xl font-headline text-primary group-hover:text-secondary transition-colors">{inquiry.property}</div>
                 </div>
              </div>

              <div className="flex-grow lg:border-l lg:border-outline-variant/10 lg:pl-10 space-y-2">
                 <p className="font-label text-[8px] text-outline uppercase tracking-widest opacity-40">Consultation Narrative</p>
                 <p className="text-sm text-on-surface-variant leading-relaxed italic opacity-80">
                   "{inquiry.message}"
                 </p>
              </div>

              <div className="w-full lg:w-auto lg:pl-10 lg:border-l lg:border-outline-variant/10 flex flex-col items-start lg:items-end gap-3">
                 <div className="flex items-center gap-3">
                    <span className={clsx(
                      "w-2 h-2 rounded-full",
                      inquiry.intensity === 'High' ? 'bg-orange-500 font-bold' : 'bg-green-500'
                    )}></span>
                    <span className="font-label text-[10px] font-bold tracking-[0.2em] uppercase text-primary">{inquiry.status}</span>
                 </div>
                 <button className="font-label text-[9px] tracking-widest uppercase text-secondary hover:text-primary transition-colors border-b border-transparent hover:border-secondary">
                    View Conversation
                 </button>
              </div>
            </div>
          ))}
        </div>

        {/* Support Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-12">
           <div className="bg-[#f6f3ee] dark:bg-[#1c1b1b] p-10 border border-outline-variant/10 space-y-6">
              <span className="material-symbols-outlined text-secondary text-3xl">concierge</span>
              <h3 className="font-headline text-2xl text-primary">Direct Line</h3>
              <p className="text-sm text-on-surface-variant opacity-70 leading-relaxed">
                Connect directly with your dedicated property advisor for immediate assistance regarding your portfolio.
              </p>
              <button className="font-label text-[10px] tracking-widest uppercase text-primary font-bold hover:text-secondary transition-colors">Call Concierge Desk</button>
           </div>
           <div className="bg-[#f6f3ee] dark:bg-[#1c1b1b] p-10 border border-outline-variant/10 space-y-6">
              <span className="material-symbols-outlined text-secondary text-3xl">quick_reference_all</span>
              <h3 className="font-headline text-2xl text-primary">Priority Scheduling</h3>
              <p className="text-sm text-on-surface-variant opacity-70 leading-relaxed">
                As a verified member, your viewing requests are prioritized. Private airport transfers can be orchestrated upon request.
              </p>
              <button className="font-label text-[10px] tracking-widest uppercase text-primary font-bold hover:text-secondary transition-colors">Request Transfer</button>
           </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Inquiries;
