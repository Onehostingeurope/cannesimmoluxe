import React from 'react';
import { clsx } from 'clsx';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { Button } from '../ui/Button';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { signOut } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { label: 'Portfolio', icon: 'domain', path: '/admin/properties' },
    { label: 'Analytics', icon: 'insights', path: '/admin' },
    { label: 'CRM', icon: 'hub', path: '/admin/crm' },
    { label: 'Marketing', icon: 'campaign', path: '/admin/marketing' },
    { label: 'Team', icon: 'groups', path: '/admin/team' },
    { label: 'Settings', icon: 'settings', path: '/admin/settings' },
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="bg-background text-on-surface font-body antialiased min-h-screen flex">
      {/* SideNavBar */}
      <aside className="bg-[#f6f3ee] dark:bg-[#1c1b1b] border-r border-outline-variant/10 text-[#705b3b] dark:text-[#dcdad5] font-['Inter'] text-sm tracking-wide fixed left-0 w-64 h-screen flex flex-col py-8 px-4 z-40 transition-colors duration-300">
        <div className="mb-10 px-4">
          <h1 className="font-headline text-lg text-black dark:text-white mb-6">CanneImmo Admin</h1>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-surface-container-highest rounded-none overflow-hidden flex-shrink-0">
              <img 
                alt="Executive Profile" 
                className="w-full h-full object-cover" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBiXlj6ix2KN3mS6eQvxJKBfFz2VTXmdlD37hJWHAAfeyYTvPdcrRhfvPTKG_YXgM62LblGwC0H-yS1iax9HH0vPFJjj8Rtr2o2kUmI7C5luLF1yG9tfrF9PUYOs0889Fl-e4YQuwWbvRSQ1gF2KH5Iq6lwM6lwHKA4cmZP1vKbBC35W2QQgtekUd7bUPaY-7Sp_wggSXZSj48nhoRxZgcPwn9s6r4ui03osHOK_ESV4oeTuTt8sz-EuPhUvFFFFypKsfWfiABbVE8" 
              />
            </div>
            <div>
              <p className="font-bold text-primary text-xs">Admin User</p>
              <p className="text-[10px] text-secondary">Managing Director</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.label}
                onClick={() => navigate(item.path)}
                className={clsx(
                  "w-full flex items-center gap-3 px-4 py-3 text-sm tracking-wide transition-all duration-300 outline-none",
                  isActive 
                    ? "bg-black dark:bg-white text-white dark:text-black font-bold opacity-90" 
                    : "text-[#705b3b] dark:text-[#dcdad5] hover:bg-[#e5e2dd] dark:hover:bg-[#2a2a2a] hover:pl-5"
                )}
              >
                <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="mt-auto pt-6 space-y-4">
          <Button 
            variant="primary" 
            className="w-full py-3 font-semibold text-xs tracking-widest"
            onClick={() => navigate('/admin/properties/new')}
          >
            New Listing
          </Button>
          <button 
            onClick={handleSignOut}
            className="flex items-center gap-3 px-4 py-3 text-[#705b3b] dark:text-[#dcdad5] hover:bg-[#e5e2dd] dark:hover:bg-[#2a2a2a] hover:pl-5 transition-all duration-300 w-full text-left"
          >
            <span className="material-symbols-outlined text-lg">logout</span>
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 md:ml-64 bg-background min-h-screen p-8 lg:p-12 pb-24">
        <div className="max-w-7xl mx-auto animate-luxury-fade">
          {children}
        </div>
      </main>
    </div>
  );
};
