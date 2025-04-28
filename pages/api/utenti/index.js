import axios from 'axios';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import nodemailer from 'nodemailer';

const supabaseUrl = process.env.SUPABASE_URL + '/rest/v1/';
const supabaseApiKey = process.env.SUPABASE_ANON_KEY;
const smtpHost = process.env.SMTP_HOST;
const smtpPort = process.env.SMTP_PORT;
const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS;

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { nome, cognome, cellulare, email, ruolo } = req.body;

    if (!nome || !cognome || !cellulare || !email || !ruolo) {
      return res.status(400).json({ error: 'Nome, Cognome, Cellulare, Email e Ruolo sono obbligatori' });
    }

    const token_conferma = uuidv4();

    const userData = {
      nome,
      cognome,
      cellulare,
      email,
      ruolo,
      indirizzo: req.body.indirizzo || '',
      citta: req.body.citta || '',
      provincia: req.body.provincia || '',
      stato: req.body.stato || '',
      attivo: true,
      superadmin: false,
      token_conferma
    };

    try {
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

      // Invia email di conferma
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: false,
        auth: {
          user: smtpUser,
          pass: smtpPass
        }
      });

      const mailOptions = {
        from: `"Sesamo" <${smtpUser}>`,
        to: email,
        subject: "Conferma la tua iscrizione a Sesamo",
        html: `
          <p>Ciao ${nome} ${cognome},</p>
          <p>Per completare la registrazione clicca qui:</p>
          <p><a href="https://sesamo.brickly.cloud/conferma?token=${token_conferma}">Conferma il tuo account</a></p>
          <p>Se non sei stato tu, puoi ignorare questa email.</p>
        `
      };

      await transporter.sendMail(mailOptions);

      res.status(201).json({ message: 'Utente creato e email inviata con successo!' });
    } catch (err) {
      if (err.response && err.response.data) {
        console.error('Errore creazione utente (dettagli Supabase):', JSON.stringify(err.response.data, null, 2));
        res.status(500).json({
          error: err.response.data.message || 'Errore creazione utente',
          details: err.response.data.details || ''
        });
      } else {
        console.error('Errore creazione utente (errore locale):', err.message);
        res.status(500).json({ error: err.message });
      }
    }
  } else {
    res.status(405).json({ error: 'Metodo non consentito' });
  }
}
