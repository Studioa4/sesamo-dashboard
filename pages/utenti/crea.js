// /pages/utenti/crea.js

import { useState } from 'react';
import { useRouter } from 'next/router';
import axios from '../../lib/axiosClient';
import Layout from '../../components/Layout';

export default function CreaUtente() {
  const router = useRouter();
  const [form, setForm] = useState({
    nome: '',
    cognome: '',
    cellulare: '',
    email: '',
    password: '',
    ruolo: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/utenti', form, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      router.push('/utenti');
    } catch (err) {
      console.error(err);
      setError('Errore creazione utente.');
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-100 p-6 flex justify-center items-center">
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-96">
          <h1 className="text-2xl font-bold mb-6 text-center">Crea Nuovo Utente</h1>

          <input
            type="text"
            name="nome"
            placeholder="Nome"
            value={form.nome}
            onChange={handleChange}
            className="border p-2 mb-4 w-full"
            required
          />
          <input
            type="text"
            name="cognome"
            placeholder="Cognome"
            value={form.cognome}
            onChange={handleChange}
            className="border p-2 mb-4 w-full"
            required
          />
          <input
            type="text"
            name="cellulare"
            placeholder="Cellulare"
            value={form.cellulare}
            onChange={handleChange}
            className="border p-2 mb-4 w-full"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="border p-2 mb-4 w-full"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="border p-2 mb-4 w-full"
            required
          />
          <select
            name="ruolo"
            value={form.ruolo}
            onChange={handleChange}
            className="border p-2 mb-4 w-full"
            required
          >
            <option value="">-- Seleziona Ruolo --</option>
            <option value="amministratore">Amministratore</option>
            <option value="fornitore">Fornitore</option>
            <option value="proprietario">Proprietario</option>
            <option value="sottoutente">Sottoutente</option>
          </select>

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          <button type="submit" className="bg-blue-500 text-white w-full p-2 rounded">
            Crea Utente
          </button>
        </form>
      </div>
    </Layout>
  );
}
