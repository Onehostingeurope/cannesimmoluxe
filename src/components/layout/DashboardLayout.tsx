import React from 'react';
import { clsx } from 'clsx';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { profile, signOut } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { label: 'Portfolio', icon: 'domain', path: '/dashboard' },
    { label: 'Analytics', icon: 'insights', path: '/dashboard/analytics' },
    { label: 'CRM', icon: 'hub', path: '/dashboard/crm' },
    { label: 'Marketing', icon: 'campaign', path: '/dashboard/marketing' },
    { label: 'Team', icon: 'groups', path: '/dashboard/team' },
    { label: 'Settings', icon: 'settings', path: '/dashboard/settings' },
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="bg-background text-on-background min-h-screen flex animate-luxury-fade">
      {/* SideNavBar */}
      <nav className="hidden md:flex flex-col h-screen fixed left-0 w-64 py-8 px-4 bg-[#f6f3ee] dark:bg-[#1c1b1b] font-['Inter'] text-sm tracking-wide z-50 transition-all duration-300">
        <div className="mb-12 px-2">
          <div className="font-['Noto_Serif'] text-lg text-black dark:text-white mb-6">CanneImmo Admin</div>
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 rounded-none bg-surface-variant overflow-hidden">
              <img 
                alt="Executive Profile" 
                className="w-full h-full object-cover" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD0DU8xwEkSxoo4sJ_jkJHl-dv3mG8OP-bl9_M3Me7b-RmOWcRz0nJ7mK3pFb-mtTIQneeVjPwuDLLB635HMzvNHgf11yypUpw5AVzEiaSY0EQo5MaGxjSbT_yRer3Mh83j3d2X5QwcnYf9ikr_i3c6QbKwSHZ9DzB6WFprwwZsiagsDg4GGL1XJ8P52hFVFzjyRVBr21ICv26Mc9JMGr2oAyJ1AeORwiEO7BOmaW6TeWrYn-z7y-TkBQc8YeESXbMFP2qUb9gnmaI" 
              />
            </div>
            <div>
              <p className="font-bold text-on-surface text-xs">{profile?.first_name || 'Admin'} {profile?.last_name || 'User'}</p>
              <p className="text-[10px] text-secondary">Managing Director</p>
            </div>
          </div>
          <button 
            onClick={() => navigate('/admin/properties/new')}
            className="w-full py-3 bg-primary text-on-primary rounded-none font-bold text-[10px] uppercase tracking-widest hover:bg-primary-container transition-colors duration-300 mb-8"
          >
            New Listing
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.label}
                onClick={() => navigate(item.path)}
                className={clsx(
                  "w-full flex items-center px-4 py-3 text-sm tracking-wide transition-all duration-300 outline-none",
                  isActive 
                    ? "bg-black dark:bg-white text-white dark:text-black font-bold opacity-90 shadow-[0_4px_12px_rgba(0,0,0,0.1)]" 
                    : "text-[#705b3b] dark:text-[#dcdad5] hover:bg-[#e5e2dd] dark:hover:bg-[#2a2a2a] hover:pl-6"
                )}
              >
                <span className="material-symbols-outlined notranslate mr-3 text-lg" style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }} translate="no">
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-auto pt-8 border-t border-outline-variant/10">
          <button 
            onClick={handleSignOut}
            className="flex items-center w-full px-4 py-3 text-[#705b3b] dark:text-[#dcdad5] hover:bg-[#e5e2dd] dark:hover:bg-[#2a2a2a] hover:pl-6 transition-all duration-300 text-left"
          >
            <span className="material-symbols-outlined notranslate mr-3 text-lg" translate="no">help_outline</span>
            <span>Help Center</span>
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 md:ml-64 bg-background min-h-screen p-8 md:p-16">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};
