import axios from 'axios';

const supabaseUrl = process.env.SUPABASE_URL + '/rest/v1/';
const supabaseApiKey = process.env.SUPABASE_ANON_KEY;

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'PUT') {
    const {
      denominazione,
      indirizzo,
      citta,
      provincia,
      latitudine,
      longitudine,
      amministratore_id
    } = req.body;

    if (!denominazione || !amministratore_id) {
      return res.status(400).json({ error: 'Denominazione e Amministratore sono obbligatori' });
    }

    try {
      const updateData = {
        denominazione,
        indirizzo,
        citta,
        provincia,
        latitudine: latitudine ? parseFloat(latitudine) : null,
        longitudine: longitudine ? parseFloat(longitudine) : null,
        amministratore_id
      };

      const response = await axios.patch(
        `${supabaseUrl}impianti?id=eq.${id}`,
        updateData,
        {
          headers: {
            apikey: supabaseApiKey,
            Authorization: `Bearer ${supabaseApiKey}`,
            "Content-Type": "application/json",
            Prefer: "return=representation"
          }
        }
      );

      res.status(200).json({ message: 'Impianto modificato con successo!', impianto: response.data[0] });

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
      res.status(204).end();
    } catch (err) {
      console.error('Errore elimina impianto:', err.response?.data || err.message);
      res.status(500).json({ error: 'Errore eliminazione impianto' });
    }
  } else {
    res.status(405).json({ error: 'Metodo non consentito' });
  }
}
