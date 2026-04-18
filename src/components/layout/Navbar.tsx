import React, { useState, useEffect } from 'react';
import { clsx } from 'clsx';
import { Menu, X, Lock } from 'lucide-react';
import { Title } from '../ui/Typography';
import { Button } from '../ui/Button';
import { useLocation, Link } from 'react-router-dom';
import { LanguageSwitcher } from './LanguageSwitcher';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isHome = location.pathname === '/';
  
  // Force contrasting text (charcoal) if we are not on the home page OR if we've scrolled
  const showContrast = !isHome || isScrolled;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Buy', href: '/buy' },
    { label: 'Rent', href: '/rent' },
    { label: 'Management', href: '/management' },
    { label: 'Areas', href: '/areas' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <>
      <nav 
        className={clsx(
          "fixed top-0 left-0 right-0 z-40 transition-all duration-500 px-6 md:px-12",
          isScrolled 
            ? "luxury-glass py-2 shadow-sm" 
            : "bg-white/5 backdrop-blur-md py-3"
        )}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src="/logo.png" alt="CannesImmo Luxe" className="h-[45px] md:h-[75px] w-auto origin-left transition-transform duration-500 hover:scale-[1.05]" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-10">
            {navLinks.map((link) => (
              <Link 
                key={link.label} 
                to={link.href}
                className="font-sans text-[11px] tracking-[0.2em] uppercase text-luxury-charcoal/70 transition-colors duration-500 hover:text-luxury-gold"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Action Component Sector */}
          <div className="hidden lg:flex items-center space-x-6">
            <LanguageSwitcher />
            
            <Link to="/login">
              <Button 
                variant="ghost" 
                className="px-4 py-2 flex items-center gap-2 group transition-colors duration-500 text-luxury-charcoal hover:bg-black/5 dark:text-white"
              >
                <Lock className="w-3 h-3 transition-transform group-hover:-translate-y-0.5" />
                <span className="text-[10px]">Private Access</span>
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Open Toggle */}
          <button 
            className={clsx("lg:hidden p-2 transition-colors duration-500 relative z-50", showContrast ? "text-luxury-charcoal" : "text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]")}
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu size={32} strokeWidth={1.5} />
          </button>
        </div>
      </nav>

      {/* Mobile Menu Fullscreen Overlay */}
      <div 
        className={clsx(
          "fixed inset-0 bg-black/95 backdrop-blur-2xl z-[100] lg:hidden transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col items-center justify-center space-y-10",
          isMobileMenuOpen ? "opacity-100 pointer-events-auto translate-y-0" : "opacity-0 pointer-events-none -translate-y-8"
        )}
      >
        <button 
          className="absolute top-8 right-8 text-white hover:text-secondary transition-colors p-2 z-[110]"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <X size={36} strokeWidth={1.5} />
        </button>

        {navLinks.map((link) => (
          <Link 
            key={link.label} 
            to={link.href}
            onClick={() => setIsMobileMenuOpen(false)}
            className="font-headline text-4xl text-white hover:text-secondary hover:italic transition-all duration-300 transform hover:scale-110"
          >
            {link.label}
          </Link>
        ))}
        
        <div className="pt-12 flex flex-col items-center gap-8">
          <div className="flex bg-white/10 px-6 py-2 rounded-full relative z-[150]">
            <LanguageSwitcher direction="up" align="center" />
          </div>
          
          <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
            <Button variant="secondary" className="flex items-center gap-3 px-8 h-12 bg-white text-black hover:bg-secondary hover:text-white rounded-none shadow-[0_0_20px_rgba(255,255,255,0.1)]">
              <Lock className="w-4 h-4" />
              Private Access
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
};

