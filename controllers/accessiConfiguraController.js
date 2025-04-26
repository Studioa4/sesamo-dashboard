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

export async function configuraAccesso(req, res) {
  const { impianto_id, nome_accesso, tipo, hardware_id, comando } = req.body;

  try {
    const accessoRes = await supabase.post('accessi_configurati', {
      impianto_id,
      nome_accesso,
      tipo,
      hardware_id,
      comando
    });

    res.status(201).json({ message: 'Accesso configurato con successo', accesso: accessoRes.data[0] });
  } catch (err) {
    console.error('❌ Errore dettagliato nella configurazione accesso:', JSON.stringify(err.response?.data || err.message || err, null, 2));
    res.status(500).json({ error: 'Errore nella configurazione accesso' });
  }
}
