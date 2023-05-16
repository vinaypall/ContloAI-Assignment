const express = require('express');
const bodyParser = require('body-parser');
const shortid = require('shortid');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;
const urlsFilePath = path.join(__dirname, 'urls.json');

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Read the URLs from the JSON file
let urlMap = new Map();
fs.readFile(urlsFilePath, 'utf8', (err, data) => {
  if (!err) {
    try {
      urlMap = new Map(JSON.parse(data));
    } catch (err) {
      console.error('Error parsing URLs JSON:', err);
    }
  }
});

// Save the URLs to the JSON file
function saveUrlsToFile() {
  fs.writeFile(urlsFilePath, JSON.stringify([...urlMap]), 'utf8', (err) => {
    if (err) {
      console.error('Error saving URLs to file:', err);
    }
  });
}

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// API endpoint for URL shortening
app.post('/shorten', (req, res) => {
  const { url } = req.body;
  const shortId = shortid.generate();
  const shortUrl = `${req.protocol}://${req.get('host')}/${shortId}`;
  
  urlMap.set(shortId, url);
  saveUrlsToFile();

  res.json({ shortUrl });
});

// Endpoint for URL redirection
app.get('/:shortId', (req, res) => {
  const { shortId } = req.params;
  if (urlMap.has(shortId)) {
    const originalUrl = urlMap.get(shortId);
    return res.redirect(originalUrl);
  }
  res.status(404).send('URL not found');
});

// Serve the index.html file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
