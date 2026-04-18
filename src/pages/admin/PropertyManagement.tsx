import { useState, useEffect } from 'react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { Button } from '../../components/ui/Button';
import { supabase } from '../../lib/supabase';
import { clsx } from 'clsx';
import { useNavigate } from 'react-router-dom';
import { GlobalMap } from '../../components/admin/GlobalMap';

const PropertyManagement = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    private: 0
  });

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .neq('mode', 'management')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching properties:', error);
    } else {
      setProperties(data || []);
      
      // Calculate stats
      const total = data?.length || 0;
      const published = data?.filter(p => p.status === 'available' || p.status === 'highlight').length || 0;
      const priv = data?.filter(p => p.status === 'reserved' || p.status === 'sold').length || 0;
      
      setStats({ total, published, private: priv });
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you certain you wish to decommission this property asset? This operation is irreversible.')) return;

    const { error } = await supabase
      .from('properties')
      .delete()
      .eq('id', id);

    if (error) {
      alert('Error decommissioning asset: ' + error.message);
    } else {
      fetchProperties();
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-12 animate-luxury-fade font-body">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 pb-8 border-b border-outline-variant/20">
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <span className="material-symbols-outlined notranslate text-secondary text-base" translate="no">inventory_2</span>
              <p className="font-label text-[10px] tracking-[0.2em] uppercase text-outline">Supply Chain</p>
            </div>
            <h2 className="font-headline text-4xl text-primary">Portfolio Propriety</h2>
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
            { label: 'Total Inventory', value: stats.total.toString(), icon: 'view_comfy' },
            { label: 'Published / Market', value: stats.published.toString(), icon: 'visibility' },
            { label: 'Off-Market / Private', value: stats.private.toString(), icon: 'visibility_off' },
          ].map((stat, idx) => (
             <div key={idx} className="bg-[#f6f3ee] dark:bg-[#1c1b1b] p-6 flex items-center justify-between border border-outline-variant/10">
                <div className="flex items-center gap-4">
                  <span className="material-symbols-outlined notranslate text-secondary text-xl" translate="no">{stat.icon}</span>
                  <span className="font-label text-[10px] tracking-widest uppercase text-outline">{stat.label}</span>
                </div>
                <span className="font-headline text-2xl text-primary">{stat.value}</span>
             </div>
          ))}
        </div>

        {/* Search and Filters Strip */}
        <div className="flex flex-col md:flex-row gap-6 items-center py-4">
           <div className="relative flex-grow group w-full">
              <span className="material-symbols-outlined notranslate absolute left-0 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors" translate="no">search</span>
              <input 
                type="text" 
                placeholder="SEARCH PORTFOLIO BY NOMENCLATURE OR REF ID..." 
                className="bg-transparent border-0 border-b border-outline-variant/30 w-full pl-10 pr-4 py-3 text-[10px] tracking-[0.2em] uppercase outline-none focus:border-primary transition-all placeholder:text-outline/40" 
              />
           </div>
        </div>

        {/* Global Cartographic Registry */}
        <div className="w-full space-y-3">
           <div className="flex flex-wrap items-center gap-4 md:gap-8 px-4 py-3 bg-[#f6f3ee] dark:bg-[#1c1b1b] border border-outline-variant/20 font-label text-[9px] tracking-widest uppercase text-outline">
              <span className="flex items-center gap-2"><div className="w-3 h-3 bg-green-500 rounded-full shadow-sm border border-white dark:border-black"></div> Properties For Sale</span>
              <span className="flex items-center gap-2"><div className="w-3 h-3 bg-yellow-500 rounded-full shadow-sm border border-white dark:border-black"></div> Seasonal Rentals</span>
              <span className="flex items-center gap-2"><div className="w-3 h-3 bg-red-500 rounded-full shadow-sm border border-white dark:border-black"></div> Assets Marked "Sold"</span>
           </div>
           <GlobalMap filter="sale-rent" />
        </div>

        {/* Listings Matrix */}
        <div className="space-y-6">
          {loading ? (
            <div className="py-20 text-center">
              <div className="w-12 h-12 border-t-2 border-secondary animate-spin rounded-full mx-auto"></div>
              <p className="font-label text-[10px] tracking-widest uppercase text-outline mt-6">Loading Inventory...</p>
            </div>
          ) : properties.length === 0 ? (
            <div className="py-20 text-center bg-[#f6f3ee] dark:bg-[#1c1b1b] border border-dashed border-outline-variant/20">
               <p className="font-label text-[10px] tracking-widest uppercase text-outline">No assets currently deployed in registry.</p>
            </div>
          ) : (
            properties.map((property) => (
              <div key={property.id} className="bg-white dark:bg-[#0a0a0a] border border-outline-variant/10 overflow-hidden flex flex-col lg:flex-row hover:shadow-xl transition-all duration-500 group">
                 {/* Fixed thumbnail */}
                 <div className="w-full lg:w-48 aspect-video lg:aspect-square bg-[#f6f3ee] dark:bg-[#1c1b1b] overflow-hidden relative">
                    <img 
                      src={property.images?.[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800'} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                      alt={property.title}
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-black/80 text-white px-2 py-1 text-[8px] tracking-widest uppercase font-bold backdrop-blur-sm">
                        {property.ref_id}
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
                          {property.district ? `${property.district}, ${property.city}` : property.city}
                       </p>
                    </div>

                    <div className="md:col-span-2 space-y-1">
                       <p className="font-label text-[8px] text-outline uppercase tracking-widest opacity-40">Financials</p>
                       <div className="text-sm font-bold text-primary font-body tracking-tight">
                          {property.price_on_request ? 'Price on Request' : property.price ? `€${property.price.toLocaleString()}` : 'Request'}
                       </div>
                       <p className="text-[9px] text-on-surface-variant opacity-60 uppercase">{property.mode === 'sale' ? 'Sale Portfolio' : 'Seasonal Lease'}</p>
                    </div>

                    <div className="md:col-span-2 space-y-2">
                       <p className="font-label text-[8px] text-outline uppercase tracking-widest opacity-40">Status Matrix</p>
                       <div className="flex items-center gap-2">
                          <span className={clsx(
                            "w-1.5 h-1.5 rounded-full",
                            property.status === 'available' || property.status === 'highlight' ? 'bg-green-500 animate-pulse' : 'bg-red-500'
                          )}></span>
                          <span className="font-label text-[10px] text-primary tracking-widest uppercase font-bold">{property.status}</span>
                       </div>
                    </div>

                    <div className="md:col-span-3 flex justify-end items-center gap-4">
                      {[
                        { icon: 'visibility', title: 'Preview Page', action: () => navigate(`/${property.mode}/${property.slug}`) },
                        { icon: 'edit_note', title: 'Edit Metadata', action: () => navigate(`/admin/properties/edit/${property.id}`) },
                        { icon: 'settings', title: 'Configuration', action: () => {} },
                      ].map((tool, tIdx) => (
                        <button 
                          key={tIdx}
                          onClick={tool.action}
                          title={tool.title}
                          className="w-10 h-10 flex items-center justify-center bg-[#f6f3ee] dark:bg-[#1c1b1b] border border-outline-variant/10 text-outline hover:text-secondary hover:border-secondary transition-all duration-300"
                        >
                          <span className="material-symbols-outlined notranslate text-xl" translate="no">{tool.icon}</span>
                        </button>
                      ))}
                      <button 
                        onClick={() => handleDelete(property.id)}
                        className="w-10 h-10 flex items-center justify-center bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900 text-red-400 hover:bg-red-500 hover:text-white transition-all duration-300"
                      >
                         <span className="material-symbols-outlined notranslate text-xl" translate="no">delete_sweep</span>
                      </button>
                    </div>
                 </div>
              </div>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default PropertyManagement;
