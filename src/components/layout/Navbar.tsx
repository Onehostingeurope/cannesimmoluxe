import React, { useState, useEffect } from 'react';
import { clsx } from 'clsx';
import { Menu, X, Lock } from 'lucide-react';
import { Title } from '../ui/Typography';
import { Button } from '../ui/Button';
import { useLocation, Link } from 'react-router-dom';

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
    <nav 
      className={clsx(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-6 md:px-12",
        isScrolled 
          ? "luxury-glass py-4 shadow-sm" 
          : "bg-white/5 backdrop-blur-md py-6"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img src="/logo.png" alt="CannesImmo Luxe" className="h-[45px] w-auto scale-[1.3] origin-left transition-transform duration-500 hover:scale-[1.4]" />
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

        {/* Action Button */}
        <div className="hidden lg:flex items-center space-x-6">
          <Link to="/login">
            <Button 
              variant="ghost" 
              className="px-4 py-2 flex items-center gap-2 group transition-colors duration-500 text-luxury-charcoal hover:bg-black/5"
            >
              <Lock className="w-3 h-3 transition-transform group-hover:-translate-y-0.5" />
              <span className="text-[10px]">Private Access</span>
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="lg:hidden p-2 transition-colors duration-500 text-luxury-charcoal"
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
          <Link 
            key={link.label} 
            to={link.href}
            onClick={() => setIsMobileMenuOpen(false)}
            className="font-serif text-3xl text-luxury-charcoal hover:text-luxury-gold transition-colors"
          >
            {link.label}
          </Link>
        ))}
        
        <div className="pt-12">
          <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
            <Button variant="primary" className="flex items-center gap-3">
              <Lock className="w-4 h-4" />
              Private Access
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

