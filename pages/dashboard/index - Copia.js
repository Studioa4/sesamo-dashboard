// /pages/dashboard/index.js

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from '../../lib/axiosClient';
import Layout from '../../components/Layout';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    } else {
      setUser(token);
    }
  }, []);

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Caricamento...</p>
      </div>
    );
  }

  return (
    <Layout>
      <header className="bg-blue-600 text-white p-4">
        <h1 className="text-2xl font-bold">Dashboard Sesamo</h1>
      </header>

      <main className="flex-1 p-6">
        <h2 className="text-xl font-semibold mb-4">Benvenuto nella Dashboard</h2>
        <p>Da qui puoi gestire Impianti, Utenti, Varchi e vedere lo Storico Accessi.</p>
      </main>
    </Layout>
  );
}
