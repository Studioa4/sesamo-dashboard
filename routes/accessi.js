import express from 'express';
import { configuraAccesso } from '../controllers/accessiConfiguraController.js';
import { abilitaAccesso } from '../controllers/accessiAbilitaController.js';
import { openAccesso } from '../controllers/accessiOpenController.js';

const router = express.Router();

// Route per configurare un varco
router.post('/configura', configuraAccesso);

// Route per abilitare un utente ad aprire un varco
router.post('/abilita', abilitaAccesso);

// Route per aprire un varco
router.post('/open', openAccesso);

export default router;
