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

      const { data, error } = await axios.patch(
        supabaseUrl + `utenti?id=eq.${id}`,
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

      if (error) {
        console.error('Errore PATCH utenti:', error);
        return res.status(500).json({ error: 'Errore modifica utente' });
      }

      res.status(200).json({ message: 'Utente modificato con successo!', utente: data[0] });

    } catch (err) {
      console.error('Errore modifica utenti:', err.response?.data || err.message);
      res.status(500).json({ error: 'Errore server modifica utenti' });
    }
  } else if (req.method === 'DELETE') {
    try {
      const { data, error } = await axios.delete(
        supabaseUrl + `utenti?id=eq.${id}`,
        {
          headers: {
            apikey: supabaseApiKey,
            Authorization: `Bearer ${supabaseApiKey}`,
          }
        }
      );

      if (error) {
        console.error('Errore DELETE utenti:', error);
        return res.status(500).json({ error: 'Errore eliminazione utente' });
      }

      res.status(204).end(); // Nessun contenuto

    } catch (err) {
      console.error('Errore elimina utenti:', err.response?.data || err.message);
      res.status(500).json({ error: 'Errore server elimina utenti' });
    }
  } else {
    res.status(405).json({ error: 'Metodo non consentito' });
  }
}
