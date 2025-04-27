// /pages/api/utenti/index.js

import axios from 'axios';
import bcrypt from 'bcryptjs';

const supabaseUrl = process.env.SUPABASE_URL + '/rest/v1/';
const supabaseApiKey = process.env.SUPABASE_ANON_KEY;

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const response = await axios.get(supabaseUrl + 'utenti', {
        headers: {
          apikey: supabaseApiKey,
          Authorization: `Bearer ${supabaseApiKey}`
        }
      });
      res.status(200).json(response.data);
    } catch (err) {
      console.error('Errore GET utenti:', err.response?.data || err.message);
      res.status(500).json({ error: 'Errore recupero utenti' });
    }
  }

  if (req.method === 'POST') {
    const { nome, cognome, cellulare, email, password, ruolo } = req.body;

    if (!nome || !cognome || !cellulare || !email || !password || !ruolo) {
      return res.status(400).json({ error: 'Tutti i campi sono obbligatori' });
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      const response = await axios.post(
        supabaseUrl + 'utenti',
        [
          {
            nome,
            cognome,
            cellulare,
            email,
            password_hash: hashedPassword,
            ruolo,
            attivo: true,
            superadmin: false
          }
        ],
        {
          headers: {
            apikey: supabaseApiKey,
            Authorization: `Bearer ${supabaseApiKey}`,
            "Content-Type": "application/json",
            Prefer: "return=representation"
          }
        }
      );

      res.status(201).json({ message: 'Utente creato con successo!', utente: response.data[0] });
      catch (err) {
        console.error('Errore POST utenti DETTAGLIATO:', JSON.stringify(err.response?.data || err.message, null, 2));
        res.status(500).json({ 
          error: 'Errore creazione utente',
          dettagli: err.response?.data || err.message 
        });
      }
      

  if (req.method !== 'GET' && req.method !== 'POST') {
    res.status(405).json({ error: 'Metodo non consentito' });
  }
}
