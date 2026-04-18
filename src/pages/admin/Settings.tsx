import { useState, useEffect } from 'react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { Button } from '../../components/ui/Button';
import { supabase } from '../../lib/supabase';
import { clsx } from 'clsx';

interface AgencySettings {
  agency_name: string;
  contact_email: string;
  contact_phone: string;
  address: string;
  instagram_url: string;
  linkedin_url: string;
  hero_title: string;
  hero_subtitle: string;
}

const Settings = () => {
  const [settings, setSettings] = useState<AgencySettings>({
    agency_name: 'CannesImmo Luxe',
    contact_email: 'contact@canneimmoluxe.com',
    contact_phone: '+33 (0)4 93 00 00 00',
    address: '45 Boulevard de la Croisette, 06400 Cannes, France',
    instagram_url: 'https://instagram.com/cannesimmoluxe',
    linkedin_url: 'https://linkedin.com/company/cannesimmoluxe',
    hero_title: "L'Art de Vivre",
    hero_subtitle: 'Curated residences for the global collector.'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('cms_content')
      .select('*')
      .eq('page_name', 'Global Settings')
      .maybeSingle();

    if (error) {
      console.error('Error fetching settings:', error);
    } else if (data && data.modules && data.modules[0]) {
      setSettings(data.modules[0]);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase
      .from('cms_content')
      .upsert({ 
        page_name: 'Global Settings', 
        modules: [settings],
        updated_at: new Date().toISOString()
      }, { onConflict: 'page_name' });

    if (error) {
      alert('Error saving settings: ' + error.message);
    } else {
      alert('Global configuration successfully updated.');
    }
    setSaving(false);
  };

  const updateSetting = (field: keyof AgencySettings, value: string) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  return (
    <AdminLayout>
      <div className="space-y-12 animate-luxury-fade font-body">
        {/* Header Strip */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 pb-8 border-b border-outline-variant/20">
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <span className="material-symbols-outlined text-secondary text-base">settings_accessibility</span>
              <p className="font-label text-[10px] tracking-[0.2em] uppercase text-outline">Executive Control</p>
            </div>
            <h2 className="font-headline text-4xl text-primary">Agency Configuration</h2>
            <p className="text-sm text-on-surface-variant max-w-xl opacity-70">
              Orchestrate the global parameters of your digital presence. Define brand identity, contact logistics, and operational metadata.
            </p>
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <Button 
              variant="primary" 
              className="flex-1 md:flex-none flex items-center justify-center gap-2"
              onClick={handleSave}
              disabled={saving}
            >
              <span className="material-symbols-outlined text-sm">{saving ? 'sync' : 'save'}</span>
              {saving ? 'Synchronizing...' : 'Save Configuration'}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Identity Section */}
          <div className="lg:col-span-8 space-y-12">
            <section className="space-y-8">
               <h3 className="font-headline text-2xl text-primary border-b border-outline-variant/10 pb-4">Brand Identity</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                     <label className="font-label text-[9px] tracking-widest uppercase text-outline opacity-50">Agency Name</label>
                     <input 
                       type="text" 
                       className="w-full bg-[#f6f3ee] dark:bg-[#1c1b1b] border-outline-variant/20 p-4 font-body text-sm text-primary" 
                       value={settings.agency_name}
                       onChange={(e) => updateSetting('agency_name', e.target.value)}
                     />
                  </div>
                  <div className="space-y-2">
                     <label className="font-label text-[9px] tracking-widest uppercase text-outline opacity-50">Legal Address</label>
                     <input 
                       type="text" 
                       className="w-full bg-[#f6f3ee] dark:bg-[#1c1b1b] border-outline-variant/20 p-4 font-body text-sm text-primary" 
                       value={settings.address}
                       onChange={(e) => updateSetting('address', e.target.value)}
                     />
                  </div>
               </div>
            </section>

            <section className="space-y-8">
               <h3 className="font-headline text-2xl text-primary border-b border-outline-variant/10 pb-4">Contact Logistics</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                     <label className="font-label text-[9px] tracking-widest uppercase text-outline opacity-50">Concierge Email</label>
                     <input 
                       type="email" 
                       className="w-full bg-[#f6f3ee] dark:bg-[#1c1b1b] border-outline-variant/20 p-4 font-body text-sm text-primary" 
                       value={settings.contact_email}
                       onChange={(e) => updateSetting('contact_email', e.target.value)}
                     />
                  </div>
                  <div className="space-y-2">
                     <label className="font-label text-[9px] tracking-widest uppercase text-outline opacity-50">Direct Phone</label>
                     <input 
                       type="text" 
                       className="w-full bg-[#f6f3ee] dark:bg-[#1c1b1b] border-outline-variant/20 p-4 font-body text-sm text-primary" 
                       value={settings.contact_phone}
                       onChange={(e) => updateSetting('contact_phone', e.target.value)}
                     />
                  </div>
               </div>
            </section>

            <section className="space-y-8">
               <h3 className="font-headline text-2xl text-primary border-b border-outline-variant/10 pb-4">Social Orchestration</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                     <label className="font-label text-[9px] tracking-widest uppercase text-outline opacity-50">Instagram URL</label>
                     <input 
                       type="url" 
                       className="w-full bg-[#f6f3ee] dark:bg-[#1c1b1b] border-outline-variant/20 p-4 font-body text-sm text-primary" 
                       value={settings.instagram_url}
                       onChange={(e) => updateSetting('instagram_url', e.target.value)}
                     />
                  </div>
                  <div className="space-y-2">
                     <label className="font-label text-[9px] tracking-widest uppercase text-outline opacity-50">LinkedIn URL</label>
                     <input 
                       type="url" 
                       className="w-full bg-[#f6f3ee] dark:bg-[#1c1b1b] border-outline-variant/20 p-4 font-body text-sm text-primary" 
                       value={settings.linkedin_url}
                       onChange={(e) => updateSetting('linkedin_url', e.target.value)}
                     />
                  </div>
               </div>
            </section>
          </div>

          {/* Secondary Column */}
          <div className="lg:col-span-4 space-y-8">
             <div className="bg-[#f6f3ee] dark:bg-[#1c1b1b] p-8 border border-outline-variant/10">
                <h4 className="font-headline text-xl text-primary mb-6">System Status</h4>
                <div className="space-y-4">
                   <div className="flex justify-between items-center py-3 border-b border-outline-variant/5">
                      <span className="text-[10px] uppercase tracking-widest text-outline">Supabase Auth</span>
                      <span className="w-2 h-2 rounded-full bg-green-500"></span>
                   </div>
                   <div className="flex justify-between items-center py-3 border-b border-outline-variant/5">
                      <span className="text-[10px] uppercase tracking-widest text-outline">Database Hub</span>
                      <span className="w-2 h-2 rounded-full bg-green-500"></span>
                   </div>
                   <div className="flex justify-between items-center py-3">
                      <span className="text-[10px] uppercase tracking-widest text-outline">Storage Cluster</span>
                      <span className="w-2 h-2 rounded-full bg-green-500"></span>
                   </div>
                </div>
             </div>

             <div className="bg-primary p-8 text-white relative overflow-hidden group">
                <div className="relative z-10 space-y-4">
                   <span className="material-symbols-outlined text-secondary">verified_user</span>
                   <h4 className="font-headline text-xl">Security Protocol</h4>
                   <p className="text-xs text-white/60 leading-relaxed font-body">
                      Global settings modification requires administrative clearance. All changes are logged in the architectural record.
                   </p>
                </div>
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                   <span className="material-symbols-outlined text-9xl">shield</span>
                </div>
             </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Settings;
