// /components/Layout.js

import Link from 'next/link';
import { useState } from 'react';
import { Bars3Icon, BuildingOffice2Icon, UsersIcon, KeyIcon, ClockIcon, ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline';


export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex min-h-screen">
      
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-blue-600 text-white flex flex-col p-4 transition-all duration-300`}>
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">{sidebarOpen ? 'Sesamo' : 'S'}</h1>
          <button onClick={toggleSidebar}>
            <Bars3Icon className="h-6 w-6" />
          </button>
        </div>

        <nav className="flex flex-col space-y-4">
          <Link href="/dashboard" className="flex items-center space-x-2 hover:underline">
            <BuildingOffice2Icon className="h-5 w-5" />
            {sidebarOpen && <span>Dashboard</span>}
          </Link>
          <Link href="/accessi" className="flex items-center space-x-2 hover:underline">
            {/* Puoi usare anche un'icona tipo KeyIcon */}
            {sidebarOpen && <span>Accessi</span>}
        </Link>
          <Link href="/impianti" className="flex items-center space-x-2 hover:underline">
            <BuildingOffice2Icon className="h-5 w-5" />
            {sidebarOpen && <span>Impianti</span>}
          </Link>
          <Link href="/utenti" className="flex items-center space-x-2 hover:underline">
            <UsersIcon className="h-5 w-5" />
            {sidebarOpen && <span>Utenti</span>}
          </Link>
          <Link href="/varchi" className="flex items-center space-x-2 hover:underline">
            <KeyIcon className="h-5 w-5" />
            {sidebarOpen && <span>Varchi</span>}
          </Link>
          <Link href="/storico" className="flex items-center space-x-2 hover:underline">
            <ClockIcon className="h-5 w-5" />
            {sidebarOpen && <span>Storico</span>}
          </Link>
          <button
            onClick={() => {
              localStorage.removeItem('token');
              window.location.href = '/login';
            }}
            className="mt-auto flex items-center space-x-2 hover:underline text-sm"
          >
            <ArrowLeftOnRectangleIcon className="h-5 w-5" />
            {sidebarOpen && <span>Logout</span>}
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
