
const express = require('express');
const request = require('request');
const path = require('path');
const app = express();

// Proxy stream to avoid CORS issues on mobile/web browsers
app.get('/stream', (req, res) => {
  const streamUrl = 'https://radiokrug.ru/usa/CNBC/icecast.audio';
  request({
    url: streamUrl,
    headers: {
      'Referer': 'https://radiostationusa.fm/',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    },
    agentOptions: {
      rejectUnauthorized: false // Ignore SSL issues from source
    }
  }).on('error', (err) => {
    console.error('Stream error:', err.message);
    res.status(500).send('Error fetching stream');
  }).pipe(res);
});

// Serve static files from the root directory
app.use(express.static(__dirname));

// Fallback to index.html for SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
