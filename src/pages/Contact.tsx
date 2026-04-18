import { useState } from 'react';
import { Layout } from '../components/layout/Layout';
import { Display, Headline, Body, Label } from '../components/ui/Typography';
import { Button } from '../components/ui/Button';
import { Mail, Phone, MapPin } from 'lucide-react';
import { supabase } from '../lib/supabase';

const Contact = () => {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase
      .from('inquiries')
      .insert([
        {
          email: form.email,
          message: form.message,
          lead_status: 'new'
        }
      ]);

    if (error) {
      alert('Error sending enquiry: ' + error.message);
    } else {
      alert('Your enquiry has been securely transmitted to our concierge.');
      setForm({ firstName: '', lastName: '', email: '', message: '' });
    }
    setLoading(false);
  };

  return (
    <Layout>
      <section className="px-6 md:px-12 lg:px-24 mb-20 editorial-grid">
        <div className="md:col-span-5 space-y-12">
          {/* Static info remains for now as it follows brand guidelines */}
          <div className="space-y-4">
            <Label>Contact Us</Label>
            <Display>Connect With Our Concierge</Display>
            <Body>
              Whether you are looking to acquire a prestigious estate or list your property, our team is ready to assist you.
            </Body>
          </div>
          
          <div className="space-y-8">
            <div className="flex items-start gap-6">
              <MapPin className="text-secondary mt-1" />
              <div>
                <Headline className="text-xl">Cannes Office</Headline>
                <Body className="text-sm">45 Boulevard de la Croisette, 06400 Cannes, France</Body>
              </div>
            </div>
            <div className="flex items-start gap-6">
              <Phone className="text-secondary mt-1" />
              <div>
                <Headline className="text-xl">Direct Line</Headline>
                <Body className="text-sm">+33 (0)4 93 00 00 00</Body>
              </div>
            </div>
            <div className="flex items-start gap-6">
              <Mail className="text-secondary mt-1" />
              <div>
                <Headline className="text-xl">Enquiries</Headline>
                <Body className="text-sm">contact@canneimmoluxe.com</Body>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="md:col-span-7 bg-[#f6f3ee] dark:bg-[#1c1b1b] p-12 md:p-20 space-y-10">
          <Headline>Send a Message</Headline>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="border-b border-primary/20 pb-2">
               <input 
                 type="text" 
                 placeholder="FIRST NAME" 
                 className="bg-transparent w-full text-[10px] tracking-widest outline-none placeholder:text-outline/50" 
                 value={form.firstName}
                 onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                 required
               />
            </div>
            <div className="border-b border-primary/20 pb-2">
               <input 
                 type="text" 
                 placeholder="LAST NAME" 
                 className="bg-transparent w-full text-[10px] tracking-widest outline-none placeholder:text-outline/50" 
                 value={form.lastName}
                 onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                 required
               />
            </div>
            <div className="md:col-span-2 border-b border-primary/20 pb-2">
               <input 
                 type="email" 
                 placeholder="EMAIL ADDRESS" 
                 className="bg-transparent w-full text-[10px] tracking-widest outline-none placeholder:text-outline/50" 
                 value={form.email}
                 onChange={(e) => setForm({ ...form, email: e.target.value })}
                 required
               />
            </div>
            <div className="md:col-span-2 border-b border-primary/20 pb-2 h-32">
               <textarea 
                 placeholder="MESSAGE" 
                 className="bg-transparent w-full h-full text-[10px] tracking-widest outline-none placeholder:text-outline/50 resize-none font-body" 
                 value={form.message}
                 onChange={(e) => setForm({ ...form, message: e.target.value })}
                 required
               />
            </div>
          </div>
          <Button variant="primary" className="w-full" disabled={loading}>
            {loading ? 'Transmitting...' : 'Submit Enquire'}
          </Button>
        </form>
      </section>
    </Layout>
  );
};

export default Contact;
