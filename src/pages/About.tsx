import { useState, useEffect } from 'react';
import { Layout } from '../components/layout/Layout';
import { Display, Headline, Body, Label } from '../components/ui/Typography';
import { supabase } from '../lib/supabase';

const About = () => {
  const [content, setContent] = useState<any>(null);

  useEffect(() => {
    const fetchContent = async () => {
      const { data } = await supabase
        .from('cms_content')
        .select('*')
        .eq('page_name', 'About Us')
        .maybeSingle();
      
      if (data && data.modules) {
        setContent(data.modules[0]); // Find specific module type if needed
      }
    };
    fetchContent();
  }, []);

  return (
    <Layout>
      <section className="px-6 md:px-12 lg:px-24 mb-20 editorial-grid items-center min-h-[60vh]">
        <div className="md:col-span-6 space-y-8 animate-luxury-fade">
          <Label>{content?.label || 'Our Story'}</Label>
          <Display>{content?.title || 'Heritage of the Côte d’Azur'}</Display>
          <Body className="text-xl">
            {content?.content || 'Established in 1984, CannesImmo Luxe has been at the forefront of the luxury real estate market in Cannes, offering unparalleled expertise and a commitment to excellence.'}
          </Body>
          <Body className="opacity-60">
            Our firm specialises in the acquisition, sale, and management of the most prestigious properties on the French Riviera. We understand that luxury is built on trust, discretion, and a deep appreciation for architectural beauty.
          </Body>
        </div>
        <div className="md:col-span-6 aspect-[4/5] bg-luxury-dim overflow-hidden">
           <img 
            src={content?.media_url || "https://images.unsplash.com/photo-1549439602-43ebca2327af?auto=format&fit=crop&q=80&w=1000"} 
            alt="Office" 
            className="w-full h-full object-cover transition-transform duration-[10s] hover:scale-110" 
          />
        </div>
      </section>

      <section className="bg-[#f6f3ee] dark:bg-[#1c1b1b] py-32 px-6 md:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto editorial-grid">
          <div className="md:col-span-4 space-y-4">
            <Headline>Discretion</Headline>
            <Body className="text-sm opacity-60">We operate with the highest level of confidentiality for our high-net-worth clients.</Body>
          </div>
          <div className="md:col-span-4 space-y-4">
            <Headline>Expertise</Headline>
            <Body className="text-sm opacity-60">Our agents possess deep local knowledge of the Riviera's micro-markets.</Body>
          </div>
          <div className="md:col-span-4 space-y-4">
            <Headline>Excellence</Headline>
            <Body className="text-sm opacity-60">From staging to legal advising, we provide a full-service experience.</Body>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
