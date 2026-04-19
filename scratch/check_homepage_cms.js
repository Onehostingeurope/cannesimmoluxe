import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const envFile = fs.readFileSync(path.resolve('.env'), 'utf8');
let url = '', anon = '';
envFile.split('\n').forEach(line => {
    if(line.startsWith('VITE_SUPABASE_URL=')) url = line.split('=')[1].trim();
    if(line.startsWith('VITE_SUPABASE_ANON_KEY=')) anon = line.split('=')[1].trim();
});

const supabase = createClient(url, anon);

async function check() {
    const { data, error } = await supabase.from('cms_content').select('*').eq('page_name', 'Homepage').single();
    if(error) {
        console.error(error);
        return;
    }
    console.log(JSON.stringify(data, null, 2));
}
check();
