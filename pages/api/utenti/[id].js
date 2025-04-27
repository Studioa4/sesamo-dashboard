// /pages/api/utenti/[id].js

import axios from 'axios';
import bcrypt from 'bcryptjs';

const supabaseUrl = process.env.SUPABASE_URL + '/rest/v1/';
const supabaseApiKey = process.env.SUPABASE_ANON_KEY;

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'PUT') {
    const { nome, cognome, cellulare, email, password, ruolo } = req.body;

    if (!nome || !cognome || !cellulare || !email || !ruolo) {
      return res.status(400).json({ error: 'Tutti i campi sono obbligatori' });
    }

    try {
      let updateData = {
        nome,
        cognome,
        cellulare,
        email,
        ruolo
      };

      if (password && password !== '') {
        const hashedPassword = await bcrypt.hash(password, 10);
        updateData.password_hash = hashedPassword;
      }

      const response = await axios.patch(
        `${supabaseUrl}utenti?id=eq.${id}`,
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

      const data = response.data;

      res.status(200).json({ message: 'Utente modificato con successo!', utente: data[0] });

    } catch (err) {
      console.error('Errore PATCH utenti:', err.response?.data || err.message);
      res.status(500).json({ error: 'Errore modifica utente' });
    }
  } else if (req.method === 'DELETE') {
    try {
      const response = await axios.delete(
        `${supabaseUrl}utenti?id=eq.${id}`,
        {
          headers: {
            apikey: supabaseApiKey,
            Authorization: `Bearer ${supabaseApiKey}`,
            Prefer: "return=representation"
          }
        }
      );

      res.status(204).end(); // Nessun contenuto = eliminazione riuscita

    } catch (err) {
      console.error('Errore DELETE utenti:', err.response?.data || err.message);
      res.status(500).json({ error: 'Errore eliminazione utente' });
    }
  } else {
    res.status(405).json({ error: 'Metodo non consentito' });
  }
}
