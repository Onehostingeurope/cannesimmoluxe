import { useState, useEffect } from 'react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { Button } from '../../components/ui/Button';
import { supabase } from '../../lib/supabase';
import { clsx } from 'clsx';

interface CMSModule {
  id: string;
  type: string;
  title?: string;
  content?: string;
  media_type?: 'image' | 'video' | 'youtube';
  media_url?: string;
  youtube_id?: string;
  youtube_id_mobile?: string;
  grid_items?: { name: string, img: string }[];
}

const CMS = () => {
  const [activePage, setActivePage] = useState('Homepage');
  const [modules, setModules] = useState<CMSModule[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);
  
  const pages = ['Homepage', 'Buy', 'Rent', 'About Us', 'Contact', 'Services'];
  
  const availableModules = [
    { type: 'hero', label: 'Cinematic Hero', icon: 'movie' },
    { type: 'grid', label: 'Asymmetric Grid', icon: 'grid_view' },
    { type: 'text', label: 'Editorial Narrative', icon: 'subject' },
    { type: 'media', label: 'Full Span Asset', icon: 'image' },
    { type: 'contact', label: 'Concierge Form', icon: 'hub' },
  ];

  useEffect(() => {
    fetchPageContent();
  }, [activePage]);

  const fetchPageContent = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('cms_content')
      .select('*')
      .eq('page_name', activePage)
      .maybeSingle();

    if (error) {
      console.error('Error fetching CMS content:', error);
    } else if (data) {
      let loadedModules = data.modules || [];
      if (!loadedModules.find((m: any) => m.type === 'grid') && activePage === 'Homepage') {
         loadedModules.push({
           id: 'img-grid-1',
           type: 'grid',
           title: 'The Enclaves',
           grid_items: [
             { name: 'Cannes', img: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&q=80&w=800' },
             { name: 'Antibes', img: 'https://images.unsplash.com/photo-1549439602-43ebca2327af?auto=format&fit=crop&q=80&w=800' },
             { name: 'St. Tropez', img: 'https://images.unsplash.com/photo-1493246507139-91e8bef99c02?auto=format&fit=crop&q=80&w=800' }
           ]
         });
      }
      if (!loadedModules.find((m: any) => m.type === 'text') && activePage === 'Homepage') {
         loadedModules.push({
           id: 'text-curator-1',
           type: 'text',
           title: 'The Curator\'s Perspective',
           content: 'For over two decades, we have provided unparalleled representation for the Riviera\'s most elite property owners. Every transaction is handled with absolute discretion and technical precision.',
           media_type: 'image',
           media_url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1000'
         });
      }
      setModules(loadedModules);
    } else {
      setModules([
        { 
          id: '1', 
          type: 'hero', 
          title: 'The Art of Living', 
          content: 'Curated residences for the global collector.',
          media_type: 'image',
          media_url: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&q=80&w=2000'
        }
      ]);
    }
    setLoading(false);
  };

  const handleDeploy = async () => {
    setSaving(true);
    const { error } = await supabase
      .from('cms_content')
      .upsert({ 
        page_name: activePage, 
        modules: modules,
        updated_at: new Date().toISOString()
      }, { onConflict: 'page_name' });

    if (error) {
      alert('Error deploying changes: ' + error.message);
    } else {
      alert('Content successfully deployed to global cluster.');
    }
    setSaving(false);
  };

  const updateModuleContent = (id: string, field: string, value: any) => {
    setModules(modules.map(m => m.id === id ? { ...m, [field]: value } : m));
  };

  const handleFileUpload = async (moduleId: string, file: File) => {
    try {
      setUploading(moduleId);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `cms/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('assets')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('assets')
        .getPublicUrl(filePath);

      updateModuleContent(moduleId, 'media_url', publicUrl);
      updateModuleContent(moduleId, 'media_type', file.type.startsWith('video/') ? 'video' : 'image');
    } catch (error: any) {
      alert('Error uploading file: ' + error.message);
    } finally {
      setUploading(null);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-12 animate-luxury-fade font-body">
        {/* Header Strip */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 pb-8 border-b border-outline-variant/20">
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <span className="material-symbols-outlined text-secondary text-base">auto_stories</span>
              <p className="font-label text-[10px] tracking-[0.2em] uppercase text-outline">Editorial Hub</p>
            </div>
            <h2 className="font-headline text-4xl text-primary">Content Orchestrator</h2>
            <p className="text-sm text-on-surface-variant max-w-xl opacity-70">
              Curate the narrative flow of your digital presence. Arrange modules, deploy visual assets, and define the vocabulary of your luxury interface.
            </p>
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <Button variant="outline" className="flex-1 md:flex-none">Preview Live</Button>
            <Button 
              variant="primary" 
              className="flex-1 md:flex-none flex items-center justify-center gap-2"
              onClick={handleDeploy}
              disabled={saving}
            >
              <span className="material-symbols-outlined text-sm">{saving ? 'sync' : 'cloud_done'}</span>
              {saving ? 'Synchronizing...' : 'Deploy Changes'}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Sitemap Sidebar */}
          <div className="lg:col-span-3 space-y-8">
            <div className="space-y-6">
               <h3 className="font-headline text-xl text-primary pb-2 border-b border-outline-variant/20">Sitemap</h3>
               <div className="space-y-1">
                  {pages.map((page) => (
                    <button
                      key={page}
                      onClick={() => setActivePage(page)}
                      className={clsx(
                        "w-full text-left px-5 py-3 font-label text-[10px] tracking-widest uppercase transition-all duration-300 outline-none",
                        activePage === page 
                          ? "bg-black dark:bg-white text-white dark:text-black font-bold" 
                          : "text-outline hover:bg-[#f6f3ee] dark:hover:bg-[#1c1b1b] hover:pl-6"
                      )}
                    >
                      {page}
                    </button>
                  ))}
               </div>
            </div>
          </div>

          {/* Builder Canvas */}
          <div className="lg:col-span-9 space-y-8">
             <div className="bg-[#f6f3ee] dark:bg-[#1c1b1b] p-1 border border-outline-variant/10 min-h-[600px] relative">
                <div className="p-8 space-y-6">
                   {loading ? (
                      <div className="py-20 text-center">
                         <div className="w-12 h-12 border-t-2 border-secondary animate-spin rounded-full mx-auto"></div>
                      </div>
                   ) : (
                     modules.map((module) => (
                       <div key={module.id} className="bg-white dark:bg-black p-10 border border-outline-variant/20 shadow-sm relative group space-y-8">
                          <div className="flex items-center gap-4 mb-2 text-secondary">
                             <span className="material-symbols-outlined">
                                {availableModules.find(am => am.type === module.type)?.icon || 'article'}
                             </span>
                             <span className="font-label text-[10px] tracking-[0.2em] uppercase font-bold">
                                {availableModules.find(am => am.type === module.type)?.label || 'Module'}
                             </span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                             <div className="space-y-6">
                                <div className="space-y-2">
                                   <label className="font-label text-[9px] tracking-widest uppercase text-outline opacity-50">Narrative Title</label>
                                   <input 
                                     type="text" 
                                     className="w-full bg-transparent border-0 border-b border-outline-variant/30 focus:border-primary focus:ring-0 px-0 pb-2 font-headline text-3xl text-primary" 
                                     value={module.title || ''}
                                     onChange={(e) => updateModuleContent(module.id, 'title', e.target.value)}
                                   />
                                </div>
                                {module.type !== 'grid' && (
                                   <div className="space-y-2">
                                      <label className="font-label text-[9px] tracking-widest uppercase text-outline opacity-50">Narrative Content</label>
                                      <textarea 
                                        className="w-full bg-transparent border-0 border-b border-outline-variant/30 focus:border-primary focus:ring-0 px-0 pb-2 font-body text-sm text-on-surface-variant h-24 resize-none" 
                                        value={module.content || ''}
                                        onChange={(e) => updateModuleContent(module.id, 'content', e.target.value)}
                                      />
                                   </div>
                                )}
                             </div>

                             {module.type === 'grid' ? (
                               <div className="space-y-6">
                                 <label className="font-label text-[9px] tracking-widest uppercase text-outline opacity-50 block">Property Enclaves Configuration</label>
                                 <div className="space-y-4">
                                   {module.grid_items?.map((item, idx) => (
                                      <div key={idx} className="flex gap-4 items-center border border-outline-variant/10 p-2 dark:bg-[#111]">
                                         <input 
                                           value={item.name} 
                                           onChange={(e) => {
                                              const newModules = [...modules];
                                              const mIdx = newModules.findIndex(m => m.id === module.id);
                                              if (newModules[mIdx].grid_items) newModules[mIdx].grid_items[idx].name = e.target.value;
                                              setModules(newModules);
                                           }}
                                           className="w-1/3 bg-[#f6f3ee] dark:bg-[#1c1b1b] py-3 px-3 font-label text-[9px] uppercase tracking-widest border-0"
                                           placeholder="Label"
                                         />
                                         <input 
                                           value={item.img}
                                           onChange={(e) => {
                                              const newModules = [...modules];
                                              const mIdx = newModules.findIndex(m => m.id === module.id);
                                              if (newModules[mIdx].grid_items) newModules[mIdx].grid_items[idx].img = e.target.value;
                                              setModules(newModules);
                                           }}
                                           className="w-2/3 bg-[#f6f3ee] dark:bg-[#1c1b1b] py-3 px-3 font-label text-[10px] border-0"
                                           placeholder="Image URL"
                                         />
                                      </div>
                                   ))}
                                 </div>
                               </div>
                             ) : (
                               <div className="space-y-6">
                                  <label className="font-label text-[9px] tracking-widest uppercase text-outline opacity-50 block">Media Orchestration</label>
                                
                                <div className="flex gap-4 mb-4">
                                   {['image', 'video', 'youtube'].map((m) => (
                                     <button
                                       key={m}
                                       onClick={() => updateModuleContent(module.id, 'media_type', m)}
                                       className={clsx(
                                         "px-4 py-2 font-label text-[9px] tracking-widest uppercase border",
                                         module.media_type === m ? "bg-secondary text-white border-secondary" : "border-outline-variant/30 text-outline"
                                       )}
                                     >
                                       {m}
                                     </button>
                                   ))}
                                </div>

                                {module.media_type === 'youtube' ? (
                                   <div className="space-y-4">
                                      <div className="space-y-2">
                                         <label className="font-label text-[8px] tracking-widest uppercase text-outline">Desktop YouTube ID</label>
                                         <input 
                                           type="text" 
                                           placeholder="e.g. dQw4w9WgXcQ"
                                           className="w-full bg-[#f6f3ee] dark:bg-[#1c1b1b] border-outline-variant/20 p-4 font-label text-[10px]"
                                           value={module.youtube_id || ''}
                                           onChange={(e) => updateModuleContent(module.id, 'youtube_id', e.target.value)}
                                         />
                                      </div>
                                      <div className="space-y-2">
                                         <label className="font-label text-[8px] tracking-widest uppercase text-outline">Mobile YouTube ID (Vertical Optional)</label>
                                         <input 
                                           type="text" 
                                           placeholder="e.g. dQw4w9WgXcQ"
                                           className="w-full bg-[#f6f3ee] dark:bg-[#1c1b1b] border-outline-variant/20 p-4 font-label text-[10px]"
                                           value={module.youtube_id_mobile || ''}
                                           onChange={(e) => updateModuleContent(module.id, 'youtube_id_mobile', e.target.value)}
                                         />
                                      </div>
                                   </div>
                                ) : (
                                   <div className="space-y-4">
                                      <div className="aspect-video bg-[#f6f3ee] dark:bg-[#1c1b1b] border border-dashed border-outline-variant/30 relative flex items-center justify-center group/media overflow-hidden">
                                         {module.media_url ? (
                                            module.media_type === 'video' ? (
                                               <video src={module.media_url} className="w-full h-full object-cover" muted loop autoPlay />
                                            ) : (
                                               <img src={module.media_url} className="w-full h-full object-cover" alt="Media Preview" />
                                            )
                                         ) : (
                                            <span className="material-symbols-outlined text-4xl text-outline opacity-30">add_photo_alternate</span>
                                         )}
                                         <input 
                                           type="file" 
                                           accept={module.media_type === 'video' ? 'video/*' : 'image/*'}
                                           className="absolute inset-0 opacity-0 cursor-pointer"
                                           onChange={(e) => e.target.files && handleFileUpload(module.id, e.target.files[0])}
                                           disabled={uploading === module.id}
                                         />
                                         {uploading === module.id && (
                                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                               <div className="w-8 h-8 border-t-2 border-white animate-spin rounded-full"></div>
                                            </div>
                                         )}
                                      </div>
                                      <div className="space-y-2">
                                         <label className="font-label text-[8px] tracking-widest uppercase text-outline">Direct URL Fallback</label>
                                         <input 
                                           type="text" 
                                           className="w-full bg-[#f6f3ee] dark:bg-[#1c1b1b] border-outline-variant/20 p-3 font-label text-[9px]" 
                                           value={module.media_url || ''}
                                           onChange={(e) => updateModuleContent(module.id, 'media_url', e.target.value)}
                                         />
                                      </div>
                                   </div>
                                )}
                             </div>
                             )}
                          </div>
                          
                          <div className="absolute top-6 right-6 flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                             <button className="material-symbols-outlined text-outline hover:text-secondary">drag_indicator</button>
                             <button className="material-symbols-outlined text-outline hover:text-red-500">delete</button>
                          </div>
                       </div>
                     ))
                   )}
                </div>
             </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default CMS;
