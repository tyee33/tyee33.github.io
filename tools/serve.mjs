/**
 * tools/serve.mjs —— 零依赖本地静态服务器（可选）
 * ----------------------------------------------------------------------------
 * 只在想用 http:// 而不是 file:// 预览时使用，例如核对相对路径、缓存行为。
 * 用法：node tools/serve.mjs [端口]       默认 8080
 */
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, resolve, sep } from 'node:path';

const ROOT = resolve(process.cwd());
const PORT = Number(process.argv[2] || process.env.PORT || 8080);

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.pdf': 'application/pdf',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.woff2': 'font/woff2'
};

const send = (res, code, body, headers = {}) => {
  res.writeHead(code, { 'Cache-Control': 'no-cache', ...headers });
  res.end(body);
};

createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://localhost:${PORT}`);
    let pathname = decodeURIComponent(url.pathname);
    if (pathname.endsWith('/')) pathname += 'index.html';

    const target = resolve(join(ROOT, pathname));
    if (target !== ROOT && !target.startsWith(ROOT + sep)) {
      return send(res, 403, 'Forbidden');
    }

    let file = target;
    try {
      const info = await stat(file);
      if (info.isDirectory()) file = join(file, 'index.html');
    } catch {
      const fallback = join(ROOT, '404.html');
      try {
        return send(res, 404, await readFile(fallback), { 'Content-Type': TYPES['.html'] });
      } catch {
        return send(res, 404, 'Not found');
      }
    }

    const body = await readFile(file);
    send(res, 200, body, { 'Content-Type': TYPES[extname(file).toLowerCase()] || 'application/octet-stream' });
  } catch (err) {
    send(res, 500, String(err && err.message ? err.message : err));
  }
}).listen(PORT, () => {
  console.log(`\n  本地预览已启动 →  http://localhost:${PORT}/\n  按 Ctrl+C 停止\n`);
});
