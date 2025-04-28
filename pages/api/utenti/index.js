import axios from 'axios';
import bcrypt from 'bcryptjs';

const supabaseUrl = process.env.SUPABASE_URL + '/rest/v1/';
const supabaseApiKey = process.env.SUPABASE_ANON_KEY;

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const response = await axios.get(
        supabaseUrl + 'utenti',
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
      console.error('Errore caricamento utenti:', JSON.stringify(err.response?.data || err.message, null, 2));
      res.status(500).json({ error: err.response?.data?.message || 'Errore caricamento utenti' });
    }
  } 
  else if (req.method === 'POST') {
    const { nome, cognome, cellulare, email, ruolo, password } = req.body;

    if (!nome || !cognome || !cellulare || !email || !ruolo) {
      return res.status(400).json({ error: 'Nome, Cognome, Cellulare, Email e Ruolo sono obbligatori' });
    }

    const userData = {
      nome,
      cognome,
      cellulare,
      email,
      ruolo,
      indirizzo: req.body.indirizzo || '',
      citta: req.body.citta || '',
      provincia: req.body.provincia || '',
      stato: req.body.stato || '',
      attivo: req.body.attivo ?? true,
      superadmin: req.body.superadmin ?? false
    };

    try {
      if (password && password !== '') {
        const hashedPassword = await bcrypt.hash(password, 10);
        userData.password_hash = hashedPassword;
      }

      const response = await axios.post(
        supabaseUrl + 'utenti',
        [userData],
        {
          headers: {
            apikey: supabaseApiKey,
            Authorization: `Bearer ${supabaseApiKey}`,
            "Content-Type": "application/json",
            Prefer: "return=representation"
          }
        }
      );

      res.status(201).json({ message: 'Utente creato con successo!', utente: response.data[0] });
    } catch (err) {
      if (err.response && err.response.data) {
        console.error('Errore creazione utente (dettagli Supabase):', JSON.stringify(err.response.data, null, 2));
        res.status(500).json({
          error: err.response.data.message || 'Errore creazione utente',
          details: err.response.data.details || ''
        });
      } else {
        console.error('Errore creazione utente (errore locale):', err.message);
        res.status(500).json({ error: err.message });
      }
    }
  } 
  else {
    res.status(405).json({ error: 'Metodo non consentito' });
  }
}
