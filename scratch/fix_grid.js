import fs from 'fs';
const file = 'src/pages/admin/CMS.tsx';
let content = fs.readFileSync(file, 'utf8');

const target = '<div key={idx} className="flex gap-4 items-center border border-outline-variant/10 p-2 dark:bg-[#111]">';

const replacement = `<div key={idx} className="flex gap-4 items-center border border-outline-variant/10 p-2 dark:bg-[#111]">
                                          <div className="w-12 h-10 shrink-0 overflow-hidden bg-[#f6f3ee] dark:bg-[#1c1b1b] flex items-center justify-center border border-outline-variant/10">
                                             {item.img && !item.img.startsWith('data:image') && !item.img.startsWith('http') ? (
                                                <span className="material-symbols-outlined text-outline/30 text-[14px] notranslate" translate="no">image</span>
                                             ) : item.img ? (
                                                <img src={item.img.startsWith('http') || item.img.startsWith('data:image') ? item.img : \`https://\${item.img}\`} alt={item.name} className="w-full h-full object-cover" />
                                             ) : (
                                                <span className="material-symbols-outlined text-outline/30 text-[14px] notranslate" translate="no">image</span>
                                             )}
                                          </div>`;

content = content.replace(target, replacement);

fs.writeFileSync(file, content);
console.log('Fixed Grid mapping successfully');
