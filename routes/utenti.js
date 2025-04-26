// /routes/utenti.js

import express from 'express';
import { getUtenti } from '../controllers/utentiController.js';

const router = express.Router();

router.get('/', getUtenti);

export default router;
