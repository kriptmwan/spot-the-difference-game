/* Lantern Lane — tiny dev server: serves game/ on http://localhost:8080
   for play-testing in a desktop browser. Standard library only. */

import { createServer } from 'node:http';
import { readFileSync, existsSync } from 'node:fs';
import { join, extname } from 'node:path';

const root = new URL('./game/', import.meta.url).pathname;
const port = 8080;

const types = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.mjs': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
};

createServer((req, res) => {
  const path = req.url === '/' ? 'index.html' : decodeURIComponent(req.url ?? '').replace(/^\/+/, '');
  const file = join(root, path);
  if (!file.startsWith(root) || !existsSync(file)) {
    res.writeHead(404, { 'content-type': 'text/plain' });
    res.end('not found');
    return;
  }
  res.writeHead(200, { 'content-type': types[extname(file)] ?? 'application/octet-stream' });
  res.end(readFileSync(file));
}).listen(port, () => {
  console.log('Lantern Lane at http://localhost:' + port);
});
