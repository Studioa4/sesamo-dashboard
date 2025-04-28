import axios from 'axios';

const supabaseUrl = process.env.SUPABASE_URL + '/rest/v1/';
const supabaseApiKey = process.env.SUPABASE_ANON_KEY;

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    try {
      const response = await axios.get(
        supabaseUrl + 'anagrafiche',
        {
          headers: {
            apikey: supabaseApiKey,
            Authorization: `Bearer ${supabaseApiKey}`
          }
        }
      );
      res.status(200).json(response.data);
    } catch (err) {
      console.error('Errore caricamento anagrafiche:', err.response?.data || err.message);
      res.status(500).json({ error: 'Errore caricamento anagrafiche' });
    }
  } 
  else if (req.method === 'POST') {
    const {
      codice_fiscale, username, nome, cognome,
      cellulare, email, indirizzo, citta, provincia, stato, ruoli
    } = req.body;

    if (!codice_fiscale || !nome || !cognome) {
      return res.status(400).json({ error: 'Codice Fiscale, Nome e Cognome sono obbligatori' });
    }

    const data = {
      codice_fiscale,
      username: username || codice_fiscale,
      nome,
      cognome,
      cellulare: cellulare || '',
      email: email || '',
      indirizzo: indirizzo || '',
      citta: citta || '',
      provincia: provincia || '',
      stato: stato || '',
      ruoli: ruoli || [],
      attivo: true,
      superadmin: false
    };

    try {
      const response = await axios.post(
        supabaseUrl + 'anagrafiche',
        [data],
        {
          headers: {
            apikey: supabaseApiKey,
            Authorization: `Bearer ${supabaseApiKey}`,
            "Content-Type": "application/json",
            Prefer: "return=representation"
          }
        }
      );
      res.status(201).json(response.data[0]);
    } catch (err) {
      console.error('Errore creazione anagrafica:', err.response?.data || err.message);
      res.status(500).json({ error: 'Errore creazione anagrafica' });
    }
  }
  else {
    res.status(405).json({ error: 'Metodo non consentito' });
  }
}
