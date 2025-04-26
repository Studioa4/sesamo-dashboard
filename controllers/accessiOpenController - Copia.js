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

export async function openAccesso(req, res) {
  const { utente_id, accesso_id } = req.body;

  try {
    // Recupera autorizzazioni
    const { data } = await supabase.get('utenti_varchi', {
      params: {
        select: '*',
        utente_id: `eq.${utente_id}`,
        accesso_id: `eq.${accesso_id}`
      }
    });

    if (!data || data.length === 0) {
      return res.status(403).json({ error: 'Utente non abilitato su questo varco' });
    }

    const autorizzazione = data[0];

    // Controlla giorno e ora
    const now = new Date();
    const giornoCorrente = now.toLocaleString('it-IT', { weekday: 'short' }).toLowerCase(); // es: 'lun', 'mar', ecc.

    const giornoFormato = giornoCorrente.replace('.', ''); // per sicurezza

    if (autorizzazione.giorni_consentiti && !autorizzazione.giorni_consentiti.includes(giornoFormato)) {
      return res.status(403).json({ error: 'Accesso non consentito oggi' });
    }

    if (autorizzazione.ora_inizio && autorizzazione.ora_fine) {
      const oraAttuale = now.toTimeString().split(' ')[0];

      if (oraAttuale < autorizzazione.ora_inizio || oraAttuale > autorizzazione.ora_fine) {
        return res.status(403).json({ error: 'Accesso non consentito in questo orario' });
      }
    }

    // Se tutti i controlli passano
    res.status(200).json({ message: 'Accesso consentito. Puoi aprire il varco!' });

  } catch (err) {
    console.error('❌ Errore apertura accesso:', JSON.stringify(err.response?.data || err.message || err, null, 2));
    res.status(500).json({ error: 'Errore nella verifica accesso' });
  }
}