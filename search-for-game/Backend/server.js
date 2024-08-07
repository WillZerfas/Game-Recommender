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
app.post('/register', (req, res) => {
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;
    db.query("INSERT INTO user (email, username, password) values (?, ?, ?)", [email, username, password], (err, result) => {
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

        if (data.length > 0) {
            return res.json("Login Successful");
        } else {
            return res.json("No record");
        }
    });
});


// get all games for pagination or infinite scroll view
// app.get('/games', (req, res) => {
//     const limit = parseInt(req.query.limit) || 24; // Default to 24 items per page
//     const offset = parseInt(req.query.offset) || 0;
//     const countQuery = 'SELECT COUNT(*) as total FROM game';
//     const gamesQuery = 'SELECT AppId, Name, Price, Image FROM game LIMIT ? OFFSET ?';
//     db.query(countQuery, (err, countResults) => {
//         if (err) {
//             console.error('Error fetching games count:', err);
//             return res.status(500).json({ error: 'Server error' });
//         }
//         const total = countResults[0].total;
//         db.query(gamesQuery, [limit, offset], (err, gameResults) => {
//             if (err) {
//                 console.error('Error fetching games:', err);
//                 return res.status(500).json({ error: 'Server error' });
//             }
//             return res.status(200).json({ total, games: gameResults });
//         });
//     });
// });

// Get games based on filter
app.get('/games', (req, res) => {

    const limit = parseInt(req.query.limit) || 24; // Default to 24 items per page
    const offset = parseInt(req.query.offset) || 0;
    const { name = '', genre = '', category = '', sortBy = '', minPrice = 0, maxPrice = 99999999.99 } = req.query;

    let countQuery = 'SELECT COUNT(*) as total FROM game WHERE 1=1';
    let gamesQuery = 'SELECT AppId, Name, Price, Image FROM game WHERE 1=1';
    const queryParams = [];

    // Filtering by name
    if (name) {
        countQuery += ' AND Name LIKE ?';
        gamesQuery += ' AND Name LIKE ?';
        queryParams.push(`%${name}%`);
    }

    // Filtering by genre
    if (genre) {
        countQuery += ' AND Genres Like ?';
        gamesQuery += ' AND Genres Like ?';
        queryParams.push(`%${genre}%`);
    }

    // Filtering by category
    if (category) {
        countQuery += ' AND Category Like ?';
        gamesQuery += ' AND Category Like ?';
        queryParams.push(`%${category}%`);
    }

    // Filtering by price
    if (minPrice !== 0) {
        countQuery += ' AND Price >= ?';
        gamesQuery += ' AND Price >= ?';
        queryParams.push(minPrice);
    }

    if (maxPrice !== 99999999.99) {
        countQuery += ' AND Price <= ?';
        gamesQuery += ' AND Price <= ?';
        queryParams.push(maxPrice);
    }

    if (sortBy) {
        gamesQuery += ` ORDER BY ${sortBy}`;
    }

    gamesQuery += ' LIMIT ? OFFSET ?';
    queryParams.push(limit, offset);

    // Execute count query
    db.query(countQuery, queryParams.slice(0, -2), (err, countResults) => {

        console.log(`here: ${countQuery}`)
        if (err) {
            console.error('Error fetching games count:', err);
            return res.status(500).json({ error: 'Server error' });
        }
        const total = countResults[0].total;

        // Execute games query
        db.query(gamesQuery, queryParams, (err, gameResults) => {
            if (err) {
                console.error('Error fetching games:', err);
                return res.status(500).json({ error: 'Server error' });
            }
            return res.status(200).json({ total, games: gameResults });
        });
    });
});


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


