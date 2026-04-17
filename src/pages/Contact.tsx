import React from 'react';
import { Layout } from '../components/layout/Layout';
import { Display, Headline, Body, Label } from '../components/ui/Typography';
import { Button } from '../components/ui/Button';
import { Mail, Phone, MapPin } from 'lucide-react';

const Contact = () => {
  return (
    <Layout>
      <section className="px-6 md:px-12 lg:px-24 mb-20 editorial-grid">
        <div className="md:col-span-5 space-y-12">
          <div className="space-y-4">
            <Label>Contact Us</Label>
            <Display>Connect With Our Concierge</Display>
            <Body>
              Whether you are looking to acquire a prestigious estate or list your property, our team is ready to assist you.
            </Body>
          </div>
          
          <div className="space-y-8">
            <div className="flex items-start gap-6">
              <MapPin className="text-luxury-gold mt-1" />
              <div>
                <Headline className="text-xl">Cannes Office</Headline>
                <Body className="text-sm">45 Boulevard de la Croisette, 06400 Cannes, France</Body>
              </div>
            </div>
            <div className="flex items-start gap-6">
              <Phone className="text-luxury-gold mt-1" />
              <div>
                <Headline className="text-xl">Direct Line</Headline>
                <Body className="text-sm">+33 (0)4 93 00 00 00</Body>
              </div>
            </div>
            <div className="flex items-start gap-6">
              <Mail className="text-luxury-gold mt-1" />
              <div>
                <Headline className="text-xl">Enquiries</Headline>
                <Body className="text-sm">contact@canneimmoluxe.com</Body>
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-7 bg-luxury-ivory-low p-12 md:p-20 space-y-10">
          <Headline>Send a Message</Headline>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="border-b border-luxury-charcoal/20 pb-2">
               <input type="text" placeholder="FIRST NAME" className="bg-transparent w-full text-[10px] tracking-widest outline-none placeholder:text-luxury-charcoal/30" />
            </div>
            <div className="border-b border-luxury-charcoal/20 pb-2">
               <input type="text" placeholder="LAST NAME" className="bg-transparent w-full text-[10px] tracking-widest outline-none placeholder:text-luxury-charcoal/30" />
            </div>
            <div className="md:col-span-2 border-b border-luxury-charcoal/20 pb-2">
               <input type="email" placeholder="EMAIL ADDRESS" className="bg-transparent w-full text-[10px] tracking-widest outline-none placeholder:text-luxury-charcoal/30" />
            </div>
            <div className="md:col-span-2 border-b border-luxury-charcoal/20 pb-2 h-32">
               <textarea placeholder="MESSAGE" className="bg-transparent w-full h-full text-[10px] tracking-widest outline-none placeholder:text-luxury-charcoal/30 resize-none" />
            </div>
          </div>
          <Button variant="primary" className="w-full">Submit Enquire</Button>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
