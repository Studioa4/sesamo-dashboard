import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const supabase = axios.create({
  baseURL: process.env.SUPABASE_URL + '/rest/v1/',
  headers: {
    apikey: process.env.SUPABASE_ANON_KEY,
    Authorization: `Bearer ${process.env.SUPABASE_ANON_KEY}`
  }
});

export async function logAccesso(req, res) {
  const { accesso_id, utente_id, note } = req.body;

  try {
    const { data } = await supabase.post('accessi_log', {
      accesso_id,
      utente_id,
      note
    });

    res.status(201).json(data[0]);
  } catch (err) {
    console.error('Errore completo:', JSON.stringify(err, null, 2));
    res.status(500).json({ error: 'Errore nella registrazione accesso' });
  }
}

export async function getAccessi(req, res) {
  try {
    const { data } = await supabase.get('accessi_log', {
      params: { select: '*' }
    });
    res.status(200).json(data);
  } catch (err) {
    console.error('Errore completo:', JSON.stringify(err, null, 2));
    res.status(500).json({ error: 'Errore nel recupero accessi' });
  }
}
