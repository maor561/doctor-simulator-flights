import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import handler from './api/save-data.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(express.json());
app.use(express.static('.'));

// API Routes
// Handle both GET and POST for /api/save-data
app.get('/api/save-data', (req, res) => {
    handler({ method: 'GET', body: {} }, res);
});

app.post('/api/save-data', (req, res) => {
    handler({ method: 'POST', body: req.body }, res);
});

app.options('/api/save-data', (req, res) => {
    handler({ method: 'OPTIONS', body: {} }, res);
});

// Serve index.html for root path
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`✅ Server running at http://localhost:${PORT}`);
    console.log(`📁 Serving files from: ${__dirname}`);
});
