import axios from 'axios';

const supabaseUrl = process.env.SUPABASE_URL + '/rest/v1/';
const supabaseApiKey = process.env.SUPABASE_ANON_KEY;

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const response = await axios.get(
        supabaseUrl + 'impianti',
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
      console.error('Errore caricamento impianti:', err.response?.data || err.message);
      res.status(500).json({ error: 'Errore caricamento impianti' });
    }
  } 
  else if (req.method === 'POST') {
    const { denominazione, amministratore_id } = req.body;

    if (!denominazione) {
      return res.status(400).json({ error: 'Denominazione è obbligatoria' });
    }

    if (!amministratore_id) {
      return res.status(400).json({ error: 'Amministratore è obbligatorio' });
    }

    try {
      const impiantoData = {
        denominazione,
        indirizzo: req.body.indirizzo || '',
        citta: req.body.citta || '',
        provincia: req.body.provincia || '',
        latitudine: req.body.latitudine ? parseFloat(req.body.latitudine) : null,
        longitudine: req.body.longitudine ? parseFloat(req.body.longitudine) : null,
        amministratore_id
      };

      const response = await axios.post(
        supabaseUrl + 'impianti',
        [impiantoData],
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

      catch (err) {
        if (err.response && err.response.data) {
          console.error('Errore creazione impianto (dettagli Supabase):', JSON.stringify(err.response.data, null, 2));
          res.status(500).json({ error: err.response.data.message || 'Errore creazione impianto', details: err.response.data.details || '' });
        } else {
          console.error('Errore creazione impianto (errore locale):', err.message);
          res.status(500).json({ error: err.message });
        }
      }