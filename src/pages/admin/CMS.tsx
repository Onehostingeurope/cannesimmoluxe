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
  en_video_url?: string;
  fr_video_url?: string;
  en_youtube_id?: string;
  fr_youtube_id?: string;
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
  
  const pages = ['Homepage', 'Buy', 'Rent', 'Management', 'About Us', 'Contact', 'Services'];
  
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
    try {
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Network Timeout: The data matrix is too heavy to stream (Likely massive Base64 images). Please use the new Storage Pipeline instead.')), 15000)
      );

      const { error } = await Promise.race([
        supabase
          .from('cms_content')
          .upsert({ 
            page_name: activePage, 
            modules: modules,
            updated_at: new Date().toISOString()
          }, { onConflict: 'page_name' }),
        timeoutPromise
      ]) as any;

      if (error) {
        throw error;
      }
      alert('Content successfully deployed to global cluster.');
    } catch (e: any) {
      alert('Error deploying changes: ' + (e.message || 'Payload too large or network timeout.'));
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const updateModuleContent = (id: string, field: string, value: any) => {
    setModules(prev => prev.map(m => m.id === id ? { ...m, [field]: value } : m));
  };

  const handleFileUpload = async (moduleId: string, file: File, targetField: string = 'media_url') => {
    if (!file) return;
    try {
      setUploading(`${moduleId}-${targetField}`);
      const isVideo = file.type.startsWith('video/');
      const folder = isVideo ? 'videos' : 'images';
      
      if (isVideo && file.size > 200 * 1024 * 1024) {
         alert("Video exceeds 200MB limit. Please compress your asset for better web performance.");
         setUploading(null);
         return;
      }

      if (!isVideo && file.size > 20 * 1024 * 1024) {
         alert("Image exceeds 20MB High-Definition limit. Please compress out of bounds vectors.");
         setUploading(null);
         return;
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `${folder}/${fileName}`;

      const bucketNames = ['Media', 'media'];
      let uploadError = null;
      let usedBucket = 'Media';

      for (const bucket of bucketNames) {
        const { error } = await supabase.storage
          .from(bucket)
          .upload(filePath, file, { cacheControl: '3600', upsert: false });
        
        if (!error) {
          uploadError = null;
          usedBucket = bucket;
          break;
        }
        uploadError = error;
      }

      if (uploadError) {
         const msg = uploadError.message.toLowerCase();
         if (msg.includes('bucket not found') || msg.includes('row-level security') || msg.includes('violates') || msg.includes('policy')) {
            alert("UPLOAD FAILURE: Your bucket exists but its SECURITIES (Policies) are missing.\n\nREQUIRED FIX:\n1. Log into Supabase Dashboard.\n2. Go to Storage -> Policies.\n3. Click 'New Policy' for the 'Media' bucket.\n4. Choose 'Full access to all users' (or Enable Insert/Select for all).\n5. Click Review -> Save.");
         } else {
            alert(`Storage Error: ${uploadError.message}`);
         }
         setUploading(null);
         return;
      }

      const { data: publicUrlData } = supabase.storage
        .from(usedBucket)
        .getPublicUrl(filePath);

      updateModuleContent(moduleId, targetField, publicUrlData.publicUrl);
      if (targetField === 'media_url') updateModuleContent(moduleId, 'media_type', isVideo ? 'video' : 'image');
      setUploading(null);
    } catch (error: any) {
      alert('Error processing file: ' + error.message);
      setUploading(null);
    }
  };

  const handleGridFileUpload = async (moduleId: string, itemIdx: number, file: File) => {
    if (!file) return;
    try {
      setUploading(`${moduleId}-${itemIdx}`);

      if (file.size > 15 * 1024 * 1024) {
         alert("Image exceeds 15MB limit. Please compress out of bounds files.");
         setUploading(null);
         return;
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `images/grids/${fileName}`;

      const bucketNames = ['Media', 'media'];
      let uploadError = null;
      let usedBucket = 'Media';

      for (const bucket of bucketNames) {
        const { error } = await supabase.storage
          .from(bucket)
          .upload(filePath, file, { cacheControl: '3600', upsert: false });
        
        if (!error) {
          uploadError = null;
          usedBucket = bucket;
          break;
        }
        uploadError = error;
      }

      if (uploadError) {
         alert(`UPLOAD FAILURE: Your bucket exists but its SECURITIES (Policies) are missing.\n\nREQUIRED FIX:\n1. Log into Supabase Dashboard.\n2. Go to Storage -> Policies.\n3. Click 'New Policy' for the 'Media' bucket.\n4. Choose 'Full access to all users'.\n5. Save.`);
         setUploading(null);
         return;
      }

      const { data: publicUrlData } = supabase.storage
        .from(usedBucket)
        .getPublicUrl(filePath);
      
      setModules(prev => prev.map(m => {
        if (m.id === moduleId && m.grid_items) {
           const newItems = [...m.grid_items];
           newItems[itemIdx] = { ...newItems[itemIdx], img: publicUrlData.publicUrl };
           return { ...m, grid_items: newItems };
        }
        return m;
      }));
      setUploading(null);
    } catch (error: any) {
      alert('Error processing file: ' + error.message);
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
              <span className="material-symbols-outlined notranslate text-secondary text-base" translate="no">auto_stories</span>
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
              <span className="material-symbols-outlined notranslate text-sm" translate="no">{saving ? 'sync' : 'cloud_done'}</span>
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
                             <span className="material-symbols-outlined notranslate" translate="no">
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
                                          <div className="w-12 h-10 shrink-0 overflow-hidden bg-[#f6f3ee] dark:bg-[#1c1b1b] flex items-center justify-center border border-outline-variant/10">
                                             {item.img && !item.img.startsWith('data:image') && !item.img.startsWith('http') ? (
                                                <span className="material-symbols-outlined text-outline/30 text-[14px] notranslate" translate="no">image</span>
                                             ) : item.img ? (
                                                <img src={item.img.startsWith('http') || item.img.startsWith('data:image') ? item.img : `https://${item.img}`} alt={item.name} className="w-full h-full object-cover" />
                                             ) : (
                                                <span className="material-symbols-outlined text-outline/30 text-[14px] notranslate" translate="no">image</span>
                                             )}
                                          </div>
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
                                         <div className="relative w-2/3">
                                            <input 
                                              value={item.img}
                                              onChange={(e) => {
                                                  const newModules = [...modules];
                                                  const mIdx = newModules.findIndex(m => m.id === module.id);
                                                  if (newModules[mIdx].grid_items) newModules[mIdx].grid_items[idx].img = e.target.value;
                                                  setModules(newModules);
                                              }}
                                              className="w-full bg-[#f6f3ee] dark:bg-[#1c1b1b] py-3 px-3 pr-10 font-label text-[10px] border-0 outline-none"
                                              placeholder="Image URL"
                                            />
                                            <div className="absolute right-2 top-1/2 -translate-y-1/2 overflow-hidden w-6 h-6 flex items-center justify-center text-outline hover:text-primary cursor-pointer transition-colors bg-[#f6f3ee] dark:bg-[#1c1b1b]">
                                               {uploading === `${module.id}-${idx}` ? (
                                                  <div className="w-3 h-3 border-t-2 border-primary animate-spin rounded-full"></div>
                                               ) : (
                                                  <span className="material-symbols-outlined notranslate text-[14px]" translate="no">upload</span>
                                               )}
                                               <input 
                                                 type="file" 
                                                 accept="image/*"
                                                 className="absolute inset-0 opacity-0 cursor-pointer"
                                                 onChange={(e) => e.target.files && handleGridFileUpload(module.id, idx, e.target.files[0])}
                                                 disabled={uploading === `${module.id}-${idx}`}
                                               />
                                            </div>
                                         </div>
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
                                            <span className="material-symbols-outlined notranslate text-4xl text-outline opacity-30" translate="no">add_photo_alternate</span>
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

                                 <div className="space-y-4 pt-8 border-t border-outline-variant/10">
                                    <label className="font-label text-[9px] tracking-widest uppercase text-outline opacity-50 block">Interactive Hover Videos (Multi-lingual Backgrounds)</label>
                                    <div className="grid grid-cols-2 gap-4">
                                      <div className="border border-dashed border-outline-variant/30 py-6 text-center relative group bg-[#f6f3ee] dark:bg-[#1c1b1b] hover:border-primary transition-colors">
                                         <span className="material-symbols-outlined notranslate text-outline mb-2 block" translate="no">{module.en_video_url ? 'check_circle' : 'videocam'}</span>
                                         <p className="font-label text-[8px] uppercase text-outline">{module.en_video_url ? 'EN Bound' : 'Upload EN MP4'}</p>
                                         <input type="file" accept="video/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => e.target.files && handleFileUpload(module.id, e.target.files[0], 'en_video_url')} />
                                         {uploading === `${module.id}-en_video_url` && <div className="absolute inset-0 bg-black/50 flex items-center justify-center"><div className="animate-spin w-4 h-4 border-t-2 border-primary rounded-full"></div></div>}
                                      </div>
                                      <div className="border border-dashed border-outline-variant/30 py-6 text-center relative group bg-[#f6f3ee] dark:bg-[#1c1b1b] hover:border-primary transition-colors">
                                         <span className="material-symbols-outlined notranslate text-outline mb-2 block" translate="no">{module.fr_video_url ? 'check_circle' : 'videocam'}</span>
                                         <p className="font-label text-[8px] uppercase text-outline">{module.fr_video_url ? 'FR Bound' : 'Upload FR MP4'}</p>
                                         <input type="file" accept="video/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => e.target.files && handleFileUpload(module.id, e.target.files[0], 'fr_video_url')} />
                                         {uploading === `${module.id}-fr_video_url` && <div className="absolute inset-0 bg-black/50 flex items-center justify-center"><div className="animate-spin w-4 h-4 border-t-2 border-primary rounded-full"></div></div>}
                                      </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 mt-4">
                                       <div className="space-y-1">
                                          <label className="font-label text-[7px] tracking-widest uppercase text-outline opacity-70">EN YouTube ID (Fallback)</label>
                                          <input 
                                            type="text" 
                                            placeholder="e.g. dQw4w9WgXcQ"
                                            className="w-full bg-[#f6f3ee] dark:bg-[#1c1b1b] border-outline-variant/20 p-2 font-label text-[8px]" 
                                            value={module.en_youtube_id || ''}
                                            onChange={(e) => updateModuleContent(module.id, 'en_youtube_id', e.target.value)}
                                          />
                                       </div>
                                       <div className="space-y-1">
                                          <label className="font-label text-[7px] tracking-widest uppercase text-outline opacity-70">FR YouTube ID (Fallback)</label>
                                          <input 
                                            type="text" 
                                            placeholder="e.g. dQw4w9WgXcQ"
                                            className="w-full bg-[#f6f3ee] dark:bg-[#1c1b1b] border-outline-variant/20 p-2 font-label text-[8px]" 
                                            value={module.fr_youtube_id || ''}
                                            onChange={(e) => updateModuleContent(module.id, 'fr_youtube_id', e.target.value)}
                                          />
                                       </div>
                                    </div>
                                 </div>

                             </div>
                             )}
                          </div>
                          
                          <div className="absolute top-6 right-6 flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                             <button className="material-symbols-outlined notranslate text-outline hover:text-secondary">drag_indicator</button>
                             <button className="material-symbols-outlined notranslate text-outline hover:text-red-500">delete</button>
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
