import axios from 'axios';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
dotenv.config();

const supabase = axios.create({
  baseURL: process.env.SUPABASE_URL + '/rest/v1/',
  headers: {
    apikey: process.env.SUPABASE_ANON_KEY,
    Authorization: `Bearer ${process.env.SUPABASE_ANON_KEY}`,
    Prefer: 'return=representation'
  }
});

export async function createImpianto(req, res) {
  const { nome, cognome, cellulare, email, impianto_nome, codice_attivazione, password } = req.body;

  try {
    // 1. Crea l'utente amministratore
    const hashedPassword = await bcrypt.hash(password, 10);

    const utenteRes = await supabase.post('utenti', {
      nome,
      cognome,
      cellulare,
      email,
      password_hash: hashedPassword
    });

    console.log('📦 Response utenti:', JSON.stringify(utenteRes.data, null, 2));

    const utente_id = utenteRes.data?.[0]?.id;
    console.log('✅ Utente ID:', utente_id);

    if (!utente_id) {
      throw new Error("Utente non creato correttamente");
    }

    // 2. Crea l'impianto collegato
    const impiantoRes = await supabase.post('impianti', {
      nome: impianto_nome,
      codice_attivazione
    });

    console.log('📦 Response impianto:', JSON.stringify(impiantoRes.data, null, 2));

    const impianto_id = impiantoRes.data?.[0]?.id;
    console.log('✅ Impianto ID:', impianto_id);

    if (!impianto_id) {
      throw new Error("Impianto non creato correttamente");
    }

    // 3. Collega utente a impianto come amministratore
    const collegamento = await supabase.post('utenti_varchi', {
      utente_id,
      impianto_id,
      accesso_id: null,
      ruolo: 'amministratore',
      giorni_consentiti: null,
      ora_inizio: null,
      ora_fine: null,
      creato_da: null
    });

    console.log('✅ Collegamento utenti_varchi creato:', collegamento.data);

    res.status(201).json({ message: 'Impianto e amministratore creati con successo' });

  } catch (err) {
    console.error('❌ Errore dettagliato:', JSON.stringify({
      status: err.response?.status,
      data: err.response?.data,
      headers: err.response?.headers
    }, null, 2));
    res.status(500).json({ error: 'Errore nella creazione impianto' });
  }
}