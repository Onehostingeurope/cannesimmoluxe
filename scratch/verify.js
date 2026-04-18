import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xnlftqzpurlnuegjytbx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhubGZ0cXpwdXJsbnVlZ2p5dGJ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY0NTUyNjksImV4cCI6MjA5MjAzMTI2OX0.qubCA-0LYCJTUQwNFjwlMEq2xzy4_nzExJ9cWlHTxlE';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkLogins() {
  const attempts = [
    { email: 'admin@cannesimmoluxe.com', pass: 'Executive123' },
    { email: 'admin@cannesimmoluxe.com', pass: '88888888$' },
    { email: 'admin@admin.com', pass: '88888888$' },
    { email: 'admin@admin.com', pass: 'Executive123' }
  ];

  for (const {email, pass} of attempts) {
    console.log(`Trying ${email} | ${pass} ...`);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password: pass });
    if (error) {
       console.log(`Failed: ${error.message}`);
    } else if (data.session) {
       console.log(`SUCCESS! Valid login found: ${email} / ${pass}`);
    }
  }
}

checkLogins();
