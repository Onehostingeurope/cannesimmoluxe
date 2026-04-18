import { useState, useEffect, useRef } from 'react';
import { Layout } from '../components/layout/Layout';
import { supabase } from '../lib/supabase';

const Management = () => {
  const [loading, setLoading] = useState(false);
  const [textData, setTextData] = useState<any>(null);
  
  useEffect(() => {
    const fetchCMS = async () => {
      const { data } = await supabase.from('cms_content').select('*').eq('page_name', 'Management').maybeSingle();
      if (data && data.modules) {
        const text = data.modules.find((m: any) => m.type === 'text');
        if (text) setTextData(text);
      }
    };
    fetchCMS();
  }, []);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    propertyType: '',
    surface: '',
    address: '',
    details: ''
  });
  const [errors, setErrors] = useState<{ email?: string, phone?: string }>({});
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_DIM = 800;
        let { width, height } = img;
        if (width > height && width > MAX_DIM) {
          height *= MAX_DIM / width;
          width = MAX_DIM;
        } else if (height > MAX_DIM) {
          width *= MAX_DIM / height;
          height = MAX_DIM;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        setUploadedImage(dataUrl);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Strict Input Validation
    const newErrors: { email?: string, phone?: string } = {};
    if (!form.email || form.email.trim() === '') newErrors.email = "* SECURE EMAIL STRICTLY REQUIRED";
    if (!form.phone || form.phone.trim() === '') newErrors.phone = "* TELEPHONE STRICTLY REQUIRED";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      // Ensure the browser scrolls instantly to the errors so the user physically sees what blocked the submission
      setTimeout(() => document.getElementById('management-portal')?.scrollIntoView({ behavior: 'smooth' }), 50);
      return;
    }

    setErrors({});
    setLoading(true);

    const { error } = await supabase
      .from('inquiries')
      .insert([
        {
          email: form.email,
          message: form.details,
          lead_status: 'new',
          tracking_data: {
            first_name: form.firstName,
            last_name: form.lastName,
            phone: form.phone,
            category: 'Management',
            property_type: form.propertyType,
            surface_area: form.surface,
            address: form.address,
            image: uploadedImage
          }
        }
      ]);

    if (error) {
      alert('Error submitting application: ' + error.message);
    } else {
      alert('Your portfolio application has been securely routed to our Management Directors.');
      setForm({ firstName: '', lastName: '', email: '', phone: '', propertyType: '', surface: '', address: '', details: '' });
      setUploadedImage(null);
    }
    setLoading(false);
  };
  return (
    <Layout>
      <main className="pt-24 pb-32 bg-[#fcf9f4] text-[#1c1c19] antialiased">
        {/* Hero Section */}
        <section className="relative w-full h-[870px] flex items-end pb-24 px-12 md:px-24">
          <div className="absolute inset-0 z-0">
            <img 
              alt="Cinematic view of a luxury French Riviera villa terrace at dusk, warm lighting, elegant outdoor furniture, overlooking the Mediterranean Sea" 
              className="w-full h-full object-cover" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBrJXRt9UZyxH_aaI13pU3p9UmEzMn8RQuRB1nK8vy489vkazL5NqH0cra-jl6nqBTCndfjcKMB9Oj3OCjmEwP9rgNth_XQfHRWOtPEEcj1HDUt50nvHPipMjYqIkyDKfYlR2itcuijMMfGPbyoHn2rmO1pIjqdjyuPp5hR1BreJL9HMzUC027uFYPbQiEqgyVH9cw5sXkACy3QZTDJBEF0BGI0IVGI548Zc-tkHb1fUrMACpTlHVXh-2ZcsOXWE8dPxVgLi1oicTY"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
          </div>
          <div className="relative z-10 max-w-4xl text-white">
            <span className="font-label text-xs uppercase tracking-[0.2em] mb-6 block text-[#fbdeb5]">Property Management</span>
            <h1 className="font-headline text-5xl md:text-7xl leading-tight mb-8">Excellence in Asset Protection. Discretion in Every Detail.</h1>
            <p className="font-body text-base max-w-2xl text-[#ebe8e3] leading-relaxed">
              Bespoke property management for discerning owners who expect absolute peace of mind. We curate the preservation of your most valuable assets with Swiss precision and Riviera elegance.
            </p>
          </div>
        </section>

        {/* Service Philosophy */}
        <section className="py-32 px-12 md:px-24 bg-[#f6f3ee]">
          <div className="max-w-[1920px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-16 items-center">
            <div className="md:col-span-5 md:col-start-2">
              <h2 className="font-headline text-4xl mb-8">The Meticulous Standard.</h2>
              <p className="font-body text-base text-gray-600 leading-loose mb-6">
                Our service philosophy is rooted in a highly personal, hands-on approach. We understand that a luxury property is not merely real estate; it is a legacy, a sanctuary, and a significant investment.
              </p>
              <p className="font-body text-base text-gray-600 leading-loose">
                Operating with absolute discretion, our dedicated estate managers become the invisible architects of your property's perfection, ensuring every mechanical, aesthetic, and administrative detail is flawlessly executed before you even recognize a need.
              </p>
            </div>
            <div className="md:col-span-5 relative">
              <img 
                alt="Close-up of minimalist architectural details in a modern luxury villa, featuring limestone textures and warm ambient lighting" 
                className="w-full aspect-[3/4] object-cover" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDSz_6bX8TqC7TEsl9JKKDzXMkjTrw2pbu_bxoVmYVVZ6cAM5fJZxX_9T6-fA6EVQgOrwldGrCMDKNq0aTsbmOkFxUsdV32-cADwxRsOzTkT0y_lggxmm6PFfoXAEzcELP2p-koUU-D8tL9fwc3jS7Fmr4oGTPqZS_6B2Bm345HcKnDfzkJpOAv8F1mXzzsFOBY_a1v050KYjnkP58tX4i5C6tJ9KvJoWV7bgkau8ByapQwWMc10fyjNQ9iQ0U-YiSX7qvmbj5ZChU"
              />
              <div className="absolute -bottom-8 -left-8 bg-[#fcf9f4] p-8 shadow-sm">
                <span className="material-symbols-outlined notranslate text-[#705b3b] text-4xl mb-4" translate="no">diamond</span>
                <p className="font-label text-xs uppercase tracking-[0.1em] font-medium">Uncompromising Quality</p>
              </div>
            </div>
          </div>
        </section>

        {/* Core Services */}
        <section className="py-32 px-12 md:px-24 bg-[#fcf9f4]">
          <div className="max-w-[1920px] mx-auto">
            <div className="mb-24 md:ml-12">
              <span className="font-label text-xs uppercase tracking-[0.2em] text-[#705b3b] mb-4 block">Our Expertise</span>
              <h2 className="font-headline text-4xl">Comprehensive Management Services</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-24 md:px-12">
              {/* Service 1 */}
              <div>
                <span className="material-symbols-outlined notranslate text-[#705b3b] text-3xl mb-6 font-light" translate="no">admin_panel_settings</span>
                <h3 className="font-label text-sm uppercase tracking-[0.05em] mb-4 font-bold">Full Supervision</h3>
                <p className="font-body text-base text-gray-600 leading-relaxed">Dedicated estate manager assigned as your single point of contact for total property oversight.</p>
              </div>
              {/* Service 2 */}
              <div>
                <span className="material-symbols-outlined notranslate text-[#705b3b] text-3xl mb-6 font-light" translate="no">engineering</span>
                <h3 className="font-label text-sm uppercase tracking-[0.05em] mb-4 font-bold">Preventive Maintenance</h3>
                <p className="font-body text-base text-gray-600 leading-relaxed">Rigorous, scheduled inspections and upkeep of all mechanical, electrical, and structural systems.</p>
              </div>
              {/* Service 3 */}
              <div>
                <span className="material-symbols-outlined notranslate text-[#705b3b] text-3xl mb-6 font-light" translate="no">cleaning_services</span>
                <h3 className="font-label text-sm uppercase tracking-[0.05em] mb-4 font-bold">Housekeeping & Staffing</h3>
                <p className="font-body text-base text-gray-600 leading-relaxed">Recruitment, training, and management of elite domestic staff, tailored to your household requirements.</p>
              </div>
              {/* Service 4 */}
              <div>
                <span className="material-symbols-outlined notranslate text-[#705b3b] text-3xl mb-6 font-light" translate="no">account_balance_wallet</span>
                <h3 className="font-label text-sm uppercase tracking-[0.05em] mb-4 font-bold">Financial Administration</h3>
                <p className="font-body text-base text-gray-600 leading-relaxed">Transparent handling of all property-related expenses, utility payments, and detailed monthly ledger reporting.</p>
              </div>
              {/* Service 5 */}
              <div>
                <span className="material-symbols-outlined notranslate text-[#705b3b] text-3xl mb-6 font-light" translate="no">security</span>
                <h3 className="font-label text-sm uppercase tracking-[0.05em] mb-4 font-bold">Security Protocol</h3>
                <p className="font-body text-base text-gray-600 leading-relaxed">Implementation and monitoring of advanced security systems, ensuring the absolute safety of the estate.</p>
              </div>
              {/* Service 6 */}
              <div>
                <span className="material-symbols-outlined notranslate text-[#705b3b] text-3xl mb-6 font-light" translate="no">nature_people</span>
                <h3 className="font-label text-sm uppercase tracking-[0.05em] mb-4 font-bold">Landscape & Grounds</h3>
                <p className="font-body text-base text-gray-600 leading-relaxed">Expert curation and maintenance of gardens, pools, and exterior amenities by specialized professionals.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CMS Injected Narrative Block */}
        <section className="py-32 px-6 md:px-12 text-center bg-[#fcf9f4]">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="font-headline text-5xl md:text-6xl text-primary">{textData?.title || 'Discuss Your Property Needs'}</h2>
            <p className="font-body text-base text-gray-500 leading-relaxed max-w-2xl mx-auto">
              {textData?.content || 'We invite discerning owners to schedule a private consultation to discuss tailored management strategies for your Riviera estate.'}
            </p>
            <div className="pt-8">
              <button 
                onClick={() => document.getElementById('management-portal')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-primary text-white font-sans text-[11px] tracking-[0.2em] uppercase px-10 py-5 hover:bg-secondary transition-colors"
              >
                Enquire About Management
              </button>
            </div>
          </div>
        </section>

        {/* Management Onboarding Portal */}
        <section id="management-portal" className="py-32 px-6 md:px-12 lg:px-24 bg-[#0a0a0a] text-white border-t border-[#dcdad5]/20">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
               <span className="font-label text-xs uppercase tracking-[0.2em] text-secondary mb-4 block">Confidential Onboarding</span>
               <h2 className="font-headline text-4xl md:text-5xl">Submit Your Asset for Evaluation</h2>
               <p className="font-body text-base text-gray-400 leading-relaxed mt-6 max-w-2xl mx-auto">
                 Provide the exact specifications of your estate. Our directors will review the architectural data and contact you to arrange a private site inspection and management consultation.
               </p>
            </div>

            <form onSubmit={handleSubmit} className="bg-[#141414] border border-white/10 p-8 md:p-16 space-y-12">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Identity */}
                  <div className="border-b border-white/20 pb-2">
                     <input type="text" placeholder="FIRST NAME" className="bg-transparent w-full text-[10px] tracking-widest outline-none placeholder:text-white/30 text-white" value={form.firstName} onChange={e => setForm({...form, firstName: e.target.value})} required />
                  </div>
                  <div className="border-b border-white/20 pb-2">
                     <input type="text" placeholder="LAST NAME" className="bg-transparent w-full text-[10px] tracking-widest outline-none placeholder:text-white/30 text-white" value={form.lastName} onChange={e => setForm({...form, lastName: e.target.value})} required />
                  </div>
                  <div className="relative border-b border-white/20 pb-2">
                     <input type="email" placeholder="SECURE EMAIL" className="bg-transparent w-full text-[10px] tracking-widest outline-none placeholder:text-white/30 text-white" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
                     {errors.email && <span className="absolute -bottom-5 left-0 text-red-600 font-label text-[9px] uppercase tracking-widest animate-pulse">{errors.email}</span>}
                  </div>
                  <div className="relative border-b border-white/20 pb-2">
                     <input type="tel" placeholder="TELEPHONE" className="bg-transparent w-full text-[10px] tracking-widest outline-none placeholder:text-white/30 text-white" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} required />
                     {errors.phone && <span className="absolute -bottom-5 left-0 text-red-600 font-label text-[9px] uppercase tracking-widest animate-pulse">{errors.phone}</span>}
                  </div>

                  {/* Property Details */}
                  <div className="md:col-span-2 pt-8">
                     <span className="font-label text-[10px] uppercase tracking-[0.3em] text-secondary">Asset Specifications</span>
                  </div>
                  
                  <div className="border-b border-white/20 pb-2">
                     <select className="bg-transparent w-full text-[10px] tracking-widest uppercase outline-none text-white cursor-pointer" value={form.propertyType} onChange={e => setForm({...form, propertyType: e.target.value})} required>
                        <option value="" disabled className="bg-black">SELECT PROPERTY CLASSIFICATION</option>
                        <option value="Villa" className="bg-black">Private Villa</option>
                        <option value="Penthouse" className="bg-black">Penthouse</option>
                        <option value="Apartment" className="bg-black">Luxury Apartment</option>
                        <option value="Estate" className="bg-black">Compound / Estate</option>
                     </select>
                  </div>
                  <div className="border-b border-white/20 pb-2">
                     <input type="number" placeholder="TOTAL SURFACE AREA (M² / SQM)" className="bg-transparent w-full text-[10px] tracking-widest outline-none placeholder:text-white/30 text-white" value={form.surface} onChange={e => setForm({...form, surface: e.target.value})} required />
                  </div>
                  <div className="md:col-span-2 border-b border-white/20 pb-2">
                     <input type="text" placeholder="EXACT LOCATION (CITY & NEIGHBORHOOD)" className="bg-transparent w-full text-[10px] tracking-widest outline-none placeholder:text-white/30 text-white" value={form.address} onChange={e => setForm({...form, address: e.target.value})} required />
                  </div>
                  
                  <div className="md:col-span-2 border-b border-white/20 pb-2 h-32 mt-4">
                     <textarea placeholder="ADDITIONAL REQUIREMENTS OR SPECIFIC MANAGEMENT NEEDS" className="bg-transparent w-full h-full text-[10px] tracking-widest outline-none placeholder:text-white/30 text-white resize-none font-body" value={form.details} onChange={e => setForm({...form, details: e.target.value})} />
                  </div>

                  {/* File Upload Engine */}
                  <div className="md:col-span-2 pt-6 flex flex-col items-start gap-4 border-t border-white/10 mt-4">
                     <span className="font-label text-[10px] uppercase tracking-[0.2em] text-white/50">Append Architectural / Interior Photograph (Optional)</span>
                     <div className="flex items-center gap-6 w-full">
                        <label className="cursor-pointer bg-white/5 border border-white/20 px-6 py-3 font-label text-[10px] uppercase tracking-widest hover:bg-white/10 transition-colors flex items-center gap-2">
                           <span className="material-symbols-outlined notranslate text-[14px]" translate="no">photo_camera</span>
                           <span>Upload Asset Image</span>
                           <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                        </label>
                        {uploadedImage && (
                           <div className="flex items-center gap-3">
                              <img src={uploadedImage} alt="Uploaded Asset" className="w-12 h-12 object-cover border border-secondary/50 rounded-sm" />
                              <span className="font-label text-[9px] uppercase tracking-widest text-green-400 flex items-center gap-1"><span className="material-symbols-outlined notranslate text-[12px]" translate="no">check_circle</span> Secured</span>
                           </div>
                        )}
                     </div>
                  </div>
               </div>

               <div className="pt-8">
                  <button type="submit" disabled={loading} className="w-full bg-secondary text-white font-sans text-xs tracking-[0.1em] uppercase px-8 py-5 hover:bg-secondary/90 transition-colors shadow-[0_0_20px_rgba(212,175,55,0.15)] disabled:opacity-50">
                     {loading ? 'Transmitting Secure Data...' : 'Submit Estate For Review'}
                  </button>
               </div>
            </form>
          </div>
        </section>
      </main>
    </Layout>
  );
};

export default Management;
