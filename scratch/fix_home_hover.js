import fs from 'fs';

const file = 'src/pages/Home.tsx';
let content = fs.readFileSync(file, 'utf8');

const target = `<div 
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

// Note: In the actual file it might have my previous cookie patch or i18n
// Let's find the current block carefully.
// I'll use a more flexible search.

const replacement = `<div 
               className="aspect-[3/4] overflow-hidden bg-black border-[20px] border-[#f6f3ee] dark:border-[#1c1b1b] shadow-2xl relative group cursor-pointer"
             >
                <img 
                  src={textData?.media_url || "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1000"} 
                  className="absolute inset-0 w-full h-full object-cover grayscale transition-all duration-700 group-hover:opacity-0 group-hover:scale-105 z-10"
                />
                
                {(textData?.en_video_url || textData?.fr_video_url) && (
                   <video 
                     src={currentLang === 'fr' ? (textData?.fr_video_url || textData?.en_video_url) : (textData?.en_video_url || textData?.fr_video_url)} 
                     className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-0" 
                     autoPlay
                     muted 
                     loop 
                     playsInline 
                   />
                )}
             </div>`;

// I'll use substring search to find the container
const startMarker = '<div \n               className="aspect-[3/4] overflow-hidden bg-black border-[20px]';
const endMarker = '</div>';

const startIndex = content.indexOf(startMarker);
if (startIndex !== -1) {
    const nextClosingDiv = content.indexOf('</div>', startIndex + 400); // look for the end of the block
    // This is risky. Let's just use the known structure from the viewed file.
} else {
    console.log("Could not find block");
}

// Fallback: overwrite the file with the correct content by replacing the suspected lines
// I will use replace_file_content for precision.
