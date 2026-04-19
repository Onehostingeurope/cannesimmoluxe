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
  const [backups, setBackups] = useState<any[]>([]);
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [restoreTarget, setRestoreTarget] = useState<any>(null);
  const [validationText, setValidationText] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [restoring, setRestoring] = useState(false);
  const [restoreError, setRestoreError] = useState('');
  
  // Anti-Brute Force Local Matrix
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutTimer, setLockoutTimer] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (lockoutTimer > 0) {
      interval = setInterval(() => {
        setLockoutTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [lockoutTimer]);

  useEffect(() => {
    fetchSettings();
    fetchBackups();
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

  const fetchBackups = async () => {
    const { data } = await supabase
      .from('cms_content')
      .select('id, page_name, updated_at, modules')
      .like('page_name', 'Backup-%')
      .order('updated_at', { ascending: false });
    if (data) setBackups(data);
  };

  const handleRestore = async () => {
    if (lockoutTimer > 0) return;
    setRestoreError('');
    if (validationText !== 'RESTORE') {
      setRestoreError('Validation mismatch: You must type RESTORE');
      return;
    }
    setRestoring(true);
    
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const userEmail = sessionData.session?.user?.email;

      if (!userEmail) throw new Error('No active session identified.');

      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: userEmail,
        password: adminPassword,
      });

      if (authError || !authData.user) {
        throw new Error('Authentication Rejected: Invalid Administrator Password.');
      }

      const archive = restoreTarget.modules[0];
      if (!archive || !archive.properties) throw new Error('Corrupt Archive: Payload missing.');

      await supabase.from('inquiries').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      await supabase.from('properties').delete().neq('id', '00000000-0000-0000-0000-000000000000');

      if (archive.properties.length > 0) {
        await supabase.from('properties').insert(archive.properties);
      }
      if (archive.inquiries.length > 0) {
        await supabase.from('inquiries').insert(archive.inquiries);
      }

      alert('Disaster Recovery Complete! Local matrix restored from archive: ' + restoreTarget.page_name);
      setShowRestoreModal(false);
      setRestoreTarget(null);
      setValidationText('');
      setAdminPassword('');
    } catch (e: any) {
      setFailedAttempts((prev) => {
        const newAttempts = prev + 1;
        let delay = 0;
        if (newAttempts === 2) delay = 3;
        else if (newAttempts === 3) delay = 10;
        else if (newAttempts >= 4) delay = 30;
        
        if (delay > 0) setLockoutTimer(delay);
        return newAttempts;
      });
      setRestoreError(e.message);
    }
    setRestoring(false);
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
              <span className="material-symbols-outlined notranslate text-secondary text-base" translate="no">settings_accessibility</span>
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
              <span className="material-symbols-outlined notranslate text-sm" translate="no">{saving ? 'sync' : 'save'}</span>
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
            
             <section className="space-y-8 mt-12 bg-red-950/5 p-8 border border-red-500/20">
               <div className="flex items-center gap-3 border-b border-red-500/20 pb-4">
                 <span className="material-symbols-outlined text-red-500 notranslate" translate="no">emergency</span>
                 <h3 className="font-headline text-2xl text-red-500">Disaster Recovery (30-Day Automated Engine)</h3>
               </div>
               
               <div className="space-y-4">
                 {backups.length === 0 ? (
                   <p className="text-on-surface-variant text-sm opacity-50">No automated archives have been recorded yet. The engine runs daily at 00:00.</p>
                 ) : backups.map((bkp) => (
                   <div key={bkp.id} className="flex items-center justify-between bg-surface p-4 border border-outline-variant/10">
                      <div>
                        <p className="font-headline text-lg text-primary">{bkp.page_name}</p>
                        <p className="text-xs text-outline font-label uppercase tracking-widest">{new Date(bkp.updated_at).toLocaleString()}</p>
                      </div>
                      <Button 
                        variant="outline" 
                        className="border-red-500/30 text-red-500 hover:bg-red-500 hover:text-white"
                        onClick={() => {
                          setRestoreTarget(bkp);
                          setShowRestoreModal(true);
                        }}
                      >
                        Initiate Restore
                      </Button>
                   </div>
                 ))}
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
                   <span className="material-symbols-outlined notranslate text-secondary" translate="no">verified_user</span>
                   <h4 className="font-headline text-xl">Security Protocol</h4>
                   <p className="text-xs text-white/60 leading-relaxed font-body">
                      Global settings modification requires administrative clearance. All changes are logged in the architectural record.
                   </p>
                </div>
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                   <span className="material-symbols-outlined notranslate text-9xl" translate="no">shield</span>
                </div>
             </div>
          </div>
        </div>
      </div>

      {showRestoreModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface p-8 max-w-lg w-full border border-red-500/30 space-y-6">
            <h3 className="font-headline text-2xl text-red-500 border-b border-red-500/20 pb-4">Critical Action: Database Overwrite</h3>
            <p className="text-sm text-on-surface leading-relaxed">
              You are about to irreversibly OVERWRITE the live properties and CRM configuration with archive: <strong>{restoreTarget?.page_name}</strong>.
            </p>
            
            {restoreError && <div className="text-red-500 text-xs bg-red-500/10 p-3">{restoreError}</div>}

            <div className="space-y-4 pt-4">
               <div>
                  <label className="font-label text-[9px] tracking-widest uppercase text-outline">Intent Verification (Type RESTORE)</label>
                  <input 
                     type="text"
                     placeholder="Type RESTORE here"
                     className="w-full bg-[#f6f3ee] dark:bg-[#1c1b1b] border-outline-variant/20 p-4 font-body text-sm text-primary mt-2 flex disabled:opacity-50"
                     value={validationText}
                     onChange={e => setValidationText(e.target.value)}
                     disabled={lockoutTimer > 0}
                  />
               </div>
               <div>
                  <label className="font-label text-[9px] tracking-widest uppercase text-outline">Executive Password</label>
                  <input 
                     type="password"
                     placeholder="Enter your administrative password"
                     className="w-full bg-[#f6f3ee] dark:bg-[#1c1b1b] border-outline-variant/20 p-4 font-body text-sm text-primary mt-2 disabled:opacity-50"
                     value={adminPassword}
                     onChange={e => setAdminPassword(e.target.value)}
                     disabled={lockoutTimer > 0}
                  />
               </div>
            </div>

            {lockoutTimer > 0 && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-500 text-xs p-3 flex items-center justify-between">
                <span>Security Shield Active.</span>
                <span className="font-bold tracking-widest">{lockoutTimer}s Lockout</span>
              </div>
            )}

            <div className="flex gap-4 pt-4 border-t border-outline-variant/20">
               <Button variant="outline" className="flex-1" onClick={() => setShowRestoreModal(false)} disabled={restoring}>Abort</Button>
               <Button variant="primary" className="flex-1 bg-red-600 hover:bg-red-700 text-white border-none disabled:opacity-50" onClick={handleRestore} disabled={restoring || lockoutTimer > 0}>
                 {restoring ? 'Overwriting...' : (lockoutTimer > 0 ? 'Restricted' : 'Execute Recovery')}
               </Button>
            </div>
          </div>
        </div>
      )}

    </AdminLayout>
  );
};

export default Settings;
