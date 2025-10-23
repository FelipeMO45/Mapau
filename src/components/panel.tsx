// src/components/PanelStats.tsx
import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function PanelStats() {
  const [countActividades, setCountActividades] = useState<number>(0);
  const [countPaquetes, setCountPaquetes] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCounts();
  }, []);

  async function fetchCounts() {
    setLoading(true);
    setError(null);
    try {
      // Obtener conteo de actividades
      const { count: actCount, error: err1 } = await supabase
        .from('actividades')
        .select('*', { head: true, count: 'exact' });
      if (err1) throw err1;
      // Obtener conteo de paquetes
      const { count: pkgCount, error: err2 } = await supabase
        .from('paquetes')
        .select('*', { head: true, count: 'exact' });
      if (err2) throw err2;

      setCountActividades(actCount ?? 0);
      setCountPaquetes(pkgCount ?? 0);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-pulse text-gray-500">Cargando estadísticas…</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-600 text-center py-12">
        Error al cargar estadísticas: {error}
      </div>
    );
  }

  return (
    <div className="w-full h-[100dvh] px-4 py-12 max-w-5xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Card Actividades */}
        <div className="bg-[#2e3136] rounded-2xl shadow-2xl p-6 flex flex-col items-center">
          <h3 className="text-5xl font-extrabold text-blue-600">{countActividades}</h3>
          <p className="mt-2 text-lg text-white-700">Actividades</p>
        </div>
        {/* Card Paquetes */}
        <div className="bg-[#2e3136] rounded-2xl shadow-2xl p-6 flex flex-col items-center">
          <h3 className="text-5xl font-extrabold text-green-600">{countPaquetes}</h3>
          <p className="mt-2 text-lg text-white-700">Paquetes</p>
        </div>
      </div>
    </div>
  );
}
