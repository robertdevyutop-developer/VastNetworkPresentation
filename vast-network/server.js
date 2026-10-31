// Zero-dependency Node.js server. Run: npm start  ->  http://localhost:3000
// Serves index.html, style.css and app.js from this same folder.
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const FILES = {
  'index.html': 'text/html; charset=utf-8',
  'style.css': 'text/css; charset=utf-8',
  'app.js': 'text/javascript; charset=utf-8'
};

http.createServer((req, res) => {
  let name = path.basename(decodeURIComponent(req.url.split('?')[0]));
  if (name === '') name = 'index.html';
  const type = FILES[name];
  if (!type) { res.writeHead(404, { 'Content-Type': 'text/plain' }); return res.end('Not found'); }
  fs.readFile(path.join(__dirname, name), (err, data) => {
    if (err) { res.writeHead(500, { 'Content-Type': 'text/plain' }); return res.end('Missing file: ' + name); }
    res.writeHead(200, { 'Content-Type': type, 'Cache-Control': 'no-cache' });
    res.end(data);
  });
}).listen(PORT, () => console.log(`Presentation running at http://localhost:${PORT}`));
