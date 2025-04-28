import axios from 'axios';

const supabaseUrl = process.env.SUPABASE_URL + '/rest/v1/';
const supabaseApiKey = process.env.SUPABASE_ANON_KEY;

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const response = await axios.get(
        supabaseUrl + 'varchi',
        {
          headers: {
            apikey: supabaseApiKey,
            Authorization: `Bearer ${supabaseApiKey}`,
            "Content-Type": "application/json"
          }
        }
      );
      res.status(200).json(response.data);
    } catch (err) {
      console.error('Errore caricamento varchi:', err.response?.data || err.message);
      res.status(500).json({ error: 'Errore caricamento varchi' });
    }
  } else if (req.method === 'POST') {
    const { denominazione, impianto_id } = req.body;

    if (!denominazione || !impianto_id) {
      return res.status(400).json({ error: 'Denominazione e Impianto sono obbligatori' });
    }

    try {
      const varcoData = {
        denominazione,
        codice_attivazione: req.body.codice_attivazione || '',
        impianto_id
      };

      const response = await axios.post(
        supabaseUrl + 'varchi',
        [varcoData],
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
      console.error('Errore creazione varco:', err.response?.data || err.message);
      res.status(500).json({ error: 'Errore creazione varco' });
    }
  } else {
    res.status(405).json({ error: 'Metodo non consentito' });
  }
}
