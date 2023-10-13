const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('locations.db');
// Define a table structure (if it doesn't exist)
db.run(`
  CREATE TABLE IF NOT EXISTS locations (
    id INTEGER PRIMARY KEY,
    Type TEXT,
    X REAL,
    Y REAL,
    Count INTEGER
  )
`);

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());



// Handle POST request to add a location
app.post('/add-location', (req, res) => {
    const newLocation = req.body;

     // Insert the new location data into the SQLite database
     const query = `
     INSERT INTO locations (Type, X, Y, Count)
     VALUES (?, ?, ?, ?)
     `;
 
    db.run(query, [newLocation.Type, newLocation.X, newLocation.Y, newLocation.Count], (err) => {
        if (err) {
            console.error('Error inserting data into SQLite:', err);
            res.status(500).send('Error adding location to the database');
        } else {
            res.send('Location added successfully.');
        }
    });
});

app.get('/get-locations', (req, res) => {
    // Query the SQLite database to retrieve locations
    const query = 'SELECT * FROM locations';

    db.all(query, (err, locations) => {
        if (err) {
            console.error('Error querying SQLite database:', err);
            res.status(500).json({ error: 'Error fetching locations' });
        } else {
            res.json(locations);
        }
    });
});

app.delete('/remove-location/:id', (req, res) => {
    const locationId = req.params.id;
    // Check if the ID is valid (positive integer)
    if (!(/^\d+$/.test(locationId))) {
        res.status(400).json({ error: 'Invalid location ID' });
        return;
    }

    // Define an SQL query to delete the location by ID
    const query = 'DELETE FROM locations WHERE id = ?';

    db.run(query, [locationId], function (err) {
        if (err) {
            console.error('Error deleting location from SQLite database:', err);
            res.status(500).json({ error: 'Error removing location' });
        } else {
            if (this.changes > 0) {
                res.json({ message: 'Location removed successfully' });
            } else {
                res.status(404).json({ error: 'Location not found' });
            }
        }
    });
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
