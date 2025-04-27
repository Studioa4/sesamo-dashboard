// /pages/api/impianti/[id].js

import axios from 'axios';

const supabaseUrl = process.env.SUPABASE_URL + '/rest/v1/';
const supabaseApiKey = process.env.SUPABASE_ANON_KEY;

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'PUT') {
    const { nome, indirizzo, codice_attivazione } = req.body;

    if (!nome) {
      return res.status(400).json({ error: 'Il nome è obbligatorio' });
    }

    try {
      const response = await axios.patch(
        `${supabaseUrl}impianti?id=eq.${id}`,
        {
          nome,
          indirizzo,
          codice_attivazione
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

      res.status(200).json({ message: 'Impianto modificato con successo!' });

    } catch (err) {
      console.error('Errore modifica impianto:', err.response?.data || err.message);
      res.status(500).json({ error: 'Errore modifica impianto' });
    }
  } else if (req.method === 'DELETE') {
    try {
      const response = await axios.delete(
        `${supabaseUrl}impianti?id=eq.${id}`,
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
      console.error('Errore elimina impianto:', err.response?.data || err.message);
      res.status(500).json({ error: 'Errore eliminazione impianto' });
    }
  } else {
    res.status(405).json({ error: 'Metodo non consentito' });
  }
}
