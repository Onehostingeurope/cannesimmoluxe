import React from 'react';
import { clsx } from 'clsx';
import { Button } from '../../ui/Button';

interface PublishSidebarProps {
  score: number;
  status: string;
  onStatusChange: (status: string) => void;
  onSave: (mode: 'draft' | 'publish') => void;
  onPreview: () => void;
  isValid: boolean;
  errors: any;
}

export const PublishSidebar = ({ score, status, onStatusChange, onSave, onPreview, isValid, errors }: PublishSidebarProps) => {
  const checklist = [
    { label: 'Essential Identity', met: score > 20 },
    { label: 'High-Res Media', met: score > 40 },
    { label: 'Technical Dossier', met: score > 60 },
    { label: 'SEO Calibration', met: score > 80 },
    { label: 'Legal Gating', met: score === 100 },
  ];

  return (
    <div className="space-y-8 lg:sticky lg:top-8 animate-luxury-fade">
      {/* Visibility & Status Card */}
      <div className="bg-white dark:bg-[#121212] border border-outline-variant/10 p-8 space-y-6">
        <div className="flex items-center gap-3 border-b border-outline-variant/10 pb-4">
          <span className="material-symbols-outlined notranslate text-secondary text-base" translate="no">published_with_changes</span>
          <p className="font-label text-[10px] tracking-widest uppercase text-primary font-bold">Visibility Matrix</p>
        </div>

        <div className="space-y-4">
           <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-widest text-outline">Current Status</span>
              <span className={clsx(
                "px-3 py-1 text-[8px] font-bold uppercase tracking-widest",
                status === 'available' ? "bg-green-500/10 text-green-600" : "bg-secondary/10 text-secondary"
              )}>
                {status}
              </span>
           </div>
           
           <div className="space-y-2">
              <label className="text-[9px] uppercase tracking-widest text-outline opacity-60">Transition To</label>
              <select 
                value={status}
                onChange={(e) => onStatusChange(e.target.value)}
                className="w-full bg-[#f6f3ee] dark:bg-[#1c1b1b] border-outline-variant/20 p-3 text-[10px] uppercase tracking-widest focus:ring-0 focus:border-secondary transition-colors"
              >
                 <option value="available">Live (Available)</option>
                 <option value="highlight">Exclusive Selection</option>
                 <option value="off-market">Confidential (Off-Market)</option>
                 <option value="reserved">Reserved / Pending</option>
                 <option value="sold">Archived (Sold)</option>
              </select>
           </div>
        </div>

        <div className="pt-4 space-y-3">
           <Button variant="primary" className="w-full py-4 text-[10px] tracking-[0.2em]" onClick={() => onSave('publish')}>
              Publish Asset
           </Button>
           <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="text-[9px] py-3" onClick={() => onSave('draft')}>Save Draft</Button>
              <Button variant="outline" className="text-[9px] py-3" onClick={onPreview}>Preview</Button>
           </div>
        </div>
      </div>

      {/* Completion Score */}
      <div className="bg-primary text-white p-8 space-y-6">
         <div className="space-y-2">
            <p className="font-label text-[9px] tracking-[0.3em] uppercase text-secondary font-bold">Dossier Integrity</p>
            <div className="flex items-baseline gap-2">
               <span className="font-serif text-5xl italic">{score}</span>
               <span className="text-secondary text-sm font-bold uppercase">/ 100</span>
            </div>
         </div>
         
         <div className="w-full h-[2px] bg-white/10 relative">
            <div 
              className="absolute top-0 left-0 h-full bg-secondary transition-all duration-1000 ease-out" 
              style={{ width: `${score}%` }}
            />
         </div>

         <ul className="space-y-4 pt-2">
            {checklist.map((item, idx) => (
              <li key={idx} className="flex items-center justify-between">
                 <span className={clsx("text-[10px] uppercase tracking-widest", item.met ? "text-white" : "text-white/30")}>
                    {item.label}
                 </span>
                 <span className={clsx(
                    "material-symbols-outlined notranslate text-sm",
                    item.met ? "text-secondary" : "text-white/10"
                 )} translate="no">
                    {item.met ? 'check_circle' : 'radio_button_unchecked'}
                 </span>
              </li>
            ))}
         </ul>
      </div>

      {/* Validation Panel */}
      {!isValid && Object.keys(errors).length > 0 && (
        <div className="bg-red-500/5 border border-red-500/20 p-8 space-y-4">
           <div className="flex items-center gap-3 text-red-600">
              <span className="material-symbols-outlined notranslate text-lg" translate="no">error_outline</span>
              <p className="font-label text-[10px] tracking-widest uppercase font-bold">Correction Required</p>
           </div>
           <ul className="space-y-2">
              {Object.entries(errors).map(([key, value]: [string, any]) => (
                <li key={key} className="text-[9px] uppercase tracking-widest text-red-600/80 leading-relaxed">
                  • {value.message || `${key} is invalid`}
                </li>
              ))}
           </ul>
        </div>
      )}
    </div>
  );
};
