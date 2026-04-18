import { AdminLayout } from '../../components/layout/AdminLayout';

export const Marketing = () => (
  <AdminLayout>
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 animate-luxury-fade font-body">
      <span className="material-symbols-outlined text-6xl text-secondary">campaign</span>
      <h2 className="font-headline text-4xl text-primary">Marketing Orchestrator</h2>
      <p className="text-on-surface-variant max-w-md opacity-70 leading-relaxed">
        This module is currently in the technical integration phase. Soon you will be able to orchestrate automated newsletter dissemination and social media amplification directly from here.
      </p>
    </div>
  </AdminLayout>
);

export const Team = () => (
  <AdminLayout>
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 animate-luxury-fade font-body">
      <span className="material-symbols-outlined text-6xl text-secondary">groups</span>
      <h2 className="font-headline text-4xl text-primary">Executive Directory</h2>
      <p className="text-on-surface-variant max-w-md opacity-70 leading-relaxed">
        The team orchestration layer is currently being synchronized. Soon you will be able to manage agent profiles and role-based permissions from this hub.
      </p>
    </div>
  </AdminLayout>
);
