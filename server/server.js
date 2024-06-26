const http = require('http');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');

const app=express();
app.use(bodyParser.json());

const ImportData = require('./ImportData');

const Building = require('./Building');

if (!Building.buildingContainer) {
    ImportData.loadBuildings();
    ImportData.loadClassRooms();
}

// Apply CORS middleware
app.use(cors());

// Serve the index.html file
app.get('/', (req, res) => {
    fs.readFile(path.join(__dirname, 'index.html'), (err, data) => {
        if (err) {
            res.status(500).send('Internal Server Error');
        } else {
            res.status(200).type('text/html').send(data);
        }
    });
});

// API endpoint to retrieve data
app.get('/api/data', (req, res) => {
    const data = Building.buildingContainer;
    res.status(200).json({ data });
});

// API endpoint to get building info
app.post('/api/getBuildingInfo', (req, res) => {
    const buildingName = req.body.params.buildingId;
    console.log('GET BUILDING INFO:', buildingName);
    // Add your logic to handle building info here
    res.status(200).send('Received building name: ' + buildingName);
});

// Handle 404 Not Found
app.use((req, res) => {
    res.status(404).send('Not Found');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});