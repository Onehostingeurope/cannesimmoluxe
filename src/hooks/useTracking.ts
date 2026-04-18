import { useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/useAuthStore';

// Cache the geolocation payload in memory so we don't hammer the ipapi service
let cachedGeoData: any = null;
let sessionTargetId = Math.random().toString(36).substring(2, 15);

export const useTracking = (actionType: string, targetId?: string) => {
  const { user } = useAuthStore();

  useEffect(() => {
    const trackActivity = async () => {
      try {
        // 1. Resolve GeoIP Data (or use Cache)
        if (!cachedGeoData) {
          const res = await fetch('https://ipapi.co/json/');
          if (res.ok) {
            cachedGeoData = await res.json();
          } else {
             cachedGeoData = { ip: 'Unknown', city: 'Unknown', country_name: 'Unknown', latitude: 0, longitude: 0 };
          }
        }

        // 2. Dispatch to the PostgreSQL Surveillance Ledger
        await supabase.from('activity_logs').insert({
          user_id: user?.id || null,
          session_id: sessionTargetId,
          action_type: actionType,
          target_id: targetId || null,
          ip_address: cachedGeoData.ip,
          city: cachedGeoData.city,
          country: cachedGeoData.country_name,
          lat: cachedGeoData.latitude,
          lng: cachedGeoData.longitude
        });
        
      } catch (error) {
        console.error('Surveillance Engine Error:', error);
      }
    };

    trackActivity();
  }, [actionType, targetId, user?.id]);
};
