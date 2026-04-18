import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';

interface PropertyCardProps {
  property: {
    id: string;
    title: string;
    city: string;
    district: string;
    type: string;
    price: number | null;
    price_on_request: boolean;
    bedrooms: number;
    bathrooms: number;
    surface: number;
    images: string[];
    featured?: boolean;
    mode: 'sale' | 'rent';
    status: string;
  };
}

export const PropertyCard = ({ property }: PropertyCardProps) => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  
  const formattedPrice = property.price 
    ? new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(property.price)
    : '';
    
  const isOffMarket = property.status === 'off-market';
  const isLocked = isOffMarket && !user;

  return (
    <div 
      onClick={() => isLocked ? navigate('/register') : navigate(`/properties/${property.id}`)}
      className="group cursor-pointer flex flex-col space-y-6 font-body animate-luxury-fade"
    >
      {/* Cinematic Frame */}
      <div className="relative aspect-[4/5] bg-black overflow-hidden border border-outline-variant/10">
        <img 
          src={property.images[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800'} 
          alt={property.title}
          className={`w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-[2s] opacity-90 ${isLocked ? 'blur-md' : ''}`}
        />
        
        {/* Status Indicators */}
        <div className="absolute top-6 left-6 flex flex-col gap-3">
          {isOffMarket && (
            <div className="bg-black text-white px-4 py-1.5 text-[9px] tracking-[0.2em] uppercase font-label border border-white/20 shadow-xl flex items-center gap-2">
              <span className="material-symbols-outlined text-[10px]">shield_lock</span>
              Confidential Off-Market
            </div>
          )}
          {property.featured && !isOffMarket && (
            <div className="bg-secondary text-white px-4 py-1.5 text-[9px] tracking-[0.2em] uppercase font-label backdrop-blur-md border border-secondary/30">
              Exclusive
            </div>
          )}
          <div className="bg-white/10 backdrop-blur-md text-white px-4 py-1.5 text-[9px] tracking-[0.3em] uppercase font-label border border-white/20">
            {property.mode === 'sale' ? 'Propriété à Vendre' : 'Location Saisonnière'}
          </div>
        </div>

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-700 flex items-center justify-center p-8">
           {isLocked ? (
             <div className="w-full border border-white/30 p-6 text-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-700 bg-black/80 backdrop-blur-sm">
                <span className="material-symbols-outlined text-white text-3xl mb-2">lock</span>
                <p className="font-label text-[10px] tracking-[0.3em] uppercase text-white mb-2">Private Operations Data</p>
                <p className="font-label text-[8px] tracking-widest text-[#dcdad5]">Authenticate Required To Decrypt</p>
             </div>
           ) : (
             <div className="w-full border border-white/30 p-6 text-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-700">
                <span className="material-symbols-outlined text-white text-3xl mb-2">visibility</span>
                <p className="font-label text-[10px] tracking-[0.3em] uppercase text-white">View Technical Dossier</p>
             </div>
           )}
        </div>
      </div>

      {/* Editorial Documentation */}
      <div className="space-y-4">
        <div className="space-y-2">
           <div className="flex items-center justify-between">
              <p className="font-label text-[10px] tracking-[0.2em] uppercase text-secondary font-bold">{property.type}</p>
              <div className="flex items-center gap-2 text-outline/40">
                 <span className="material-symbols-outlined text-sm">location_on</span>
                 <p className="font-label text-[9px] tracking-widest uppercase">{property.city}</p>
              </div>
           </div>
           <h3 className="font-headline text-3xl text-primary leading-tight group-hover:text-secondary transition-colors">
             {property.title}
           </h3>
        </div>

        {/* Technical Matrix */}
        <div className="flex items-center justify-between py-4 border-y border-outline-variant/10">
           {[
             { label: 'CH', value: property.bedrooms, icon: 'bed' },
             { label: 'SDB', value: property.bathrooms, icon: 'bathtub' },
             { label: 'M²', value: property.surface, icon: 'straighten' }
           ].map((spec, sidx) => (
             <div key={sidx} className="flex flex-col items-center">
                <span className="material-symbols-outlined text-outline/30 text-base mb-1">{spec.icon}</span>
                <p className="font-label text-[10px] font-bold text-primary tracking-widest">{spec.value}<span className="text-[8px] text-outline font-normal ml-0.5">{spec.label}</span></p>
             </div>
           ))}
        </div>

        <div className="flex items-center justify-between">
          {property.price_on_request ? (
            <p className="font-headline italic text-secondary tracking-wide">Price on Request</p>
          ) : (
            <p className="font-headline text-2xl text-primary">{formattedPrice}</p>
          )}
          <button className="material-symbols-outlined text-outline/40 hover:text-secondary transition-colors">favorite</button>
        </div>
      </div>
    </div>
  );
};
