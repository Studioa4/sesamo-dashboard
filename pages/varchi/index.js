// /pages/varchi/index.js

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from '../../lib/axiosClient';
import Layout from '../../components/Layout';

export default function Varchi() {
  const router = useRouter();
  const [varchi, setVarchi] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    } else {
      fetchVarchi(token);
    }
  }, []);

  const fetchVarchi = async (token) => {
    try {
      const res = await axios.get('/api/varchi', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setVarchi(res.data);
    } catch (err) {
      console.error('Errore nel caricamento varchi:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen">
          <p>Caricamento varchi...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-100 p-6">
        <h1 className="text-2xl font-bold mb-6">Accessi Configurati</h1>
        {varchi.length === 0 ? (
          <p>Nessun varco trovato.</p>
        ) : (
          <ul className="space-y-4">
            {varchi.map((accesso) => (
              <li key={accesso.id} className="bg-white p-4 rounded shadow">
                <h2 className="text-lg font-semibold">{accesso.nome_accesso}</h2>
                <p>Tipo: {accesso.tipo}</p>
                <p>Comando: {accesso.comando}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Layout>
  );
}
