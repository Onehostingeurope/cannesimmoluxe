import React from 'react';
import { Layout } from '../components/layout/Layout';
import { Display, Headline, Body, Label } from '../components/ui/Typography';
import { Button } from '../components/ui/Button';

const About = () => {
  return (
    <Layout>
      <section className="px-6 md:px-12 lg:px-24 mb-20 editorial-grid items-center">
        <div className="md:col-span-6 space-y-8">
          <Label>Our Story</Label>
          <Display>Heritage of the Côte d’Azur</Display>
          <Body className="text-xl">
            Established in 1984, CanneImmo Luxe has been at the forefront of the luxury real estate market in Cannes, offering unparalleled expertise and a commitment to excellence.
          </Body>
          <Body>
            Our firm specialises in the acquisition, sale, and management of the most prestigious properties on the French Riviera. We understand that luxury is built on trust, discretion, and a deep appreciation for architectural beauty.
          </Body>
        </div>
        <div className="md:col-span-6 aspect-[4/5] bg-luxury-dim">
           <img 
            src="https://images.unsplash.com/photo-1549439602-43ebca2327af?auto=format&fit=crop&q=80&w=1000" 
            alt="Office" 
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      <section className="bg-luxury-ivory-low section-padding">
        <div className="max-w-7xl mx-auto editorial-grid">
          <div className="md:col-span-4 space-y-4">
            <Headline>Discretion</Headline>
            <Body className="text-sm">We operate with the highest level of confidentiality for our high-net-worth clients.</Body>
          </div>
          <div className="md:col-span-4 space-y-4">
            <Headline>Expertise</Headline>
            <Body className="text-sm">Our agents possess deep local knowledge of the Riviera's micro-markets.</Body>
          </div>
          <div className="md:col-span-4 space-y-4">
            <Headline>Excellence</Headline>
            <Body className="text-sm">From staging to legal advising, we provide a full-service experience.</Body>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
