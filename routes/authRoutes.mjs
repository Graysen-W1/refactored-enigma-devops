// routes/authRoutes.mjs
// defines the authentication routes
// source: https://expressjs.com/en/guide/routing.html
import { Router } from 'express';
import { register, login } from '../controllers/authController.mjs';

const router = Router();

router.post('/register', register);
router.post('/login', login);

// source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export
export default router;
