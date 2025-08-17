
const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');

const app = express();
app.use(express.json());

app.use(cors({
  origin: '*',
  methods: 'GET,POST,PUT,DELETE,OPTIONS',
  allowedHeaders: 'Content-Type,Authorization',
}));

const MONGO_URI = 'mongodb://172.29.14.81:27017';  
const DB_NAME = 'Arcade';

let db;

async function connectMongo() {
  const client = new MongoClient(MONGO_URI);
  await client.connect();
  db = client.db(DB_NAME);
  console.log('✅ Connected to MongoDB');
}
connectMongo().catch(err => {
  console.error('❌ MongoDB connection failed:', err);
  process.exit(1);
});

// Login Route
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).send('Username and password required');

  try {
    const user = await db.collection('users').findOne({ username });
    if (!user || user.password_hash !== password) {
      return res.status(401).send('Invalid credentials');
    }
    res.status(200).send(`Login successful for ${username}`);
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).send('Internal Server Error');
  }
});

// Get All Games
app.get('/games', async (req, res) => {
  try {
    const games = await db.collection('games').find().toArray();
    res.json(games);
  } catch (err) {
    console.error('Get games error:', err);
    res.status(500).send('Internal Server Error');
  }
});

// Add Game Scores
app.post('/score-entry', async (req, res) => {
  const { game_id, name, rollno, score } = req.body;

  if (!game_id || !name || !rollno || typeof score !== 'number') {
    return res.status(400).send('Please provide game_id, name, rollno, and numeric score');
  }

  try {
    await db.collection('scores').insertOne({
      game_id,
      name,
      rollno,
      score,
      timestamp: new Date(),
    });
    res.status(201).send('Score entry added successfully');
  } catch (err) {
    console.error('Insert score error:', err);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/scores', async (req, res) => {
  try {
    const aggregation = [
      // Group by rollno and name to count name frequencies
      {
        $group: {
          _id: { rollno: '$rollno', name: '$name' },
          nameCount: { $sum: 1 },
          totalScore: { $sum: '$score' }
        }
      },
      // Group by rollno again to pick most frequent name
      {
        $sort: { 'nameCount': -1 } // important for picking the first name later
      },
      {
        $group: {
          _id: '$_id.rollno',
          totalScore: { $sum: '$totalScore' },
          name: { $first: '$_id.name' }
        }
      },
      {
        $project: {
          _id: 0,
          rollno: '$_id',
          name: 1,
          totalScore: 1
        }
      },
      { $sort: { totalScore: -1 } }
    ];

    const results = await db.collection('scores').aggregate(aggregation).toArray();
    res.json(results);
  } catch (err) {
    console.error('Get scores error:', err);
    res.status(500).send('Internal Server Error');
  }
});// Add Games by Game ID
app.post('/add-games', async (req, res) => {
  const { games } = req.body;
  if (!Array.isArray(games)) return res.status(400).send('Games must be an array of objects with game_id and name');

  try {
    const docs = games.map(({ game_id, name }) => ({ game_id, name }));
    await db.collection('games').insertMany(docs);
    res.status(201).send('Games added successfully');
  } catch (err) {
    console.error('Add games error:', err);
    res.status(500).send('Internal Server Error');
  }
});

// Bulk Delete Scores by Roll Number
app.delete('/delete-scores', async (req, res) => {
  const { rollnos } = req.body;
  if (!Array.isArray(rollnos)) return res.status(400).send('rollnos must be an array');

  try {
    const result = await db.collection('scores').deleteMany({ rollno: { $in: rollnos } });
    res.status(200).send(`Deleted ${result.deletedCount} score(s)`);
  } catch (err) {
    console.error('Delete scores error:', err);
    res.status(500).send('Internal Server Error');
  }
});

// Safety
process.on('unhandledRejection', (reason) => console.error('Unhandled Rejection:', reason));
process.on('uncaughtException', (err) => console.error('Uncaught Exception:', err));

const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

