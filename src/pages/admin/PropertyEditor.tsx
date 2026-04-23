import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { Button } from '../../components/ui/Button';
import { Headline, Label } from '../../components/ui/Typography';
import { supabase } from '../../lib/supabase';
import { clsx } from 'clsx';

// Modular Components
import { FormSection } from '../../components/admin/property/FormSection';
import { AmenityPicker } from '../../components/admin/property/AmenityPicker';
import { MediaUploader } from '../../components/admin/property/MediaUploader';
import { PublishSidebar } from '../../components/admin/property/PublishSidebar';

// Schema Definition
const propertySchema = z.object({
  // Basic
  title: z.string().min(3, 'Title must be at least 3 characters'),
  ref_id: z.string().min(2, 'Reference ID is required'),
  mode: z.enum(['sale', 'rent']),
  type: z.string().min(2, 'Property type is required'),
  status: z.string(),
  featured: z.boolean().default(false),
  description_short: z.string().min(10, 'Short summary should be descriptive'),
  description_long: z.string().min(20, 'Detailed description is required'),
  
  // Location
  country: z.string().default('France'),
  city: z.string().min(2, 'City is required'),
  district: z.string().optional(),
  address: z.string().optional(),
  postal_code: z.string().optional(),
  latitude: z.number().nullable().optional(),
  longitude: z.number().nullable().optional(),
  hide_map: z.boolean().default(false),
  
  // Pricing
  price: z.number().nullable().optional(),
  price_on_request: z.boolean().default(false),
  currency: z.string().default('EUR'),
  property_tax: z.number().nullable().optional(),
  charges: z.number().nullable().optional(),
  availability_date: z.string().optional(),
  
  // Details
  rooms: z.number().nullable().optional(),
  bedrooms: z.number().nullable().optional(),
  bathrooms: z.number().nullable().optional(),
  levels: z.number().nullable().optional(),
  interior_area: z.number().nullable().optional(),
  surface: z.number().nullable().optional(), // total surface
  land_surface: z.number().nullable().optional(),
  terrace_surface: z.number().nullable().optional(),
  balcony_surface: z.number().nullable().optional(),
  garage: z.number().nullable().optional(),
  piscine: z.boolean().default(false),
  air_conditioning: z.boolean().default(false),
  exposition: z.string().optional(),
  vue: z.string().optional(),
  condition: z.string().optional(),
  style: z.string().optional(),
  
  // Technical
  heating_energy: z.string().optional(),
  heating_type: z.string().optional(),
  hot_water: z.string().optional(),
  waste_water: z.string().optional(),
  energy_class: z.string().optional(),
  energy_value: z.number().nullable().optional(),
  climate_class: z.string().optional(),
  climate_value: z.number().nullable().optional(),
  annual_energy_min: z.number().nullable().optional(),
  annual_energy_max: z.number().nullable().optional(),
  
  // Amenities
  amenities: z.array(z.string()).default([]),
  
  // SEO
  seo_title: z.string().optional(),
  seo_description: z.string().optional(),
  slug: z.string().optional(),
  og_title: z.string().optional(),
  og_description: z.string().optional(),
  
  // Gated
  gated_brochure: z.boolean().default(false),
  gated_dossier: z.boolean().default(false),
  gated_save: z.boolean().default(false),
  agent_notes: z.string().optional(),
  
  // Media
  youtube_id: z.string().optional(),
});

type PropertyFormData = z.infer<typeof propertySchema>;

const LUXURY_AMENITIES = [
  'Air conditioning', 'Double glazing', 'Sliding windows', 'Internet', 'Jacuzzi', 
  'Electric shutters', 'Irrigation', 'Barbecue', 'Outdoor lighting', 'Optical fiber', 
  'Alarm', 'Safe', 'Electric gate', 'Video surveillance', 'Videophone', 
  'Swimming pool', 'Fireplace', 'Gym', 'Wine Cellar', 'Elevator', 'Home Automation'
];

const PropertyEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  const [loading, setLoading] = useState(isEdit);
  const [mediaFiles, setMediaFiles] = useState<any[]>([]);
  const [completionScore, setCompletionScore] = useState(0);

  const { register, handleSubmit, watch, setValue, reset, formState: { errors, isValid, isSubmitting } } = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      status: 'available',
      mode: 'sale',
      country: 'France',
      currency: 'EUR',
      featured: false,
      hide_map: false,
      price_on_request: false,
      amenities: [],
      piscine: false,
      air_conditioning: false,
      gated_brochure: false,
      gated_dossier: false,
      gated_save: false,
    }
  });

  const watchedFields = watch();

  // Calculate Completion Score
  useEffect(() => {
    let score = 0;
    if (watchedFields.title && watchedFields.ref_id) score += 20;
    if (mediaFiles.length > 0) score += 20;
    if (watchedFields.energy_class || watchedFields.interior_area) score += 20;
    if (watchedFields.seo_title) score += 20;
    if (watchedFields.gated_brochure) score += 20;
    setCompletionScore(score);
  }, [watchedFields, mediaFiles]);

  useEffect(() => {
    if (isEdit) fetchProperty();
  }, [id]);

  const fetchProperty = async () => {
    const { data, error } = await supabase.from('properties').select('*').eq('id', id).single();
    if (data) {
      reset(data);
      // Fetch media too if implemented...
      setLoading(false);
    }
  };

  const onSubmit = async (values: PropertyFormData, mode: 'draft' | 'publish') => {
    const slug = values.slug || values.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    const propertyData = { ...values, slug, updated_at: new Date().toISOString() };
    
    // In actual implementation, we would also handle mediaFiles table updates here
    
    const { error } = isEdit 
      ? await supabase.from('properties').update(propertyData).eq('id', id)
      : await supabase.from('properties').insert([propertyData]);

    if (error) {
      alert('Error saving: ' + error.message);
    } else {
      navigate('/admin/properties');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    
    // Simple local preview for demo
    const newFiles = Array.from(files).map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      url: URL.createObjectURL(file),
      alt: '',
      isCover: false,
      type: 'image'
    }));
    setMediaFiles(prev => [...prev, ...newFiles]);
  };

  if (loading) return <div className="p-20 text-center">Loading Asset Dossier...</div>;

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto space-y-12 pb-24">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-outline-variant/20 pb-8">
           <div className="space-y-3">
              <div className="flex items-center gap-3">
                 <span className="material-symbols-outlined notranslate text-secondary text-base" translate="no">add_circle</span>
                 <p className="font-label text-[10px] tracking-[0.2em] uppercase text-outline">Inventory Management</p>
              </div>
              <h1 className="font-serif text-4xl text-primary">{isEdit ? 'Refine Asset' : 'Add New Property'}</h1>
              <p className="text-sm text-outline opacity-70 italic font-serif max-w-xl">
                 Create a luxury listing with media, pricing, details, SEO, and brochure access.
              </p>
           </div>
           <div className="flex gap-4 w-full md:w-auto">
              <Button variant="outline" onClick={() => navigate('/admin/properties')}>Discard</Button>
              <Button variant="outline" onClick={() => {}}>Preview</Button>
              <Button variant="primary" onClick={handleSubmit((d: PropertyFormData) => onSubmit(d, 'publish'))}>Publish Asset</Button>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
           {/* Main Content */}
           <div className="lg:col-span-8 space-y-12">
              
              {/* A. Basic Information */}
              <FormSection title="Basic Information" subtitle="Primary identity and editorial narrative" icon="info">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2 md:col-span-2">
                       <label className="text-[10px] uppercase tracking-widest text-outline">Property Title</label>
                       <input {...register('title')} className="w-full bg-[#f6f3ee] dark:bg-[#1c1b1b] border-outline-variant/10 p-4 font-serif text-2xl focus:ring-0 focus:border-secondary transition-all" placeholder="e.g. Villa Émeraude" />
                       {errors.title && <p className="text-red-500 text-[9px] uppercase tracking-widest">{errors.title.message}</p>}
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] uppercase tracking-widest text-outline">Reference ID</label>
                       <input {...register('ref_id')} className="w-full bg-[#f6f3ee] dark:bg-[#1c1b1b] border-outline-variant/10 p-4 text-sm focus:ring-0 focus:border-secondary transition-all uppercase tracking-widest" placeholder="REF-8841" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] uppercase tracking-widest text-outline">Acquisition Mode</label>
                       <div className="flex gap-2">
                          {['sale', 'rent'].map(m => (
                             <button
                                key={m}
                                type="button"
                                onClick={() => setValue('mode', m as any)}
                                className={clsx(
                                   "flex-1 py-3 px-4 border text-[10px] uppercase tracking-widest transition-all",
                                   watchedFields.mode === m ? "bg-secondary text-white border-secondary" : "border-outline-variant/20 text-outline hover:border-primary"
                                )}
                             >
                                {m === 'sale' ? 'For Sale' : 'Seasonal Rental'}
                             </button>
                          ))}
                       </div>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] uppercase tracking-widest text-outline">Property Category</label>
                       <select {...register('type')} className="w-full bg-[#f6f3ee] dark:bg-[#1c1b1b] border-outline-variant/10 p-4 text-xs uppercase tracking-widest focus:ring-0 focus:border-secondary transition-all">
                          <option value="Villa">Villa</option>
                          <option value="Penthouse">Penthouse</option>
                          <option value="Apartment">Apartment</option>
                          <option value="Estate">Historical Estate</option>
                       </select>
                    </div>
                    <div className="space-y-2 md:col-span-2 pt-4 border-t border-outline-variant/10 flex items-center gap-6">
                       <div className="flex items-center gap-3">
                          <input type="checkbox" {...register('featured')} className="w-5 h-5 text-secondary focus:ring-0 rounded-none bg-transparent border-outline-variant/30" />
                          <label className="text-[10px] uppercase tracking-widest text-primary font-bold">Featured Selection</label>
                       </div>
                       <p className="text-[9px] text-outline italic uppercase tracking-widest opacity-60">Highlight this asset on the primary landing page.</p>
                    </div>
                    <div className="space-y-2 md:col-span-2">
                       <label className="text-[10px] uppercase tracking-widest text-outline">Short Summary</label>
                       <textarea {...register('description_short')} rows={3} className="w-full bg-[#f6f3ee] dark:bg-[#1c1b1b] border-outline-variant/10 p-4 text-sm leading-relaxed focus:ring-0 focus:border-secondary transition-all resize-none" placeholder="A brief teaser for the property lists..." />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                       <label className="text-[10px] uppercase tracking-widest text-outline">Full Narrative</label>
                       <textarea {...register('description_long')} rows={8} className="w-full bg-[#f6f3ee] dark:bg-[#1c1b1b] border-outline-variant/10 p-4 text-sm leading-relaxed focus:ring-0 focus:border-secondary transition-all resize-none font-serif" placeholder="Tell the story of this exceptional residence..." />
                    </div>
                 </div>
              </FormSection>

              {/* B. Location */}
              <FormSection title="Location" subtitle="Geographic positioning and map privacy" icon="location_on">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                       <label className="text-[10px] uppercase tracking-widest text-outline">Country</label>
                       <input {...register('country')} className="w-full bg-[#f6f3ee] dark:bg-[#1c1b1b] border-outline-variant/10 p-4 text-sm" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] uppercase tracking-widest text-outline">City / Commune</label>
                       <input {...register('city')} className="w-full bg-[#f6f3ee] dark:bg-[#1c1b1b] border-outline-variant/10 p-4 text-sm" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] uppercase tracking-widest text-outline">District / Neighborhood</label>
                       <input {...register('district')} className="w-full bg-[#f6f3ee] dark:bg-[#1c1b1b] border-outline-variant/10 p-4 text-sm" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] uppercase tracking-widest text-outline">Postal Code</label>
                       <input {...register('postal_code')} className="w-full bg-[#f6f3ee] dark:bg-[#1c1b1b] border-outline-variant/10 p-4 text-sm" />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                       <label className="text-[10px] uppercase tracking-widest text-outline">Full Address</label>
                       <input {...register('address')} className="w-full bg-[#f6f3ee] dark:bg-[#1c1b1b] border-outline-variant/10 p-4 text-sm" />
                    </div>
                    <div className="grid grid-cols-2 gap-4 md:col-span-2">
                       <div className="space-y-2">
                          <label className="text-[10px] uppercase tracking-widest text-outline">Latitude</label>
                          <input type="number" step="any" {...register('latitude', { valueAsNumber: true })} className="w-full bg-[#f6f3ee] dark:bg-[#1c1b1b] border-outline-variant/10 p-4 text-sm" />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] uppercase tracking-widest text-outline">Longitude</label>
                          <input type="number" step="any" {...register('longitude', { valueAsNumber: true })} className="w-full bg-[#f6f3ee] dark:bg-[#1c1b1b] border-outline-variant/10 p-4 text-sm" />
                       </div>
                    </div>
                    <div className="space-y-2 md:col-span-2 pt-4 border-t border-outline-variant/10">
                       <div className="flex items-center gap-3">
                          <input type="checkbox" {...register('hide_map')} className="w-5 h-5 text-secondary focus:ring-0 rounded-none bg-transparent border-outline-variant/30" />
                          <label className="text-[10px] uppercase tracking-widest text-primary font-bold">Hide Exact Location from Public</label>
                       </div>
                    </div>
                 </div>
              </FormSection>

              {/* C. Pricing */}
              <FormSection title="Pricing & Financials" subtitle="Valuation and recurring fiscal obligations" icon="payments">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2 pt-4 md:col-span-2 border-b border-outline-variant/10 pb-6">
                       <div className="flex items-center gap-3">
                          <input type="checkbox" {...register('price_on_request')} className="w-5 h-5 text-secondary focus:ring-0 rounded-none bg-transparent border-outline-variant/30" />
                          <label className="text-[10px] uppercase tracking-widest text-primary font-bold">Price on Request (Confidential Valuation)</label>
                       </div>
                    </div>
                    {!watchedFields.price_on_request && (
                       <>
                          <div className="space-y-2">
                             <label className="text-[10px] uppercase tracking-widest text-outline">Valuation Amount</label>
                             <div className="relative">
                                <input type="number" {...register('price', { valueAsNumber: true })} className="w-full bg-[#f6f3ee] dark:bg-[#1c1b1b] border-outline-variant/10 p-4 text-xl font-bold pl-12" />
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-outline font-bold">€</span>
                             </div>
                          </div>
                          <div className="space-y-2">
                             <label className="text-[10px] uppercase tracking-widest text-outline">Currency</label>
                             <input {...register('currency')} className="w-full bg-[#f6f3ee] dark:bg-[#1c1b1b] border-outline-variant/10 p-4 text-sm uppercase tracking-widest" />
                          </div>
                       </>
                    )}
                    <div className="space-y-2">
                       <label className="text-[10px] uppercase tracking-widest text-outline">Property Tax (Annual)</label>
                       <input type="number" {...register('property_tax', { valueAsNumber: true })} className="w-full bg-[#f6f3ee] dark:bg-[#1c1b1b] border-outline-variant/10 p-4 text-sm" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] uppercase tracking-widest text-outline">Charges / HOA Fees</label>
                       <input type="number" {...register('charges', { valueAsNumber: true })} className="w-full bg-[#f6f3ee] dark:bg-[#1c1b1b] border-outline-variant/10 p-4 text-sm" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] uppercase tracking-widest text-outline">Availability Date</label>
                       <input type="date" {...register('availability_date')} className="w-full bg-[#f6f3ee] dark:bg-[#1c1b1b] border-outline-variant/10 p-4 text-sm" />
                    </div>
                 </div>
              </FormSection>

              {/* D. Property Details */}
              <FormSection title="Property Details" subtitle="Technical metrics and architectural style" icon="architecture">
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {[
                       { name: 'rooms', label: 'Rooms', icon: 'grid_view' },
                       { name: 'bedrooms', label: 'Bedrooms', icon: 'bed' },
                       { name: 'bathrooms', label: 'Bathrooms', icon: 'bathtub' },
                       { name: 'levels', label: 'Levels', icon: 'layers' },
                    ].map(field => (
                       <div key={field.name} className="space-y-2">
                          <label className="text-[9px] uppercase tracking-widest text-outline flex items-center gap-2">
                             <span className="material-symbols-outlined notranslate text-xs" translate="no">{field.icon}</span>
                             {field.label}
                          </label>
                          <input type="number" {...register(field.name as any, { valueAsNumber: true })} className="w-full bg-[#f6f3ee] dark:bg-[#1c1b1b] border-outline-variant/10 p-3 text-sm" />
                       </div>
                    ))}
                 </div>
                 <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-8 border-t border-outline-variant/10">
                    {[
                       { name: 'interior_area', label: 'Interior Area (m²)', icon: 'square_foot' },
                       { name: 'surface', label: 'Total Surface (m²)', icon: 'zoom_out_map' },
                       { name: 'land_surface', label: 'Land Size (m²)', icon: 'landscape' },
                       { name: 'terrace_surface', label: 'Terrace (m²)', icon: 'deck' },
                       { name: 'balcony_surface', label: 'Balcony (m²)', icon: 'balcony' },
                       { name: 'garage', label: 'Garage / Parking', icon: 'directions_car' },
                    ].map(field => (
                       <div key={field.name} className="space-y-2">
                          <label className="text-[9px] uppercase tracking-widest text-outline flex items-center gap-2">
                             <span className="material-symbols-outlined notranslate text-xs" translate="no">{field.icon}</span>
                             {field.label}
                          </label>
                          <input type="number" {...register(field.name as any, { valueAsNumber: true })} className="w-full bg-[#f6f3ee] dark:bg-[#1c1b1b] border-outline-variant/10 p-3 text-sm" />
                       </div>
                    ))}
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8 border-t border-outline-variant/10">
                    <div className="space-y-2">
                       <label className="text-[10px] uppercase tracking-widest text-outline">Exposure (Orientation)</label>
                       <input {...register('exposition')} className="w-full bg-[#f6f3ee] dark:bg-[#1c1b1b] border-outline-variant/10 p-4 text-sm" placeholder="e.g. South-West" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] uppercase tracking-widest text-outline">View Description</label>
                       <input {...register('vue')} className="w-full bg-[#f6f3ee] dark:bg-[#1c1b1b] border-outline-variant/10 p-4 text-sm" placeholder="e.g. Panoramic Sea View" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] uppercase tracking-widest text-outline">Condition</label>
                       <input {...register('condition')} className="w-full bg-[#f6f3ee] dark:bg-[#1c1b1b] border-outline-variant/10 p-4 text-sm" placeholder="e.g. Brand New" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] uppercase tracking-widest text-outline">Architectural Style</label>
                       <input {...register('style')} className="w-full bg-[#f6f3ee] dark:bg-[#1c1b1b] border-outline-variant/10 p-4 text-sm" placeholder="e.g. Contemporary" />
                    </div>
                 </div>
              </FormSection>

              {/* E. Technical / Energy */}
              <FormSection title="Technical & Energy" subtitle="Utility systems and environmental performance" icon="bolt">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                       <label className="text-[10px] uppercase tracking-widest text-outline">Heating Energy</label>
                       <input {...register('heating_energy')} className="w-full bg-[#f6f3ee] dark:bg-[#1c1b1b] border-outline-variant/10 p-4 text-sm" placeholder="e.g. Electricity" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] uppercase tracking-widest text-outline">Heating Type</label>
                       <input {...register('heating_type')} className="w-full bg-[#f6f3ee] dark:bg-[#1c1b1b] border-outline-variant/10 p-4 text-sm" placeholder="e.g. Air-conditioning" />
                    </div>
                    <div className="grid grid-cols-2 gap-6 md:col-span-2 border-y border-outline-variant/10 py-8">
                       <div className="space-y-4">
                          <label className="text-[10px] uppercase tracking-widest text-primary font-bold">Energy Performance (DPE)</label>
                          <div className="grid grid-cols-2 gap-4">
                             <div className="space-y-1">
                                <label className="text-[8px] uppercase tracking-widest text-outline">Class</label>
                                <select {...register('energy_class')} className="w-full bg-[#f6f3ee] dark:bg-[#1c1b1b] border-outline-variant/10 p-3 text-sm">
                                   <option value="">--</option>
                                   {['A', 'B', 'C', 'D', 'E', 'F', 'G'].map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                             </div>
                             <div className="space-y-1">
                                <label className="text-[8px] uppercase tracking-widest text-outline">Value (kWh/m²/y)</label>
                                <input type="number" {...register('energy_value', { valueAsNumber: true })} className="w-full bg-[#f6f3ee] dark:bg-[#1c1b1b] border-outline-variant/10 p-3 text-sm" />
                             </div>
                          </div>
                       </div>
                       <div className="space-y-4 border-l border-outline-variant/10 pl-6">
                          <label className="text-[10px] uppercase tracking-widest text-primary font-bold">Climate Emission (GES)</label>
                          <div className="grid grid-cols-2 gap-4">
                             <div className="space-y-1">
                                <label className="text-[8px] uppercase tracking-widest text-outline">Class</label>
                                <select {...register('climate_class')} className="w-full bg-[#f6f3ee] dark:bg-[#1c1b1b] border-outline-variant/10 p-3 text-sm">
                                   <option value="">--</option>
                                   {['A', 'B', 'C', 'D', 'E', 'F', 'G'].map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                             </div>
                             <div className="space-y-1">
                                <label className="text-[8px] uppercase tracking-widest text-outline">Value (kgCO²/m²/y)</label>
                                <input type="number" {...register('climate_value', { valueAsNumber: true })} className="w-full bg-[#f6f3ee] dark:bg-[#1c1b1b] border-outline-variant/10 p-3 text-sm" />
                             </div>
                          </div>
                       </div>
                    </div>
                    <div className="space-y-2 md:col-span-2">
                       <label className="text-[10px] uppercase tracking-widest text-outline">Estimated Annual Energy Cost</label>
                       <div className="grid grid-cols-2 gap-4">
                          <input type="number" {...register('annual_energy_min', { valueAsNumber: true })} placeholder="Min €" className="w-full bg-[#f6f3ee] dark:bg-[#1c1b1b] border-outline-variant/10 p-4 text-sm" />
                          <input type="number" {...register('annual_energy_max', { valueAsNumber: true })} placeholder="Max €" className="w-full bg-[#f6f3ee] dark:bg-[#1c1b1b] border-outline-variant/10 p-4 text-sm" />
                       </div>
                    </div>
                 </div>
              </FormSection>

              {/* F. Amenities */}
              <FormSection title="Amenities & Comfort" subtitle="Exclusive features and lifestyle amenities" icon="pool">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 pb-8 border-b border-outline-variant/10">
                    <div className="flex items-center justify-between p-4 bg-[#f6f3ee] dark:bg-[#1c1b1b] border border-outline-variant/10">
                       <div className="flex items-center gap-4">
                          <span className="material-symbols-outlined notranslate text-secondary" translate="no">pool</span>
                          <label className="text-[10px] uppercase tracking-widest text-primary font-bold">Swimming Pool</label>
                       </div>
                       <input type="checkbox" {...register('piscine')} className="w-5 h-5 text-secondary focus:ring-0 rounded-none bg-transparent border-outline-variant/30" />
                    </div>
                    <div className="flex items-center justify-between p-4 bg-[#f6f3ee] dark:bg-[#1c1b1b] border border-outline-variant/10">
                       <div className="flex items-center gap-4">
                          <span className="material-symbols-outlined notranslate text-secondary" translate="no">ac_unit</span>
                          <label className="text-[10px] uppercase tracking-widest text-primary font-bold">Air Conditioning</label>
                       </div>
                       <input type="checkbox" {...register('air_conditioning')} className="w-5 h-5 text-secondary focus:ring-0 rounded-none bg-transparent border-outline-variant/30" />
                    </div>
                 </div>
                 <AmenityPicker 
                    suggestions={LUXURY_AMENITIES} 
                    value={watchedFields.amenities || []}
                    onChange={(val) => setValue('amenities', val, { shouldValidate: true, shouldDirty: true })}
                 />
              </FormSection>

              {/* G. Media Upload */}
              <FormSection title="Media Orchestration" subtitle="Architectural photography and cinematic assets" icon="movie">
                 <MediaUploader 
                    files={mediaFiles} 
                    onChange={setMediaFiles}
                    onUpload={handleFileUpload}
                 />
                 <div className="pt-8 space-y-4">
                    <label className="text-[10px] uppercase tracking-widest text-outline">YouTube Cinematic Video ID</label>
                    <input {...register('youtube_id')} className="w-full bg-[#f6f3ee] dark:bg-[#1c1b1b] border-outline-variant/10 p-4 text-sm" placeholder="e.g. dQw4w9WgXcQ" />
                 </div>
              </FormSection>

              {/* H. Lead Access / Gated Content */}
              <FormSection title="Gated Intelligence" subtitle="Privacy controls and internal briefings" icon="lock">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                       {[
                          { name: 'gated_brochure', label: 'Gated Digital Brochure' },
                          { name: 'gated_dossier', label: 'Gated Technical Dossier' },
                          { name: 'gated_save', label: 'Require Registry to Save' },
                       ].map(gate => (
                          <div key={gate.name} className="flex items-center gap-4 py-3 border-b border-outline-variant/10">
                             <input type="checkbox" {...register(gate.name as any)} className="w-5 h-5 text-secondary focus:ring-0 rounded-none bg-transparent border-outline-variant/30" />
                             <label className="text-[10px] uppercase tracking-widest text-primary font-bold">{gate.label}</label>
                          </div>
                       ))}
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] uppercase tracking-widest text-outline">Internal Agent Notes</label>
                       <textarea {...register('agent_notes')} rows={6} className="w-full bg-[#f6f3ee] dark:bg-[#1c1b1b] border-outline-variant/10 p-4 text-sm italic opacity-80" placeholder="Confidential briefing for the operative team..." />
                    </div>
                 </div>
              </FormSection>

              {/* I. SEO */}
              <FormSection title="Global Reach (SEO)" subtitle="Search engine optimization and social metadata" icon="language">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2 md:col-span-2">
                       <label className="text-[10px] uppercase tracking-widest text-outline">Custom Slug (URI)</label>
                       <input {...register('slug')} className="w-full bg-[#f6f3ee] dark:bg-[#1c1b1b] border-outline-variant/10 p-4 text-sm" placeholder="villa-emeraude-cannes" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] uppercase tracking-widest text-outline">SEO Meta Title</label>
                       <input {...register('seo_title')} className="w-full bg-[#f6f3ee] dark:bg-[#1c1b1b] border-outline-variant/10 p-4 text-sm" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] uppercase tracking-widest text-outline">Open Graph Title</label>
                       <input {...register('og_title')} className="w-full bg-[#f6f3ee] dark:bg-[#1c1b1b] border-outline-variant/10 p-4 text-sm" />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                       <label className="text-[10px] uppercase tracking-widest text-outline">SEO Meta Description</label>
                       <textarea {...register('seo_description')} rows={3} className="w-full bg-[#f6f3ee] dark:bg-[#1c1b1b] border-outline-variant/10 p-4 text-sm" />
                    </div>
                 </div>
              </FormSection>

           </div>

           {/* Sticky Sidebar */}
           <div className="lg:col-span-4">
              <PublishSidebar 
                 score={completionScore}
                 status={watchedFields.status || 'available'}
                 onStatusChange={(s) => setValue('status', s)}
                 onSave={(mode) => handleSubmit((d: PropertyFormData) => onSubmit(d, mode))()}
                 onPreview={() => {}}
                 isValid={isValid}
                 errors={errors}
              />
              
              {/* Secondary Context Actions */}
              <div className="mt-8 space-y-4 opacity-60 hover:opacity-100 transition-opacity">
                 <button className="w-full flex items-center justify-between p-4 bg-white dark:bg-[#121212] border border-outline-variant/10 text-[9px] uppercase tracking-[0.2em] hover:bg-[#f6f3ee] transition-colors">
                    <span>Duplicate Dossier</span>
                    <span className="material-symbols-outlined notranslate text-xs" translate="no">content_copy</span>
                 </button>
                 <button className="w-full flex items-center justify-between p-4 bg-white dark:bg-[#121212] border border-outline-variant/10 text-[9px] uppercase tracking-[0.2em] hover:bg-[#f6f3ee] transition-colors">
                    <span>AI-Assisted Narrative</span>
                    <span className="material-symbols-outlined notranslate text-xs" translate="no">psychology</span>
                 </button>
                 <button className="w-full flex items-center justify-between p-4 bg-white dark:bg-[#121212] border border-outline-variant/10 text-[9px] uppercase tracking-[0.2em] hover:bg-[#f6f3ee] transition-colors">
                    <span>Import from PDF/Brochure</span>
                    <span className="material-symbols-outlined notranslate text-xs" translate="no">upload_file</span>
                 </button>
              </div>
           </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default PropertyEditor;
