// /components/Layout.js

import Link from 'next/link';

export default function Layout({ children }) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-600 text-white flex flex-col p-4">
        <h1 className="text-2xl font-bold mb-8">Sesamo Admin</h1>
        <nav className="flex flex-col space-y-4">
          <Link href="/dashboard" className="hover:underline">Dashboard</Link>
          <Link href="/impianti" className="hover:underline">Impianti</Link>
          <Link href="/utenti" className="hover:underline">Utenti</Link>
          <Link href="/varchi" className="hover:underline">Varchi</Link>
          <Link href="/storico" className="hover:underline">Storico Accessi</Link>
          <button
            className="mt-auto text-sm underline"
            onClick={() => {
              localStorage.removeItem('token');
              window.location.href = '/login';
            }}
          >
            Logout
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-gray-100 p-6">
        {children}
      </main>
    </div>
  );
}
