// /pages/utenti/modifica/[id].js

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from '../../../lib/axiosClient';
import Layout from '../../../components/Layout';

export default function ModificaUtente() {
  const router = useRouter();
  const { id } = router.query;
  const [form, setForm] = useState({
    nome: '',
    cognome: '',
    cellulare: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    fetchUtente();
  }, [id]);

  const fetchUtente = async () => {
    try {
      const res = await axios.get(`/utenti/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setForm({
        nome: res.data.nome,
        cognome: res.data.cognome,
        cellulare: res.data.cellulare,
        email: res.data.email,
        password: ''
      });
    } catch (err) {
      console.error('Errore caricamento utente:', err.response?.data || err.message);
      setError('Errore caricamento utente.');
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/utenti/${id}`, form, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      router.push('/utenti');
    } catch (err) {
      console.error('Errore aggiornamento utente:', err.response?.data || err.message);
      setError('Errore aggiornamento utente.');
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-100 p-6 flex justify-center items-center">
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-96">
          <h1 className="text-2xl font-bold mb-6 text-center">Modifica Utente</h1>

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
            placeholder="Nuova Password (opzionale)"
            value={form.password}
            onChange={handleChange}
            className="border p-2 mb-4 w-full"
          />

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          <button type="submit" className="bg-blue-500 text-white w-full p-2 rounded hover:bg-blue-600">
            Salva Modifiche
          </button>
        </form>
      </div>
    </Layout>
  );
}
