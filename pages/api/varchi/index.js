// /pages/api/varchi/index.js

import axios from 'axios';

const supabaseUrl = process.env.SUPABASE_URL + '/rest/v1/';
const supabaseApiKey = process.env.SUPABASE_ANON_KEY;

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const response = await axios.get(supabaseUrl + 'varchi', {
        headers: {
          apikey: supabaseApiKey,
          Authorization: `Bearer ${supabaseApiKey}`
        }
      });
      res.status(200).json(response.data);
    } catch (err) {
      console.error('Errore GET varchi:', err.response?.data || err.message);
      res.status(500).json({ error: 'Errore recupero varchi' });
    }
  }

  if (req.method === 'POST') {
    const { nome_varco, impianto_id } = req.body;

    if (!nome_varco || !impianto_id) {
      return res.status(400).json({ error: 'Tutti i campi sono obbligatori' });
    }

    try {
      const response = await axios.post(
        supabaseUrl + 'varchi',
        [
          {
            nome_varco,
            impianto_id
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

      res.status(201).json({ message: 'Varco creato con successo!', varco: response.data[0] });
    } catch (err) {
      console.error('Errore POST varchi:', err.response?.data || err.message);
      res.status(500).json({ error: 'Errore creazione varco' });
    }
  }

  if (req.method !== 'GET' && req.method !== 'POST') {
    res.status(405).json({ error: 'Metodo non consentito' });
  }
}
