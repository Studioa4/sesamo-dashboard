// /pages/utenti/index.js

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from '../../lib/axiosClient';
import Layout from '../../components/Layout';
import Modal from '../../components/Modal';

export default function Utenti() {
  const router = useRouter();
  const [utenti, setUtenti] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUtente, setEditingUtente] = useState(null);
  const [form, setForm] = useState({
    nome: '',
    cognome: '',
    cellulare: '',
    email: '',
    password: '',
    ruolo: ''
  });

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
      console.error('Errore caricamento utenti:', err.response?.data || err.message);
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

  const openModalForAdd = () => {
    setForm({
      nome: '',
      cognome: '',
      cellulare: '',
      email: '',
      password: '',
      ruolo: ''
    });
    setEditingUtente(null);
    setShowModal(true);
  };

  const openModalForEdit = (utente) => {
    setForm({
      nome: utente.nome,
      cognome: utente.cognome,
      cellulare: utente.cellulare,
      email: utente.email,
      password: '',
      ruolo: utente.ruolo || ''
    });
    setEditingUtente(utente.id);
    setShowModal(true);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUtente) {
        // Modifica
        await axios.put(`/utenti/${editingUtente}`, form, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
      } else {
        // Aggiunta
        await axios.post('/utenti', form, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
      }
      setShowModal(false);
      fetchUtenti(localStorage.getItem('token'));
    } catch (err) {
      console.error('Errore salvataggio utente:', err.response?.data || err.message);
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
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Utenti Registrati</h1>
          <button
            onClick={openModalForAdd}
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
                        onClick={() => openModalForEdit(utente)}
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

      {/* Modal per Aggiungi/Modifica */}
      {showModal && (
        <Modal title={editingUtente ? "Modifica Utente" : "Aggiungi Utente"} onClose={() => setShowModal(false)}>
          <form onSubmit={handleSubmit}>
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

            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="bg-gray-300 text-black p-2 rounded hover:bg-gray-400"
              >
                Annulla
              </button>
              <button
                type="submit"
                className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
              >
                Salva
              </button>
            </div>
          </form>
        </Modal>
      )}
    </Layout>
  );
}
