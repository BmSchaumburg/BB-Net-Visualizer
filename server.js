const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');

const app = express();
const port = 30001;

app.use(cors());
app.use(bodyParser.json());
app.use(helmet());

// Serve the index.html file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'fullscan.html'));
});

let networkData = { nodes: [], links: [] };

// Endpoint to receive data from Bitburner script
app.post('/data', (req, res) => {
    console.log('Received data:', req.body);
    // Assuming req.body contains nodes and links directly
    networkData = req.body;
    res.send('Data received');
});

// Endpoint to serve server data to the HTML page
app.get('/server-data', (req, res) => {
    res.json(networkData);
});

// Start the server
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
