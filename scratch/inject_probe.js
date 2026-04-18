import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xnlftqzpurlnuegjytbx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhubGZ0cXpwdXJsbnVlZ2p5dGJ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY0NTUyNjksImV4cCI6MjA5MjAzMTI2OX0.qubCA-0LYCJTUQwNFjwlMEq2xzy4_nzExJ9cWlHTxlE';

const supabase = createClient(supabaseUrl, supabaseKey);

async function inject() {
   // Try to inject all imaginable fields
   const payload = {
      message: 'Probe test',
      email: 'probe@test.com',
      first_name: 'John',
      last_name: 'Doe',
      phone: '1234567890',
      intensity: 'High'
   };
   
   const { data, error } = await supabase.from('inquiries').insert([payload]).select();
   console.log("Error:", error);
   console.log("Data:", data);
}

inject();
