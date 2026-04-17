import React, { useState, useEffect } from 'react';
import { clsx } from 'clsx';
import { Menu, X, Lock } from 'lucide-react';
import { Title } from '../ui/Typography';
import { Button } from '../ui/Button';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
    <nav 
      className={clsx(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-6 md:px-12 py-6",
        isScrolled ? "luxury-glass py-4 shadow-sm" : "bg-transparent py-8"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="flex flex-col">
          <span className={clsx(
            "font-serif text-xl tracking-tighter transition-colors duration-500",
            isScrolled ? "text-luxury-charcoal" : "text-white"
          )}>
            CANNEIMMO
          </span>
          <span className="font-sans text-[10px] tracking-[0.4em] uppercase text-luxury-gold ml-0.5">LUXE</span>
        </a>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-10">
          {navLinks.map((link) => (
            <a 
              key={link.label} 
              href={link.href}
              className={clsx(
                "font-sans text-[11px] tracking-[0.2em] uppercase transition-colors duration-500 hover:text-luxury-gold",
                isScrolled ? "text-luxury-charcoal/70" : "text-white/80"
              )}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Action Button */}
        <div className="hidden lg:flex items-center space-x-6">
          <Button 
            variant="ghost" 
            className={clsx(
              "px-4 py-2 flex items-center gap-2 group transition-colors duration-500",
              isScrolled ? "text-luxury-charcoal" : "text-white hover:bg-white/10"
            )}
          >
            <Lock className="w-3 h-3 transition-transform group-hover:-translate-y-0.5" />
            <span className="text-[10px]">Private Access</span>
          </Button>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className={clsx(
            "lg:hidden p-2 transition-colors duration-500",
            isScrolled ? "text-luxury-charcoal" : "text-white"
          )}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div 
        className={clsx(
          "fixed inset-0 bg-surface z-40 lg:hidden transition-transform duration-500 ease-in-out p-12 flex flex-col items-center justify-center space-y-8",
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <button 
          className="absolute top-8 right-8 text-luxury-charcoal"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <X size={32} />
        </button>

        {navLinks.map((link) => (
          <a 
            key={link.label} 
            href={link.href}
            onClick={() => setIsMobileMenuOpen(false)}
            className="font-serif text-3xl text-luxury-charcoal hover:text-luxury-gold transition-colors"
          >
            {link.label}
          </a>
        ))}
        
        <div className="pt-12">
          <Button variant="primary" className="flex items-center gap-3">
            <Lock className="w-4 h-4" />
            Private Access
          </Button>
        </div>
      </div>
    </nav>
  );
};
