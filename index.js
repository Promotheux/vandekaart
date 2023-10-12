const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

// Handle POST request to add a location
app.post('/add-location', (req, res) => {
    const newLocation = req.body;

    // Load the existing locations
    let locations = [];
    try {
        locations = JSON.parse(fs.readFileSync('locations.json'));
    } catch (err) {
        console.error('Error reading locations.json:', err);
    }

    // Add the new location to the array
    locations.push(newLocation);

    // Write the updated locations array back to locations.json
    fs.writeFileSync('locations.json', JSON.stringify(locations, null, 2));

    res.send('Location added successfully.');
});

app.get('/get-locations', (req, res) => {
    let locations = [];

    try {
        locations = JSON.parse(fs.readFileSync('locations.json'));
    } catch (err) {
        console.error('Error reading locations.json:', err);
    }

    res.json(locations);
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
