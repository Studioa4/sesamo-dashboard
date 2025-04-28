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
      console.error('Errore caricamento utenti:', err.response?.data || err.message);
      res.status(500).json({ error: 'Errore caricamento utenti' });
    }
  } 
  else if (req.method === 'POST') {
    const { nome, cognome, cellulare, email, ruolo, password } = req.body;

    if (!nome || !cognome || !cellulare || !email || !ruolo) {
      return res.status(400).json({ error: 'Nome, Cognome, Cellulare, Email e Ruolo sono obbligatori' });
    }

    try {
      let userData = {
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
      console.error('Errore creazione utente:', err.response?.data || err.message);
      res.status(500).json({ error: 'Errore creazione utente' });
    }
  } 
  else {
    res.status(405).json({ error: 'Metodo non consentito' });
  }
}