app.post('/change-username', (req, res) => {
    const newUsername = req.body.newUsername;
    const email = req.body.email;
    const password = req.body.password;

    const checkQuery = `
      SELECT UID
      FROM user
      WHERE email = ? AND password = ?
    `;

    db.query(checkQuery, [email, password], (err, result) => {
        if (err) {
            console.error('Error checking user:', err);
            return res.status(500).json({ error: 'Server error' });
        }

        if (result.length === 0) {
            return res.status(404).json({ error: 'No matching account found.' });
        }

        const userId = result[0].UID;

        const updateQuery = `
        UPDATE user
        SET username = ?
        WHERE UID = ?
      `;

        db.query(updateQuery, [newUsername, userId], (err) => {
            if (err) {
                console.error('Error updating username:', err);
                return res.status(500).json({ error: 'Server error' });
            }
            res.json({ success: true, message: 'Username updated successfully.' });
        });
    });
});


app.post('/forgot-password', (req, res) => {

    const username = req.body.username;
    const email = req.body.email;
    const newPassword = req.body.newPassword;

    const checkQuery = `
      SELECT UID
      FROM user
      WHERE username = ? AND email = ?
    `;

    db.query(checkQuery, [username, email], (err, result) => {
        if (err) {
            console.error('Error checking user:', err);
            return res.status(500).json({ error: 'Server error' });
        }

        if (result.length === 0) {
            return res.status(404).json({ error: 'No matching account found.' });
        }

        const userId = result[0].UID;

        const updateQuery = `
        UPDATE user
        SET password = ?
        WHERE UID = ?
      `;

        db.query(updateQuery, [newPassword, userId], (err) => {
            if (err) {
                console.error('Error updating password:', err);
                return res.status(500).json({ error: 'Server error' });
            }
            res.json({ success: true, message: 'Password updated successfully.' });
        });
    });
});



app.get('/average-price', (req, res) => {
    const query = `
      SELECT AVG(price) AS avg_price
      FROM game
    `;

    db.query(query, (error, results) => {
        if (error) {
            console.error('Error executing query:', error);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
        res.json({ avg_price: results[0].avg_price });
    });
});



app.get('/games-below-average', (req, res) => {
    const query = `
    SELECT COUNT(*) AS games_below_average
    FROM game
    WHERE price < (
      SELECT AVG(price)
      FROM game
    )
  `;

    db.query(query, (error, results) => {
        if (error) {
            console.error('Error executing query:', error);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
        res.json({ games_below_average: results[0].games_below_average });
    });
});



app.get('/top-ratio', (req, res) => {
    db.query("SELECT AppId, Name, Price, Image, Positive, Negative, (Positive / NULLIF(Negative, 0)) AS Ratio FROM game WHERE (Positive + Negative) > 10000 ORDER BY Ratio DESC LIMIT 20", (err, result) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).json({ error: 'Failed to fetch games' });
            return;
        }
        res.json(result);
    });
});



// Get user's favorite games by username
app.get('/favorites-by-username', (req, res) => {
    const username = req.query.username;
    if (!username) {
        return res.status(400).json({ error: 'Username is required' });
    }
    const query = `
        SELECT g.AppId, g.Name, g.Price, g.Image
        FROM user u
        JOIN favorite f ON u.UID = f.UID
        JOIN game g ON f.AppID = g.AppID
        WHERE u.Username = ?
        `;
    db.query(query, [username], (err, results) => {
        if (err) {
            console.error('Error fetching favorite games:', err);
            return res.status(500).json({ error: 'Server error' });
        }
        return res.status(200).json(results);
    });
});



// Get the total number of favorite games a user has by username
app.get('/total-favorites', (req, res) => {
    const username = req.query.username;
    if (!username) {
        return res.status(400).json({ error: 'Username is required' });
    }
    const query = `
        SELECT COUNT(f.AppId) AS total_favorites
        FROM user u
        JOIN favorite f ON u.UID = f.UID
        WHERE u.Username = ?
    `;
    db.query(query, [username], (err, results) => {
        if (err) {
            console.error('Error fetching total number of favorite games:', err);
            return res.status(500).json({ error: 'Server error' });
        }
        return res.status(200).json(results[0]);
    });
});



