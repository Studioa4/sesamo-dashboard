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
      const res = await axios.get('/utenti', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setUtenti(res.data);
    } catch (err) {
      console.error('Errore nel caricamento utenti:', err.response?.data || err.message);
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
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded shadow">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="p-4 text-left">Nome</th>
                  <th className="p-4 text-left">Cognome</th>
                  <th className="p-4 text-left">Cellulare</th>
                  <th className="p-4 text-left">Email</th>
                </tr>
              </thead>
              <tbody>
                {utenti.map((utente) => (
                  <tr key={utente.id} className="hover:bg-blue-50">
                    <td className="p-4">{utente.nome}</td>
                    <td className="p-4">{utente.cognome}</td>
                    <td className="p-4">{utente.cellulare}</td>
                    <td className="p-4">{utente.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
}
