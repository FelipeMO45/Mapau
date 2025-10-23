// src/pages/Dashboard.tsx
import React from 'react';
import { Map, User, LogOut } from 'lucide-react';
import Tabs from '../components/reusable/tabs';
import ActividadesCRUD from './crud/ActividadesCRUD';
import PaquetesCRUD from './crud/PaquetesCRUD';
import PanelStats from './panel';
import AdminLogin from './auth/AminLogin';
import AdminRegister from './auth/AdminRegister';

export default function Dashboard() {
  const tabs = [
    {
      label: 'Dashboard',
      content: (
        <>
          <h2 className="text-2xl font-semibold mb-6">Dashboard Overview</h2>
          <PanelStats />
        </>
      ),
    },
    {
      label: 'Actividades',
      content: <ActividadesCRUD />,
    },
    {
      label: 'Paquetes',
      content: <PaquetesCRUD />,
    },
    {
     label: 'Login',
      content: <AdminLogin />,
    },
     {
     label: 'Registro',
      content: <AdminRegister />,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#1b1d20] text-gray-100">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-gray-700">
        <div className="flex items-center space-x-2">
          <Map className="w-6 h-6 text-[#D89216]" />
          <h1 className="text-xl font-semibold">Mapau Panel</h1>
        </div>
        <div className="flex items-center space-x-4">
          <button aria-label="Perfil" className="hover:text-white">
            <User className="w-5 h-5" />
          </button>
          <button aria-label="Cerrar sesión" className="hover:text-white">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 overflow-auto p-6">
        <Tabs tabs={tabs} />
      </main>
    </div>
  );
}
