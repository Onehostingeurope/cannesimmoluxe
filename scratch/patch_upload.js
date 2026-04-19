import fs from 'fs';

const file = 'src/pages/admin/CMS.tsx';
let content = fs.readFileSync(file, 'utf8');

// Patch 1: Update handleFileUpload definition and uploading state logic
content = content.replace(
  "const handleFileUpload = async (moduleId: string, file: File) => {",
  "const handleFileUpload = async (moduleId: string, file: File, targetField: string = 'media_url') => {"
);

content = content.replace(
  "setUploading(moduleId);",
  "setUploading(`${moduleId}-${targetField}`);"
);

content = content.replace(
  "updateModuleContent(moduleId, 'media_url', publicUrlData.publicUrl);",
  "updateModuleContent(moduleId, targetField, publicUrlData.publicUrl);"
);

content = content.replace(
  "updateModuleContent(moduleId, 'media_type', isVideo ? 'video' : 'image');",
  "if (targetField === 'media_url') updateModuleContent(moduleId, 'media_type', isVideo ? 'video' : 'image');"
);

// Patch 2: Inject the Multi-lingual Box at the bottom of the non-grid media module
const uiTarget = `                                       </div>
                                    </div>
                                 )}
                               </div>
                             )}
                           </div>
                        </div>
                      ))`;

const uiReplacement = `                                       </div>
                                    </div>
                                 )}

                                 <div className="space-y-4 pt-8 border-t border-outline-variant/10">
                                    <label className="font-label text-[9px] tracking-widest uppercase text-outline opacity-50 block">Interactive Hover Videos (Multi-lingual Backgrounds)</label>
                                    <div className="grid grid-cols-2 gap-4">
                                      <div className="border border-dashed border-outline-variant/30 py-6 text-center relative group bg-[#f6f3ee] dark:bg-[#1c1b1b] hover:border-primary transition-colors">
                                         <span className="material-symbols-outlined notranslate text-outline mb-2 block" translate="no">{module.en_video_url ? 'check_circle' : 'videocam'}</span>
                                         <p className="font-label text-[8px] uppercase text-outline">{module.en_video_url ? 'EN Bound' : 'Upload EN MP4'}</p>
                                         <input type="file" accept="video/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => e.target.files && handleFileUpload(module.id, e.target.files[0], 'en_video_url')} />
                                         {uploading === \`\${module.id}-en_video_url\` && <div className="absolute inset-0 bg-black/50 flex items-center justify-center"><div className="animate-spin w-4 h-4 border-t-2 border-white rounded-full"></div></div>}
                                      </div>
                                      <div className="border border-dashed border-outline-variant/30 py-6 text-center relative group bg-[#f6f3ee] dark:bg-[#1c1b1b] hover:border-primary transition-colors">
                                         <span className="material-symbols-outlined notranslate text-outline mb-2 block" translate="no">{module.fr_video_url ? 'check_circle' : 'videocam'}</span>
                                         <p className="font-label text-[8px] uppercase text-outline">{module.fr_video_url ? 'FR Bound' : 'Upload FR MP4'}</p>
                                         <input type="file" accept="video/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => e.target.files && handleFileUpload(module.id, e.target.files[0], 'fr_video_url')} />
                                         {uploading === \`\${module.id}-fr_video_url\` && <div className="absolute inset-0 bg-black/50 flex items-center justify-center"><div className="animate-spin w-4 h-4 border-t-2 border-white rounded-full"></div></div>}
                                      </div>
                                    </div>
                                 </div>

                               </div>
                             )}
                           </div>
                        </div>
                      ))`;

content = content.replace(uiTarget, uiReplacement);

fs.writeFileSync(file, content);
console.log("Successfully patched Multi-Lingual Hover CMS parameters!");
