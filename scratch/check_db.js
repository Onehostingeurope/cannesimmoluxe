import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Read exactly from .env
const envPath = path.resolve('.env');
const envFile = fs.readFileSync(envPath, 'utf8');

let url = '';
let anon = '';

envFile.split('\n').forEach(line => {
    if(line.startsWith('VITE_SUPABASE_URL=')) url = line.split('=')[1].trim();
    if(line.startsWith('VITE_SUPABASE_ANON_KEY=')) anon = line.split('=')[1].trim();
});

const supabase = createClient(url, anon);

async function check() {
    const { data } = await supabase.from('properties').select('*').limit(1);
    console.log(data);
}
check();
