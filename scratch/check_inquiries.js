import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xnlftqzpurlnuegjytbx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhubGZ0cXpwdXJsbnVlZ2p5dGJ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY0NTUyNjksImV4cCI6MjA5MjAzMTI2OX0.qubCA-0LYCJTUQwNFjwlMEq2xzy4_nzExJ9cWlHTxlE';

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data, error } = await supabase.from('inquiries').select('*').limit(1);
  console.log(data, error);
}

check();
