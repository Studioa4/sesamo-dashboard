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
      const res = await axios.get('/varchi', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setVarchi(res.data);
    } catch (err) {
      console.error('Errore nel caricamento varchi:', err.response?.data || err.message);
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
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded shadow">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="p-4 text-left">Nome Accesso</th>
                  <th className="p-4 text-left">Tipo</th>
                  <th className="p-4 text-left">Comando</th>
                </tr>
              </thead>
              <tbody>
                {varchi.map((varco) => (
                  <tr key={varco.id} className="hover:bg-blue-50">
                    <td className="p-4">{varco.nome_accesso}</td>
                    <td className="p-4">{varco.tipo}</td>
                    <td className="p-4">{varco.comando}</td>
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
