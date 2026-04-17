import { AdminLayout } from '../../components/layout/AdminLayout';
import { Button } from '../../components/ui/Button';
import { MOCK_PROPERTIES } from '../../data/mockProperties';
import { clsx } from 'clsx';
import { useNavigate } from 'react-router-dom';

const PropertyManagement = () => {
  const navigate = useNavigate();

  return (
    <AdminLayout>
      <div className="space-y-12 animate-luxury-fade">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 pb-8 border-b border-outline-variant/20">
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <span className="material-symbols-outlined text-secondary text-base">inventory_2</span>
              <p className="font-label text-[10px] tracking-[0.2em] uppercase text-outline">Supply Chain</p>
            </div>
            <h2 className="font-headline text-4xl text-primary">Portfolio Management</h2>
            <p className="text-sm text-on-surface-variant max-w-xl opacity-70">
              Manage, curate, and deploy your most prestigious listings across the French Riviera. Use the technical matrix to update market status and media assets.
            </p>
          </div>
          <Button 
            variant="primary" 
            className="w-full md:w-auto"
            onClick={() => navigate('/admin/properties/new')}
          >
            Deploy New Estate
          </Button>
        </div>

        {/* Global Controls & Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: 'Total Inventory', value: '48', icon: 'view_comfy' },
            { label: 'Published / Market', value: '42', icon: 'visibility' },
            { label: 'Off-Market / Private', value: '6', icon: 'visibility_off' },
          ].map((stat, idx) => (
             <div key={idx} className="bg-[#f6f3ee] dark:bg-[#1c1b1b] p-6 flex items-center justify-between border border-outline-variant/10">
                <div className="flex items-center gap-4">
                  <span className="material-symbols-outlined text-secondary text-xl">{stat.icon}</span>
                  <span className="font-label text-[10px] tracking-widest uppercase text-outline">{stat.label}</span>
                </div>
                <span className="font-headline text-2xl text-primary">{stat.value}</span>
             </div>
          ))}
        </div>

        {/* Search and Filters Strip */}
        <div className="flex flex-col md:flex-row gap-6 items-center py-4">
           <div className="relative flex-grow group w-full">
              <span className="material-symbols-outlined absolute left-0 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">search</span>
              <input 
                type="text" 
                placeholder="SEARCH PORTFOLIO BY NOMENCLATURE OR REF ID..." 
                className="bg-transparent border-0 border-b border-outline-variant/30 w-full pl-10 pr-4 py-3 text-[10px] tracking-[0.2em] uppercase outline-none focus:border-primary transition-all placeholder:text-outline/40" 
              />
           </div>
           <div className="flex gap-6 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
              {['All', 'Villas', 'Apartments', 'Developments'].map((filter) => (
                <button 
                  key={filter}
                  className="whitespace-nowrap font-label text-[10px] tracking-widest uppercase text-outline hover:text-primary border-b border-transparent hover:border-secondary pb-1 transition-all"
                >
                  {filter}
                </button>
              ))}
           </div>
        </div>

        {/* Listings Matrix */}
        <div className="space-y-6">
          {MOCK_PROPERTIES.map((property) => (
            <div key={property.id} className="bg-white dark:bg-[#0a0a0a] border border-outline-variant/10 overflow-hidden flex flex-col lg:flex-row hover:shadow-xl transition-all duration-500 group">
               {/* Fixed thumbnail */}
               <div className="w-full lg:w-48 aspect-video lg:aspect-square bg-[#f6f3ee] dark:bg-[#1c1b1b] overflow-hidden relative">
                  <img 
                    src={property.images[0]} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    alt={property.title}
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-black/80 text-white px-2 py-1 text-[8px] tracking-widest uppercase font-bold backdrop-blur-sm">
                      {property.ref_id || 'REF-001'}
                    </span>
                  </div>
               </div>
               
               {/* Details Grid */}
               <div className="flex-grow p-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                  <div className="md:col-span-5 space-y-2">
                     <span className="font-label text-[9px] text-secondary uppercase tracking-[0.2em]">{property.type}</span>
                     <h3 className="font-headline text-xl text-primary group-hover:text-secondary transition-colors duration-300">
                        {property.title}
                     </h3>
                     <p className="font-label text-[10px] text-outline tracking-widest uppercase italic opacity-70">
                        {property.district || 'Cannes'}, {property.city}
                     </p>
                  </div>

                  <div className="md:col-span-2 space-y-1">
                     <p className="font-label text-[8px] text-outline uppercase tracking-widest opacity-40">Financials</p>
                     <div className="text-sm font-bold text-primary font-body tracking-tight">
                        {property.price ? `€${property.price.toLocaleString()}` : 'Request'}
                     </div>
                     <p className="text-[9px] text-on-surface-variant opacity-60 uppercase">{property.mode === 'sale' ? 'Sale Portfolio' : 'Seasonal Lease'}</p>
                  </div>

                  <div className="md:col-span-2 space-y-2">
                     <p className="font-label text-[8px] text-outline uppercase tracking-widest opacity-40">Status Matrix</p>
                     <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                        <span className="font-label text-[10px] text-primary tracking-widest uppercase font-bold">Published</span>
                     </div>
                  </div>

                  <div className="md:col-span-3 flex justify-end items-center gap-4">
                    {[
                      { icon: 'visibility', title: 'Preview Page', action: () => navigate(`/buy/${property.slug}`) },
                      { icon: 'edit_note', title: 'Edit Metadata', action: () => navigate(`/admin/properties/edit/${property.id}`) },
                      { icon: 'settings', title: 'Configuration', action: () => {} },
                    ].map((tool, tIdx) => (
                      <button 
                        key={tIdx}
                        onClick={tool.action}
                        title={tool.title}
                        className="w-10 h-10 flex items-center justify-center bg-[#f6f3ee] dark:bg-[#1c1b1b] border border-outline-variant/10 text-outline hover:text-secondary hover:border-secondary transition-all duration-300"
                      >
                        <span className="material-symbols-outlined text-xl">{tool.icon}</span>
                      </button>
                    ))}
                    <button className="w-10 h-10 flex items-center justify-center bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900 text-red-400 hover:bg-red-500 hover:text-white transition-all duration-300">
                       <span className="material-symbols-outlined text-xl">delete_sweep</span>
                    </button>
                  </div>
               </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default PropertyManagement;
