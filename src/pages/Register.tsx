import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Layout } from '../components/layout/Layout';
import { Display, Headline, Body, Label } from '../components/ui/Typography';
import { Button } from '../components/ui/Button';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

const schema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(6, 'Phone is required'),
  address: z.string().min(5, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  postalCode: z.string().min(2, 'Postal code is required'),
  country: z.string().min(2, 'Country is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  consent: z.literal(true),
});

type FormData = z.infer<typeof schema>;

const Register = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      });

      if (authError) throw authError;

      if (authData.user) {
        const { error: profileError } = await supabase.from('profiles').insert({
          id: authData.user.id,
          first_name: data.firstName,
          last_name: data.lastName,
          phone: data.phone,
          address: data.address,
          city: data.city,
          postal_code: data.postalCode,
          country: data.country,
          role: 'user',
        });

        if (profileError) throw profileError;
        navigate('/dashboard');
      }
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <main className="flex-grow grid grid-cols-1 md:grid-cols-2 min-h-screen animate-luxury-fade font-body">
      {/* Left Side: Form */}
      <div className="flex flex-col justify-center px-8 md:px-16 lg:px-24 py-12 md:py-0 bg-surface z-10 relative">
        <div className="max-w-md w-full mx-auto">
          <div className="mb-12">
            <h1 
              onClick={() => navigate('/')}
              className="font-headline italic text-2xl tracking-tighter text-primary mb-8 cursor-pointer"
            >
              CanneImmoLuxe
            </h1>
            <h2 className="font-headline text-4xl text-primary mb-4 leading-tight">
              The Art of Living. <br/>
              <span className="text-secondary italic">Exclusive Access.</span>
            </h2>
            <p className="text-sm text-on-surface-variant tracking-wide leading-relaxed">
              Create your private account to access full listing details and exclusive opportunities on the French Riviera.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Name Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="relative">
                <label className="block font-label text-[10px] tracking-[0.1em] uppercase text-outline mb-2">First Name</label>
                <input 
                  {...register('firstName')}
                  className="w-full bg-transparent border-0 border-b border-outline-variant/30 focus:border-primary focus:ring-0 px-0 pb-2 text-sm text-primary transition-all" 
                  placeholder="Jean" 
                />
                {errors.firstName && <span className="text-[10px] text-red-500 mt-1">{errors.firstName.message}</span>}
              </div>
              <div className="relative">
                <label className="block font-label text-[10px] tracking-[0.1em] uppercase text-outline mb-2">Last Name</label>
                <input 
                  {...register('lastName')}
                  className="w-full bg-transparent border-0 border-b border-outline-variant/30 focus:border-primary focus:ring-0 px-0 pb-2 text-sm text-primary transition-all" 
                  placeholder="Dupont" 
                />
                {errors.lastName && <span className="text-[10px] text-red-500 mt-1">{errors.lastName.message}</span>}
              </div>
            </div>

            {/* Email & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="relative">
                <label className="block font-label text-[10px] tracking-[0.1em] uppercase text-outline mb-2">Email Address</label>
                <input 
                  {...register('email')}
                  className="w-full bg-transparent border-0 border-b border-outline-variant/30 focus:border-primary focus:ring-0 px-0 pb-2 text-sm text-primary transition-all" 
                  placeholder="jean@example.com" 
                />
                {errors.email && <span className="text-[10px] text-red-500 mt-1">{errors.email.message}</span>}
              </div>
              <div className="relative">
                <label className="block font-label text-[10px] tracking-[0.1em] uppercase text-outline mb-2">Phone Number</label>
                <input 
                  {...register('phone')}
                  className="w-full bg-transparent border-0 border-b border-outline-variant/30 focus:border-primary focus:ring-0 px-0 pb-2 text-sm text-primary transition-all" 
                  placeholder="+33 6 12 34 56 78" 
                />
                {errors.phone && <span className="text-[10px] text-red-500 mt-1">{errors.phone.message}</span>}
              </div>
            </div>

            {/* Address */}
            <div className="relative">
              <label className="block font-label text-[10px] tracking-[0.1em] uppercase text-outline mb-2">Street Address</label>
              <input 
                {...register('address')}
                className="w-full bg-transparent border-0 border-b border-outline-variant/30 focus:border-primary focus:ring-0 px-0 pb-2 text-sm text-primary transition-all" 
                placeholder="123 Avenue de la Croisette" 
              />
              {errors.address && <span className="text-[10px] text-red-500 mt-1">{errors.address.message}</span>}
            </div>

            {/* City & Country */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              <div className="relative col-span-1">
                <label className="block font-label text-[10px] tracking-[0.1em] uppercase text-outline mb-2">City</label>
                <input 
                  {...register('city')}
                  className="w-full bg-transparent border-0 border-b border-outline-variant/30 focus:border-primary focus:ring-0 px-0 pb-2 text-sm text-primary transition-all" 
                  placeholder="Cannes" 
                />
                {errors.city && <span className="text-[10px] text-red-500 mt-1">{errors.city.message}</span>}
              </div>
              <div className="relative col-span-1">
                <label className="block font-label text-[10px] tracking-[0.1em] uppercase text-outline mb-2">Postcode</label>
                <input 
                  {...register('postalCode')}
                  className="w-full bg-transparent border-0 border-b border-outline-variant/30 focus:border-primary focus:ring-0 px-0 pb-2 text-sm text-primary transition-all" 
                  placeholder="06400" 
                />
                {errors.postalCode && <span className="text-[10px] text-red-500 mt-1">{errors.postalCode.message}</span>}
              </div>
              <div className="relative col-span-1">
                <label className="block font-label text-[10px] tracking-[0.1em] uppercase text-outline mb-2">Country</label>
                <input 
                  {...register('country')}
                  className="w-full bg-transparent border-0 border-b border-outline-variant/30 focus:border-primary focus:ring-0 px-0 pb-2 text-sm text-primary transition-all" 
                  placeholder="France" 
                />
                {errors.country && <span className="text-[10px] text-red-500 mt-1">{errors.country.message}</span>}
              </div>
            </div>

            {/* Password */}
            <div className="relative">
              <label className="block font-label text-[10px] tracking-[0.1em] uppercase text-outline mb-2">Create Password</label>
              <input 
                {...register('password')}
                type="password"
                className="w-full bg-transparent border-0 border-b border-outline-variant/30 focus:border-primary focus:ring-0 px-0 pb-2 text-sm text-primary transition-all" 
                placeholder="••••••••" 
              />
              {errors.password && <span className="text-[10px] text-red-500 mt-1">{errors.password.message}</span>}
            </div>

            {/* Consent checkbox */}
            <div className="space-y-4">
              <label className="flex items-start gap-4 cursor-pointer group">
                <input 
                  {...register('consent')}
                  type="checkbox" 
                  className="mt-1 w-4 h-4 text-primary border-outline-variant/50 focus:ring-primary rounded-none bg-transparent" 
                />
                <span className="text-[10px] leading-relaxed text-on-surface-variant/70 uppercase tracking-wider group-hover:text-primary transition-colors">
                  I consent to the processing of my personal data for the purpose of receiving exclusive property offers and private updates.
                </span>
              </label>
              {errors.consent && <span className="text-[10px] text-red-500 block">{errors.consent.message}</span>}
            </div>

            {/* Submit Action */}
            <div className="pt-4 flex flex-col items-start gap-6">
              <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto min-w-[200px]">
                {isSubmitting ? 'Processing...' : 'Request Access'}
              </Button>
              <p className="text-xs text-on-surface-variant opacity-70">
                Already a member? <a href="/login" className="text-primary hover:text-secondary border-b border-primary hover:border-secondary transition-colors pb-0.5">Sign in here</a>
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* Right Side: Editorial Image */}
      <div className="hidden md:block relative h-screen bg-surface-container-low overflow-hidden">
        <img 
          alt="Gated Access" 
          className="absolute inset-0 w-full h-full object-cover object-center opacity-90 transition-transform duration-[10s] hover:scale-110" 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCbgE8XzWI5jMLoUgmUMfXDCCGLCXElyRB55A0xrusX9F3Tjxh8dcZ30A9LpOKw1NQ2a8AdjpMD9Ht72XayBK7LSfgi6Lyy8EPuYp1bdxkufJSHftsQNLbrTTyXMZKtKbhxXQ_nwXVx9DBkSL3VcnfmBBOEPISwARX0j4-aOq_1-rnsneheH2GPbvXzjbCdtc4WZ2Nq7fUIrkzsTXIlxvjhZxi_S6LQf-_u0DE6UyK-ZE0E25_8Xfh6dNYRjrGc56ArvR7b70iO048" 
        />
        <div className="absolute inset-0 bg-primary/20 pointer-events-none"></div>
        {/* Glassmorphism overlay for trust badge */}
        <div className="absolute bottom-16 right-16 luxury-glass p-8 max-w-sm border border-white/10 shadow-2xl">
          <span className="material-symbols-outlined text-secondary text-3xl mb-4 block" style={{ fontVariationSettings: "'FILL' 1" }}>
            vpn_key
          </span>
          <p className="font-headline text-lg text-white mb-2">Private Portfolio</p>
          <p className="text-xs text-white/70 leading-relaxed">
            Our most exclusive off-market properties are reserved for verified clientele. Registration ensures confidentiality for both buyers and sellers across the French Riviera.
          </p>
        </div>
      </div>
    </main>
  );
};

export default Register;
