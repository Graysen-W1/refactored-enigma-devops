// app.mjs
// main entry point - wires together routes, middleware, and database
// source: https://expressjs.com/en/starter/hello-world.html
import 'dotenv/config';
import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import authRoutes from './routes/authRoutes.mjs';
import entryRoutes from './routes/entryRoutes.mjs';
import moonRoutes from './routes/moonRoutes.mjs';
import errorHandler from './middleware/errorHandler.mjs';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// middleware
// source: https://expressjs.com/en/starter/static-files.html
app.use(express.static(join(__dirname, 'public'), { index: false }));
// source: https://expressjs.com/en/api.html#express.json
app.use(express.json());

// serve pages
// source: literate-fortnight-yar app.mjs pattern
app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'public', 'login.html'));
});

app.get('/journal', (req, res) => {
  res.sendFile(join(__dirname, 'public', 'lunary.html'));
});

// mount API routes
// source: https://expressjs.com/en/guide/routing.html#express-router
app.use('/api', authRoutes);
app.use('/api', entryRoutes);
app.use('/api', moonRoutes);

// error-handling middleware (must be last)
// source: https://expressjs.com/en/guide/error-handling.html
app.use(errorHandler);

// start the server
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
