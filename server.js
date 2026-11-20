const http = require('http');
const fs = require('fs');
const path = require('path');
const root = __dirname;
const server = http.createServer((req, res) => {
  const name = req.url === '/' ? '/index.html' : req.url;
  const file = path.join(root, name);
  if (!file.startsWith(root) || !fs.existsSync(file)) { res.writeHead(404); return res.end('Not found'); }
  res.writeHead(200, { 'Content-Type': file.endsWith('.html') ? 'text/html; charset=utf-8' : 'text/plain; charset=utf-8' }); res.end(fs.readFileSync(file));
});
server.listen(8080, () => console.log('Dao Den Long: http://localhost:8080'));
