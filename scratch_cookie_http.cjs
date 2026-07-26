const http = require('http');

async function test(checked) {
  return new Promise(resolve => {
    http.get('http://localhost:3000/api/auth/csrf', res => {
      let d='';
      res.on('data', c=>d+=c);
      res.on('end', () => {
        const csrf=JSON.parse(d).csrfToken;
        const csrfC = (res.headers['set-cookie']||[]).find(c=>c.includes('next-auth.csrf-token'))?.split(';')[0];
        
        // I don't know the exact credentials so I will just check what headers NextAuth generates on error, OR I can just simulate it.
        // Wait, NextAuth maxAge is applied globally based on authOptions. Even if login fails, it doesn't set a session cookie.
        // But we can just create a dummy session or check if `admin@example.com`/`admin123` works. Let's try it.
        const pd=new URLSearchParams({
          csrfToken:csrf,
          email:'admin@example.com',
          password:'Password123!',
          redirect:'false'
        }).toString();
        
        const r=http.request({
          hostname:'localhost',
          port:3000,
          path:'/api/auth/callback/credentials',
          method:'POST',
          headers:{
            'Content-Type':'application/x-www-form-urlencoded',
            'Content-Length':Buffer.byteLength(pd),
            'Cookie': csrfC + '; rememberMe=' + checked
          }
        }, res2 => {
          let d2='';
          res2.on('data', c=>d2+=c);
          res2.on('end', () => {
            const sc = (res2.headers['set-cookie']||[]).find(c=>c.includes('next-auth.session-token'));
            if (sc) {
              const maxAge = sc.match(/Max-Age=(\d+)/i);
              const expires = sc.match(/Expires=([^;]+)/i);
              resolve({
                maxAge: maxAge ? maxAge[1] : null,
                expires: expires ? expires[1] : null,
                cookieStr: sc.substring(0, 80) + '...'
              });
            } else {
              resolve('Login Failed');
            }
          });
        });
        r.write(pd);
        r.end();
      });
    });
  });
}

(async()=>{
  console.log('Checked (true):', await test(true));
  console.log('Unchecked (false):', await test(false));
})();
