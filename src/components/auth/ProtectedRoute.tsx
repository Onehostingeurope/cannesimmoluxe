import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export const ProtectedRoute = ({ children, requireAdmin = false }: ProtectedRouteProps) => {
  const { user, profile, loading, initialized } = useAuthStore();
  const location = useLocation();

  if (!initialized || loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
        <div className="w-12 h-12 border-t-2 border-secondary animate-spin rounded-full"></div>
      </div>
    );
  }

  if (!user) {
    const loginPath = requireAdmin ? '/admin/login' : '/login';
    return <Navigate to={loginPath} state={{ from: location }} replace />;
  }

  if (requireAdmin && profile?.role !== 'admin') {
    return <Navigate to="/admin/login" state={{ error: 'Administrative clearance required.' }} replace />;
  }

  if (profile?.approval_status === 'pending') {
    return (
       <div className="min-h-screen bg-white dark:bg-black flex flex-col items-center justify-center p-6 text-center font-body animate-luxury-fade">
          <div className="mb-8 w-16 h-16 bg-[#f6f3ee] dark:bg-[#1c1b1b] border border-outline-variant/20 flex items-center justify-center rounded-full scale-110">
             <span className="material-symbols-outlined text-3xl text-secondary">hourglass_empty</span>
          </div>
          <h1 className="font-headline text-3xl text-primary mb-4">Clearance Pending</h1>
          <p className="max-w-md text-sm text-on-surface-variant leading-relaxed mb-6 opacity-80">
             Your access credentials have been securely logged. The system requires manual validation by a Director before your portfolio dashboard is unlocked. 
             You will be notified once clearance is granted.
          </p>
          <div className="flex gap-4 mt-4">
             <button onClick={() => window.location.href = '/'} className="px-6 py-3 border border-outline-variant/50 text-[10px] tracking-[0.2em] font-label uppercase text-primary hover:bg-[#f6f3ee] dark:hover:bg-[#1c1b1b] transition-colors">
                Return to Directory
             </button>
             <button onClick={() => useAuthStore.getState().signOut()} className="px-6 py-3 bg-black dark:bg-white text-white dark:text-black text-[10px] tracking-[0.2em] font-label uppercase transition-all hover:bg-secondary dark:hover:bg-secondary hover:text-white">
                Sign Out
             </button>
          </div>
       </div>
    );
  }

  return <>{children}</>;
};
