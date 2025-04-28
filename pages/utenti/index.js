import { useState, useEffect } from 'react';
import axios from '../../lib/axiosClient';
import Layout from '../../components/Layout';
import Modal from '../../components/Modal';
import DataTable from '../../components/DataTable';

export default function Utenti() {
  const [utenti, setUtenti] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingUtente, setEditingUtente] = useState(null);
  const [form, setForm] = useState({
    nome: '',
    cognome: '',
    cellulare: '',
    email: '',
    indirizzo: '',
    citta: '',
    provincia: '',
    stato: '',
    password: '',
    attivo: true,
    superadmin: false,
    ruolo: ''
  });

  useEffect(() => {
    fetchUtenti();
  }, []);

  const fetchUtenti = async () => {
    try {
      const res = await axios.get('/utenti');
      setUtenti(res.data);
    } catch (err) {
      console.error('Errore caricamento utenti:', err.response?.data || err.message);
    }
  };

  const columns = [
    { label: 'Nome', accessor: 'nome' },
    { label: 'Cognome', accessor: 'cognome' },
    { label: 'Cellulare', accessor: 'cellulare' },
    { label: 'Email', accessor: 'email' },
    { label: 'Indirizzo', accessor: 'indirizzo' },
    { label: 'Città', accessor: 'citta' },
    { label: 'Provincia', accessor: 'provincia' },
    { label: 'Stato', accessor: 'stato' },
    { label: 'Ruolo', accessor: 'ruolo' },
    { label: 'Superadmin', accessor: 'superadmin' },
    { label: 'Attivo', accessor: 'attivo' },
  ];

  const handleDelete = async (id) => {
    if (!confirm('Sei sicuro di voler eliminare questo utente?')) return;
    try {
      await axios.delete(`/utenti/${id}`);
      fetchUtenti();
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
      indirizzo: '',
      citta: '',
      provincia: '',
      stato: '',
      password: '',
      attivo: true,
      superadmin: false,
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
      email: utente.email || '',
      indirizzo: utente.indirizzo || '',
      citta: utente.citta || '',
      provincia: utente.provincia || '',
      stato: utente.stato || '',
      password: '',
      attivo: utente.attivo,
      superadmin: utente.superadmin,
      ruolo: utente.ruolo || ''
    });
    setEditingUtente(utente.id);
    setShowModal(true);
  };

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUtente) {
        await axios.put(`/utenti/${editingUtente}`, form);
      } else {
        await axios.post('/utenti', form);
      }
      setShowModal(false);
      fetchUtenti();
    } catch (err) {
      console.error('Errore salvataggio utente:', err.response?.data || err.message);
    }
  };

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

        <DataTable columns={columns} data={utenti} />

        {showModal && (
          <Modal title={editingUtente ? "Modifica Utente" : "Aggiungi Utente"} onClose={() => setShowModal(false)}>
            <form onSubmit={handleSubmit}>
              <input type="text" name="nome" placeholder="Nome" value={form.nome} onChange={handleChange} className="border p-2 mb-4 w-full" required />
              <input type="text" name="cognome" placeholder="Cognome" value={form.cognome} onChange={handleChange} className="border p-2 mb-4 w-full" required />
              <input type="text" name="cellulare" placeholder="Cellulare" value={form.cellulare} onChange={handleChange} className="border p-2 mb-4 w-full" required />
              <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} className="border p-2 mb-4 w-full" />
              <input type="text" name="indirizzo" placeholder="Indirizzo" value={form.indirizzo} onChange={handleChange} className="border p-2 mb-4 w-full" />
              <input type="text" name="citta" placeholder="Città" value={form.citta} onChange={handleChange} className="border p-2 mb-4 w-full" />
              <input type="text" name="provincia" placeholder="Provincia" value={form.provincia} onChange={handleChange} className="border p-2 mb-4 w-full" />
              <input type="text" name="stato" placeholder="Stato" value={form.stato} onChange={handleChange} className="border p-2 mb-4 w-full" />
              <input type="password" name="password" placeholder="Password (solo se vuoi cambiarla)" value={form.password} onChange={handleChange} className="border p-2 mb-4 w-full" />

              <div className="flex gap-4 mb-4">
                <label className="flex items-center gap-2">
                  <input type="checkbox" name="attivo" checked={form.attivo} onChange={handleChange} />
                  Attivo
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" name="superadmin" checked={form.superadmin} onChange={handleChange} />
                  Superadmin
                </label>
              </div>

              <select name="ruolo" value={form.ruolo} onChange={handleChange} className="border p-2 mb-4 w-full" required>
                <option value="">Seleziona Ruolo</option>
                <option value="amministratore">Amministratore</option>
                <option value="fornitore">Fornitore</option>
                <option value="proprietario">Proprietario</option>
                <option value="sottoutente">Sottoutente</option>
              </select>

              <div className="flex justify-end gap-4">
                <button type="button" onClick={() => setShowModal(false)} className="bg-gray-300 text-black p-2 rounded hover:bg-gray-400">Annulla</button>
                <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">Salva</button>
              </div>
            </form>
          </Modal>
        )}
      </div>
    </Layout>
  );
}
