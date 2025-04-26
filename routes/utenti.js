import express from 'express';
import { getUtenti } from '../controllers/utentiController.js';
import { creaUtente } from '../controllers/creaUtenteController.js';

const router = express.Router();

router.get('/', getUtenti);
router.post('/', creaUtente); // ✅ Aggiunta POST per creare utenti

export default router;
