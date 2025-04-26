// /pages/impianti/index.js

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from '../../lib/axiosClient';
import Layout from '../../components/Layout';

export default function Impianti() {
  const router = useRouter();
  const [impianti, setImpianti] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    } else {
      fetchImpianti(token);
    }
  }, []);

  const fetchImpianti = async (token) => {
    try {
      const res = await axios.get('/impianti', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setImpianti(res.data);
    } catch (err) {
      console.error('Errore nel caricamento impianti:', err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen">
          <p>Caricamento impianti...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-6">I tuoi Impianti</h1>
      {impianti.length === 0 ? (
        <p>Nessun impianto trovato.</p>
      ) : (
        <ul className="space-y-4">
          {impianti.map((impianto) => (
            <li key={impianto.id} className="bg-white p-4 rounded shadow">
              <h2 className="text-lg font-semibold">{impianto.nome}</h2>
              <p>Codice attivazione: {impianto.codice_attivazione}</p>
            </li>
          ))}
        </ul>
      )}
    </Layout>
  );
}
