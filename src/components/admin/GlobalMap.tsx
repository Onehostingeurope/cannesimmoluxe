import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { supabase } from '../../lib/supabase';

// Fix generic Leaflet marker icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom Luxury Marker
const luxuryMarker = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  className: 'hue-rotate-[160deg] opacity-80', // Gives it a golden/amber vibe
});

export const GlobalMap = () => {
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    fetchLogs();
    
    // Subscribe to real-time tracker inserts
    const subscription = supabase.channel('activity_logs')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'activity_logs' }, payload => {
        setLogs(prev => [payload.new, ...prev]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const fetchLogs = async () => {
    const { data } = await supabase.from('activity_logs').select('*').order('created_at', { ascending: false }).limit(50);
    if (data) setLogs(data);
  };

  // Filter logs with valid coordinates
  const validLogs = logs.filter(l => l.lat && l.lng);

  return (
    <div className="w-full h-[70vh] min-h-[600px] border border-outline-variant/20 bg-[#1c1b1b] relative z-0">
      <MapContainer 
         center={[43.5528, 7.0174]} // Default Cannes
         zoom={3} 
         scrollWheelZoom={true} 
         style={{ height: '100%', width: '100%', zIndex: 1 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CartoDB</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        {validLogs.map((log) => (
          <Marker key={log.id} position={[log.lat, log.lng]} icon={luxuryMarker}>
            <Popup className="font-body">
              <div className="p-1 space-y-1">
                 <p className="font-label text-[9px] uppercase tracking-widest text-outline">{log.action_type}</p>
                 <p className="font-bold text-sm">{log.city}, {log.country}</p>
                 <p className="text-xs opacity-70">Target: {log.target_id || 'Global'}</p>
                 <p className="text-[10px] opacity-40">{log.ip_address}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};
