import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xnlftqzpurlnuegjytbx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhubGZ0cXpwdXJsbnVlZ2p5dGJ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY0NTUyNjksImV4cCI6MjA5MjAzMTI2OX0.qubCA-0LYCJTUQwNFjwlMEq2xzy4_nzExJ9cWlHTxlE';

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data: auth, error } = await supabase.auth.signInWithPassword({
     email: 'admin@cannesimmoluxe.com', 
     password: 'Executive123'
  });
  
  if (error) {
     console.error("Auth Fail", error.message);
     return;
  }
  
  console.log("Logged in. UID:", auth.user.id);
  
  const { data: profile, error: pError } = await supabase.from('profiles').select('*').eq('id', auth.user.id).single();
  
  if (pError) {
     console.error("Profile Fail", pError.message);
  } else {
     console.log("Profile Data:", profile);
  }
}

check();
