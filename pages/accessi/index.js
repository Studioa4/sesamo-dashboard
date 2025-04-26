// /pages/accessi/index.js

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from '../../lib/axiosClient';
import Layout from '../../components/Layout';

export default function Accessi() {
  const router = useRouter();
  const [impianti, setImpianti] = useState([]);
  const [varchi, setVarchi] = useState([]);
  const [selezionatoImpianto, setSelezionatoImpianto] = useState('');
  const [selezionatoVarco, setSelezionatoVarco] = useState('');
  const [autorizzazioni, setAutorizzazioni] = useState([]);
  const [loading, setLoading] = useState(false);

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
        headers: { Authorization: `Bearer ${token}` }
      });
      setImpianti(res.data);
    } catch (err) {
      console.error('Errore caricamento impianti:', err.response?.data || err.message);
    }
  };

  const fetchVarchi = async (token, impiantoId) => {
    try {
      const res = await axios.get(`/varchi?impianto_id=${impiantoId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setVarchi(res.data);
    } catch (err) {
      console.error('Errore caricamento varchi:', err.response?.data || err.message);
    }
  };

  const fetchAutorizzazioni = async (token, accessoId) => {
    try {
      setLoading(true);
      const res = await axios.get(`/utenti_varchi?accesso_id=${accessoId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAutorizzazioni(res.data);
    } catch (err) {
      console.error('Errore caricamento autorizzazioni:', err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectImpianto = (e) => {
    const impiantoId = e.target.value;
    setSelezionatoImpianto(impiantoId);
    setSelezionatoVarco('');
    setAutorizzazioni([]);
    const token = localStorage.getItem('token');
    fetchVarchi(token, impiantoId);
  };

  const handleSelectVarco = (e) => {
    const varcoId = e.target.value;
    setSelezionatoVarco(varcoId);
    const token = localStorage.getItem('token');
    fetchAutorizzazioni(token, varcoId);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-100 p-6">
        <h1 className="text-2xl font-bold mb-6">I miei Accessi</h1>

        {/* Select Impianto */}
        <div className="mb-6">
          <label className="block mb-2">Seleziona Impianto:</label>
          <select value={selezionatoImpianto} onChange={handleSelectImpianto} className="border p-2 w-full">
            <option value="">-- Scegli un Impianto --</option>
            {impianti.map((impianto) => (
              <option key={impianto.id} value={impianto.id}>
                {impianto.nome}
              </option>
            ))}
          </select>
        </div>

        {/* Select Varco */}
        {varchi.length > 0 && (
          <div className="mb-6">
            <label className="block mb-2">Seleziona Varco:</label>
            <select value={selezionatoVarco} onChange={handleSelectVarco} className="border p-2 w-full">
              <option value="">-- Scegli un Varco --</option>
              {varchi.map((varco) => (
                <option key={varco.id} value={varco.id}>
                  {varco.nome_accesso}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Tabella Autorizzazioni */}
        {loading ? (
          <p>Caricamento autorizzazioni...</p>
        ) : (
          autorizzazioni.length > 0 && (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded shadow">
                <thead className="bg-blue-600 text-white">
                  <tr>
                    <th className="p-4 text-left">Utente ID</th>
                    <th className="p-4 text-left">Giorni Consentiti</th>
                    <th className="p-4 text-left">Ora Inizio</th>
                    <th className="p-4 text-left">Ora Fine</th>
                  </tr>
                </thead>
                <tbody>
                  {autorizzazioni.map((auth) => (
                    <tr key={auth.id} className="hover:bg-blue-50">
                      <td className="p-4">{auth.utente_id}</td>
                      <td className="p-4">{auth.giorni_consentiti}</td>
                      <td className="p-4">{auth.ora_inizio}</td>
                      <td className="p-4">{auth.ora_fine}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        )}
      </div>
    </Layout>
  );
}
