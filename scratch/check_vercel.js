import https from 'https';
https.get('https://cannesimmo-luxe.vercel.app/admin/properties', (res) => {
  let data = '';
  res.on('data', (c) => data += c);
  res.on('end', () => {
    const jsUrlMatch = data.match(/src="(\/assets\/index-[^\"]+\.js)"/);
    if (!jsUrlMatch) {
       console.log('No JS bundle found.');
       return;
    }
    const jsUrl = 'https://cannesimmo-luxe.vercel.app' + jsUrlMatch[1];
    https.get(jsUrl, (r2) => {
       let code = '';
       r2.on('data', (c) => code += c);
       r2.on('end', () => {
          if (code.includes('notifications_active')) {
             console.log('SUCCESS: Notifications code is actively deployed in the current live JS bundle.');
          } else {
             console.log('FAILURE: Notifications code is missing from the JS bundle. Vercel did NOT deploy the latest commit!');
          }
       });
    });
  });
});
