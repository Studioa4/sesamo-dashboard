import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from '../../lib/axiosClient';
import Layout from '../../components/Layout';
import Modal from '../../components/Modal';

export default function Impianti() {
  const router = useRouter();
  const [impianti, setImpianti] = useState([]);
  const [amministratori, setAmministratori] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingImpianto, setEditingImpianto] = useState(null);
  const [form, setForm] = useState({
    denominazione: '',
    indirizzo: '',
    citta: '',
    provincia: '',
    latitudine: '',
    longitudine: '',
    amministratore_id: ''
  });

  useEffect(() => {
    fetchImpianti();
    fetchAmministratori();
  }, []);

  const fetchImpianti = async () => {
    try {
      const res = await axios.get('/impianti');
      setImpianti(res.data);
    } catch (err) {
      console.error('Errore caricamento impianti:', err.response?.data || err.message);
    }
  };

  const fetchAmministratori = async () => {
    try {
      const res = await axios.get('/utenti');
      const adminUsers = res.data.filter(u => u.superadmin === true);
      setAmministratori(adminUsers);
    } catch (err) {
      console.error('Errore caricamento amministratori:', err.response?.data || err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Sei sicuro di voler eliminare questo impianto?')) return;
    try {
      await axios.delete(`/api/impianti/${id}`);
      fetchImpianti();
    } catch (err) {
      console.error('Errore eliminazione impianto:', err.response?.data || err.message);
    }
  };

  const openModalForAdd = () => {
    setForm({
      denominazione: '',
      indirizzo: '',
      citta: '',
      provincia: '',
      latitudine: '',
      longitudine: '',
      amministratore_id: ''
    });
    setEditingImpianto(null);
    setShowModal(true);
  };

  const openModalForEdit = (impianto) => {
    setForm({
      denominazione: impianto.denominazione,
      indirizzo: impianto.indirizzo || '',
      citta: impianto.citta || '',
      provincia: impianto.provincia || '',
      latitudine: impianto.latitudine || '',
      longitudine: impianto.longitudine || '',
      amministratore_id: impianto.amministratore_id || ''
    });
    setEditingImpianto(impianto.id);
    setShowModal(true);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingImpianto) {
        await axios.put(`/api/impianti/${editingImpianto}`, form);
      } else {
        await axios.post('/api/impianti', form);
      }
      setShowModal(false);
      fetchImpianti();
    } catch (err) {
      console.error('Errore salvataggio impianto:', err.response?.data || err.message);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Impianti Registrati</h1>
          <button
            onClick={openModalForAdd}
            className="bg-green-500 text-white p-2 rounded hover:bg-green-600"
          >
            ➕ Aggiungi Impianto
          </button>
        </div>

        {impianti.length === 0 ? (
          <p>Nessun impianto trovato.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded shadow">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="p-4 text-left">Denominazione</th>
                  <th className="p-4 text-left">Indirizzo</th>
                  <th className="p-4 text-left">Città</th>
                  <th className="p-4 text-left">Provincia</th>
                  <th className="p-4 text-left">Latitudine</th>
                  <th className="p-4 text-left">Longitudine</th>
                  <th className="p-4 text-left">Amministratore</th>
                  <th className="p-4 text-left">Azioni</th>
                </tr>
              </thead>
              <tbody>
                {impianti.map((impianto) => (
                  <tr key={impianto.id} className="hover:bg-blue-50">
                    <td className="p-4">{impianto.denominazione}</td>
                    <td className="p-4">{impianto.indirizzo}</td>
                    <td className="p-4">{impianto.citta}</td>
                    <td className="p-4">{impianto.provincia}</td>
                    <td className="p-4">{impianto.latitudine}</td>
                    <td className="p-4">{impianto.longitudine}</td>
                    <td className="p-4">{impianto.amministratore_id}</td>
                    <td className="p-4 flex gap-2">
                      <button
                        onClick={() => openModalForEdit(impianto)}
                        className="bg-yellow-400 text-white px-2 py-1 rounded text-xs hover:bg-yellow-500"
                      >
                        ✏️ Modifica
                      </button>
                      <button
                        onClick={() => handleDelete(impianto.id)}
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

      {showModal && (
        <Modal title={editingImpianto ? "Modifica Impianto" : "Aggiungi Impianto"} onClose={() => setShowModal(false)}>
          <form onSubmit={handleSubmit}>
            <input type="text" name="denominazione" placeholder="Denominazione" value={form.denominazione} onChange={handleChange} className="border p-2 mb-4 w-full" required />
            <input type="text" name="indirizzo" placeholder="Indirizzo" value={form.indirizzo} onChange={handleChange} className="border p-2 mb-4 w-full" />
            <input type="text" name="citta" placeholder="Città" value={form.citta} onChange={handleChange} className="border p-2 mb-4 w-full" />
            <input type="text" name="provincia" placeholder="Provincia" value={form.provincia} onChange={handleChange} className="border p-2 mb-4 w-full" />
            <input type="text" name="latitudine" placeholder="Latitudine" value={form.latitudine} onChange={handleChange} className="border p-2 mb-4 w-full" />
            <input type="text" name="longitudine" placeholder="Longitudine" value={form.longitudine} onChange={handleChange} className="border p-2 mb-4 w-full" />
            <select name="amministratore_id" value={form.amministratore_id} onChange={handleChange} className="border p-2 mb-4 w-full" required>
              <option value="">Seleziona Amministratore</option>
              {amministratori.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.nome} {user.cognome}
                </option>
              ))}
            </select>

            <div className="flex justify-end gap-4">
              <button type="button" onClick={() => setShowModal(false)} className="bg-gray-300 text-black p-2 rounded hover:bg-gray-400">Annulla</button>
              <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">Salva</button>
            </div>
          </form>
        </Modal>
      )}
    </Layout>
  );
}
