// Zero-dependency Node.js server. Run: npm start  ->  http://localhost:3000
// Serves every page/asset in this folder (server.js and package.json are never served).
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const TYPES = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.ico': 'image/x-icon'
};
const PRIVATE = new Set(['server.js', 'package.json']);

http.createServer((req, res) => {
  let name = path.basename(decodeURIComponent(req.url.split('?')[0]));
  if (name === '') name = 'index.html';
  const type = TYPES[path.extname(name)];
  if (!type || PRIVATE.has(name)) { res.writeHead(404, { 'Content-Type': 'text/plain' }); return res.end('Not found'); }
  fs.readFile(path.join(__dirname, name), (err, data) => {
    if (err) { res.writeHead(404, { 'Content-Type': 'text/plain' }); return res.end('Not found: ' + name); }
    res.writeHead(200, { 'Content-Type': type, 'Cache-Control': 'no-cache' });
    res.end(data);
  });
}).listen(PORT, () => console.log(`Presentation running at http://localhost:${PORT}`));
