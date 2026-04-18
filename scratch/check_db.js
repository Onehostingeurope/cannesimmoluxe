import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://xnlftqzpurlnuegjytbx.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'your-key';

// I need the actual anon key. I will wait for the next command to read it from .env or just read .env
