import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { MOCK_PROPERTIES } from '../../data/mockProperties';
import { PropertyCard } from '../../components/property/PropertyCard';

const SavedProperties = () => {
  return (
    <DashboardLayout>
      <div className="space-y-12 animate-luxury-fade font-body pb-20">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 pb-8 border-b border-outline-variant/20">
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <span className="material-symbols-outlined text-secondary text-base">book_online</span>
              <p className="font-label text-[10px] tracking-[0.2em] uppercase text-outline">Exclusive Access</p>
            </div>
            <h2 className="font-headline text-4xl text-primary">Private Collection</h2>
            <p className="text-sm text-on-surface-variant max-w-xl opacity-70">
              Your curated portfolio of the French Riviera's most distinguished residences. Verification has unlocked technical blueprints and material schedules for the items below.
            </p>
          </div>
          <div className="flex gap-4">
            <span className="font-label text-[10px] tracking-widest uppercase text-outline">Items: {MOCK_PROPERTIES.length}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-20">
          {MOCK_PROPERTIES.map((property) => (
            <div key={property.id} className="animate-luxury-fade">
              <PropertyCard property={property} />
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SavedProperties;
