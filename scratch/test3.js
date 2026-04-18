import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);
supabase.from('properties').insert([{ title: 'Schema Test', ref_id: 'TEST1', type: 'Villa', mode: 'sale', status: 'available', city: 'Cannes', features: { agent_id: 'test' } }]).then(r => console.log(JSON.stringify(r)));
