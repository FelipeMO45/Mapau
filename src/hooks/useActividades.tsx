// src/hooks/useActividades.ts
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface Actividad {
  id: string;
  titulo: string;       // "Apple Intelligence"
  slogan: string;       // "Tú a la infinita potencia."
  titulo1: string;      // "La belleza de la simplicidad."
  texto1: string;       // párrafo sección 1
  titulo2: string;      // "Un zoom que te dejará woooow."
  texto2: string;       // párrafo sección 2
  imagenes: string[];   // JSONB → array de URLs
  fecha_creacion: string;
}

export function useActividades() {
  const [actividades, setActividades] = useState<Actividad[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchActividades();
  }, []);

  async function fetchActividades() {
    setLoading(true);
    setError(null);
    try {
      const { data, error: selectError } = await supabase
        .from('actividades')
        .select(`
          id,
          titulo,
          slogan,
          titulo1,
          texto1,
          titulo2,
          texto2,
          imagenes,
          fecha_creacion
        `)
        .order('fecha_creacion', { ascending: false });

      if (selectError) throw selectError;
      setActividades(data as Actividad[]);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function createActividad(
    payload: Omit<Actividad, 'id' | 'fecha_creacion'>
  ) {
    setLoading(true);
    setError(null);
    try {
      const { error: insertError } = await supabase
        .from('actividades')
        .insert(payload);
      if (insertError) throw insertError;
      await fetchActividades();
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  async function updateActividad(
    id: string,
    payload: Partial<Omit<Actividad, 'id' | 'fecha_creacion'>>
  ) {
    setLoading(true);
    setError(null);
    try {
      const { error: updateError } = await supabase
        .from('actividades')
        .update(payload)
        .eq('id', id);
      if (updateError) throw updateError;
      await fetchActividades();
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  async function deleteActividad(id: string) {
    setLoading(true);
    setError(null);
    try {
      const { error: deleteError } = await supabase
        .from('actividades')
        .delete()
        .eq('id', id);
      if (deleteError) throw deleteError;
      await fetchActividades();
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  return {
    actividades,
    loading,
    error,
    fetchActividades,
    createActividad,
    updateActividad,
    deleteActividad,
  };
}
