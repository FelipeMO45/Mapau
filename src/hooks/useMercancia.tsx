import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export interface Mercancia {
  id: string;
  nombre: string;
  descripcion: string | null;
  precio: number;
  stock: number;
  imagen_url: string;
  fecha_creacion: string;
}

export function useMercanciaCRUD() {
  const [mercancia, setMercancia] = useState<Mercancia[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  // Leer
  const fetchMercancia = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from("mercancia")
        .select("id, nombre, descripcion, precio, stock, imagen_url, fecha_creacion")
        .order("fecha_creacion", { ascending: false });
      if (error) throw error;
      setMercancia(data as Mercancia[]);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  // Crear
  const createMercancia = async ({
    nombre,
    descripcion,
    precio,
    stock,
    file,
  }: {
    nombre: string;
    descripcion?: string;
    precio: number;
    stock: number;
    file: File;
  }) => {
    setLoading(true);
    setError(null);
    try {
      // subir imagen
      const fileName = `${Date.now()}_${file.name}`;
      const { data: uploadData, error: uploadError } = await supabase
        .storage
        .from("mercancia")
        .upload(fileName, file);
      if (uploadError) throw uploadError;

      // obtener URL
      const { data: urlData } = supabase
        .storage
        .from("mercancia")
        .getPublicUrl(uploadData.path);
      const imagen_url = urlData.publicUrl;

      // insertar registro
      const { error: insertError } = await supabase
        .from("mercancia")
        .insert({ nombre, descripcion, precio, stock, imagen_url });
      if (insertError) throw insertError;

      await fetchMercancia();
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  // Actualizar
  const updateMercancia = async (
    id: string,
    updates: {
      nombre?: string;
      descripcion?: string;
      precio?: number;
      stock?: number;
    }
  ) => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase
        .from("mercancia")
        .update(updates)
        .eq("id", id);
      if (error) throw error;
      await fetchMercancia();
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  // Borrar
  const deleteMercancia = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase
        .from("mercancia")
        .delete()
        .eq("id", id);
      if (error) throw error;
      await fetchMercancia();
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMercancia();
  }, []);

  return {
    mercancia,
    loading,
    error,
    fetchMercancia,
    createMercancia,
    updateMercancia,
    deleteMercancia,
  };
}
