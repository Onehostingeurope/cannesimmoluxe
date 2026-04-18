import React, { useState, useEffect } from 'react';
import { clsx } from 'clsx';
import { Globe } from 'lucide-react';

const languages = [
  { code: 'en', flag: '🇬🇧', label: 'English' },
  { code: 'fr', flag: '🇫🇷', label: 'Français' },
  { code: 'es', flag: '🇪🇸', label: 'Español' },
  { code: 'ru', flag: '🇷🇺', label: 'Русский' },
  { code: 'de', flag: '🇩🇪', label: 'Deutsch' },
  { code: 'it', flag: '🇮🇹', label: 'Italiano' },
];

export const LanguageSwitcher = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState('en');

  useEffect(() => {
    // Identify the active Google Translate cookie safely
    const identifyLang = () => {
       const cookieStr = document.cookie;
       const match = cookieStr.match(/googtrans=\/[a-zA-Z]{2}\/([a-zA-Z]{2})/);
       if (match && match[1]) {
          setCurrentLang(match[1]);
       } else {
          setCurrentLang('en'); // Defaults back to english if no translation overlay matches
       }
    };
    identifyLang();
  }, []);

  const changeLanguage = (code: string) => {
    // Completely nuke old translate cookies to prevent API confusion
    document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=' + window.location.hostname;
    document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.' + window.location.hostname;

    if (code !== 'en') {
       // Assign the new translation path explicitly targeting English -> Selected Locale
       document.cookie = `googtrans=/en/${code}; path=/;`;
       document.cookie = `googtrans=/en/${code}; path=/; domain=.` + window.location.hostname;
    }
    
    // Reboot the DOM to apply the translation pass globally
    window.location.reload();
  };

  const currentFlag = languages.find(l => l.code === currentLang)?.flag || '🇬🇧';

  return (
    <div className="relative z-[110]" onMouseLeave={() => setIsOpen(false)}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 focus:outline-none transition-all duration-300 hover:opacity-70 mt-[2px]"
      >
        <Globe size={14} className="text-luxury-charcoal dark:text-white lg:text-inherit" />
        <span className="text-xl drop-shadow-md">{currentFlag}</span>
      </button>

      {isOpen && (
        <div className="absolute top-full lg:-right-4 right-0 mt-4 py-3 w-40 bg-white dark:bg-[#0a0a0a] shadow-2xl border border-outline-variant/10 flex flex-col items-start font-label text-[10px] uppercase tracking-widest animate-luxury-fade rounded-none">
          {languages.map((lang) => (
             <button
                key={lang.code}
                onClick={() => changeLanguage(lang.code)}
                className={clsx(
                   "w-full text-left px-5 py-3 hover:bg-[#f6f3ee] dark:hover:bg-[#1c1b1b] transition-colors flex items-center gap-4 border-l-2 border-transparent",
                   currentLang === lang.code ? "border-luxury-gold text-luxury-gold font-bold bg-[#f6f3ee]/50 dark:bg-[#1c1b1b]/50" : "text-luxury-charcoal dark:text-outline hover:border-luxury-gold/50"
                )}
             >
                <span className="text-lg opacity-90">{lang.flag}</span>
                <span className="mt-[2px]">{lang.label}</span>
             </button>
          ))}
        </div>
      )}
    </div>
  );
};
