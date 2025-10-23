// src/hooks/usePaquetes.ts
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface Paquete {
  id: string;
  titulo: string;
  descripcion: string | null;
  actividades: string[];     // JSONB en la base
  precio: number;
  imagen_url: string | null; // URL de la imagen del paquete
  created_at: string;
}

export function usePaquetes() {
  const [paquetes, setPaquetes] = useState<Paquete[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPaquetes();
  }, []);

  /** Trae todos los paquetes, incluyendo la URL de imagen */
  async function fetchPaquetes() {
    setLoading(true);
    setError(null);
    try {
      const { data, error: selectError } = await supabase
        .from('paquetes')
        .select(`
          id,
          titulo,
          descripcion,
          actividades,
          precio,
          imagen_url,
          created_at
        `)
        .order('created_at', { ascending: false });

      if (selectError) throw selectError;
      setPaquetes(data as Paquete[]);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return {
    paquetes,
    loading,
    error,
    fetchPaquetes, // para refrescar manualmente si hace falta
  };
}
