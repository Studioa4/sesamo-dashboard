// /pages/api/login/index.js
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');  // 👈 Consente da tutti i domini
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end(); // 👈 Gestione CORS preflight
    return;
  }

  // ... resto del tuo codice handler ...
}

import axios from 'axios';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const supabaseUrl = process.env.SUPABASE_URL + '/rest/v1/';
const supabaseApiKey = process.env.SUPABASE_ANON_KEY;
const jwtSecret = process.env.JWT_SECRET;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Metodo non consentito' });
  }

  const { cellulare, password } = req.body;

  try {
    const response = await axios.get(supabaseUrl + 'utenti', {
      headers: {
        apikey: supabaseApiKey,
        Authorization: `Bearer ${supabaseApiKey}`
      },
      params: {
        select: '*',
        cellulare: `eq.${cellulare}`,
        attivo: `eq.true`
      }
    });

    if (!response.data || response.data.length === 0) {
      return res.status(401).json({ error: 'Utente non trovato' });
    }

    const user = response.data[0];
    const valid = await bcrypt.compare(password, user.password_hash);

    if (!valid) {
      return res.status(403).json({ error: 'Password errata' });
    }

    const token = jwt.sign(
      {
        id: user.id,
        cellulare: user.cellulare,
        email: user.email,
        superadmin: user.superadmin
      },
      jwtSecret,
      { expiresIn: '6h' }
    );

    res.status(200).json({ token, superadmin: user.superadmin });
  } catch (err) {
    console.error('Errore login:', err.response?.data || err.message);
    res.status(500).json({ error: 'Errore login server' });
  }
}
