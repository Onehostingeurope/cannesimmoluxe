import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Layout } from '../components/layout/Layout';
import { Button } from '../components/ui/Button';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

const schema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

type FormData = z.infer<typeof schema>;

const Login = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutTimer, setLockoutTimer] = useState(0);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (lockoutTimer > 0) {
      interval = setInterval(() => {
        setLockoutTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [lockoutTimer]);

  const onSubmit = async (data: FormData) => {
    if (lockoutTimer > 0) return;

    try {
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) throw error;
      
      if (authData.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authData.user.id)
          .single();
          
        useAuthStore.getState().setUser(authData.user);
        useAuthStore.getState().setProfile(profile);
        setFailedAttempts(0); // Reset on clean login
      }

      navigate('/dashboard');
    } catch (error: any) {
      setFailedAttempts((prev) => {
        const newAttempts = prev + 1;
        // Mathematical Logic:
        // Fail 1: 0s delay
        // Fail 2: 3s delay
        // Fail 3: 10s delay
        // Fail 4+: 30s delay limit
        let delay = 0;
        if (newAttempts === 2) delay = 3;
        else if (newAttempts === 3) delay = 10;
        else if (newAttempts >= 4) delay = 30;
        
        if (delay > 0) setLockoutTimer(delay);
        return newAttempts;
      });
      alert(error.message);
    }
  };

  return (
    <Layout>
      <main className="min-h-screen flex flex-col md:flex-row animate-luxury-fade font-body">
        {/* Editorial Side Panel */}
        <section className="hidden md:flex md:w-1/2 bg-black relative overflow-hidden">
          <img 
            alt="Luxury Estate Entrance" 
            className="absolute inset-0 w-full h-full object-cover opacity-60 grayscale hover:grayscale-0 transition-all duration-[10s]" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuD9E8XzWI5jMLoUgmUMfXDCCGLCXElyRB55A0xrusX9F3Tjxh8dcZ30A9LpOKw1NQ2a8AdjpMD9Ht72XayBK7LSfgi6Lyy8EPuYp1bdxkufJSHftsQNLbrTTyXMZKtKbhxXQ_nwXVx9DBkSL3VcnfmBBOEPISwARX0j4-aOq_1-rnsneheH2GPbvXzjbCdtc4WZ2Nq7fUIrkzsTXIlxvjhZxi_S6LQf-_u0DE6UyK-ZE0E25_8Xfh6dNYRjrGc56ArvR7b70iO048" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
          
          <div className="relative z-10 p-16 lg:p-24 flex flex-col justify-end h-full">
            <div className="space-y-6">
              <div className="inline-flex items-center space-x-3 bg-secondary/20 backdrop-blur-md px-4 py-2 border border-secondary/30">
                <span className="material-symbols-outlined notranslate text-secondary text-sm" translate="no">security</span>
                <span className="font-label text-[10px] tracking-[0.3em] uppercase text-white">Encrypted Workspace</span>
              </div>
              <h2 className="font-headline text-5xl lg:text-7xl text-white leading-tight">
                Step into your <br/><span className="italic text-secondary">Private Portfolio.</span>
              </h2>
            </div>
          </div>
        </section>

        {/* Private Entrance Form */}
        <section className="flex-grow flex items-center justify-center p-8 md:p-16 lg:p-24 bg-white dark:bg-[#0a0a0a]">
          <div className="w-full max-w-md space-y-12">
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-8 h-px bg-secondary"></span>
                <p className="font-label text-[10px] tracking-[0.2em] uppercase text-outline">Digital Curator Access</p>
              </div>
              <h1 className="font-headline text-4xl text-primary">Resume the Journey.</h1>
              <p className="text-sm text-on-surface-variant leading-relaxed opacity-70">
                Verify your credentials to unlock technical blueprints, CAD floor plans, and priority communication channels for the Côte d'Azur's most exclusive estates.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              <div className="space-y-6">
                <div className="space-y-2 relative group">
                  <label className="block font-label text-[9px] tracking-widest uppercase text-outline group-focus-within:text-primary transition-colors">Email Address</label>
                  <input 
                    {...register('email')} 
                    type="email"
                    className="w-full bg-transparent border-0 border-b border-outline-variant/30 focus:border-primary focus:ring-0 px-0 pb-2 text-sm text-primary transition-all placeholder:text-outline/30" 
                    placeholder="client@excellence.com"
                  />
                  {errors.email && <span className="absolute -bottom-5 left-0 text-[10px] text-red-500 font-medium">{errors.email.message}</span>}
                </div>

                <div className="space-y-2 relative group">
                  <div className="flex justify-between items-center">
                    <label className="block font-label text-[9px] tracking-widest uppercase text-outline group-focus-within:text-primary transition-colors">Credential Access</label>
                    <button type="button" className="text-[9px] tracking-widest uppercase text-secondary hover:text-primary transition-colors">Forgot Password?</button>
                  </div>
                  <input 
                    {...register('password')} 
                    type="password" 
                    className="w-full bg-transparent border-0 border-b border-outline-variant/30 focus:border-primary focus:ring-0 px-0 pb-2 text-sm text-primary transition-all placeholder:text-outline/30" 
                    placeholder="••••••••"
                  />
                  {errors.password && <span className="absolute -bottom-5 left-0 text-[10px] text-red-500 font-medium">{errors.password.message}</span>}
                </div>
              </div>

              <div className="space-y-6 pt-4">
                {lockoutTimer > 0 && (
                   <div className="bg-red-500/10 border border-red-500/30 text-red-500 text-xs p-3 flex items-center justify-between">
                     <span>Security Protocol Intitiated.</span>
                     <span className="font-bold tracking-widest">{lockoutTimer}s Lockout</span>
                   </div>
                )}
                <Button 
                  type="submit" 
                  disabled={isSubmitting || lockoutTimer > 0} 
                  className="w-full h-14 bg-black dark:bg-white text-white dark:text-black hover:bg-secondary hover:text-white transition-all duration-300 shadow-xl disabled:opacity-50"
                >
                  {isSubmitting ? 'Validating Connection...' : (lockoutTimer > 0 ? 'Connection Restricted' : 'Verify Identity')}
                </Button>
                
                <div className="text-center">
                  <button 
                    type="button"
                    onClick={() => navigate('/register')} 
                    className="font-label text-[10px] tracking-[0.2em] uppercase text-outline hover:text-secondary group transition-all"
                  >
                    Not yet a member? <span className="text-secondary font-bold group-hover:underline">Request Private Access</span>
                  </button>
                </div>
              </div>
            </form>

            <div className="pt-10 flex items-center justify-center opacity-30">
               <div className="h-px w-8 bg-outline-variant mr-4"></div>
               <span className="font-headline italic text-xs tracking-tighter text-primary">CannesImmo Luxe</span>
               <div className="h-px w-8 bg-outline-variant ml-4"></div>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
};

export default Login;
