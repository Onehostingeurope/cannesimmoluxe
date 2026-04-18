import { useState, useEffect } from 'react';
import { Layout } from '../components/layout/Layout';
import { PropertyCard } from '../components/property/PropertyCard';
import { supabase } from '../lib/supabase';
import { clsx } from 'clsx';

interface PropertiesPageProps {
  mode: 'sale' | 'rent';
}

const PropertiesPage = ({ mode }: PropertiesPageProps) => {
  const [filterType, setFilterType] = useState('All');
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProperties();
  }, [mode, filterType]);

  const fetchProperties = async () => {
    setLoading(true);
    let query = supabase
      .from('properties')
      .select('*')
      .eq('mode', mode);
    
    if (filterType !== 'All') {
      query = query.ilike('type', `%${filterType}%`);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching properties:', error);
    } else {
      setProperties(data || []);
    }
    setLoading(false);
  };
  const title = mode === 'sale' ? 'Exquisite Sales' : 'Seasonal Rentals';
  const subtitle = mode === 'sale' 
    ? 'A curated selection of the most prestigious residences on the Côte d’Azur.' 
    : 'Exceptional stays in the most exclusive locations in Cannes and beyond.';

  return (
    <Layout>
      {/* Header Orchestration */}
      <section className="bg-[#f6f3ee] dark:bg-[#0a0a0a] pt-12 pb-24 px-6 md:px-12 lg:px-24 font-body border-b border-outline-variant/10">
        <div className="max-w-7xl mx-auto space-y-10 animate-luxury-fade text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
             <div className="flex items-center gap-3">
               <span className="material-symbols-outlined notranslate text-secondary text-base" translate="no">architecture</span>
               <p className="font-label text-[10px] tracking-[0.4em] uppercase text-outline">{mode === 'sale' ? 'Portfolio Acquisition' : 'Seasonal Curations'}</p>
             </div>
             <div className="hidden md:block h-px w-24 bg-outline-variant/30"></div>
          </div>
          <h1 className="font-headline text-5xl md:text-7xl lg:text-8xl text-primary leading-tight">
            {title.split(' ')[0]} <br className="md:hidden" /> <span className="italic text-secondary">{title.split(' ')[1]}</span>
          </h1>
          <p className="text-lg text-on-surface-variant max-w-2xl opacity-70 leading-relaxed mx-auto md:mx-0">
            {subtitle} Verification unlocks technical dimensions and structural assessments for every item in this ledger.
          </p>
        </div>
      </section>

      {/* Orchestration Ledger (Filter Bar) */}
      <section className="sticky top-20 z-40 bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-outline-variant/10 px-6 md:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center py-6 gap-8">
          <div className="flex items-center gap-10 overflow-x-auto w-full md:w-auto no-scrollbar pb-2 md:pb-0">
            {['All', 'Villa', 'Penthouse', 'Historical', 'Apartment'].map((type) => (
              <button 
                key={type}
                onClick={() => setFilterType(type)}
                className={clsx(
                  "font-label text-[10px] tracking-[0.3em] uppercase whitespace-nowrap transition-all duration-300 outline-none border-b-2 pb-1",
                  filterType === type 
                    ? "text-primary font-bold border-secondary" 
                    : "text-outline border-transparent hover:text-primary"
                )}
              >
                {type}
              </button>
            ))}
          </div>
          
          <div className="flex items-center gap-10 w-full md:w-auto justify-between md:justify-end">
             <div className="flex items-center gap-3 text-outline hover:text-primary cursor-pointer transition-colors group">
                <span className="material-symbols-outlined notranslate text-lg group-hover:scale-110 transition-transform" translate="no">search</span>
                <span className="font-label text-[10px] tracking-widest uppercase">Search Repository</span>
             </div>
             <div className="flex items-center gap-3 text-outline hover:text-primary cursor-pointer transition-colors group">
                <span className="material-symbols-outlined notranslate text-lg group-hover:scale-110 transition-transform" translate="no">tune</span>
                <span className="font-label text-[10px] tracking-widest uppercase">Ledger Filters</span>
             </div>
          </div>
        </div>
      </section>

      {/* Collection Matrix */}
      <section className="px-6 md:px-12 lg:px-24 py-24 bg-white dark:bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-24">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
          
          <div className="mt-40 text-center space-y-8">
             <div className="flex items-center justify-center gap-4">
                <div className="h-px w-12 bg-outline-variant/20"></div>
                <span className="material-symbols-outlined notranslate text-secondary opacity-40" translate="no">stat_1</span>
                <div className="h-px w-12 bg-outline-variant/20"></div>
             </div>
             <p className="font-headline italic text-on-surface-variant opacity-40 text-sm">
                Orchestrating {properties.length} exceptional destinations — CannesImmo Luxe Portfolio
             </p>
             <button className="font-label text-[10px] tracking-[0.4em] uppercase text-primary border border-primary/20 hover:border-secondary px-12 py-5 hover:bg-secondary hover:text-white transition-all">
                Load More Entries
             </button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default PropertiesPage;
