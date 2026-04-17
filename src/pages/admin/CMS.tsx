import { useState } from 'react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { Button } from '../../components/ui/Button';
import { clsx } from 'clsx';

const CMS = () => {
  const [activePage, setActivePage] = useState('Homepage');
  
  const pages = ['Homepage', 'Buy', 'Rent', 'About Us', 'Contact', 'Services'];
  
  const modules = [
    { type: 'hero', label: 'Cinematic Hero', icon: 'movie' },
    { type: 'grid', label: 'Asymmetric Grid', icon: 'grid_view' },
    { type: 'text', label: 'Editorial Narrative', icon: 'subject' },
    { type: 'media', label: 'Full Span Asset', icon: 'image' },
    { type: 'contact', label: 'Concierge Form', icon: 'hub' },
  ];

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
            <Button variant="primary" className="flex-1 md:flex-none flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-sm">cloud_done</span>
              Deploy Changes
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Module Selector Sidebar */}
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

            <div className="space-y-6">
               <h3 className="font-headline text-xl text-primary pb-2 border-b border-outline-variant/20">Component Library</h3>
               <div className="grid grid-cols-1 gap-3">
                  {modules.map((module) => (
                    <div 
                      key={module.type}
                      className="p-4 bg-[#f6f3ee] dark:bg-[#1c1b1b] border border-outline-variant/10 flex items-center gap-4 group cursor-grab active:cursor-grabbing hover:border-secondary transition-all"
                    >
                      <span className="material-symbols-outlined text-xl text-secondary group-hover:scale-110 transition-transform">
                        {module.icon}
                      </span>
                      <span className="font-label text-[9px] tracking-[0.1em] uppercase text-primary font-bold">
                        {module.label}
                      </span>
                      <span className="material-symbols-outlined ml-auto text-sm text-outline group-hover:text-primary">drag_handle</span>
                    </div>
                  ))}
               </div>
            </div>
          </div>

          {/* Builder Canvas */}
          <div className="lg:col-span-9 space-y-8">
             <div className="bg-[#f6f3ee] dark:bg-[#1c1b1b] p-1 border border-outline-variant/10 min-h-[600px] relative">
                {/* Canvas Header */}
                <div className="bg-white dark:bg-black p-4 border-b border-outline-variant/10 flex justify-between items-center mb-1">
                   <div className="flex items-center gap-3">
                      <span className="w-2 h-2 rounded-full bg-green-500"></span>
                      <span className="font-label text-[9px] tracking-widest uppercase text-primary font-bold animate-pulse">Editing: {activePage}</span>
                   </div>
                   <div className="flex gap-4">
                      <button className="material-symbols-outlined text-lg text-outline hover:text-primary transition-colors">history</button>
                      <button className="material-symbols-outlined text-lg text-outline hover:text-primary transition-colors">desktop_windows</button>
                      <button className="material-symbols-outlined text-lg text-outline hover:text-primary transition-colors">smartphone</button>
                   </div>
                </div>

                {/* Simulated Module Stack */}
                <div className="p-8 space-y-6">
                   {/* 1. Hero Module */}
                   <div className="bg-white dark:bg-black p-10 border border-outline-variant/20 shadow-sm relative group">
                      <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                         <button className="material-symbols-outlined text-sm text-outline hover:text-primary">settings</button>
                         <button className="material-symbols-outlined text-sm text-outline hover:text-red-500">delete</button>
                      </div>
                      <div className="flex items-center gap-4 mb-8 text-secondary">
                         <span className="material-symbols-outlined">movie</span>
                         <span className="font-label text-[10px] tracking-[0.2em] uppercase font-bold">Cinematic Hero</span>
                      </div>
                      <div className="space-y-6 max-w-2xl">
                         <div className="space-y-2">
                            <label className="font-label text-[9px] tracking-widest uppercase text-outline opacity-50">Narrative Title</label>
                            <input 
                              type="text" 
                              className="w-full bg-transparent border-0 border-b border-outline-variant/30 focus:border-primary focus:ring-0 px-0 pb-2 font-headline text-3xl text-primary transition-all" 
                              defaultValue="The Art of Living"
                            />
                         </div>
                         <div className="space-y-2">
                            <label className="font-label text-[9px] tracking-widest uppercase text-outline opacity-50">Content Body</label>
                            <textarea 
                              className="w-full bg-transparent border-0 border-b border-outline-variant/30 focus:border-primary focus:ring-0 px-0 pb-2 font-body text-sm text-on-surface-variant leading-relaxed resize-none h-20" 
                              defaultValue="Curated residences for the global collector on the French Riviera."
                            />
                         </div>
                      </div>
                   </div>

                   {/* 2. Media List Module */}
                   <div className="bg-white dark:bg-black p-10 border border-outline-variant/20 shadow-sm group">
                      <div className="flex items-center gap-4 mb-8 text-secondary">
                         <span className="material-symbols-outlined">collections</span>
                         <span className="font-label text-[10px] tracking-[0.2em] uppercase font-bold">Asset Gallery</span>
                      </div>
                      <div className="grid grid-cols-4 gap-4">
                         {[1, 2, 3].map(id => (
                            <div key={id} className="aspect-square bg-[#f6f3ee] dark:bg-[#1c1b1b] border border-dashed border-outline-variant/30 flex flex-col items-center justify-center group/item hover:border-secondary transition-all cursor-pointer">
                               <span className="material-symbols-outlined text-2xl text-outline group-hover/item:text-secondary group-hover/item:scale-110 transition-transform">add_photo_alternate</span>
                               <span className="font-label text-[8px] tracking-widest uppercase text-outline mt-3 opacity-50">Upload Asset</span>
                            </div>
                         ))}
                         <div className="aspect-square bg-[#f6f3ee] dark:bg-[#1c1b1b] p-1">
                            <img alt="Preview" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD9E8XzWI5jMLoUgmUMfXDCCGLCXElyRB55A0xrusX9F3Tjxh8dcZ30A9LpOKw1NQ2a8AdjpMD9Ht72XayBK7LSfgi6Lyy8EPuYp1bdxkufJSHftsQNLbrTTyXMZKtKbhxXQ_nwXVx9DBkSL3VcnfmBBOEPISwARX0j4-aOq_1-rnsneheH2GPbvXzjbCdtc4WZ2Nq7fUIrkzsTXIlxvjhZxi_S6LQf-_u0DE6UyK-ZE0E25_8Xfh6dNYRjrGc56ArvR7b70iO048" />
                         </div>
                      </div>
                   </div>
                </div>

                {/* Global Plus Button */}
                <div className="absolute left-1/2 -bottom-6 -translate-x-1/2">
                   <button className="w-12 h-12 bg-black dark:bg-white text-white dark:text-black rounded-full shadow-2xl flex items-center justify-center group hover:scale-110 transition-all active:scale-95 border-4 border-background">
                      <span className="material-symbols-outlined text-2xl group-hover:rotate-90 transition-transform">add</span>
                   </button>
                </div>
             </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default CMS;
