// /pages/api/storico/index.js

import axios from 'axios';

const supabaseUrl = process.env.SUPABASE_URL + '/rest/v1/';
const supabaseApiKey = process.env.SUPABASE_ANON_KEY;

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const response = await axios.get(supabaseUrl + 'storico_accessi', {
        headers: {
          apikey: supabaseApiKey,
          Authorization: `Bearer ${supabaseApiKey}`
        }
      });
      res.status(200).json(response.data);
    } catch (err) {
      console.error('Errore GET storico:', err.response?.data || err.message);
      res.status(500).json({ error: 'Errore recupero storico' });
    }
  } else {
    res.status(405).json({ error: 'Metodo non consentito' });
  }
}
