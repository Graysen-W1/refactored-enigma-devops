// controllers/authController.mjs
// this handles user registration and login
// source: https://firebase.google.com/docs/firestore/manage-data/add-data
import { db } from '../models/db.mjs';
// source: https://www.npmjs.com/package/bcrypt
import bcrypt from 'bcrypt';
// source: https://www.npmjs.com/package/jsonwebtoken
import jwt from 'jsonwebtoken';

// REGISTER: this creates a new user
async function register(req, res) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    // this checks if username already exists
    // source: https://firebase.google.com/docs/firestore/query-data/queries#simple_queries
    const snapshot = await db.collection('users').where('username', '==', username).get();
    if (!snapshot.empty) {
      return res.status(409).json({ error: 'Username already taken' });
    }

    // this hashes the password before storing
    // source: https://www.npmjs.com/package/bcrypt#usage
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = {
      username,
      password: hashedPassword,
      createdAt: new Date().toISOString()
    };

    await db.collection('users').add(user);
    res.status(201).json({ message: 'Account created!' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Failed to register' });
  }
}

// LOGIN: this authenticates a user and returns a JWT
async function login(req, res) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    // find the user by username
    const snapshot = await db.collection('users').where('username', '==', username).get();
    if (snapshot.empty) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const userDoc = snapshot.docs[0];
    const user = userDoc.data();

    // this compares the password with the hashed one
    // source: https://www.npmjs.com/package/bcrypt#to-check-a-password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // this creates a JWT token
    // source: https://www.npmjs.com/package/jsonwebtoken#jwtsignpayload-secretorprivatekey-options-callback
    const token = jwt.sign(
      { id: userDoc.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ message: 'Login successful!', token });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Failed to login' });
  }
}

// source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export
export { register, login };
