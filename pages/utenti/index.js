// /pages/utenti/index.js

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from '../../lib/axiosClient';
import Layout from '../../components/Layout';

export default function Utenti() {
  const router = useRouter();
  const [utenti, setUtenti] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    } else {
      fetchUtenti(token);
    }
  }, []);

  const fetchUtenti = async (token) => {
    try {
      const res = await axios.get('/api/utenti', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setUtenti(res.data);
    } catch (err) {
      console.error('Errore nel caricamento utenti:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen">
          <p>Caricamento utenti...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-100 p-6">
        <h1 className="text-2xl font-bold mb-6">Utenti Registrati</h1>
        {utenti.length === 0 ? (
          <p>Nessun utente trovato.</p>
        ) : (
          <ul className="space-y-4">
            {utenti.map((utente) => (
              <li key={utente.id} className="bg-white p-4 rounded shadow">
                <h2 className="text-lg font-semibold">{utente.nome} {utente.cognome}</h2>
                <p>Cellulare: {utente.cellulare}</p>
                <p>Email: {utente.email}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Layout>
  );
}
