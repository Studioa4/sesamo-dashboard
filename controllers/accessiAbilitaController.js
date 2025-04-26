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

export async function abilitaAccesso(req, res) {
  const { utente_id, impianto_id, accesso_id, giorni_consentiti, ora_inizio, ora_fine, creato_da } = req.body;

  try {
    const abilitazioneRes = await supabase.post('utenti_varchi', {
      utente_id,
      impianto_id,
      accesso_id,
      ruolo: 'sottoutente', // oppure può essere dinamico se necessario
      giorni_consentiti,
      ora_inizio,
      ora_fine,
      creato_da
    });

    res.status(201).json({ message: 'Accesso utente abilitato con successo', abilitazione: abilitazioneRes.data[0] });
  } catch (err) {
    console.error('❌ Errore dettagliato nell\'abilitazione accesso:', JSON.stringify(err.response?.data || err.message || err, null, 2));
    res.status(500).json({ error: 'Errore nell\'abilitazione accesso' });
  }
}
