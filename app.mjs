// app.mjs
// Lunary: Your Daily Journal App with Moon Phase Tracking
// source: ES6 module syntax - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules
import 'dotenv/config';
import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { MongoClient, ServerApiVersion, ObjectId } from 'mongodb';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const uri = process.env.MONGO_URI;

// middleware
// source: https://expressjs.com/en/starter/static-files.html
app.use(express.static(join(__dirname, 'public'), { index: false }));
// source: https://expressjs.com/en/api.html#express.json
app.use(express.json());

// mongoDB connection
// source: https://www.mongodb.com/docs/drivers/node/current/quick-start/
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function connectToMongo() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
}
connectToMongo();

// get today's date as YYYY-MM-DD
// source: https://www.w3schools.com/js/js_dates.asp
function getTodayDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// API ROUTING

// serve the main HTML page
// source: literate-fortnight-yar app.mjs pattern
app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'public', 'lunary.html'));
});

// moon phase API proxy 
// source: https://www.freeastroapi.com/docs/utilities/moon-phase
app.get('/api/moon', async (req, res) => {
  try {
    const url = new URL('https://astro-api-1qnc.onrender.com/api/v1/moon/phase');
    url.searchParams.append('date', new Date().toISOString());
    url.searchParams.append('include_visuals', 'true');
  
    url.searchParams.append('style_moon_color', '#c9b3ff');

    const response = await fetch(url, {
      headers: { 'x-api-key': process.env.ASTRO_API_KEY }
    });
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching moon data:', error);
    res.status(500).json({ error: 'Failed to fetch moon phase data' });
  }
});

// health check
// GET /           -> serves lunary.html
// GET /api/moon   -> moon phase data
// POST /api/entry -> create entry
// GET /api/entries -> all entries
// GET /api/entry/today -> today's entry
// PUT /api/entry/:id   -> update entry
// DELETE /api/entry/:id -> delete entry
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', server: 'Lunary', timestamp: new Date().toISOString() });
});

// JOURNAL ENTRY CRUD 

// CREATE: adds a new journal entry
// source: https://www.mongodb.com/docs/drivers/node/current/usage-examples/insertOne/
app.post('/api/entry', async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    const db = client.db('cis486');
    const collection = db.collection('entries');
    const today = getTodayDate();

    // this checks if an entry already exists for today
    const existing = await collection.findOne({ date: today });
    if (existing) {
      return res.status(409).json({ error: 'An entry for today already exists. Please edit it instead.' });
    }

    const entry = {
      title,
      content,
      date: today,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await collection.insertOne(entry);
    res.status(201).json({ message: 'Journal entry saved!', id: result.insertedId });
  } catch (error) {
    console.error('Error creating entry:', error);
    res.status(500).json({ error: 'Failed to save journal entry' });
  }
});

// READ: this gets all journal entries, which newest is sorted first
// source: https://www.mongodb.com/docs/drivers/node/current/usage-examples/find/
app.get('/api/entries', async (req, res) => {
  try {
    const db = client.db('cis486');
    const collection = db.collection('entries');
    // source: https://www.w3schools.com/jsref/jsref_sort.asp
    const entries = await collection.find({}).sort({ date: -1 }).toArray();
    res.json(entries);
  } catch (error) {
    console.error('Error reading entries:', error);
    res.status(500).json({ error: 'Failed to get journal entries' });
  }
});

// READ: this gets today's journal entry
app.get('/api/entry/today', async (req, res) => {
  try {
    const db = client.db('cis486');
    const collection = db.collection('entries');
    const today = getTodayDate();
    const entry = await collection.findOne({ date: today });

    if (!entry) {
      return res.json({ exists: false });
    }

    res.json({ exists: true, entry });
  } catch (error) {
    console.error('Error reading today\'s entry:', error);
    res.status(500).json({ error: 'Failed to get today\'s entry' });
  }
});

// UPDATE: this updates a journal entry by ID
// source: https://www.mongodb.com/docs/drivers/node/current/usage-examples/updateOne/
app.put('/api/entry/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    const db = client.db('cis486');
    const collection = db.collection('entries');

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { title, content, updatedAt: new Date() } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Entry not found' });
    }

    res.json({ message: 'Journal entry updated!' });
  } catch (error) {
    console.error('Error updating entry:', error);
    res.status(500).json({ error: 'Failed to update journal entry' });
  }
});

// DELETE: this deletes a journal entry by ID
// source: https://www.mongodb.com/docs/drivers/node/current/usage-examples/deleteOne/
app.delete('/api/entry/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const db = client.db('cis486');
    const collection = db.collection('entries');

    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Entry not found' });
    }

    res.json({ message: 'Journal entry deleted!' });
  } catch (error) {
    console.error('Error deleting entry:', error);
    res.status(500).json({ error: 'Failed to delete journal entry' });
  }
});

// this starts the server
app.listen(3000, () => {
  console.log('Lunary is running on http://localhost:3000');
});
