import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { Button } from '../components/ui/Button';
import { MOCK_PROPERTIES } from '../data/mockProperties';
import { useAuthStore } from '../store/useAuthStore';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { PropertyPDF } from '../components/property/PropertyPDF';
import { useTracking } from '../hooks/useTracking';

const PropertyDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  useTracking('view_property', slug);
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const isGated = !user; 
  const property = (MOCK_PROPERTIES.find(p => p.slug === slug) || MOCK_PROPERTIES[0]) as any;

  const formattedPrice = property.price 
    ? new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(property.price)
    : '';

  return (
    <Layout>
      <main className="flex-grow pt-24 pb-20 animate-luxury-fade font-body bg-white text-black">
        {/* Asymmetric Gallery Header */}
        <section className="px-6 md:px-16 lg:px-24 mb-16">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 h-[600px]">
            <div className="md:col-span-8 overflow-hidden">
              <img 
                alt="Principal View" 
                className="w-full h-full object-cover transition-transform duration-[10s] hover:scale-105" 
                src={property.images[0]} 
              />
            </div>
            <div className="md:col-span-4 grid grid-rows-2 gap-4">
              <div className="overflow-hidden">
                <img 
                  alt="Interior Detail" 
                  className="w-full h-full object-cover transition-transform duration-[10s] hover:scale-105" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDxG7GAtGsc-r2K4o3x_hH2T2r_Y3Rst5Xn5M7_u7fD_p1J1_9p_P1_X_X_X_X_X_X_X_X_X_X_X_X_X_X_X_X_X_X_X_X_X_X_X_X_X_X_X_X_X_X_X_X_X_X_X_X_X_X_X_X_X_X_X_X" 
                />
              </div>
              <div className="overflow-hidden">
                <img 
                  alt="Terrace View" 
                  className="w-full h-full object-cover transition-transform duration-[10s] hover:scale-105" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAnrG7GAtGsc-r2K4o3x_hH2T2r_Y3Rst5Xn5M7_u7fD_p1J1_9p_P1_X_X_X_X_X_X_X_X_X_X_X_X_X_X_X_X_X_X_X_X_X_X_X_X_X_X_X_X_X_X_X_X_X_X_X_X_X_X_X_X_X_X_X_X" 
                />
              </div>
            </div>
          </div>
        </section>

        {/* Property Information & Inquiry Matrix */}
        <section className="px-6 md:px-16 lg:px-24 grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Main Info Column */}
          <div className="lg:col-span-8 space-y-12">
            <div>
              <div className="flex items-center space-x-4 mb-4">
                <span className="font-label text-[10px] tracking-[0.2em] uppercase text-secondary">{property.type}</span>
                <span className="w-1 h-1 bg-outline-variant rounded-full"></span>
                <span className="font-label text-[10px] tracking-[0.2em] uppercase text-outline">Ref: {property.ref_id}</span>
              </div>
              <h1 className="font-headline text-5xl md:text-6xl text-primary mb-6 leading-tight">{property.title}</h1>
              <div className="flex items-center text-on-surface-variant opacity-70">
                <span className="material-symbols-outlined notranslate mr-2" translate="no">location_on</span>
                <span className="font-label text-xs tracking-widest uppercase">{property.district}, {property.city}</span>
              </div>
            </div>

            {/* Core Stats Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-8 border-y border-outline-variant/20">
              <div className="flex flex-col items-center justify-center text-center space-y-2">
                <span className="material-symbols-outlined notranslate text-secondary text-3xl" translate="no">bed</span>
                <p className="font-label text-xs tracking-widest uppercase text-outline">Bedrooms</p>
                <p className="font-headline text-2xl text-primary">{property.bedrooms}</p>
              </div>
              <div className="flex flex-col items-center justify-center text-center space-y-2 border-l border-outline-variant/20">
                <span className="material-symbols-outlined notranslate text-secondary text-3xl" translate="no">bathtub</span>
                <p className="font-label text-xs tracking-widest uppercase text-outline">Bathrooms</p>
                <p className="font-headline text-2xl text-primary">{property.bathrooms}</p>
              </div>
              <div className="flex flex-col items-center justify-center text-center space-y-2 border-l border-outline-variant/20">
                <span className="material-symbols-outlined notranslate text-secondary text-3xl" translate="no">straighten</span>
                <p className="font-label text-xs tracking-widest uppercase text-outline">Living Area</p>
                <p className="font-headline text-2xl text-primary">{property.surface}m²</p>
              </div>
              <div className="flex flex-col items-center justify-center text-center space-y-2 border-l border-outline-variant/20">
                <span className="material-symbols-outlined notranslate text-secondary text-3xl" translate="no">landscape</span>
                <p className="font-label text-xs tracking-widest uppercase text-outline">Land Size</p>
                <p className="font-headline text-2xl text-primary">{property.land_surface || 'N/A'}m²</p>
              </div>
            </div>

            {/* Narrative Portfolio */}
            <div className="space-y-8">
              <h2 className="font-headline text-2xl text-primary">The Narrative</h2>
              <p className="text-lg leading-relaxed text-on-surface-variant max-w-3xl border-l-2 border-secondary pl-8 italic">
                {property.description || "This exceptional property represents the pinnacle of luxury living in the heart of the Côte d’Azur. Perfectly situated to offer breath-taking views and absolute privacy, it has been meticulously designed to blend historical charm with contemporary amenities."}
              </p>
              <p className="text-sm leading-relaxed text-on-surface-variant max-w-3xl opacity-80">
                Every detail has been considered, from the choice of natural stone to the precision of the lighting, creating an atmosphere of refined elegance that is both timeless and modern. The expansive terraces offer the perfect setting for entertaining or simply enjoying the tranquility of the Mediterranean lifestyle.
              </p>
            </div>

            {/* Technical Matrix (Gated) */}
            <div className="space-y-8">
              <h2 className="font-headline text-2xl text-primary flex items-center">
                Technical Matrix
                {isGated && <span className="material-symbols-outlined notranslate ml-3 text-secondary text-xl" translate="no">lock</span>}
              </h2>
              
              {isGated ? (
                <div className="bg-[#f6f3ee] p-12 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined notranslate text-[120px]" translate="no">security</span>
                  </div>
                  <div className="relative z-10 max-w-md">
                    <h3 className="font-headline text-xl text-primary mb-4">Verified Access Required</h3>
                    <p className="text-sm text-on-surface-variant leading-relaxed mb-8">
                      To safeguard the privacy of our residents, precise coordinates, floor plans, and technical specifications are reserved for verified members of our private collection.
                    </p>
                    <div className="flex items-center space-x-6">
                      <Button variant="primary" onClick={() => navigate('/register')}>Request Access</Button>
                      <button onClick={() => navigate('/login')} className="font-label text-[10px] tracking-widest uppercase text-secondary hover:text-primary transition-colors">Sign In</button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-4">
                  {[
                    { label: "Ref ID", value: property.ref_id },
                    { label: "Exposure", value: property.exposition || "N/A" },
                    { label: "View", value: property.vue || "N/A" },
                    { label: "Garage", value: property.garage ? `${property.garage} spaces` : "None" },
                    { label: "Swimming Pool", value: property.piscine ? "Yes" : "No" },
                    { label: "Air Conditioning", value: property.air_conditioning ? "Yes" : "No" },
                    { label: "Energy Rating", value: property.dpe ? `Class ${property.dpe}` : "N/A" },
                  ].map((field, idx) => (
                    <div key={idx} className="flex items-center justify-between py-4 border-b border-outline-variant/20">
                      <span className="font-label text-[10px] tracking-widest uppercase text-outline">{field.label}</span>
                      <span className="font-body text-sm text-primary font-medium">{field.value}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Inquiry Column */}
          <div className="lg:col-span-4 lg:sticky lg:top-32 h-fit space-y-8">
            <div className="bg-[#1c1b1b] text-white p-10 shadow-2xl relative overflow-hidden">
                {/* Branding corner */}
                <div className="absolute top-0 right-0 p-4 opacity-10">
                   <h1 className="font-headline italic text-xs tracking-tighter">CIL</h1>
                </div>
                
                <p className="font-label text-[10px] tracking-[0.3em] uppercase text-secondary mb-2">Concierge</p>
                <h3 className="font-headline text-3xl mb-8 leading-tight">Begin the <span className="italic text-secondary">Conversation.</span></h3>
                
                <form className="space-y-6">
                  <div className="space-y-2">
                    <label className="block font-label text-[9px] tracking-widest uppercase text-white/40">Full Name</label>
                    <input type="text" className="w-full bg-white/5 border-0 border-b border-white/20 focus:border-secondary focus:ring-0 px-0 pb-2 text-sm text-white transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="block font-label text-[9px] tracking-widest uppercase text-white/40">Email Address</label>
                    <input type="email" className="w-full bg-white/5 border-0 border-b border-white/20 focus:border-secondary focus:ring-0 px-0 pb-2 text-sm text-white transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="block font-label text-[9px] tracking-widest uppercase text-white/40">Inquiry Narrative</label>
                    <textarea rows={4} className="w-full bg-white/5 border-0 border-b border-white/20 focus:border-secondary focus:ring-0 px-0 pb-2 text-sm text-white transition-all resize-none"></textarea>
                  </div>
                  <Button variant="secondary" className="w-full border-white/20 text-white hover:bg-white hover:text-black mt-4">
                    Send Enquiry
                  </Button>
                </form>
            </div>

            {/* Technical Brochure Utility */}
            <div className="bg-[#f6f3ee] p-10 border border-outline-variant/10">
              <h4 className="font-headline text-lg text-primary mb-2">Digital Dossier</h4>
              <p className="text-xs text-on-surface-variant opacity-70 mb-8 leading-relaxed">
                Download the complete technical sheet, including cadastral maps and material schedules.
              </p>
              
              {user ? (
                <PDFDownloadLink 
                  document={<PropertyPDF property={property} />} 
                  fileName={`${property.slug}-dossier.pdf`}
                >
                  {({ loading }) => (
                    <Button variant="outline" className="w-full flex items-center justify-center gap-3" disabled={loading}>
                      <span className="material-symbols-outlined notranslate text-lg" translate="no">description</span>
                      <span>{loading ? 'Compiling Dossier...' : 'Download PDF'}</span>
                    </Button>
                  )}
                </PDFDownloadLink>
              ) : (
                <Button 
                  variant="outline" 
                  className="w-full flex items-center justify-center gap-3 opacity-50 cursor-not-allowed"
                  onClick={() => navigate('/register')}
                >
                  <span className="material-symbols-outlined notranslate text-lg" translate="no">lock</span>
                  <span>Register to Download</span>
                </Button>
              )}
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
};

export default PropertyDetail;
