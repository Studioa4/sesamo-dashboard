import axios from 'axios';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const supabase = axios.create({
  baseURL: process.env.SUPABASE_URL + '/rest/v1/',
  headers: {
    apikey: process.env.SUPABASE_ANON_KEY,
    Authorization: `Bearer ${process.env.SUPABASE_ANON_KEY}`
  }
});

export async function login(req, res) {
  const { cellulare, password } = req.body;

  try {
    const { data } = await supabase.get('utenti', {
      params: {
        select: '*',
        cellulare: `eq.${cellulare}`,
        attivo: `eq.true`
      }
    });

    if (!data || data.length === 0) return res.status(401).json({ error: 'Utente non trovato' });

    const user = data[0];
    const valid = await bcrypt.compare(password, user.password_hash);

    if (!valid) return res.status(403).json({ error: 'Password errata' });

    const token = jwt.sign({ id: user.id, ruolo: user.ruolo }, process.env.JWT_SECRET, { expiresIn: '6h' });

    res.status(200).json({ token });
  } catch (err) {
    console.error('Errore completo:', JSON.stringify(err, null, 2));
    res.status(500).json({ error: 'Errore nel login' });
  }
}
