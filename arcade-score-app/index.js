const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

const app = express();
app.use(express.json());

// Middleware to log requests
app.use((req, res, next) => {
    console.log(`${req.method} request to ${req.url}`);
    next();
});


app.use(cors({
    origin: '*', // Replace with your React app's IP and port
    methods: 'GET,POST,PUT,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type,Authorization',
}));

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: 'Jaswanth84',
    database: 'Arcade',
    port: 3306,
};

// Test database connection
const testDbConnection = async () => {
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        console.log('Database connection successful!');
        await connection.execute('SELECT 1'); // Simple query to test connection
    } catch (err) {
        console.error('Database connection failed:', err);
        process.exit(1); // Exit the process with failure code
    } finally {
        if (connection) {
            await connection.end();
        }
    }
};

testDbConnection();

// User Login
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute(
            `SELECT * FROM Users WHERE username = ? AND password_hash = ?`,
            [username, password]
        );

        const user = rows[0];

        if (!user) {
            return res.status(401).send('Invalid credentials');
        }

        res.status(200).send(`Login successful for ${user.username}`);
        await connection.end();
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/games', async (req, res) => {
    try {
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT * FROM Games'); // Adjust the query as needed
        res.json(rows);
        await connection.end();
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

// Route to handle score entries
app.post('/score-entry', async (req, res) => {
    const { game_id, username, score } = req.body;

    try {
        const connection = await mysql.createConnection(dbConfig);
        const [result] = await connection.execute(
            `INSERT INTO Scores (game_id, username, score) VALUES (?, ?, ?)`,

            [game_id, username, score]
        );

        res.status(201).send('Score entry added successfully');
        await connection.end();
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/scores', async (req, res) => {
    try {
        const connection = await mysql.createConnection(dbConfig);

        // Get all unique usernames
        const [users] = await connection.execute('SELECT DISTINCT username FROM Scores');

        const scores = [];

        // Calculate the total score for each user
        for (let user of users) {
            const [totalScore] = await connection.execute(
                'SELECT SUM(score) as totalScore FROM Scores WHERE username = ?',
                [user.username]
            );
            scores.push({ username: user.username, totalScore: totalScore[0].totalScore });
        }

        res.json(scores);
        await connection.end();
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));
