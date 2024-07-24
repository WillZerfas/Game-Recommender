const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());

const db = mysql.createConnection({
    host: "localhost",
    user: 'root',
    password: 'Bucky2024!',
    database: 'steamgames'
});

app.get('/', (req, res) =>{
    return res.json("From Backend Side");
});

app.get('/user', (req, res) => {
    const sql = "SELECT * FROM user";
    db.query(sql, (err, data) => {
        if(err) return res.json(err);
        return res.json(data);
    });
});



app.listen(8801, () => {
    console.log("listening");
})