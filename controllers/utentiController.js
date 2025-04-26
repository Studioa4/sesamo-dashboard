// /controllers/utentiController.js

import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const supabase = axios.create({
  baseURL: process.env.SUPABASE_URL + '/rest/v1/',
  headers: {
    apikey: process.env.SUPABASE_ANON_KEY,
    Authorization: `Bearer ${process.env.SUPABASE_ANON_KEY}`
  }
});

export async function getUtenti(req, res) {
  try {
    const { data } = await supabase.get('utenti', {
      params: { select: '*' }
    });
    res.status(200).json(data);
  } catch (err) {
    console.error('Errore caricamento utenti:', err.response?.data || err.message);
    res.status(500).json({ error: 'Errore caricamento utenti' });
  }
}
