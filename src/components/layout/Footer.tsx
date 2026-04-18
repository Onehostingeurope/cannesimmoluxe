import { Title, Body, Label } from '../ui/Typography';
import { 
  Camera, 
  Share2,
  Mail, 
  Phone,
  MapPin
} from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-luxury-ivory-low py-12 px-6 md:py-20 md:px-12 lg:px-24 mt-12 md:mt-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-6">
        {/* Brand Section */}
        <div className="md:col-span-4 space-y-6 md:space-y-8">
          <div className="flex flex-col">
            <span className="font-serif text-2xl tracking-tighter text-luxury-charcoal">CANNESIMMO</span>
            <span className="font-sans text-[11px] tracking-[0.4em] uppercase text-luxury-gold ml-0.5">LUXE</span>
          </div>
          <Body className="text-sm max-w-xs">
            Curating the finest real estate on the French Riviera. A legacy of excellence, discretion, and architectural beauty.
          </Body>
          <div className="flex space-x-6 text-luxury-charcoal/50">
            <Camera className="w-5 h-5 hover:text-luxury-gold cursor-pointer transition-colors" />
            <Share2 className="w-5 h-5 hover:text-luxury-gold cursor-pointer transition-colors" />
          </div>
        </div>

        {/* Navigation Section */}
        <div className="md:col-span-2 space-y-6">
          <Title className="text-[10px]">Company</Title>
          <ul className="space-y-4 font-sans text-xs tracking-widest uppercase text-luxury-charcoal/60">
            <li><a href="/about" className="hover:text-luxury-gold">About Us</a></li>
            <li><a href="/services" className="hover:text-luxury-gold">Services</a></li>
            <li><a href="/blog" className="hover:text-luxury-gold">Journal</a></li>
            <li><a href="/contact" className="hover:text-luxury-gold">Contact</a></li>
          </ul>
        </div>

        <div className="md:col-span-2 space-y-6">
          <Title className="text-[10px]">Real Estate</Title>
          <ul className="space-y-4 font-sans text-xs tracking-widest uppercase text-luxury-charcoal/60">
            <li><a href="/buy" className="hover:text-luxury-gold">Properties for Sale</a></li>
            <li><a href="/rent" className="hover:text-luxury-gold">Seasonal Rentals</a></li>
            <li><a href="/management" className="hover:text-luxury-gold">Property Management</a></li>
            <li><a href="/off-market" className="hover:text-luxury-gold">Off-Market</a></li>
          </ul>
        </div>

        {/* Contact info */}
        <div className="md:col-span-4 space-y-6">
          <Title className="text-[10px]">Contact</Title>
          <ul className="space-y-4">
            <li className="flex items-start gap-4">
              <MapPin className="w-4 h-4 text-luxury-gold mt-1" />
              <Body className="text-sm">45 Boulevard de la Croisette, 06400 Cannes, France</Body>
            </li>
            <li className="flex items-center gap-4">
              <Phone className="w-4 h-4 text-luxury-gold" />
              <Body className="text-sm">+33 (0)4 93 00 00 00</Body>
            </li>
            <li className="flex items-center gap-4">
              <Mail className="w-4 h-4 text-luxury-gold" />
              <Body className="text-sm">contact@cannesimmoluxe.com</Body>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto mt-20 pt-10 border-t border-luxury-charcoal/5 flex flex-col md:flex-row justify-between items-center gap-6">
        <Label className="text-[9px] text-luxury-charcoal/40 tracking-[0.2em] text-center md:text-left leading-relaxed">
          &copy; 2026 CANNESIMMO LUXE. ALL RIGHTS RESERVED. Design & Conception <a href="https://onehostingeurope.com" target="_blank" rel="noopener noreferrer" className="text-luxury-charcoal/60 hover:text-luxury-gold transition-colors border-b border-transparent hover:border-luxury-gold pb-0.5">OneHostingEurope</a>.
        </Label>
        <div className="flex gap-8">
          <a href="/legal" className="text-[9px] font-sans tracking-[0.2em] uppercase text-luxury-charcoal/40 hover:text-luxury-gold">Legal Notice</a>
          <a href="/privacy" className="text-[9px] font-sans tracking-[0.2em] uppercase text-luxury-charcoal/40 hover:text-luxury-gold">Privacy Policy</a>
        </div>
      </div>
    </footer>
  );
};
