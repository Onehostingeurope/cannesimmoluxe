import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { useAuthStore } from '../../store/useAuthStore';
import { Button } from '../../components/ui/Button';
import { MOCK_PROPERTIES } from '../../data/mockProperties';
import { PropertyCard } from '../../components/property/PropertyCard';
import { useNavigate } from 'react-router-dom';

const DashboardHome = () => {
  const { profile } = useAuthStore();
  const navigate = useNavigate();
  
  // Mock recent properties for the collection
  const savedProperties = MOCK_PROPERTIES.slice(0, 2);

  return (
    <DashboardLayout>
      <div className="space-y-16 animate-luxury-fade font-body">
        {/* Welcome Workstation */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-secondary text-base">verified_user</span>
              <p className="font-label text-[10px] tracking-[0.2em] uppercase text-outline">Verified Access</p>
            </div>
            <h1 className="font-headline text-5xl md:text-6xl text-primary leading-tight">
              Bienvenue, <span className="italic text-secondary">{profile?.first_name || 'Collector'}</span>.
            </h1>
            <p className="text-lg text-on-surface-variant max-w-xl opacity-80 leading-relaxed">
              Your private portal to the French Riviera's most exceptional estates. Manage your curated collection and oversee your ongoing consultations.
            </p>
          </div>
          
          <div className="lg:col-span-4 bg-[#f6f3ee] dark:bg-[#1c1b1b] p-10 border border-outline-variant/10 relative overflow-hidden group">
            <div className="absolute -top-4 -right-4 opacity-5 group-hover:scale-110 transition-transform">
               <span className="material-symbols-outlined text-[120px]">security</span>
            </div>
            <div className="relative z-10 space-y-4">
              <h3 className="font-headline text-xl text-primary">Identity Verified</h3>
              <p className="text-xs text-on-surface-variant leading-relaxed opacity-70">
                You have unrestricted access to technical dossier downloads, precise CAD site locations, and the priority concierge desk.
              </p>
            </div>
          </div>
        </div>

        {/* Action Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: 'Private Collection', value: '12 Estates', icon: 'favorite', path: '/dashboard/saved' },
            { label: 'Active Inquiries', value: '2 Consultations', icon: 'chat', path: '/dashboard/inquiries' },
            { label: 'Digital Dossiers', value: '1 Ready', icon: 'description', path: '/dashboard/documents' },
          ].map((action, idx) => (
            <div key={idx} className="bg-[#f6f3ee] dark:bg-[#1c1b1b] p-8 space-y-8 border border-outline-variant/10 hover:shadow-xl transition-all duration-500 group">
              <span className="material-symbols-outlined text-secondary text-3xl group-hover:scale-110 transition-transform">{action.icon}</span>
              <div className="space-y-2">
                <h4 className="font-headline text-2xl text-primary">{action.label}</h4>
                <p className="font-label text-xs tracking-widest text-outline uppercase">{action.value}</p>
              </div>
              <Button 
                variant="outline" 
                className="w-full text-[10px] tracking-widest uppercase border-outline-variant/30 hover:border-secondary"
                onClick={() => navigate(action.path)}
              >
                Enter Station
              </Button>
            </div>
          ))}
        </div>

        {/* Curated Recommendations */}
        <div className="space-y-12 pb-20">
          <div className="flex justify-between items-end pb-4 border-b border-outline-variant/20">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="material-symbols-outlined text-secondary text-base">auto_awesome</span>
                <p className="font-label text-[10px] tracking-[0.2em] uppercase text-outline">Intelligence Matching</p>
              </div>
              <h2 className="font-headline text-3xl text-primary">Tailored for You</h2>
            </div>
            <button className="font-label text-[10px] tracking-widest uppercase text-secondary hover:text-primary transition-colors border-b border-transparent hover:border-secondary">Explore All</button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {savedProperties.map(property => (
              <div key={property.id} className="animate-luxury-fade">
                <PropertyCard property={property} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardHome;
