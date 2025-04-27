// /pages/api/impianti/index.js

import axios from 'axios';

const supabaseUrl = process.env.SUPABASE_URL + '/rest/v1/';
const supabaseApiKey = process.env.SUPABASE_ANON_KEY;

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const response = await axios.get(supabaseUrl + 'impianti', {
        headers: {
          apikey: supabaseApiKey,
          Authorization: `Bearer ${supabaseApiKey}`
        }
      });
      res.status(200).json(response.data);
    } catch (err) {
      console.error('Errore GET impianti:', err.response?.data || err.message);
      res.status(500).json({ error: 'Errore recupero impianti' });
    }
  }

  if (req.method === 'POST') {
    const { nome, codice_attivazione } = req.body;

    if (!nome || !codice_attivazione) {
      return res.status(400).json({ error: 'Tutti i campi sono obbligatori' });
    }

    try {
      const response = await axios.post(
        supabaseUrl + 'impianti',
        [
          {
            nome,
            codice_attivazione
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

      res.status(201).json({ message: 'Impianto creato con successo!', impianto: response.data[0] });
    } catch (err) {
      console.error('Errore POST impianti:', err.response?.data || err.message);
      res.status(500).json({ error: 'Errore creazione impianto' });
    }
  }

  if (req.method !== 'GET' && req.method !== 'POST') {
    res.status(405).json({ error: 'Metodo non consentito' });
  }
}
