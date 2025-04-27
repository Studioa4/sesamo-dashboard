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
        headers: { Authorization: `Bearer ${token}` }
      });
      setUtenti(res.data);
    } catch (err) {
      console.error('Errore nel caricamento utenti:', err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (utenteId) => {
    if (!confirm('Sei sicuro di voler eliminare questo utente?')) return;
    try {
      await axios.delete(`/utenti/${utenteId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchUtenti(localStorage.getItem('token'));
    } catch (err) {
      console.error('Errore eliminazione utente:', err.response?.data || err.message);
    }
  };

  const handleModifica = (utenteId) => {
    router.push(`/utenti/modifica/${utenteId}`);
  };

  const handleAggiungi = () => {
    router.push('/utenti/crea');
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
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Utenti Registrati</h1>
          <button
            onClick={handleAggiungi}
            className="bg-green-500 text-white p-2 rounded hover:bg-green-600"
          >
            ➕ Aggiungi Utente
          </button>
        </div>

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
                  <th className="p-4 text-left">Azioni</th>
                </tr>
              </thead>
              <tbody>
                {utenti.map((utente) => (
                  <tr key={utente.id} className="hover:bg-blue-50">
                    <td className="p-4">{utente.nome}</td>
                    <td className="p-4">{utente.cognome}</td>
                    <td className="p-4">{utente.cellulare}</td>
                    <td className="p-4">{utente.email}</td>
                    <td className="p-4 flex gap-2">
                      <button
                        onClick={() => handleModifica(utente.id)}
                        className="bg-yellow-400 text-white px-2 py-1 rounded text-xs hover:bg-yellow-500"
                      >
                        ✏️ Modifica
                      </button>
                      <button
                        onClick={() => handleDelete(utente.id)}
                        className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
                      >
                        🗑️ Elimina
                      </button>
                    </td>
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
