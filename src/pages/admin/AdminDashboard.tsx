import { AdminLayout } from '../../components/layout/AdminLayout';
import { clsx } from 'clsx';

const AdminDashboard = () => {
  const stats = [
    { label: 'Portfolio Value', value: '€412.5M', change: '+12.4%', trend: 'up', icon: 'payments' },
    { label: 'Active Listings', value: '48', change: '+2', trend: 'up', icon: 'domain' },
    { label: 'Open Inquiries', value: '156', change: '-4%', trend: 'down', icon: 'hub' },
    { label: 'Private Access', value: '24', change: '+8', trend: 'up', icon: 'security' },
  ];

  const recentRegistrations = [
    { name: 'Jean-Pierre Laurent', email: 'jp.laurent@example.com', date: '2 hours ago', status: 'Qualified' },
    { name: 'Sofia Varma', email: 's.varma@example.com', date: '5 hours ago', status: 'Inquiry' },
    { name: 'Alexander Wright', email: 'a.wright@example.com', date: '1 day ago', status: 'New' },
    { name: 'Elaine Dubois', email: 'e.dubois@example.com', date: '2 days ago', status: 'Qualified' },
  ];

  return (
    <AdminLayout>
      <div className="space-y-12 animate-luxury-fade">
        {/* KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-[#f6f3ee] dark:bg-[#1c1b1b] p-8 border border-outline-variant/10 group hover:shadow-2xl transition-all duration-500">
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 flex items-center justify-center bg-white dark:bg-black p-2 border border-outline-variant/20">
                  <span className="material-symbols-outlined text-secondary text-2xl group-hover:scale-110 transition-transform">{stat.icon}</span>
                </div>
                <div className={clsx(
                  "flex items-center gap-1 text-[10px] font-bold tracking-widest uppercase",
                  stat.trend === 'up' ? 'text-green-600' : 'text-red-500'
                )}>
                  {stat.change}
                  <span className="material-symbols-outlined text-sm">{stat.trend === 'up' ? 'trending_up' : 'trending_down'}</span>
                </div>
              </div>
              <p className="font-label text-[10px] tracking-[0.2em] uppercase text-outline mb-1">{stat.label}</p>
              <h3 className="font-headline text-3xl text-primary">{stat.value}</h3>
              {/* Sparkline simulation */}
              <div className="mt-6 h-1 w-full bg-outline-variant/20 relative overflow-hidden">
                <div 
                  className={clsx("absolute inset-y-0 left-0 transition-all duration-[2s]", stat.trend === 'up' ? 'bg-green-600' : 'bg-red-500')} 
                  style={{ width: '65%' }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Recent Registrations Table */}
          <div className="lg:col-span-8 space-y-8">
            <div className="flex justify-between items-end pb-4 border-b border-outline-variant/20">
              <h2 className="font-headline text-2xl text-primary flex items-center">
                Executive Overview
                <span className="material-symbols-outlined ml-3 text-secondary text-base">analytics</span>
              </h2>
              <button className="font-label text-[10px] tracking-widest uppercase text-secondary hover:text-primary transition-colors border-b border-transparent hover:border-secondary">View Registry</button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-[#f6f3ee] dark:bg-[#1c1b1b]">
                    <th className="px-6 py-4 font-label text-[10px] tracking-widest uppercase text-outline">Client Information</th>
                    <th className="px-6 py-4 font-label text-[10px] tracking-widest uppercase text-outline">Verification</th>
                    <th className="px-6 py-4 font-label text-[10px] tracking-widest uppercase text-outline">Onboarding</th>
                    <th className="px-6 py-4 font-label text-[10px] tracking-widest uppercase text-outline text-right">Portfolio</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10">
                  {recentRegistrations.map((user) => (
                    <tr key={user.email} className="group hover:bg-surface-container-lowest transition-colors">
                      <td className="px-6 py-8">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-[#f6f3ee] dark:bg-[#1c1b1b] flex items-center justify-center font-headline italic text-primary">
                            {user.name.charAt(0)}
                          </div>
                          <div>
                            <div className="text-sm font-bold text-primary">{user.name}</div>
                            <div className="text-[10px] text-outline tracking-wider mt-1">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-8">
                        <span className={clsx(
                          "px-3 py-1 text-[9px] font-bold tracking-[0.2em] uppercase border",
                          user.status === 'Qualified' ? 'border-primary bg-primary text-white' : 'border-outline text-outline'
                        )}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-8">
                        <span className="text-xs text-on-surface-variant opacity-70 italic">{user.date}</span>
                      </td>
                      <td className="px-6 py-8 text-right">
                        <button className="material-symbols-outlined text-lg text-outline group-hover:text-primary transition-colors">
                          open_in_new
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Activity Log Sidebar */}
          <div className="lg:col-span-4 space-y-8">
            <h2 className="font-headline text-2xl text-primary flex items-center pb-4 border-b border-outline-variant/20">
              Intelligence
              <span className="material-symbols-outlined ml-3 text-secondary text-base">history</span>
            </h2>
            <div className="space-y-6">
              {[
                { event: 'Dossier Download', target: 'Villa Azurite', time: '12 min ago', icon: 'description' },
                { event: 'Private Inquiry', target: 'Penthouse Croisette', time: '45 min ago', icon: 'chat' },
                { event: 'Membership Level', target: 'Lead #4012 -> Platinum', time: '1 hour ago', icon: 'grade' },
                { label: 'Alert', event: 'Unauthorized Access', target: 'Login Attempt - Paris IP', time: '3 hours ago', icon: 'warning', critical: true },
              ].map((item: any, idx) => (
                <div key={idx} className={clsx(
                  "p-6 border-l-2 flex gap-4 bg-[#f6f3ee] dark:bg-[#1c1b1b] transition-all duration-300 hover:pl-8 group",
                  item.critical ? 'border-red-500' : 'border-secondary'
                )}>
                  <span className={clsx("material-symbols-outlined text-xl mt-1", item.critical ? 'text-red-500' : 'text-secondary group-hover:scale-110 transition-transform')}>
                    {item.icon}
                  </span>
                  <div>
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-label text-[10px] tracking-widest uppercase text-primary font-bold">{item.event}</span>
                      <span className="text-[9px] text-outline font-medium tracking-tighter">{item.time}</span>
                    </div>
                    <p className="text-xs text-on-surface-variant opacity-70">{item.target}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
