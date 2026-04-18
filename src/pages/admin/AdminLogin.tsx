import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Layout } from '../../components/layout/Layout';
import { Button } from '../../components/ui/Button';
import { supabase } from '../../lib/supabase';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck, Lock, ArrowRight, Info } from 'lucide-react';

const schema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

type FormData = z.infer<typeof schema>;

const AdminLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [authError, setAuthError] = useState<string | null>(location.state?.error || null);
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setAuthError(null);
    try {
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) throw error;

      // Double check if user is admin
      if (authData.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', authData.user.id)
          .single();

        if (profile?.role !== 'admin') {
          await supabase.auth.signOut();
          throw new Error('Verification Failed: Account lacks administrative clearance.');
        }
        
        navigate('/admin');
      }
    } catch (error: any) {
      setAuthError(error.message);
    }
  };

  return (
    <Layout>
      <main className="min-h-screen flex items-center justify-center bg-[#0a0a0a] relative overflow-hidden font-body">
        {/* Cinematic Backdrop */}
        <div className="absolute inset-0 z-0">
          <img 
            alt="The Curator's Desk" 
            className="w-full h-full object-cover opacity-30 grayscale mix-blend-luminosity" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAYF_5t-fV2gM_7c3mS6qZ_R8N5V3uDX8Z5vF3Tjxh8dcZ30A9LpOKw1NQ2a8AdjpMD9Ht72XayBK7LSfgi6Lyy8EPuYp1bdxkufJSHftsQNLbrTTyXMZKtKbhxXQ_nwXVx9DBkSL3VcnfmBBOEPISwARX0j4-aOq_1-rnsneheH2GPbvXzjbCdtc4WZ2Nq7fUIrkzsTXIlxvjhZxi_S6LQf-_u0DE6UyK-ZE0E25_8Xfh6dNYRjrGc56ArvR7b70iO048" 
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/90"></div>
        </div>

        {/* Login Container */}
        <div className="relative z-10 w-full max-w-[1000px] grid grid-cols-1 md:grid-cols-2 luxury-glass border border-white/10 shadow-3xl overflow-hidden animate-luxury-fade">
          
          {/* Left: Administrative Branding */}
          <section className="bg-black/40 p-12 lg:p-16 flex flex-col justify-between border-r border-white/5">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-3 bg-luxury-gold/10 px-4 py-2 border border-luxury-gold/20">
                <ShieldCheck className="w-4 h-4 text-luxury-gold" />
                <span className="font-label text-[10px] tracking-[0.3em] uppercase text-luxury-gold">Secure Infrastructure</span>
              </div>
              <div className="space-y-4">
                <h1 className="font-serif text-5xl lg:text-6xl text-white leading-tight">
                  Executive <br/>
                  <span className="italic text-luxury-gold">Orchestration.</span>
                </h1>
                <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
                  Welcome to the CannesImmo Luxe "Digital Curator" panel. Verify your identity to manage the Riviera's most distinguished ledger.
                </p>
              </div>
            </div>

            <div className="pt-12 border-t border-white/10">
              <p className="font-label text-[9px] tracking-[0.4em] uppercase text-gray-500 mb-2">Protocol Status</p>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-[10px] text-white/50 tracking-wider uppercase">Systems Operational</span>
              </div>
            </div>
          </section>

          {/* Right: Validation Form */}
          <section className="p-12 lg:p-16 flex flex-col justify-center bg-white/5">
            <div className="mb-12">
              <h2 className="font-label text-xs tracking-widest uppercase text-luxury-gold mb-2">Private Entrance</h2>
              <p className="text-2xl font-serif text-white italic">Identity Verification Required</p>
            </div>

            {authError && (
              <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 flex items-start gap-3 animate-shake">
                <Info className="w-4 h-4 text-red-400 mt-0.5" />
                <p className="text-[11px] text-red-200 leading-relaxed">{authError}</p>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
              <div className="space-y-8">
                <div className="relative group">
                  <label className="block font-label text-[9px] tracking-[0.3em] uppercase text-gray-500 group-focus-within:text-luxury-gold transition-colors mb-2">Registry Email</label>
                  <input 
                    {...register('email')}
                    className="w-full bg-transparent border-0 border-b border-white/10 focus:border-luxury-gold focus:ring-0 px-0 pb-3 text-sm text-white transition-all placeholder:text-white/10" 
                    placeholder="agent@cannesimmoluxe.com"
                  />
                  {errors.email && <span className="absolute -bottom-5 left-0 text-[9px] text-red-400 uppercase tracking-widest">{errors.email.message}</span>}
                </div>

                <div className="relative group">
                  <label className="block font-label text-[9px] tracking-[0.3em] uppercase text-gray-500 group-focus-within:text-luxury-gold transition-colors mb-2">Security Key</label>
                  <input 
                    {...register('password')}
                    type="password"
                    className="w-full bg-transparent border-0 border-b border-white/10 focus:border-luxury-gold focus:ring-0 px-0 pb-3 text-sm text-white transition-all placeholder:text-white/10" 
                    placeholder="••••••••"
                  />
                  {errors.password && <span className="absolute -bottom-5 left-0 text-[10px] text-red-400 uppercase tracking-widest">Required</span>}
                </div>
              </div>

              <div className="pt-6">
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full h-14 bg-luxury-gold text-black hover:bg-white hover:text-black transition-all duration-500 flex items-center justify-center gap-2 group"
                >
                  <span className="font-label text-[10px] tracking-[0.3em] uppercase font-bold">
                    {isSubmitting ? 'Authenticating...' : 'Gain Access'}
                  </span>
                  {!isSubmitting && <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />}
                </Button>
                
                <p className="mt-8 text-[9px] text-center text-gray-600 uppercase tracking-[0.3em] leading-relaxed">
                  Confidential Property of <br/> CannesImmo Luxe Real Estate
                </p>
              </div>
            </form>
          </section>
        </div>

        {/* Animated accent lines */}
        <div className="absolute top-0 right-0 w-[500px] h-px bg-gradient-to-l from-luxury-gold/20 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-px bg-gradient-to-r from-luxury-gold/20 to-transparent"></div>
      </main>
    </Layout>
  );
};

export default AdminLogin;
