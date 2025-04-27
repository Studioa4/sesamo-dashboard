// /pages/api/varchi/[id].js

import axios from 'axios';

const supabaseUrl = process.env.SUPABASE_URL + '/rest/v1/';
const supabaseApiKey = process.env.SUPABASE_ANON_KEY;

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'PUT') {
    const { nome_varco, impianto_id } = req.body;

    if (!nome_varco || !impianto_id) {
      return res.status(400).json({ error: 'Tutti i campi sono obbligatori' });
    }

    try {
      const response = await axios.patch(
        `${supabaseUrl}varchi?id=eq.${id}`,
        {
          nome_varco,
          impianto_id
        },
        {
          headers: {
            apikey: supabaseApiKey,
            Authorization: `Bearer ${supabaseApiKey}`,
            "Content-Type": "application/json",
            Prefer: "return=representation"
          }
        }
      );

      res.status(200).json({ message: 'Varco modificato con successo!' });

    } catch (err) {
      console.error('Errore modifica varco:', err.response?.data || err.message);
      res.status(500).json({ error: 'Errore modifica varco' });
    }
  } else if (req.method === 'DELETE') {
    try {
      const response = await axios.delete(
        `${supabaseUrl}varchi?id=eq.${id}`,
        {
          headers: {
            apikey: supabaseApiKey,
            Authorization: `Bearer ${supabaseApiKey}`,
            Prefer: "return=representation"
          }
        }
      );

      res.status(204).end(); // Nessun contenuto

    } catch (err) {
      console.error('Errore elimina varco:', err.response?.data || err.message);
      res.status(500).json({ error: 'Errore eliminazione varco' });
    }
  } else {
    res.status(405).json({ error: 'Metodo non consentito' });
  }
}
