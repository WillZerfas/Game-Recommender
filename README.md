# Game-Recommender
Find video games based on user input

To get the backend running go to backend:  Game-Recommender\search-for-game\Backend
Then put in:   node server.js

Database setup is:
const db = mysql.createConnection({
    host: "localhost",
    user: 'root',
    password: 'Bucky2024!',
    database: 'steamgames'
});

After the backend is running open a new terminal:
Go to the frontend: Game-Recommender\search-for-game\Frontend
Then put in:  npm start

The Home screen for the app should open up!