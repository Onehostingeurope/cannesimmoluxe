import React, { useState } from 'react';
import { clsx } from 'clsx';
import { Button } from '../../ui/Button';

interface MediaFile {
  id: string;
  url: string;
  alt: string;
  isCover: boolean;
  type: 'image' | 'video' | 'brochure' | 'dpe';
}

interface MediaUploaderProps {
  files: MediaFile[];
  onChange: (files: MediaFile[]) => void;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const MediaUploader = ({ files, onChange, onUpload }: MediaUploaderProps) => {
  const images = files.filter(f => f.type === 'image');
  const [dragOver, setDragOver] = useState(false);

  const removeFile = (id: string) => {
    onChange(files.filter(f => f.id !== id));
  };

  const setCover = (id: string) => {
    onChange(files.map(f => ({
      ...f,
      isCover: f.id === id && f.type === 'image'
    })));
  };

  const updateAlt = (id: string, alt: string) => {
    onChange(files.map(f => f.id === id ? { ...f, alt } : f));
  };

  return (
    <div className="space-y-8">
      {/* Upload Zone */}
      <div 
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); /* Handle drop */ }}
        className={clsx(
          "border-2 border-dashed p-12 transition-all duration-300 flex flex-col items-center justify-center space-y-4 cursor-pointer group",
          dragOver ? "border-secondary bg-secondary/5" : "border-outline-variant/20 hover:border-secondary/50"
        )}
      >
        <div className="w-16 h-16 bg-[#f6f3ee] dark:bg-[#1c1b1b] flex items-center justify-center border border-outline-variant/10 text-outline group-hover:text-secondary transition-colors">
          <span className="material-symbols-outlined notranslate text-3xl" translate="no">add_photo_alternate</span>
        </div>
        <div className="text-center">
          <p className="font-label text-[10px] tracking-widest uppercase text-primary font-bold">Drop Architectural Assets</p>
          <p className="text-[10px] text-outline opacity-60 uppercase tracking-widest mt-1">High-Resolution JPEG/PNG (Max 10MB)</p>
        </div>
        <input 
          type="file" 
          multiple 
          accept="image/*" 
          className="absolute inset-0 opacity-0 cursor-pointer" 
          onChange={onUpload}
        />
        <Button variant="outline" className="mt-4 px-10 pointer-events-none">Select Files</Button>
      </div>

      {/* Gallery Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((file, idx) => (
            <div key={file.id} className="group relative bg-white dark:bg-[#1c1b1b] border border-outline-variant/10 overflow-hidden animate-luxury-fade">
               <div className="aspect-[4/3] relative overflow-hidden">
                  <img src={file.url} alt={file.alt} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                     <button 
                        type="button"
                        onClick={() => setCover(file.id)}
                        className={clsx(
                          "w-10 h-10 flex items-center justify-center transition-colors border",
                          file.isCover ? "bg-secondary border-secondary text-white" : "bg-white/10 border-white/20 text-white hover:bg-white hover:text-black"
                        )}
                        title="Set as Cover"
                     >
                        <span className="material-symbols-outlined notranslate text-sm" translate="no">grade</span>
                     </button>
                     <button 
                        type="button"
                        onClick={() => removeFile(file.id)}
                        className="w-10 h-10 bg-red-500/80 border border-transparent text-white flex items-center justify-center hover:bg-red-600 transition-colors"
                        title="Remove"
                     >
                        <span className="material-symbols-outlined notranslate text-sm" translate="no">delete</span>
                     </button>
                  </div>
                  {file.isCover && (
                    <div className="absolute top-4 left-4 bg-secondary text-white text-[8px] font-bold tracking-widest uppercase px-3 py-1 shadow-lg">
                      Principal Asset
                    </div>
                  )}
                  <div className="absolute top-4 right-4 bg-black/50 text-white text-[8px] font-bold tracking-widest uppercase px-2 py-1">
                    {idx + 1}
                  </div>
               </div>
               <div className="p-4 space-y-3">
                  <div className="space-y-1">
                     <label className="text-[8px] uppercase tracking-widest text-outline opacity-60">SEO Alt Text</label>
                     <input 
                        type="text" 
                        value={file.alt}
                        onChange={(e) => updateAlt(file.id, e.target.value)}
                        placeholder="Describe the interior..."
                        className="w-full bg-[#f6f3ee] dark:bg-[#121212] border-0 border-b border-outline-variant/20 p-2 text-[10px] focus:ring-0 focus:border-secondary transition-colors"
                     />
                  </div>
               </div>
            </div>
          ))}
        </div>
      )}

      {/* Other Media (Brochures, DPE) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8 border-t border-outline-variant/10">
         <div className="space-y-4">
            <h4 className="font-label text-[10px] tracking-widest uppercase text-primary">Technical Dossier (PDF)</h4>
            <div className="bg-[#f6f3ee] dark:bg-[#1c1b1b] border border-outline-variant/10 p-6 flex items-center justify-between group hover:border-secondary transition-colors cursor-pointer relative">
               <div className="flex items-center gap-4">
                  <span className="material-symbols-outlined notranslate text-secondary" translate="no">description</span>
                  <div>
                     <p className="text-[10px] font-bold text-primary uppercase tracking-widest">Brochure Portfolio</p>
                     <p className="text-[8px] text-outline opacity-60 uppercase tracking-widest">PDF, MAX 20MB</p>
                  </div>
               </div>
               <input type="file" accept=".pdf" className="absolute inset-0 opacity-0 cursor-pointer" />
               <span className="material-symbols-outlined notranslate text-outline opacity-40 group-hover:translate-x-1 transition-transform" translate="no">chevron_right</span>
            </div>
         </div>
         <div className="space-y-4">
            <h4 className="font-label text-[10px] tracking-widest uppercase text-primary">DPE / Energy Diagnostic</h4>
            <div className="bg-[#f6f3ee] dark:bg-[#1c1b1b] border border-outline-variant/10 p-6 flex items-center justify-between group hover:border-secondary transition-colors cursor-pointer relative">
               <div className="flex items-center gap-4">
                  <span className="material-symbols-outlined notranslate text-secondary" translate="no">energy_savings_leaf</span>
                  <div>
                     <p className="text-[10px] font-bold text-primary uppercase tracking-widest">Diagnostic Technical</p>
                     <p className="text-[8px] text-outline opacity-60 uppercase tracking-widest">PDF, MAX 10MB</p>
                  </div>
               </div>
               <input type="file" accept=".pdf" className="absolute inset-0 opacity-0 cursor-pointer" />
               <span className="material-symbols-outlined notranslate text-outline opacity-40 group-hover:translate-x-1 transition-transform" translate="no">chevron_right</span>
            </div>
         </div>
      </div>
    </div>
  );
};
