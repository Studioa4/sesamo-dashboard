// /pages/login.js

import { useState } from 'react';
import axios from '../lib/axiosClient';
import { useRouter } from 'next/router';

export default function Login() {
  const router = useRouter();
  const [cellulare, setCellulare] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/login', { cellulare, password });
      localStorage.setItem('token', res.data.token);
      router.push('/dashboard');
    } catch (err) {
      setError('Login fallito. Controlla i dati.');
    }
  };

  return (
    <div className="flex min-h-screen justify-center items-center bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded shadow-md w-80">
        <h1 className="text-2xl font-bold mb-6 text-center">Login Sesamo</h1>
        <input
          type="text"
          placeholder="Cellulare"
          value={cellulare}
          onChange={(e) => setCellulare(e.target.value)}
          className="border p-2 mb-4 w-full"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 mb-4 w-full"
        />
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <button type="submit" className="bg-blue-500 text-white w-full p-2 rounded">
          Entra
        </button>
      </form>
    </div>
  );
}
