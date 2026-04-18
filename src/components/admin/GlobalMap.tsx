import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { supabase } from '../../lib/supabase';

// High-fidelity Custom SVG Marker Generator
const getCustomPin = (color: string) => {
  const colorMap: Record<string, string> = {
    blue: '#3b82f6', // Management
    green: '#10b981', // For Sale
    yellow: '#eab308', // For Rent
    red: '#ef4444', // Sold
  };
  const hex = colorMap[color] || '#3b82f6';
  
  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div style="
        width: 32px; height: 32px; 
        background-color: ${hex}; 
        border-radius: 50% 50% 50% 0; 
        transform: rotate(-45deg); 
        box-shadow: 0 4px 10px rgba(0,0,0,0.3);
        border: 2px solid white;
        display: flex; align-items: center; justify-content: center;
      ">
         <div style="width: 8px; height: 8px; background: white; border-radius: 50%;"></div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

export const GlobalMap = ({ filter }: { filter?: 'sale-rent' | 'management' }) => {
  const [properties, setProperties] = useState<any[]>([]);
  const [geoCache, setGeoCache] = useState<Record<string, {lat: number, lng: number}>>({});

  useEffect(() => {
    fetchPropertiesAndGeocode();
  }, [filter]);

  const fetchPropertiesAndGeocode = async () => {
    let query = supabase.from('properties').select('*').order('created_at', { ascending: false });
    
    if (filter === 'sale-rent') {
       query = query.neq('mode', 'management');
    } else if (filter === 'management') {
       query = query.eq('mode', 'management');
    }

    const { data: props } = await query;
    if (!props) return;

    // We implement an intelligent Geocoding memory to prevent repeating identical structural API queries
    const cache: Record<string, {lat: number, lng: number}> = {};
    const updatedProps = [];

    for (const prop of props) {
      const addressString = prop.district ? `${prop.district}, ${prop.city}, France` : `${prop.city}, France`;
      
      let coords = cache[addressString];
      if (!coords) {
         try {
            // Free Nominatim OpenStreetMap API serves perfectly as a Google geocoder substitute without billing limits
            const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(addressString)}`);
            const geoData = await res.json();
            if (geoData && geoData.length > 0) {
               coords = { lat: parseFloat(geoData[0].lat), lng: parseFloat(geoData[0].lon) };
               cache[addressString] = coords;
               // Wait 500ms between unique queries to respect OSM limits safely
               await new Promise(resolve => setTimeout(resolve, 500));
            } else {
               // Default fallback if address cannot be parsed
               coords = { lat: 43.5528, lng: 7.0174 }; // Center of Cannes
            }
         } catch(e) {
            coords = { lat: 43.5528, lng: 7.0174 };
         }
      }

      // Add a microscopic random algorithmic offset (Jitter) so properties in identical districts don't physically stack perfectly over each other
      const jitterLat = coords.lat + (Math.random() - 0.5) * 0.003;
      const jitterLng = coords.lng + (Math.random() - 0.5) * 0.003;

      updatedProps.push({
         ...prop,
         computedLat: jitterLat,
         computedLng: jitterLng
      });
    }

    setGeoCache(cache);
    setProperties(updatedProps);
  };

  const getMarkerColor = (mode: string, status: string) => {
    if (status === 'sold') return 'red';
    if (mode === 'management') return 'blue';
    if (mode === 'rent') return 'yellow';
    return 'green'; // Default for sale & available
  };

  return (
    <div className="w-full h-[70vh] min-h-[600px] border border-outline-variant/20 bg-[#1c1b1b] relative z-0 group">
      <MapContainer 
         center={[43.5528, 7.0174]} // Default Cannes Matrix
         zoom={12} 
         scrollWheelZoom={true} 
         style={{ height: '100%', width: '100%', zIndex: 1 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CartoDB</a> • CannesImmo Luxe Architecture'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        {properties.map((prop) => (
          <Marker 
             key={prop.id} 
             position={[prop.computedLat || 43.5528, prop.computedLng || 7.0174]} 
             icon={getCustomPin(getMarkerColor(prop.mode, prop.status))}
          >
            <Popup className="font-body custom-map-popup min-w-[200px] p-0 overflow-hidden rounded-none shadow-2xl">
              <div className="flex flex-col">
                 <div className="h-32 w-full relative">
                    <img 
                       src={prop.images?.[0] || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800'} 
                       alt={prop.title} 
                       className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/80 backdrop-blur-sm text-white font-label tracking-widest uppercase text-[8px] border border-white/20">
                       {prop.ref_id || 'ASSET'}
                    </div>
                 </div>
                 <div className="p-4 bg-white space-y-2 border-t-2" style={{ borderColor: getCustomPin(getMarkerColor(prop.mode, prop.status)).options.iconUrl ? '#fff' : '#000' /* Inline safety check */}}>
                    <p className="font-label text-[8px] uppercase tracking-widest opacity-50" style={{ color: getMarkerColor(prop.mode, prop.status) === 'blue' ? '#3b82f6' : (getMarkerColor(prop.mode, prop.status) === 'green' ? '#10b981' : (getMarkerColor(prop.mode, prop.status) === 'yellow' ? '#eab308' : '#ef4444')) }}>{prop.mode === 'management' ? 'Managed Portfolio' : prop.mode === 'sale' ? 'Acquisition Market' : 'Seasonal Lease'}</p>
                    <h3 className="font-bold text-sm leading-tight text-[#0a0a0a] m-0">{prop.title}</h3>
                    <div className="flex justify-between items-center text-xs text-gray-500 pt-2 border-t border-gray-100">
                       <span className="truncate max-w-[100px]">{prop.district || prop.city}</span>
                       <span className="font-medium text-black">{prop.surface ? `${prop.surface} m²` : 'TBA'}</span>
                    </div>
                 </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};
