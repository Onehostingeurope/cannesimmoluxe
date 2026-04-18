import React from 'react';

const DebugPage = () => {
  return (
    <div style={{ padding: '50px', background: 'white', minHeight: '100vh', color: 'black' }}>
      <h1>System Debug Matrix</h1>
      <p>Status: Root Mounting Successful</p>
      <p>Env Check URL: {import.meta.env.VITE_SUPABASE_URL ? 'PRESENT' : 'MISSING'}</p>
      <p>Time: {new Date().toISOString()}</p>
      <a href="/">Return to Home</a>
    </div>
  );
};

export default DebugPage;
