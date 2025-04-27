import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from '../../lib/axiosClient';
import Layout from '../../components/Layout';
import Modal from '../../components/Modal';

export default function Varchi() {
  const router = useRouter();
  const [varchi, setVarchi] = useState([]);
  const [impianti, setImpianti] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingVarco, setEditingVarco] = useState(null);
  const [form, setForm] = useState({
    nome_varco: '',
    impianto_id: ''
  });

  useEffect(() => {
    fetchVarchi();
    fetchImpianti();
  }, []);

  const fetchVarchi = async () => {
    try {
      const res = await axios.get('/varchi');
      setVarchi(res.data);
    } catch (err) {
      console.error('Errore caricamento varchi:', err.response?.data || err.message);
    }
  };

  const fetchImpianti = async () => {
    try {
      const res = await axios.get('/impianti');
      setImpianti(res.data);
    } catch (err) {
      console.error('Errore caricamento impianti:', err.response?.data || err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Sei sicuro di voler eliminare questo varco?')) return;
    try {
      await axios.delete(`/api/varchi/${id}`);
      fetchVarchi();
    } catch (err) {
      console.error('Errore eliminazione varco:', err.response?.data || err.message);
    }
  };

  const openModalForAdd = () => {
    setForm({ nome_varco: '', impianto_id: '' });
    setEditingVarco(null);
    setShowModal(true);
  };

  const openModalForEdit = (varco) => {
    setForm({
      nome_varco: varco.nome_varco,
      impianto_id: varco.impianto_id || ''
    });
    setEditingVarco(varco.id);
    setShowModal(true);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingVarco) {
        await axios.put(`/api/varchi/${editingVarco}`, form);
      } else {
        await axios.post('/api/varchi', form);
      }
      setShowModal(false);
      fetchVarchi();
    } catch (err) {
      console.error('Errore salvataggio varco:', err.response?.data || err.message);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Varchi Registrati</h1>
          <button
            onClick={openModalForAdd}
            className="bg-green-500 text-white p-2 rounded hover:bg-green-600"
          >
            ➕ Aggiungi Varco
          </button>
        </div>

        {varchi.length === 0 ? (
          <p>Nessun varco trovato.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded shadow">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="p-4 text-left">Nome Varco</th>
                  <th className="p-4 text-left">Impianto</th>
                  <th className="p-4 text-left">Azioni</th>
                </tr>
              </thead>
              <tbody>
                {varchi.map((varco) => (
                  <tr key={varco.id} className="hover:bg-blue-50">
                    <td className="p-4">{varco.nome_varco}</td>
                    <td className="p-4">{varco.impianto_id}</td>
                    <td className="p-4 flex gap-2">
                      <button
                        onClick={() => openModalForEdit(varco)}
                        className="bg-yellow-400 text-white px-2 py-1 rounded text-xs hover:bg-yellow-500"
                      >
                        ✏️ Modifica
                      </button>
                      <button
                        onClick={() => handleDelete(varco.id)}
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
        <Modal title={editingVarco ? "Modifica Varco" : "Aggiungi Varco"} onClose={() => setShowModal(false)}>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="nome_varco"
              placeholder="Nome Varco"
              value={form.nome_varco}
              onChange={handleChange}
              className="border p-2 mb-4 w-full"
              required
            />
            <select
              name="impianto_id"
              value={form.impianto_id}
              onChange={handleChange}
              className="border p-2 mb-4 w-full"
              required
            >
              <option value="">Seleziona Impianto</option>
              {impianti.map((impianto) => (
                <option key={impianto.id} value={impianto.id}>
                  {impianto.nome}
                </option>
              ))}
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
