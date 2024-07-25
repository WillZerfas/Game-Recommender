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


// Start the server
app.listen(8801, () => {
    console.log(`Listening...`);
});