import React, { useState, useEffect } from 'react';
import { clsx } from 'clsx';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { Button } from '../ui/Button';
import { supabase } from '../../lib/supabase';
import { LanguageSwitcher } from './LanguageSwitcher';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { signOut, user } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [profile, setProfile] = useState<any>(null);
  const [notificationsCount, setNotificationsCount] = useState(0);

  useEffect(() => {
    if (user?.id) {
       supabase.from('profiles').select('*').eq('id', user.id).single()
         .then(({ data }) => setProfile(data));
    }
  }, [user?.id]);

  useEffect(() => {
    if (profile?.role === 'admin') {
      const fetchNotificationCounts = async () => {
         const { count: leadCount } = await supabase.from('inquiries').select('*', { count: 'exact', head: true }).eq('lead_status', 'new');
         
         const sevenDaysAgo = new Date();
         sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
         const { count: profileCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true })
            .eq('role', 'user')
            .gte('created_at', sevenDaysAgo.toISOString());

         setNotificationsCount((leadCount || 0) + (profileCount || 0));
      };
      
      fetchNotificationCounts();
      const interval = setInterval(fetchNotificationCounts, 60000); 
      return () => clearInterval(interval);
    }
  }, [profile?.role]);

  const isDirector = profile?.role === 'admin';

  const menuItems = [
    { label: 'Portfolio Propriety', icon: 'domain', path: '/admin/properties' },
    { label: 'Portfolio Management', icon: 'real_estate_agent', path: '/admin/managed' },
    ...(isDirector ? [{ label: 'Analytics', icon: 'insights', path: '/admin' }] : []),
    ...(isDirector ? [{ label: 'Notifications', icon: 'notifications_active', path: '/admin/notifications', badge: notificationsCount }] : []),
    { label: 'CRM', icon: 'hub', path: '/admin/crm' },
    ...(isDirector ? [
      { label: 'Editorial CMS', icon: 'auto_stories', path: '/admin/cms' },
      { label: 'Marketing', icon: 'campaign', path: '/admin/marketing' },
      { label: 'Team', icon: 'groups', path: '/admin/team' },
      { label: 'Settings', icon: 'settings', path: '/admin/settings' },
    ] : [])
  ];

  // RBAC Routing Interceptor: Bounces agents if they force-load a locked URL
  useEffect(() => {
     if (profile && profile.role !== 'admin') {
        const lockedRoutes = ['/admin', '/admin/cms', '/admin/marketing', '/admin/team', '/admin/settings'];
        if (lockedRoutes.includes(location.pathname)) {
           navigate('/admin/properties');
        }
     }
  }, [profile, location.pathname, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="bg-background text-on-surface font-body antialiased min-h-screen flex">
      {/* SideNavBar */}
      <aside className="bg-[#f6f3ee] dark:bg-[#1c1b1b] border-r border-outline-variant/10 text-[#705b3b] dark:text-[#dcdad5] font-['Inter'] text-sm tracking-wide fixed left-0 w-72 h-screen flex flex-col py-8 px-4 z-40 transition-colors duration-300">
        <div className="mb-10 px-4">
          <div className="mb-8">
             <img src="/logo.png" alt="CannesImmo Luxe" className="h-[45px] w-auto origin-left opacity-80 mix-blend-multiply dark:mix-blend-screen dark:invert" />
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#f6f3ee] dark:bg-[#1c1b1b] border border-outline-variant/20 rounded-none overflow-hidden flex-shrink-0 flex items-center justify-center font-headline text-lg text-primary">
              {profile?.avatar_url ? (
                <img 
                  alt="Executive Profile" 
                  className="w-full h-full object-cover" 
                  src={profile.avatar_url} 
                />
              ) : (
                profile?.first_name ? profile.first_name[0] : 'U'
              )}
            </div>
            <div>
              <p className="font-bold text-primary text-xs truncate max-w-[120px]">
                 {profile?.first_name ? `${profile.first_name} ${profile.last_name || ''}` : 'Admin User'}
              </p>
              <p className="text-[10px] text-secondary capitalize">{profile?.role === 'admin' ? 'Managing Director' : 'Operative'}</p>
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
                  "w-full flex items-center gap-3 px-4 py-3 text-sm tracking-wide transition-all duration-300 outline-none relative",
                  isActive 
                    ? "bg-black dark:bg-white text-white dark:text-black font-bold opacity-90" 
                    : "text-[#705b3b] dark:text-[#dcdad5] hover:bg-[#e5e2dd] dark:hover:bg-[#2a2a2a]"
                )}
              >
                <span className="material-symbols-outlined text-lg shrink-0" style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>
                  {item.icon}
                </span>
                <span className="truncate whitespace-nowrap flex-1 text-left">{item.label}</span>
                {item.badge !== undefined && item.badge > 0 && (
                   <span className="absolute right-4 bg-red-600 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full animate-bounce-slow">
                      {item.badge > 99 ? '99+' : item.badge}
                   </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="mt-auto pt-6 space-y-4">
          <div className="px-6 pb-4 border-b border-outline-variant/10 flex justify-start">
            <LanguageSwitcher direction="up" align="left" />
          </div>
          <Button 
            variant="primary" 
            className="w-full py-3 font-semibold text-xs tracking-widest mt-2"
            onClick={() => navigate('/admin/properties/new')}
          >
            New Listing
          </Button>
          <button 
            onClick={handleSignOut}
            className="flex items-center gap-3 px-4 py-3 text-[#705b3b] dark:text-[#dcdad5] hover:bg-[#e5e2dd] dark:hover:bg-[#2a2a2a] transition-all duration-300 w-full text-left"
          >
            <span className="material-symbols-outlined text-lg">logout</span>
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 md:ml-72 bg-background min-h-screen p-8 lg:p-12 pb-24">
        <div className="max-w-7xl mx-auto animate-luxury-fade">
          {children}
        </div>
      </main>
    </div>
  );
};
