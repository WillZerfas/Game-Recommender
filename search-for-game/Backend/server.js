// Import necessary modules
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

// Create an Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON request bodies

// Set up MySQL connection
const db = mysql.createConnection({
    host: "localhost",
    user: 'root',
    password: 'Bucky2024!',
    database: 'steamgames'
});

// Connect to MySQL
db.connect(err => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the MySQL database');
});

// Basic route
app.get('/', (req, res) => {
    return res.json("From Backend Side");
});

// Fetch all users (just for testing)
app.get('/user', (req, res) => {
    const sql = "SELECT * FROM user";
    db.query(sql, (err, data) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).json(err);
        }
        return res.json(data);
    });
});

// register
app.post('/register', (req,res)=> {
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;
    db.query("INSERT INTO user (email, username, password) values (?, ?, ?)", [email, username, password], (err, result)=> {
        if (err) {
            console.error('Error inserting user:', err.message);
            return res.status(500).json({ message: 'Server error' });
        }
        return res.status(200).json({ message: 'Registration successful!' });
    });
});

app.get('/check-user', (req, res) => {
    const email = req.query.email; // Use req.query for GET request parameters
    const username = req.query.username;
    
    // Query the database to see if the username or email already exists
    db.query("SELECT * FROM user WHERE username = ? OR email = ?", [username, email], (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Error checking username availability: " + err.message }); // Corrected error reference
        }

        const isAvailable = result.length === 0; // Check if the result set is empty
        const message = isAvailable ? 'Username and email are available.' : 'Username or email already exists. Please choose another one.';

        return res.status(200).json({ available: isAvailable, message: message });
    });
});


// Login route
app.post('/login', (req, res) => {
    console.log('Request body:', req.body); // Log the request body
    db.query('select * from user where username ')
    const sql = 'SELECT * FROM user WHERE username = ? AND password = ?';
    db.query(sql, [req.body.username, req.body.password], async (err, data) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.json("Error");
        }
        console.log('Query result:', data); // Log the query result
        
        if(data.length > 0){
            return res.json("Login Successful");
        } else{
            return res.json("No record");
        }
    });
});

// get all games for pagination or infinite scroll view
app.get('/games', (req, res) => {
    const limit = parseInt(req.query.limit) || 24; // Default to 24 items per page
    const offset = parseInt(req.query.offset) || 0;
    const countQuery = 'SELECT COUNT(*) as total FROM game';
    const gamesQuery = 'SELECT AppId, Name, Price, Image FROM game LIMIT ? OFFSET ?';
    db.query(countQuery, (err, countResults) => {
        if (err) {
            console.error('Error fetching games count:', err);
            return res.status(500).json({ error: 'Server error' });
        }
        const total = countResults[0].total;
        db.query(gamesQuery, [limit, offset], (err, gameResults) => {
            if (err) {
                console.error('Error fetching games:', err);
                return res.status(500).json({ error: 'Server error' });
            }
            return res.status(200).json({ total, games: gameResults });
        });
    });
});


// get games based on 



app.get('/games/popular', (req, res) => {
    // Query the database to see if the username or email already exists
    db.query("SELECT AppId, Name, Price, Image FROM game ORDER BY Positive DESC LIMIT 10", (err, result) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).json({ error: 'Failed to fetch games' });
            return;
          }
          res.json(result);
    });
});


app.get('/games/details/:appId', (req, res) => {
    const { appId } = req.params;
    const gameQuery = `
        SELECT g.AppId, g.Name, g.ReleaseDate, g.Price, g.Image, g.Description,
               GROUP_CONCAT(DISTINCT p.Platform) AS Platforms
        FROM game g
        LEFT JOIN playedon po ON g.AppId = po.AppId
        LEFT JOIN platforms p ON po.PlatformID = p.PlatformID
        WHERE g.AppId = ?
        GROUP BY g.AppId
    `;

    db.query(gameQuery, [appId], (err, result) => {
        if (err) {
            console.error('Error fetching game details:', err);
            return res.status(500).json({ error: 'Server error' });
        }
        if (result.length === 0) {
            return res.status(404).json({ error: 'Game not found' });
        }
        const game = result[0];
        game.Platforms = game.Platforms.split(','); // Convert comma-separated string to array
        res.json(game);
    });
});



app.get('/games/developers/:appId', (req, res) => {
    const { appId } = req.params;
    const query = `
        SELECT DISTINCT d.developer, d.website
        FROM develop de
        LEFT JOIN developer d ON de.developer = d.developer
        WHERE de.AppID = ?
    `;

    db.query(query, [appId], (err, result) => {
        if (err) {
            console.error('Error fetching developers:', err);
            return res.status(500).json({ error: 'Server error' });
        }
        res.json(result);
    });
});



app.get('/games/platforms/:appId', (req, res) => {
    const { appId } = req.params;
    const platformQuery = `
        SELECT p.PlatformID, p.Platform, p.Description
        FROM platforms p
        JOIN playedon po ON p.PlatformID = po.PlatformID
        WHERE po.AppID = ?
    `;

    db.query(platformQuery, [appId], (err, result) => {
        if (err) {
            console.error('Error fetching platform descriptions:', err);
            return res.status(500).json({ error: 'Server error' });
        }
        if (result.length === 0) {
            return res.status(404).json({ error: 'No platforms found for this game' });
        }
        res.json(result);
    });
});


// Start the server
app.listen(8801, () => {
    console.log(`Listening...`);
});