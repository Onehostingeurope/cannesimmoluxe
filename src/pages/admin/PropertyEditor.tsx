import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { Button } from '../../components/ui/Button';
import { supabase } from '../../lib/supabase';
import { clsx } from 'clsx';

const propertySchema = z.object({
  title: z.string().min(3, 'Title is required'),
  ref_id: z.string().min(2, 'Reference ID is required'),
  type: z.string().min(2, 'Asset type is required'),
  mode: z.enum(['sale', 'rent']),
  status: z.enum(['available', 'reserved', 'sold', 'highlight']),
  city: z.string().min(2, 'City is required'),
  district: z.string().optional(),
  price: z.number().nullable().optional(),
  price_on_request: z.boolean().default(false),
  surface: z.number().nullable().optional(),
  land_surface: z.number().nullable().optional(),
  rooms: z.number().nullable().optional(),
  bedrooms: z.number().nullable().optional(),
  bathrooms: z.number().nullable().optional(),
  description_short: z.string().nullable().optional(),
  description_long: z.string().nullable().optional(),
  dpe: z.string().nullable().optional(),
  youtube_id: z.string().nullable().optional(),
});

type PropertyFormData = z.infer<typeof propertySchema>;

const PropertyEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  const [loading, setLoading] = useState(isEdit ? true : false);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [crmLeads, setCrmLeads] = useState<any[]>([]);
  const [assignedLeadId, setAssignedLeadId] = useState<string>('');

  const { register, handleSubmit, reset, watch, setValue, formState: { errors, isSubmitting } } = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      mode: 'sale',
      status: 'available',
      price_on_request: false,
    }
  });

  const priceOnRequest = watch('price_on_request');

  useEffect(() => {
    const orchestrateLeads = async () => {
      const { data } = await supabase.from('inquiries').select('id, tracking_data, created_at').order('created_at', { ascending: false });
      if (data) {
        const mgmtLeads = data.filter(lead => 
          lead.tracking_data?.category === 'Management' || 
          lead.tracking_data?.category === 'Real Estate'
        );
        setCrmLeads(mgmtLeads);
      }
    };
    orchestrateLeads();

    if (isEdit) {
      fetchProperty();
    }
  }, [id]);

  const fetchProperty = async () => {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching property:', error);
      navigate('/admin/properties');
    } else {
      reset({
        title: data.title,
        ref_id: data.ref_id,
        type: data.type,
        mode: data.mode,
        status: data.status,
        city: data.city,
        district: data.district || '',
        price: data.price,
        price_on_request: data.price_on_request,
        surface: data.surface,
        land_surface: data.land_surface,
        rooms: data.rooms,
        bedrooms: data.bedrooms,
        bathrooms: data.bathrooms,
        description_short: data.description_short,
        description_long: data.description_long,
        dpe: data.dpe,
        youtube_id: data.youtube_id,
      });
      setImageUrls(data.images || []);
      
      const { data: leadReq } = await supabase.from('inquiries').select('id').eq('property_id', id).maybeSingle();
      if (leadReq && leadReq.id) {
         setAssignedLeadId(leadReq.id);
      }
      
      setLoading(false);
    }
  };

  const onSubmit = async (values: PropertyFormData) => {
    const slug = values.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    const propertyData = {
      ...values,
      slug,
      images: imageUrls,
      updated_at: new Date().toISOString(),
    };

    let targetPropertyId = id;
    let error;
    if (isEdit) {
      const { error: updateError } = await supabase
        .from('properties')
        .update(propertyData)
        .eq('id', id);
      error = updateError;
    } else {
      const { error: insertError, data: insertData } = await supabase
        .from('properties')
        .insert([propertyData])
        .select()
        .single();
      error = insertError;
      if (insertData) targetPropertyId = insertData.id;
    }

    if (error) {
      alert('Error saving property: ' + error.message);
    } else {
      if (assignedLeadId && targetPropertyId) {
         await supabase.from('inquiries').update({ property_id: targetPropertyId }).eq('id', assignedLeadId);
      }
      navigate('/admin/properties');
    }
  };

  const addImage = () => {
    if (newImageUrl && !imageUrls.includes(newImageUrl)) {
      setImageUrls([...imageUrls, newImageUrl]);
      setNewImageUrl('');
    }
  };

  const removeImage = (url: string) => {
    setImageUrls(imageUrls.filter(u => u !== url));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_DIM = 1200;
        let width = img.width;
        let height = img.height;

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
        setImageUrls(prev => [...prev, dataUrl]);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  if (loading) {
    return (
      <AdminLayout>
         <div className="min-h-[400px] flex items-center justify-center">
            <div className="w-12 h-12 border-t-2 border-secondary animate-spin rounded-full"></div>
         </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto space-y-12 animate-luxury-fade font-body pb-24">
        <div className="flex justify-between items-end border-b border-outline-variant/20 pb-8">
           <div className="space-y-4">
              <div className="flex items-center gap-3">
                 <span className="material-symbols-outlined text-secondary text-base">edit_square</span>
                 <p className="font-label text-[10px] tracking-[0.2em] uppercase text-outline">Technical Dossier Editor</p>
              </div>
              <h2 className="font-headline text-4xl text-primary">{isEdit ? 'Refine Asset' : 'Deploy New Estate'}</h2>
           </div>
           <div className="flex gap-4">
              <Button variant="ghost" onClick={() => navigate('/admin/properties')}>Cancel</Button>
              <Button 
                variant="primary" 
                onClick={(e) => {
                  e.preventDefault();
                  handleSubmit(onSubmit as any)();
                }}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Processing...' : isEdit ? 'Update Entry' : 'Publish Asset'}
              </Button>
           </div>
        </div>

        <form className="grid grid-cols-1 md:grid-cols-2 gap-12">
           {/* Section 1: Identification */}
           <div className="space-y-8">
              <h3 className="font-label text-[10px] tracking-[0.3em] uppercase text-secondary font-bold border-l-2 border-secondary pl-4">Identification Matrix</h3>
              
              <div className="space-y-6">
                 <div className="space-y-2">
                    <label className="font-label text-[9px] tracking-widest uppercase text-outline opacity-60">Property Title</label>
                    <input {...register('title')} className="w-full bg-[#f6f3ee] dark:bg-[#1c1b1b] border-outline-variant/20 focus:border-secondary focus:ring-0 p-4 font-headline text-xl text-primary" />
                    {errors.title && <p className="text-red-500 text-[9px] uppercase tracking-widest">{(errors.title as any).message}</p>}
                 </div>

                 <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="font-label text-[9px] tracking-widest uppercase text-outline opacity-60">Reference ID</label>
                       <input {...register('ref_id')} placeholder="REF-XXXX" className="w-full bg-[#f6f3ee] dark:bg-[#1c1b1b] border-outline-variant/20 p-4 font-label text-[10px] tracking-widest uppercase" />
                    </div>
                    <div className="space-y-2">
                       <label className="font-label text-[9px] tracking-widest uppercase text-outline opacity-60">Asset Type</label>
                       <input {...register('type')} placeholder="Villa, Penthouse, etc." className="w-full bg-[#f6f3ee] dark:bg-[#1c1b1b] border-outline-variant/20 p-4 font-label text-[10px] tracking-widest uppercase" />
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="font-label text-[9px] tracking-widest uppercase text-outline opacity-60">Listing Mode</label>
                       <select {...register('mode')} className="w-full bg-[#f6f3ee] dark:bg-[#1c1b1b] border-outline-variant/20 p-4 font-label text-[10px] tracking-widest uppercase">
                          <option value="sale">For Sale</option>
                          <option value="rent">Seasonal Rental</option>
                       </select>
                    </div>
                    <div className="space-y-2">
                       <label className="font-label text-[9px] tracking-widest uppercase text-outline opacity-60">Market Status</label>
                       <select {...register('status')} className="w-full bg-[#f6f3ee] dark:bg-[#1c1b1b] border-outline-variant/20 p-4 font-label text-[10px] tracking-widest uppercase">
                          <option value="available">Available</option>
                          <option value="highlight">Exclusive Highlight</option>
                          <option value="off-market">Off-Market (Confidential)</option>
                          <option value="reserved">Reserved</option>
                          <option value="sold">Decommissioned (Sold)</option>
                       </select>
                    </div>
                 </div>

                 <div className="space-y-2 pt-4 border-t border-outline-variant/10">
                     <label className="font-label text-[9px] tracking-widest uppercase text-outline opacity-60 flex items-center gap-2">
                       <span className="material-symbols-outlined text-xs text-secondary">diversity_3</span>
                       CRM Owner / Lead Association
                     </label>
                     <select 
                        value={assignedLeadId}
                        onChange={(e) => setAssignedLeadId(e.target.value)}
                        className="w-full bg-[#f6f3ee] dark:bg-[#1c1b1b] border-outline-variant/20 p-4 font-label text-[10px] tracking-widest uppercase cursor-pointer text-primary"
                     >
                        <option value="">-- NO OWNER ASSOCIATED --</option>
                        {crmLeads.map(lead => (
                           <option key={lead.id} value={lead.id}>
                              {lead.tracking_data?.first_name || lead.tracking_data?.firstName} {lead.tracking_data?.last_name || lead.tracking_data?.lastName} — [{lead.tracking_data?.category || 'Legacy'}]
                           </option>
                        ))}
                     </select>
                  </div>
              </div>
           </div>

           {/* Section 2: Financials & Location */}
           <div className="space-y-8">
              <h3 className="font-label text-[10px] tracking-[0.3em] uppercase text-secondary font-bold border-l-2 border-secondary pl-4">Financials & Geometry</h3>
              
              <div className="space-y-6">
                 <div className="flex items-center gap-4 py-2 border-b border-outline-variant/10">
                    <input type="checkbox" {...register('price_on_request')} className="w-4 h-4 text-secondary focus:ring-0" />
                    <label className="font-label text-[10px] tracking-widest uppercase text-primary">Conceal Price (On Request)</label>
                 </div>

                 {!priceOnRequest && (
                    <div className="space-y-2">
                       <label className="font-label text-[9px] tracking-widest uppercase text-outline opacity-60">Valuation (€)</label>
                       <input 
                         type="number" 
                         {...register('price', { valueAsNumber: true })} 
                         className="w-full bg-[#f6f3ee] dark:bg-[#1c1b1b] border-outline-variant/20 p-4 font-headline text-2xl text-primary" 
                       />
                    </div>
                 )}

                 <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="font-label text-[9px] tracking-widest uppercase text-outline opacity-60">City / Commune</label>
                       <input {...register('city')} className="w-full bg-[#f6f3ee] dark:bg-[#1c1b1b] border-outline-variant/20 p-4 font-label text-[10px] tracking-widest uppercase" />
                    </div>
                    <div className="space-y-2">
                       <label className="font-label text-[9px] tracking-widest uppercase text-outline opacity-60">District / Quarter</label>
                       <input {...register('district')} className="w-full bg-[#f6f3ee] dark:bg-[#1c1b1b] border-outline-variant/20 p-4 font-label text-[10px] tracking-widest uppercase" />
                    </div>
                 </div>
              </div>
           </div>

           {/* Section 3: Technical Specifications */}
           <div className="space-y-8">
              <h3 className="font-label text-[10px] tracking-[0.3em] uppercase text-secondary font-bold border-l-2 border-secondary pl-4">Technical Specifications</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                 {[
                   { id: 'surface', label: 'Living Space (m²)', icon: 'straighten' },
                   { id: 'land_surface', label: 'Plot Size (m²)', icon: 'landscape' },
                   { id: 'rooms', label: 'Total Rooms', icon: 'apps' },
                   { id: 'bedrooms', label: 'Bedrooms', icon: 'bed' },
                   { id: 'bathrooms', label: 'Bathrooms', icon: 'bathtub' },
                 ].map((spec) => (
                   <div key={spec.id} className="space-y-2">
                      <label className="font-label text-[9px] tracking-widest uppercase text-outline opacity-60 flex items-center gap-2">
                         <span className="material-symbols-outlined text-xs">{spec.icon}</span>
                         {spec.label}
                      </label>
                      <input 
                        type="number" 
                        {...register(spec.id as any, { valueAsNumber: true })} 
                        className="w-full bg-[#f6f3ee] dark:bg-[#1c1b1b] border-outline-variant/20 p-4 font-label text-[11px]" 
                      />
                   </div>
                 ))}
                 <div className="space-y-2">
                    <label className="font-label text-[9px] tracking-widest uppercase text-outline opacity-60 flex items-center gap-2">
                       <span className="material-symbols-outlined text-xs">energy_savings_leaf</span>
                       DPE Rating
                    </label>
                    <select {...register('dpe')} className="w-full bg-[#f6f3ee] dark:bg-[#1c1b1b] border-outline-variant/20 p-4 font-label text-[11px]">
                       <option value="">Undefined</option>
                       <option value="A">A - Exceptional</option>
                       <option value="B">B - Excellent</option>
                       <option value="C">C - Good</option>
                       <option value="D">D - Average</option>
                       <option value="E">E - Poor</option>
                       <option value="F">F - Very Poor</option>
                       <option value="G">G - Extremely Poor</option>
                    </select>
                 </div>
              </div>
           </div>

           {/* Section 4: Media Orchestration */}
           <div className="space-y-8">
              <h3 className="font-label text-[10px] tracking-[0.3em] uppercase text-secondary font-bold border-l-2 border-secondary pl-4">Media Orchestration</h3>
              <div className="space-y-4">
                 <div className="space-y-2">
                    <label className="font-label text-[9px] tracking-widest uppercase text-outline opacity-60">YouTube Cinematic Video ID (Optional)</label>
                    <input {...register('youtube_id')} placeholder="e.g. dQw4w9WgXcQ" className="w-full bg-[#f6f3ee] dark:bg-[#1c1b1b] border-outline-variant/20 p-4 font-label text-[10px]" />
                    <p className="text-[10px] text-outline opacity-50">Upload your massive hero videos exclusively to YouTube and paste the ID here.</p>
                 </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-outline-variant/10">
                 <label className="font-label text-[9px] tracking-widest uppercase text-outline opacity-60">Architectural Photography Library (Base64 Injection)</label>
                 <div className="flex gap-4 items-center">
                    <div className="relative overflow-hidden inline-block group">
                       <Button variant="secondary" type="button" className="px-8 whitespace-nowrap group-hover:bg-secondary/90">
                          <span className="material-symbols-outlined text-sm mr-2 align-middle">cloud_upload</span> Upload Local Image
                       </Button>
                       <input 
                         type="file" 
                         accept="image/*" 
                         className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                         onChange={handleFileUpload}
                       />
                    </div>
                    <p className="text-[10px] uppercase tracking-widest text-outline">OR</p>
                    <input 
                      value={newImageUrl}
                      onChange={(e) => setNewImageUrl(e.target.value)}
                      placeholder="ENTER ASSET URL..." 
                      className="flex-grow bg-[#f6f3ee] dark:bg-[#1c1b1b] border-outline-variant/20 p-4 font-label text-[9px] tracking-widest uppercase" 
                    />
                    <Button variant="secondary" onClick={addImage} type="button">Add</Button>
                 </div>
                 <div className="grid grid-cols-4 gap-4 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                    {imageUrls.map((url, index) => (
                       <div key={index} className="relative group aspect-square border border-outline-variant/20">
                          <img src={url} className="w-full h-full object-cover" alt="Property asset" />
                          <button 
                            type="button"
                            onClick={() => removeImage(url)}
                            className="absolute inset-0 bg-red-500/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                             <span className="material-symbols-outlined text-sm">delete</span>
                          </button>
                       </div>
                    ))}
                 </div>
              </div>
           </div>

           {/* Section 5: Editorial Content */}
           <div className="md:col-span-2 space-y-8">
              <h3 className="font-label text-[10px] tracking-[0.3em] uppercase text-secondary font-bold border-l-2 border-secondary pl-4">Editorial Narrative</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                 <div className="space-y-4">
                    <label className="font-label text-[9px] tracking-widest uppercase text-outline opacity-60">Short Abstract (Curated Teaser)</label>
                    <textarea 
                      {...register('description_short')}
                      className="w-full bg-[#f6f3ee] dark:bg-[#1c1b1b] border-outline-variant/20 p-6 font-body text-sm leading-relaxed resize-none h-32" 
                    />
                 </div>
                 <div className="space-y-4">
                    <label className="font-label text-[9px] tracking-widest uppercase text-outline opacity-60">The Full Narrative (Detailed Dossier)</label>
                    <textarea 
                      {...register('description_long')}
                      className="w-full bg-[#f6f3ee] dark:bg-[#1c1b1b] border-outline-variant/20 p-6 font-body text-sm leading-relaxed resize-none h-32" 
                    />
                 </div>
              </div>
           </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default PropertyEditor;
