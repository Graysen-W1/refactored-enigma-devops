// controllers/entryController.mjs
// this will handle the logic for journal entry CRUD operations
// source: https://firebase.google.com/docs/firestore/manage-data/add-data
// source: https://firebase.google.com/docs/firestore/query-data/get-data
import { db, getTodayDate } from '../models/db.mjs';

// CREATE: adds a new journal entry
// source: https://firebase.google.com/docs/firestore/manage-data/add-data#add_a_document
async function createEntry(req, res) {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    const today = getTodayDate();

    // this checks if an entry already exists for today
    // source: https://firebase.google.com/docs/firestore/query-data/queries#simple_queries
    const snapshot = await db.collection('entries').where('date', '==', today).get();
    if (!snapshot.empty) {
      return res.status(409).json({ error: 'An entry for today already exists. Please edit it instead.' });
    }

    const entry = {
      title,
      content,
      date: today,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const docRef = await db.collection('entries').add(entry);
    res.status(201).json({ message: 'Journal entry saved!', id: docRef.id });
  } catch (error) {
    console.error('Error creating entry:', error);
    res.status(500).json({ error: 'Failed to save journal entry' });
  }
}

// READ: this gets all journal entries, newest sorted first
// source: https://firebase.google.com/docs/firestore/query-data/order-limit-data
async function getAllEntries(req, res) {
  try {
    const snapshot = await db.collection('entries').orderBy('date', 'desc').get();
    const entries = [];
    snapshot.forEach(doc => {
      entries.push({ _id: doc.id, ...doc.data() });
    });
    res.json(entries);
  } catch (error) {
    console.error('Error reading entries:', error);
    res.status(500).json({ error: 'Failed to get journal entries' });
  }
}

// READ: this gets today's journal entry
// source: https://firebase.google.com/docs/firestore/query-data/queries#simple_queries
async function getTodayEntry(req, res) {
  try {
    const today = getTodayDate();
    const snapshot = await db.collection('entries').where('date', '==', today).get();

    if (snapshot.empty) {
      return res.json({ exists: false });
    }

    const doc = snapshot.docs[0];
    res.json({ exists: true, entry: { _id: doc.id, ...doc.data() } });
  } catch (error) {
    console.error('Error reading today\'s entry:', error);
    res.status(500).json({ error: 'Failed to get today\'s entry' });
  }
}

// UPDATE: this updates a journal entry by ID
// source: https://firebase.google.com/docs/firestore/manage-data/add-data#update-data
async function updateEntry(req, res) {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    const docRef = db.collection('entries').doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'Entry not found' });
    }

    await docRef.update({
      title,
      content,
      updatedAt: new Date().toISOString()
    });

    res.json({ message: 'Journal entry updated!' });
  } catch (error) {
    console.error('Error updating entry:', error);
    res.status(500).json({ error: 'Failed to update journal entry' });
  }
}

// DELETE: this deletes a journal entry by ID
// source: https://firebase.google.com/docs/firestore/manage-data/delete-data
async function deleteEntry(req, res) {
  try {
    const { id } = req.params;

    const docRef = db.collection('entries').doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'Entry not found' });
    }

    await docRef.delete();
    res.json({ message: 'Journal entry deleted!' });
  } catch (error) {
    console.error('Error deleting entry:', error);
    res.status(500).json({ error: 'Failed to delete journal entry' });
  }
}

// source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export
export { createEntry, getAllEntries, getTodayEntry, updateEntry, deleteEntry };