// Get the number of users who have favorited a specific game by appid
app.get('/game-favorite-count', (req, res) => {
    const appid = req.query.appid;
    if (!appid) {
        return res.status(400).json({ error: 'AppID is required' });
    }
    const query = `
        SELECT g.AppId, g.Name, COUNT(f.UID) AS TotalFavorites 
        FROM Game g 
        JOIN Favorite f ON g.AppID = f.AppID 
        WHERE g.AppID = ? 
        GROUP BY g.AppID, g.Name;
    `;
    db.query(query, [appid], (err, results) => {
        if (err) {
            console.error('Error fetching favorite count for the game:', err);
            return res.status(500).json({ error: 'Server error' });
        }
        if (results.length === 0) {
            return res.status(200).json({ TotalFavorites: 0 });
        }
        return res.status(200).json(results[0]);
    });
});



// Calculate the total cost of a user's favorite games by username
app.get('/total-cost-favorites', (req, res) => {
    const username = req.query.username;
    if (!username) {
        return res.status(400).json({ error: 'Username is required' });
    }
    const query = `
        SELECT SUM(g.Price) AS TotalCost
        FROM user u
        JOIN favorite f ON u.UID = f.UID
        JOIN game g ON f.AppId = g.AppId
        WHERE u.Username = ?;
    `;
    db.query(query, [username], (err, results) => {
        if (err) {
            console.error('Error calculating total cost of favorite games:', err);
            return res.status(500).json({ error: 'Server error' });
        }
        return res.status(200).json(results[0]);
    });
});



// Check if a game is in favorites of user by username and appid
app.get('/check-favorite', (req, res) => {
    const { username, appId } = req.query;
    if (!username || !appId) {
        return res.status(400).json({ isFavorite: false });
    }
    db.query('SELECT UID FROM user WHERE username = ?', [username], (err, userResult) => {
        if (err) {
            console.error('Error fetching user UID:', err);
            return res.status(500).json({ isFavorite: false });
        }
        if (userResult.length === 0) {
            return res.status(404).json({ isFavorite: false });
        }
        const uid = userResult[0].UID;
        db.query('SELECT * FROM favorite WHERE UID = ? AND AppID = ?', [uid, appId], (err, favoriteResult) => {
            if (err) {
                console.error('Error checking favorite status:', err);
                return res.status(500).json({ isFavorite: false });
            }
            const isFavorite = favoriteResult.length > 0;
            return res.status(200).json({ isFavorite });
        });
    });
});



// Add a game to favorites by username and appid
app.post('/add-to-favorites', (req, res) => {
    const { username, appId } = req.body;
    if (!username || !appId) {
        return res.status(400).json({ success: false, message: 'Username and AppID are required' });
    }
    db.query('SELECT UID FROM user WHERE username = ?', [username], (err, userResult) => {
        if (err) {
            console.error('Error fetching user UID:', err);
            return res.status(500).json({ success: false, message: 'Server error' });
        }
        if (userResult.length === 0) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        const uid = userResult[0].UID;
        db.query('INSERT INTO favorite (UID, AppID) VALUES (?, ?)', [uid, appId], (err, result) => {
            if (err) {
                console.error('Error adding to favorites:', err);
                return res.status(500).json({ success: false, message: 'Server error' });
            }
            return res.status(200).json({ success: true, message: 'Added to favorites' });
        });
    });
});



// Remove a game from favorites
app.post('/remove-from-favorites', (req, res) => {
    const { username, appId } = req.body;
    if (!username || !appId) {
        return res.status(400).json({ success: false, message: 'Username and AppID are required' });
    }
    db.query('SELECT UID FROM user WHERE username = ?', [username], (err, userResult) => {
        if (err) {
            console.error('Error fetching user UID:', err);
            return res.status(500).json({ success: false, message: 'Server error' });
        }
        if (userResult.length === 0) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        const uid = userResult[0].UID;
        db.query('DELETE FROM favorite WHERE UID = ? AND AppID = ?', [uid, appId], (err, result) => {
            if (err) {
                console.error('Error removing from favorites:', err);
                return res.status(500).json({ success: false, message: 'Server error' });
            }
            return res.status(200).json({ success: true, message: 'Removed from favorites' });
        });
    });
});



// Start the server
app.listen(8801, () => {
    console.log(`Listening...`);
});