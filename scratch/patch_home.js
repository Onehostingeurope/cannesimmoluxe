import fs from 'fs';

const file = 'src/pages/Home.tsx';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes("import { useTranslation }")) {
  content = content.replace(
    "import { useNavigate } from 'react-router-dom';",
    "import { useNavigate } from 'react-router-dom';\nimport { useTranslation } from 'react-i18next';"
  );
}

if (!content.includes("const { i18n } = useTranslation()")) {
  content = content.replace(
    "const navigate = useNavigate();",
    "const navigate = useNavigate();\n  const { i18n } = useTranslation();"
  );
}

const target = `<div className="aspect-[3/4] overflow-hidden bg-black border-[20px] border-[#f6f3ee] dark:border-[#1c1b1b] shadow-2xl">
                <img 
                  src={textData?.media_url || "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1000"} 
                  className="w-full h-full object-cover grayscale transition-all duration-[5s] hover:grayscale-0"
                />
             </div>`;

const replacement = `<div 
               className="aspect-[3/4] overflow-hidden bg-black border-[20px] border-[#f6f3ee] dark:border-[#1c1b1b] shadow-2xl relative group cursor-pointer"
               onMouseEnter={(e) => { const v = e.currentTarget.querySelector('video'); if (v) v.play(); }}
               onMouseLeave={(e) => { const v = e.currentTarget.querySelector('video'); if (v) v.pause(); }}
             >
                <img 
                  src={textData?.media_url || "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1000"} 
                  className="absolute inset-0 w-full h-full object-cover grayscale transition-all duration-700 group-hover:opacity-0 group-hover:scale-105 z-10"
                />
                
                {(textData?.en_video_url || textData?.fr_video_url) && (
                   <video 
                     src={i18n.language === 'fr' ? (textData?.fr_video_url || textData?.en_video_url) : (textData?.en_video_url || textData?.fr_video_url)} 
                     className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-0" 
                     preload="auto" 
                     muted 
                     loop 
                     playsInline 
                   />
                )}
             </div>`;

content = content.replace(target, replacement);

fs.writeFileSync(file, content);
console.log("Successfully patched Home parameter logic!");
