// src/components/AdminRegister.tsx
import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';     // ← IMPORTA TU CLIENTE
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function AdminRegister() {
  const [username, setUsername] = useState('');
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading,  setLoading]  = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.rpc('register_administrador', {
        v_username   : username,
        v_email      : email,
        v_password   : password,
        v_full_name  : fullName || null,
        v_avatar_url : null,
        v_bio        : null,
        v_phone      : null,
      });

      if (error) throw error;
      toast.success('Administrador creado correctamente');
      setUsername(''); setEmail(''); setPassword(''); setFullName('');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#26292e] p-4">
      <ToastContainer position="top-right" autoClose={3000} />
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-[#2e3136] rounded-lg shadow-lg p-6 space-y-6 text-white"
      >
        <h2 className="text-2xl font-bold text-center">Registro Administrador</h2>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Usuario</label>
          <input
            type="text" required
            value={username}
            onChange={e => setUsername(e.target.value)}
            placeholder="nombre_de_usuario"
            className="w-full bg-[#33363b] border border-[#26292e] px-3 py-2 rounded placeholder-gray-400 text-white focus:ring-green-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Correo</label>
          <input
            type="email" required
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="admin@ejemplo.com"
            className="w-full bg-[#33363b] border border-[#26292e] px-3 py-2 rounded placeholder-gray-400 text-white focus:ring-green-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Contraseña</label>
          <input
            type="password" required
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full bg-[#33363b] border border-[#26292e] px-3 py-2 rounded placeholder-gray-400 text-white focus:ring-green-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Nombre Completo</label>
          <input
            type="text"
            value={fullName}
            onChange={e => setFullName(e.target.value)}
            placeholder="Ej. Juan Pérez"
            className="w-full bg-[#33363b] border border-[#26292e] px-3 py-2 rounded placeholder-gray-400 text-white focus:ring-green-400"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-semibold px-4 py-2 rounded transition"
        >
          {loading ? 'Registrando...' : 'Crear cuenta'}
        </button>
      </form>
    </div>
  );
}
