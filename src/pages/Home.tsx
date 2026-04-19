import { useState, useEffect, useRef } from 'react';
import { Layout } from '../components/layout/Layout';
import { Button } from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';

import { supabase } from '../lib/supabase';

const Home = () => {
  const navigate = useNavigate();
  const [currentLang, setCurrentLang] = useState('en');
  useEffect(() => {
    const match = document.cookie.match(/googtrans=\/[a-zA-Z]{2}\/([a-zA-Z]{2})/);
    if (match && match[1]) setCurrentLang(match[1]);
  }, []);
  const [heroData, setHeroData] = useState<any>(null);
  const [gridData, setGridData] = useState<any>(null);
  const [textData, setTextData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

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
        const grid = data.modules.find((m: any) => m.type === 'grid');
        if (grid) setGridData(grid);
        const text = data.modules.find((m: any) => m.type === 'text');
        if (text) setTextData(text);
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
              {/* Desktop Video Stream */}
              <iframe 
                src={`https://www.youtube.com/embed/${heroData.youtube_id}?autoplay=1&mute=1&loop=1&playlist=${heroData.youtube_id}&controls=0&showinfo=0&rel=0&iv_load_policy=3&vq=hd1080&modestbranding=1`}
                className="hidden md:block w-full h-full border-0"
                allow="autoplay; encrypted-media"
              />
              {/* Mobile Dedicated Video Stream */}
              <iframe 
                src={`https://www.youtube.com/embed/${heroData.youtube_id_mobile || heroData.youtube_id}?autoplay=1&mute=1&loop=1&playlist=${heroData.youtube_id_mobile || heroData.youtube_id}&controls=0&showinfo=0&rel=0&iv_load_policy=3&vq=hd1080&modestbranding=1`}
                className="block md:hidden w-full h-full border-0"
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
               The Riviera Office <span className="material-symbols-outlined notranslate text-sm group-hover:translate-x-1 transition-transform" translate="no">arrow_forward</span>
             </button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="hidden md:flex absolute bottom-12 left-1/2 -translate-x-1/2 flex-col items-center gap-4 z-10 animate-bounce cursor-pointer group" onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}>
           <span className="font-label text-[10px] tracking-[0.5em] uppercase text-white/50 group-hover:text-white transition-colors duration-500">Explore</span>
           <span className="material-symbols-outlined notranslate text-white/50 group-hover:text-white transition-colors duration-500 font-light text-3xl" translate="no">expand_more</span>
        </div>
      </section>

      {/* Editorial Curation Segment */}
      <section className="bg-[#f6f3ee] dark:bg-[#0a0a0a] py-32 px-6 md:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto space-y-24">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12 border-b border-outline-variant/20 pb-12">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined notranslate text-secondary" translate="no">auto_awesome</span>
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

      {/* Concierge Engagement Segment - Expanded Hybrid Layout */}
      <section className="bg-white dark:bg-[#0a0a0a] py-32 px-6 md:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-6 relative order-2 lg:order-1">
             <div 
               className="aspect-video overflow-hidden bg-black shadow-2xl relative group cursor-pointer"
             >
                <img 
                  src={textData?.media_url || "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1000"} 
                  className="absolute inset-0 w-full h-full object-cover grayscale transition-all duration-700 group-hover:opacity-0 group-hover:scale-110 z-10"
                />
                
                {/* High-Fidelity Video Layer (Priority 1: Native MP4, Priority 2: YouTube) */}
                { (textData?.en_video_url || textData?.fr_video_url) ? (
                    <video 
                      ref={videoRef}
                      src={currentLang === 'fr' ? (textData?.fr_video_url || textData?.en_video_url) : (textData?.en_video_url || textData?.fr_video_url)} 
                      className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-1000 z-0" 
                      autoPlay
                      muted={isMuted}
                      loop 
                      playsInline 
                      preload="auto"
                    />
                ) : (textData?.en_youtube_id || textData?.fr_youtube_id) && (
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 z-0 pointer-events-none">
                       <iframe 
                         src={`https://www.youtube.com/embed/${currentLang === 'fr' ? (textData?.fr_youtube_id || textData?.en_youtube_id) : (textData?.en_youtube_id || textData?.fr_youtube_id)}?autoplay=1&mute=${isMuted ? 1 : 0}&controls=0&loop=1&playlist=${currentLang === 'fr' ? (textData?.fr_youtube_id || textData?.en_youtube_id) : (textData?.en_youtube_id || textData?.fr_youtube_id)}&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1`}
                         className="w-full h-[150%] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 object-cover aspect-video"
                         allow="autoplay; encrypted-media"
                         frameBorder="0"
                       />
                    </div>
                )}

                {/* Premium Audio Controls */}
                <div className="absolute bottom-6 right-6 z-30 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={(e) => { e.stopPropagation(); setIsMuted(!isMuted); }}
                      className="bg-white/10 backdrop-blur-md border border-white/20 p-3 rounded-full hover:bg-white/20 transition-all flex items-center justify-center"
                    >
                       <span className="material-symbols-outlined notranslate text-white text-base" translate="no">
                          {isMuted ? 'volume_off' : 'volume_up'}
                       </span>
                    </button>
                </div>
             </div>
             <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-secondary flex flex-col items-center justify-center text-white p-6 text-center shadow-2xl z-20">
                <span className="font-headline text-4xl">25</span>
                <p className="font-label text-[8px] tracking-widest uppercase opacity-80 leading-tight">Years of Discretion</p>
             </div>
          </div>

          <div className="lg:col-span-6 space-y-12 order-1 lg:order-2">
            <div className="space-y-6">
              <p className="font-label text-[10px] tracking-[0.4em] uppercase text-secondary">The Riviera Office</p>
              <h2 className="font-headline text-5xl md:text-6xl text-primary leading-[1.1]">{textData?.title || 'The Curator\'s Perspective'}</h2>
            </div>
            <p className="text-lg text-on-surface-variant max-w-xl opacity-80 leading-relaxed font-body">
              {textData?.content || "For over two decades, we have provided unparalleled representation for the Riviera's most elite property owners. Every transaction is handled with absolute discretion and technical precision."}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-4">
              {[
                { icon: 'handshake', title: 'Discreet Acquisition', desc: 'Private transactions for buyers who demand absolute confidentiality and architectural integrity.' },
                { icon: 'account_balance', title: 'Asset Orchestration', desc: 'Comprehensive management of your Riviera real estate portfolio, from maintenance to tax optimization.' }
              ].map((service, sidx) => (
                <div key={sidx} className="space-y-4">
                  <span className="material-symbols-outlined notranslate text-secondary text-3xl" translate="no">{service.icon}</span>
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
           <h2 className="font-headline text-5xl md:text-6xl text-primary tracking-tight">{gridData?.title || 'The Enclaves'}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
          {(gridData?.grid_items || [
            { name: 'Cannes', img: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&q=80&w=800' },
            { name: 'Antibes', img: 'https://images.unsplash.com/photo-1549439602-43ebca2327af?auto=format&fit=crop&q=80&w=800' },
            { name: 'St. Tropez', img: 'https://images.unsplash.com/photo-1493246507139-91e8bef99c02?auto=format&fit=crop&q=80&w=800' }
          ]).map((city: any, idx: number) => (
            <div key={idx} className="group relative aspect-[3/5] overflow-hidden cursor-pointer" onClick={() => navigate('/properties')}>
              <img 
                src={city.img} 
                className="w-full h-full object-cover grayscale brightness-[0.7] group-hover:scale-110 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-[2s]" 
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-all duration-700" />
              <div className="absolute bottom-12 left-12">
                 <h3 className="font-headline text-4xl text-white tracking-widest uppercase italic">{city.name}</h3>
                 <p className="font-label text-[9px] tracking-[0.3em] uppercase text-white/60 mt-2">Discover the Territory</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Concierge Segment */}
      <section className="bg-white dark:bg-black py-32">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-12">
           <div className="space-y-4">
              <p className="font-label text-[10px] tracking-[0.4em] uppercase text-secondary">Global Reach</p>
              <h2 className="font-headline text-6xl text-primary leading-tight lowercase">Representing excellence.</h2>
           </div>
           <p className="text-xl text-on-surface-variant opacity-70 font-body leading-relaxed max-w-2xl mx-auto">
             Whether acquiring a historic villa in Cap d'Antibes or listing a contemporary masterpiece in Cannes, our concierge team provides the technical precision and network access required for success.
           </p>
           <div className="pt-8">
              <Button 
                variant="outline" 
                className="h-16 px-16 text-[10px] tracking-[0.4em] uppercase border-primary text-primary hover:bg-black hover:text-white"
                onClick={() => navigate('/contact')}
              >
                Request Representation
              </Button>
           </div>
        </div>
      </section>
    </Layout>
  );
};

export default Home;
