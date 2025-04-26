import express from 'express';
import { createImpianto } from '../controllers/setupController.js';

const router = express.Router();

router.post('/', createImpianto);

export default router;