export interface TrackingData {
  ip?: string;
  userAgent: string;
  referrer: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  timestamp: string;
}

export const getTrackingData = async (): Promise<TrackingData> => {
  const urlParams = new URLSearchParams(window.location.search);
  
  // Try to get IP (approximate) via a public service if needed, 
  // but for now we'll rely on the server side (Supabase/Vercel) to capture actual IP.
  // We capture client-side info here.
  
  return {
    userAgent: navigator.userAgent,
    referrer: document.referrer,
    utmSource: urlParams.get('utm_source') || undefined,
    utmMedium: urlParams.get('utm_medium') || undefined,
    utmCampaign: urlParams.get('utm_campaign') || undefined,
    timestamp: new Date().toISOString(),
  };
};
