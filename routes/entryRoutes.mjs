// routes/entryRoutes.mjs
// this defines the journal entry API routes
// source: https://expressjs.com/en/guide/routing.html
import { Router } from 'express';
import authCheck from '../middleware/auth.mjs';
import { createEntry, getAllEntries, getTodayEntry, searchEntries, updateEntry, deleteEntry } from '../controllers/entryController.mjs';

const router = Router();

// these are all the CRUD routes for journal entries. these now have proper protection with authCheck
// source: https://expressjs.com/en/guide/using-middleware.html#middleware.router
router.post('/entry', authCheck, createEntry);
router.get('/entries', authCheck, getAllEntries);
router.get('/entries/search', authCheck, searchEntries);
router.get('/entry/today', authCheck, getTodayEntry);
router.put('/entry/:id', authCheck, updateEntry);
router.delete('/entry/:id', authCheck, deleteEntry);

// source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export
export default router;
