import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Load environment variables from .env
dotenv.config();

// Custom Vite plugin to serve /api serverless functions locally
function apiServerlessPlugin() {
  return {
    name: 'api-serverless-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url.startsWith('/api/')) {
          return next();
        }

        const urlPath = req.url.split('?')[0];
        const apiName = urlPath.replace('/api/', '').replace(/\.js$/, '');
        const filePath = path.resolve(process.cwd(), 'api', `${apiName}.js`);

        if (!fs.existsSync(filePath)) {
          res.statusCode = 404;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: `API route /api/${apiName} not found` }));
          return;
        }

        // Buffer request body for POST/PUT requests
        let rawBody = '';
        req.on('data', (chunk) => {
          rawBody += chunk;
        });

        req.on('end', async () => {
          try {
            const fullUrl = new URL(req.url, `http://${req.headers.host || '127.0.0.1:5173'}`);
            req.query = Object.fromEntries(fullUrl.searchParams.entries());

            if (rawBody && req.headers['content-type']?.includes('application/json')) {
              req.body = JSON.parse(rawBody);
            } else {
              req.body = rawBody;
            }

            // Mock Vercel response helper methods
            res.status = (statusCode) => {
              res.statusCode = statusCode;
              return res;
            };
            res.json = (data) => {
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(data));
              return res;
            };
            res.send = (data) => {
              res.end(data);
              return res;
            };

            // Dynamically import the handler (with cache busting in dev)
            const module = await import(`${filePath}?t=${Date.now()}`);
            const handler = module.default;

            await handler(req, res);
          } catch (err) {
            console.error(`[API Error in ${apiName}]:`, err);
            if (!res.headersSent) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'Internal Server Error', message: err.message }));
            }
          }
        });
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), apiServerlessPlugin()],
  server: {
    host: true,
    port: 5173,
  },
});
