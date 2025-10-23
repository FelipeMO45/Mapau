// src/components/AdminLogin.tsx
import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data: admin, error } = await supabase
      .rpc('login_administrador', {
        v_email: email,
        v_password: password,
      });

    setLoading(false);

    if (error) {
      setError(error.message);
    } else {
      // aquí podrías guardar admin en tu contexto, storage, etc.
      console.log('Administrador autenticado:', admin);
      // p. ej.: router.push('/dashboard');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#26292e] p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-[#2e3136] rounded-lg shadow-lg p-6 space-y-6 text-white"
      >
        <h2 className="text-2xl font-bold text-center">Iniciar Sesión</h2>

        {error && (
          <p className="text-red-500 text-sm text-center">
            {error}
          </p>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Correo electrónico
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="admin@ejemplo.com"
            className="w-full bg-[#33363b] border border-[#26292e] px-3 py-2 rounded placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-green-400 transition"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Contraseña
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full bg-[#33363b] border border-[#26292e] px-3 py-2 rounded placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-green-400 transition"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-semibold px-4 py-2 rounded transition"
        >
          {loading ? 'Validando...' : 'Entrar'}
        </button>
      </form>
    </div>
  );
}
