// src/components/PaquetesCRUD.tsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { usePaquetes, Paquete } from '../../hooks/usePaquetes';
import { ToastContainer, toast } from 'react-toastify';
import { Modal } from '../reusable/modalAdmin'; // importa tu Modal aquí
import 'react-toastify/dist/ReactToastify.css';

interface PaqueteForm {
  titulo: string;
  descripcion: string;
  actividadesText: string; // una línea por actividad
  precio: string;
  imagen_url: string | null;
}

const initialForm: PaqueteForm = {
  titulo: '',
  descripcion: '',
  actividadesText: '',
  precio: '',
  imagen_url: null,
};

const IMAGE_EXT_RE = /\.(png|jpe?g|gif|webp|svg)$/i;

export default function PaquetesCRUD() {
  const { paquetes, loading, error, fetchPaquetes } = usePaquetes();
  const [form, setForm] = useState<PaqueteForm>(initialForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [openId, setOpenId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);



  const [storageFiles, setStorageFiles] = useState<{ name: string; url: string }[]>([]);
  const [loadingImgs, setLoadingImgs] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // 1) Cargar imágenes del bucket "paquetes"
  useEffect(() => {
    async function loadImages() {
      setLoadingImgs(true);
      try {
        const { data, error } = await supabase
          .storage
          .from('paquetes')
          .list('', { limit: 200, offset: 0 });
        if (error) throw error;
        const files = data!
          .filter(f => IMAGE_EXT_RE.test(f.name))
          .map(f => {
            const { data: urlData } = supabase
              .storage
              .from('paquetes')
              .getPublicUrl(f.name);
            return { name: f.name, url: urlData.publicUrl };
          });
        setStorageFiles(files);
      } catch (err: any) {
        console.error('Error cargando imágenes:', err.message);
      } finally {
        setLoadingImgs(false);
      }
    }
    loadImages();
  }, []);

  const handleChange = (key: keyof PaqueteForm, value: string) => {
    setForm(f => ({ ...f, [key]: value }));
  };

  // 2) Crear / actualizar
  const handleSubmit = async () => {
    if (!form.titulo || !form.precio || !form.actividadesText.trim() || !form.imagen_url) {
      toast.error('Título, precio, actividades e imagen son obligatorios');
      return;
    }
    const actividades = form.actividadesText
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);
    const payload = {
      titulo: form.titulo,
      descripcion: form.descripcion || null,
      actividades,
      precio: parseFloat(form.precio),
      imagen_url: form.imagen_url,
    };

    setSaving(true);
    try {
      if (editingId) {
        const { error: upErr } = await supabase
          .from('paquetes')
          .update(payload)
          .eq('id', editingId);
        if (upErr) throw upErr;
        toast.success('Paquete actualizado');
      } else {
        const { error: insErr } = await supabase
          .from('paquetes')
          .insert(payload);
        if (insErr) throw insErr;
        toast.success('Paquete creado');
      }
      await fetchPaquetes();
      setForm(initialForm);
      setEditingId(null);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (paq: Paquete) => {
    setEditingId(paq.id);
    setForm({
      titulo: paq.titulo,
      descripcion: paq.descripcion ?? '',
      actividadesText: (paq.actividades || []).join('\n'),
      precio: paq.precio.toString(),
      imagen_url: paq.imagen_url,
    });
  };


  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    try {
      const { error: delErr } = await supabase
        .from('paquetes')
        .delete()
        .eq('id', deleteId);
      if (delErr) throw delErr;
      toast.success('Paquete eliminado correctamente');
      await fetchPaquetes();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setDeleteId(null);
    }
  };


  // 3) Filtrado de imágenes
  const filtered = storageFiles.filter(f =>
    f.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Formulario Crear/Editar */}
      <div className="bg-[#26292e] p-6 rounded-2xl shadow-2xl space-y-4">
        <h2 className="text-2xl font-bold">
          {editingId ? 'Editar paquete (modal)' : 'Nuevo paquete'}
        </h2>

        {/* Título / Precio */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Título *</label>
            <input
              type="text"
              value={form.titulo}
              onChange={e => handleChange('titulo', e.target.value)}
              className="w-full bg-[#33363b] placeholder-[#c5c5c5] border-[#26292e] border px-3 py-2 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Precio (MXN) *</label>
            <input
              type="number"
              step="0.01"
              value={form.precio}
              onChange={e => handleChange('precio', e.target.value)}
              className="w-full border bg-[#33363b] placeholder-[#c5c5c5] border-[#26292e] px-3 py-2 rounded"
            />
          </div>
        </div>

        {/* Descripción */}
        <div>
          <label className="block text-sm font-medium">Descripción</label>
          <textarea
            value={form.descripcion}
            onChange={e => handleChange('descripcion', e.target.value)}
            className="w-full border bg-[#33363b] placeholder-[#c5c5c5] border-[#26292e] px-3 py-2 rounded resize-none"
            rows={2}
          />
        </div>

        {/* Actividades */}
        <div>
          <label className="block text-sm font-medium">
            Actividades (una por línea)
          </label>
          <textarea
            value={form.actividadesText}
            onChange={e => handleChange('actividadesText', e.target.value)}
            className="w-full border bg-[#33363b] placeholder-[#c5c5c5] border-[#26292e] px-3 py-2 rounded resize-none"
            rows={4}
          />
        </div>

        {/* Buscador & selector de imagen */}
        <div className="space-y-2">
          <label className="block text-sm font-medium">Buscar imagen</label>
          <input
            type="text"
            placeholder="Filtrar por nombre..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full border bg-[#33363b] placeholder-[#c5c5c5] border-[#26292e] px-3 py-2 rounded"
          />

          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-48 overflow-auto p-1 border rounded">
            {loadingImgs
              ? <p className="col-span-3 text-center">Cargando imágenes…</p>
              : filtered.length > 0
                ? filtered.map(f => (
                  <div
                    key={f.name}
                    onClick={() => setForm(prev => ({ ...prev, imagen_url: f.url }))}
                    className={`
                        p-1 rounded cursor-pointer transition
                        ${form.imagen_url === f.url
                        ? 'ring-2 ring-green-500'
                        : 'hover:ring-1 hover:ring-gray-400'}
                      `}
                  >
                    <img
                      src={f.url}
                      alt={f.name}
                      className="w-full h-20 object-cover rounded"
                    />
                  </div>
                ))
                : <p className="col-span-3 text-center text-gray-500">
                  No se encontraron imágenes.
                </p>
            }
          </div>
        </div>

        {/* Botones */}
        <div className="flex space-x-4 pt-2">
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded disabled:opacity-50 item"
          >
            {editingId ? 'Actualizar' : 'Crear'}
          </button>
          {editingId && (
            <button
              onClick={() => {
                setEditingId(null);
                setForm(initialForm);
              }}
              className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-2 rounded"
            >
              Cancelar
            </button>
          )}
        </div>
      </div>

      {/* Listado minimalista de paquetes */}
      {loading ? (
        <p>Cargando paquetes…</p>
      ) : (
        <div className="space-y-4">
          {paquetes.map(paq => (
            <div
              key={paq.id}
              className="bg-[#26292e] p-4 rounded-lg shadow flex flex-col"
            >
              <div className="flex justify-between items-start">
                {/* Imagen + info principal */}
                <div className="flex  items-center space-x-4">
                  {paq.imagen_url && (
                    <img
                      src={paq.imagen_url}
                      alt={paq.titulo}
                      className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                    />
                  )}
                  <div>
                    <h4 className="text-lg font-semibold">{paq.titulo}</h4>
                    {paq.descripcion && (
                      <p className="text-[#d4d4d4] text-sm">{paq.descripcion}</p>
                    )}
                    <p className="font-bold text-[#D89216] text-md mt-1">
                      {paq.precio.toLocaleString('es-MX', {
                        style: 'currency',
                        currency: 'MXN',
                      })}
                    </p>
                  </div>
                </div>

                {/* Botones y toggle */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() =>
                      setOpenId(openId === paq.id ? null : paq.id)
                    }
                    className={`
                text-sm font-medium px-3 py-1 rounded-full transition
                ${openId === paq.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}
              `}
                  >
                    {openId === paq.id ? 'Ocultar' : 'actividades'}
                  </button>
                  <button
                    onClick={() => handleEdit(paq)}
                    className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded text-sm"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => setDeleteId(paq.id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                  >
                    Borrar
                  </button>

                </div>
              </div>

              {/* Desplegable de actividades */}
              {openId === paq.id && (
                <ul className="mt-3 list-disc list-inside text-[#d4d4d4]  text-sm space-y-1">
                  {paq.actividades.map((act, i) => (
                    <li key={i}>{act}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}


      {error && <div className="text-red-600 mt-4">{error}</div>}

      {/* —— MODAL DE EDICIÓN —— */}
      {editingId && (
        <Modal onClose={() => setEditingId(null)}>
          <div className="space-y-4">
            <h2 className="text-2xl text-[#fff] font-bold">Editar paquete</h2>
            {/* Reutilizamos exactamente los mismos campos que en el formulario principal */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[#fff] text-sm text-white-700font-medium">Título *</label>
                <input
                  type="text"
                  value={form.titulo}
                  onChange={e => handleChange('titulo', e.target.value)}
                  className="w-full border bg-[#33363b] text-[#c5c5c5] border-[#26292e] px-3 py-2 rounded"
                />
              </div>
              <div>
                <label className="block text-sm text-[#fff] font-medium">Precio (MXN) *</label>
                <input
                  type="number"
                  step="0.01"
                  value={form.precio}
                  onChange={e => handleChange('precio', e.target.value)}
                  className="w-full border bg-[#33363b] text-[#c5c5c5] border-[#26292e] px-3 py-2 rounded"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm text-[#fff] font-medium">Descripción</label>
              <textarea
                value={form.descripcion}
                onChange={e => handleChange('descripcion', e.target.value)}
                className="w-full border bg-[#33363b] text-[#c5c5c5] border-[#26292e] px-3 py-2 rounded resize-none"
                rows={2}
              />
            </div>
            <div>
              <label className="block text-sm text-[#fff] font-medium">Actividades</label>
              <textarea
                value={form.actividadesText}
                onChange={e => handleChange('actividadesText', e.target.value)}
                className="w-full border bg-[#33363b] text-[#c5c5c5] border-[#26292e] px-3 py-2 rounded resize-none"
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm text-[#fff] font-medium">Buscar imagen</label>
              <input
                type="text"
                placeholder="Filtrar..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full border bg-[#33363b] text-[#c5c5c5] border-[#26292e] px-3 py-2 rounded"
              />
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-48 overflow-auto p-1 border rounded">
                {loadingImgs
                  ? <p className="col-span-3 text-center">Cargando imágenes…</p>
                  : filtered.map(f => (
                    <div
                      key={f.name}
                      onClick={() => setForm(prev => ({ ...prev, imagen_url: f.url }))}
                      className={`
                          p-1 rounded cursor-pointer transition
                          ${form.imagen_url === f.url
                          ? 'ring-2 ring-green-500'
                          : 'hover:ring-1 hover:ring-gray-400'}
                        `}
                    >
                      <img
                        src={f.url}
                        alt={f.name}
                        className="w-full h-20 object-cover rounded"
                      />
                    </div>
                  ))
                }
              </div>
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <button
                onClick={() => setEditingId(null)}
                className="px-4 py-2 bg-red-600 text-white rounded border"
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmit}
                disabled={saving}
                className="px-4 py-2 rounded bg-green-600 text-white disabled:opacity-50"
              >
                Guardar
              </button>
            </div>
          </div>
        </Modal>
      )}
      {deleteId && (
        <Modal onClose={() => setDeleteId(null)}>
          <div className="p-6 space-y-4">
            <h2 className="text-xl font-bold">Confirmar eliminación</h2>
            <p>¿Estás seguro de que deseas eliminar este paquete?</p>
            <div className="flex justify-end space-x-2 pt-4">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 rounded border"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded bg-red-600 text-white"
              >
                Eliminar
              </button>
            </div>
          </div>
        </Modal>
      )}

    </div>
  );
}
