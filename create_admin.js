import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xnlftqzpurlnuegjytbx.supabase.co';
// Using the anon key to create the user, then we will authenticate using the generated token to update their profile role via RLS since users can update their own profile.
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhubGZ0cXpwdXJsbnVlZ2p5dGJ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY0NTUyNjksImV4cCI6MjA5MjAzMTI2OX0.qubCA-0LYCJTUQwNFjwlMEq2xzy4_nzExJ9cWlHTxlE';
const supabase = createClient(supabaseUrl, supabaseKey);

async function setup() {
  const email = 'admin@admin.com';
  const password = '88888888$';

  console.log('Attempting to create user...');
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (authError) {
    if (authError.message.includes('already registered')) {
        console.log('User already registered. Attempting to log in to update role.');
        await supabase.auth.signInWithPassword({ email, password });
    } else {
        console.error('Sign up error:', authError);
        return;
    }
  } else {
    console.log('User registered successfully.');
  }

  // Get the session to ensure we act as the user
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    console.log('Updating user role to admin...');
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ role: 'admin' })
      .eq('id', user.id);
      
    if (profileError) {
      console.error('Failed to update role:', profileError);
    } else {
      console.log('Role updated to admin successfully.');
    }
  }
}

setup();
