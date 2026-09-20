import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Proxy endpoint for Kompas Tour live sync to avoid CORS issues
app.use('/api/kompas', async (req, res) => {
  try {
    const targetUrl = `https://online.uz.kompastour.com${req.url}`;
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'https://online.uz.kompastour.com/search_tour',
        'Accept': req.headers['accept'] || '*/*',
        ...(req.headers['x-requested-with'] ? { 'X-Requested-With': req.headers['x-requested-with'] } : {})
      },
      body: ['POST', 'PUT', 'PATCH'].includes(req.method) ? JSON.stringify(req.body) : undefined
    });

    const data = await response.text();
    res.status(response.status);
    const contentType = response.headers.get('content-type');
    if (contentType) {
      res.setHeader('Content-Type', contentType);
    }
    res.send(data);
  } catch (error) {
    console.error('Error proxying to Kompas Tour:', error);
    res.status(500).json({ error: 'Failed to fetch from Kompas Tour' });
  }
});

// Serve static assets from Vite build output
app.use(express.static(path.join(__dirname, 'dist')));

// Fallback for Single Page Application (SPA) routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running at http://0.0.0.0:${PORT}`);
});
