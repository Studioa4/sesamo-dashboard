// /pages/storico/index.js

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from '../../lib/axiosClient';
import Layout from '../../components/Layout';

export default function Storico() {
  const router = useRouter();
  const [logAccessi, setLogAccessi] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    } else {
      fetchStorico(token);
    }
  }, []);

  const fetchStorico = async (token) => {
    try {
      const res = await axios.get('/storico', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setLogAccessi(res.data);
    } catch (err) {
      console.error('Errore nel caricamento storico accessi:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen">
          <p>Caricamento storico accessi...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-100 p-6">
        <h1 className="text-2xl font-bold mb-6">Storico Accessi</h1>
        {logAccessi.length === 0 ? (
          <p>Nessun accesso registrato.</p>
        ) : (
          <ul className="space-y-4">
            {logAccessi.map((log) => (
              <li key={log.id} className="bg-white p-4 rounded shadow">
                <h2 className="text-lg font-semibold">Utente ID: {log.utente_id}</h2>
                <p>Accesso ID: {log.accesso_id}</p>
                <p>Orario: {new Date(log.timestamp).toLocaleString('it-IT')}</p>
                <p>Risultato: {log.risultato}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Layout>
  );
}
