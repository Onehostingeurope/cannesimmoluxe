import { useState, useEffect } from 'react';
import { Layout } from '../components/layout/Layout';
import { Button } from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const Home = () => {
  const navigate = useNavigate();
  const [heroData, setHeroData] = useState<any>(null);

  useEffect(() => {
    const fetchHero = async () => {
      const { data } = await supabase
        .from('cms_content')
        .select('*')
        .eq('page_name', 'Homepage')
        .maybeSingle();
      
      if (data && data.modules) {
        const hero = data.modules.find((m: any) => m.type === 'hero');
        if (hero) setHeroData(hero);
      }
    };
    fetchHero();
  }, []);

  return (
    <Layout>
      {/* Cinematic Hero Segment */}
      <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden font-body bg-black">
        {/* Living Background */}
        <div className="absolute inset-0 z-0">
          {!heroData || heroData.media_type === 'image' ? (
            <img 
              src={heroData?.media_url || "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&q=80&w=2000"} 
              alt="Riviera Horizon" 
              className="w-full h-full object-cover scale-105 animate-[ken-burns_20s_ease-in-out_infinite_alternate] opacity-60"
            />
          ) : heroData.media_type === 'video' ? (
            <video 
              src={heroData.media_url} 
              autoPlay 
              muted 
              loop 
              playsInline
              className="w-full h-full object-cover opacity-60 scale-105"
            />
          ) : heroData.media_type === 'youtube' ? (
            <div className="absolute inset-0 w-full h-full pointer-events-none scale-[1.3] opacity-60">
              <iframe 
                src={`https://www.youtube.com/embed/${heroData.youtube_id}?autoplay=1&mute=1&loop=1&playlist=${heroData.youtube_id}&controls=0&showinfo=0&rel=0&iv_load_policy=3&vq=hd1080&modestbranding=1`}
                className="w-full h-full border-0"
                allow="autoplay; encrypted-media"
              />
            </div>
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
        </div>

        {/* Brand Narrative */}
        <div className="relative z-10 text-center space-y-6 md:space-y-12 px-6 max-w-6xl animate-luxury-fade mt-16 md:mt-24">
          <h1 className="font-headline text-white text-5xl md:text-8xl lg:text-9xl tracking-tighter leading-none italic">
            {heroData?.title?.split(' ').slice(0, -1).join(' ') || "L'Art de"} <br /> 
            <span className="not-italic text-secondary">{heroData?.title?.split(' ').slice(-1) || "Vivre."}</span>
          </h1>
          <p className="text-white/60 text-lg md:text-xl font-body max-w-2xl mx-auto leading-relaxed">
            {heroData?.content || "Curating the French Riviera's most distinguished estates with an unwavering focus on architectural precision and discreet representation."}
          </p>
          <div className="pt-8 flex flex-col md:flex-row items-center justify-center gap-6">
             <Button 
               variant="primary" 
               className="h-16 px-12 text-[11px] tracking-[0.3em] uppercase bg-white text-black hover:bg-secondary hover:text-white"
               onClick={() => navigate('/properties')}
             >
               Explore Collection
             </Button>
             <button className="font-label text-[10px] tracking-[0.2em] uppercase text-white hover:text-secondary group flex items-center gap-3 transition-colors">
               The Riviera Office <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
             </button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="hidden md:flex absolute bottom-12 left-1/2 -translate-x-1/2 flex-col items-center gap-4 z-10 animate-bounce cursor-pointer group" onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}>
           <span className="font-label text-[10px] tracking-[0.5em] uppercase text-white/50 group-hover:text-white transition-colors duration-500">Explore</span>
           <span className="material-symbols-outlined text-white/50 group-hover:text-white transition-colors duration-500 font-light text-3xl">expand_more</span>
        </div>
      </section>

      {/* Editorial Curation Segment */}
      <section className="bg-[#f6f3ee] dark:bg-[#0a0a0a] py-32 px-6 md:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto space-y-24">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12 border-b border-outline-variant/20 pb-12">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-secondary">auto_awesome</span>
                <p className="font-label text-[10px] tracking-[0.3em] uppercase text-outline">Digital Curator</p>
              </div>
              <h2 className="font-headline text-5xl md:text-6xl text-primary">Curated Selection</h2>
            </div>
            <p className="text-sm text-on-surface-variant max-w-md opacity-70 leading-relaxed italic">
              "Every property in our portfolio undergoes a rigorous architectural evaluation to ensure it meets the highest standards of Riviera luxury."
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            <div className="lg:col-span-8 group cursor-pointer" onClick={() => navigate('/properties/1')}>
              <div className="aspect-[16/10] overflow-hidden bg-black relative mb-8">
                <img 
                  src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200" 
                  alt="Villa Azurite"
                  className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000 opacity-90 group-hover:opacity-100"
                />
                <div className="absolute bottom-8 left-8 py-2 px-6 bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] tracking-[0.2em] uppercase">
                  Cinematic Spotlight
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                   <p className="font-label text-[10px] tracking-[0.2em] uppercase text-outline">La Californie, Cannes</p>
                   <p className="font-headline text-lg text-secondary italic">€ 14,800,000</p>
                </div>
                <h3 className="font-headline text-4xl text-primary">Villa Azurite</h3>
              </div>
            </div>

            <div className="lg:col-span-4 space-y-20 flex flex-col justify-center">
              {[
                { name: 'Penthouse Croisette', city: 'Cannes', price: 'Price on Request', img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800' },
                { name: 'Domaine de la Mer', city: 'Saint-Jean-Cap-Ferrat', price: '€ 8,900,000', img: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=800' }
              ].map((item, i) => (
                <div key={i} className="group cursor-pointer space-y-6" onClick={() => navigate('/properties')}>
                  <div className="aspect-[4/3] overflow-hidden bg-black relative">
                    <img 
                      src={item.img} 
                      className="w-full h-full object-cover grayscale-[50%] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700 opacity-80"
                    />
                  </div>
                  <div className="space-y-1">
                    <p className="font-label text-[9px] tracking-widest text-outline uppercase">{item.city}</p>
                    <h4 className="font-headline text-2xl text-primary">{item.name}</h4>
                    <p className="text-secondary font-headline text-sm italic">{item.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Concierge Engagement Segment */}
      <section className="bg-white dark:bg-[#0a0a0a] py-32 px-6 md:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-20 items-center">
          <div className="lg:col-span-5 relative order-2 lg:order-1">
             <div className="aspect-[3/4] overflow-hidden bg-black border-[20px] border-[#f6f3ee] dark:border-[#1c1b1b] shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1600607687940-4e2303c00427?auto=format&fit=crop&q=80&w=1000" 
                  className="w-full h-full object-cover grayscale transition-all duration-[5s] hover:grayscale-0"
                />
             </div>
             <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-secondary flex flex-col items-center justify-center text-white p-8 text-center space-y-2 shadow-2xl">
                <span className="font-headline text-4xl">25</span>
                <p className="font-label text-[9px] tracking-widest uppercase opacity-80">Years of Discretion</p>
             </div>
          </div>

          <div className="lg:col-span-7 space-y-12 order-1 lg:order-2">
            <div className="space-y-6">
              <p className="font-label text-[10px] tracking-[0.4em] uppercase text-secondary">The Riviera Office</p>
              <h2 className="font-headline text-5xl md:text-6xl text-primary leading-[1.1]">The Curator's <br /> <span className="italic">Perspective.</span></h2>
            </div>
            <p className="text-lg text-on-surface-variant max-w-xl opacity-80 leading-relaxed font-body">
              For over two decades, we have provided unparalleled representation for the Riviera's most elite property owners. Every transaction is handled with absolute discretion and technical precision.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-4">
              {[
                { icon: 'handshake', title: 'Discreet Acquisition', desc: 'Private transactions for buyers who demand absolute confidentiality and architectural integrity.' },
                { icon: 'account_balance', title: 'Asset Orchestration', desc: 'Comprehensive management of your Riviera real estate portfolio, from maintenance to tax optimization.' }
              ].map((service, sidx) => (
                <div key={sidx} className="space-y-4">
                  <span className="material-symbols-outlined text-secondary text-3xl">{service.icon}</span>
                  <h3 className="font-headline text-xl text-primary">{service.title}</h3>
                  <p className="text-sm text-on-surface-variant opacity-60 leading-relaxed">{service.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Riviera Destinations Segment */}
      <section className="bg-[#f6f3ee] dark:bg-[#0a0a0a] py-32">
        <div className="px-6 md:px-12 lg:px-24 mb-20 text-center space-y-4">
           <p className="font-label text-[10px] tracking-[0.4em] uppercase text-secondary">Our Influence</p>
           <h2 className="font-headline text-5xl md:text-6xl text-primary tracking-tight">The Enclaves</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
          {[
            { name: 'Cannes', img: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&q=80&w=800' },
            { name: 'Antibes', img: 'https://images.unsplash.com/photo-1549439602-43ebca2327af?auto=format&fit=crop&q=80&w=800' },
            { name: 'St. Tropez', img: 'https://images.unsplash.com/photo-1493246507139-91e8bef99c02?auto=format&fit=crop&q=80&w=800' }
          ].map((city, idx) => (
            <div key={idx} className="group relative aspect-[3/5] overflow-hidden cursor-pointer" onClick={() => navigate('/properties')}>
              <img 
                src={city.img} 
                className="w-full h-full object-cover grayscale brightness-[0.7] group-hover:scale-110 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-[2s]" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute inset-0 flex flex-col items-center justify-end p-16 pb-24 text-center space-y-4">
                <h3 className="font-headline text-5xl text-white italic transform translate-y-8 group-hover:translate-y-0 transition-transform duration-700">{city.name}</h3>
                <div className="w-0 h-px bg-secondary group-hover:w-24 transition-all duration-700"></div>
                <p className="font-label text-[9px] tracking-[0.3em] uppercase text-white/40 opacity-0 group-hover:opacity-100 transition-opacity duration-700">View Collection</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Segment */}
      <section className="relative h-[80vh] flex items-center justify-center bg-black overflow-hidden">
        <div className="absolute inset-0 opacity-40">
           <img 
             src="https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&q=80&w=2000" 
             className="w-full h-full object-cover grayscale"
           />
           <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
        </div>
        
        <div className="relative z-10 text-center max-w-4xl px-8 space-y-12 animate-luxury-fade">
           <div className="space-y-6">
              <span className="material-symbols-outlined text-secondary text-5xl">key</span>
              <h2 className="font-headline text-5xl md:text-7xl text-white">Enter the <br /> <span className="italic">Private Circle.</span></h2>
              <p className="text-white/40 text-lg font-body max-w-2xl mx-auto leading-relaxed">
                Verification unlocks access to our classified portfolio and direct consultation lines with our senior partners.
              </p>
           </div>
           
           <div className="pt-8 flex flex-col md:flex-row items-center justify-center gap-6">
              <Button 
                variant="primary" 
                className="h-16 px-16 text-[10px] tracking-[0.4em] uppercase bg-secondary text-white border-secondary hover:bg-white hover:text-black"
                onClick={() => navigate('/register')}
              >
                Request Access
              </Button>
              <button 
                className="font-label text-[10px] tracking-[0.2em] uppercase text-white hover:text-secondary border-b border-transparent hover:border-secondary pb-1 transition-all"
                onClick={() => navigate('/login')}
              >
                Verified Login
              </button>
           </div>
        </div>
      </section>
    </Layout>
  );
};

export default Home;
