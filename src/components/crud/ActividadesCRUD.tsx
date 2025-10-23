import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { useActividades, Actividad } from '../../hooks/useActividades';
import { supabase } from '../../lib/supabase';

import { Modal } from '../reusable/modalAdmin';
import { createPortal } from 'react-dom';

const initialForm: Omit<Actividad, 'id' | 'fecha_creacion'> = {
  titulo: '',
  slogan: '',
  titulo1: '',
  texto1: '',
  titulo2: '',
  texto2: '',
  imagenes: [],
};
const IMAGE_EXT_RE = /\.(png|jpe?g|gif|webp|svg)$/i;

export default function ActividadesCRUD() {
  const {
    actividades,
    loading: loadActs,
    error: errActs,
    fetchActividades,
    createActividad,
    updateActividad,
    deleteActividad,
  } = useActividades();

  const [storageUrls, setStorageUrls] = useState<string[]>([]);
  const [loadingImgs, setLoadingImgs] = useState(false);

  // Nuevo estado para vista
  const [viewActivity, setViewActivity] = useState<Actividad | null>(null)

  // Crear form
  const [form, setForm] = useState(initialForm);

  // Estado para edición en modal
   const [editing, setEditing] = useState<Actividad | null>(null);
  const [modalForm, setModalForm] = useState<Omit<Actividad, 'id' | 'fecha_creacion'>>(initialForm);

  //Eliminar modal
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
  };

  //Buscador
  const [storageFiles, setStorageFiles] = useState<{ name: string; url: string }[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteActividad(deleteId);
      toast.success('Actividad eliminada');
      fetchActividades();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setDeleteId(null);
    }
  };
  
  useEffect(() => {
    if (editing) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [editing]);

  // Carga imágenes del bucket
  useEffect(() => {
    async function loadImages() {
      setLoadingImgs(true);
      try {
        const { data, error } = await supabase.storage.from('actividades').list('', { limit: 200 });
        if (error) throw error;
        const files = data!.filter(i => IMAGE_EXT_RE.test(i.name));
        const items = files.map(i => {
          const { data: d } = supabase.storage.from('actividades').getPublicUrl(i.name);
          return { name: i.name, url: d.publicUrl };
        });
        setStorageFiles(items);
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingImgs(false);
      }
    }
    loadImages();
  }, []);

  // justo antes de renderizar la grid calcula:
  const filteredFiles = storageFiles.filter(f =>
    f.name.toLowerCase().includes(searchTerm.toLowerCase())
  );


  const handleChange = (key: keyof typeof form, value: any) =>
    setForm(f => ({ ...f, [key]: value }));
  const handleModalChange = (key: keyof typeof modalForm, value: any) =>
    setModalForm(m => ({ ...m, [key]: value }));

  const toggleImage = (url: string, target: 'create' | 'edit') => {
    const arr = target === 'create' ? form.imagenes : modalForm.imagenes;
    const setter = target === 'create' ? setForm : setModalForm;
    if (arr.includes(url)) setter(prev => ({ ...prev, imagenes: prev.imagenes.filter(u => u !== url) }));
    else setter(prev => ({ ...prev, imagenes: [...prev.imagenes, url] }));
  };

  // dentro de ActividadesCRUD, reemplaza tu función handleCreate por esta:

  const handleCreate = async () => {
    // 1) Validación
    if (
      !form.titulo.trim() ||
      !form.slogan.trim() ||
      !form.titulo1.trim() ||
      !form.texto1.trim() ||
      !form.titulo2.trim() ||
      !form.texto2.trim() ||
      form.imagenes.length === 0
    ) {
      toast.error('Todos los campos son obligatorios y debes seleccionar al menos una imagen');
      return;
    }

    // 2) Si pasa validación, crea la actividad
    try {
      await createActividad(form);
      toast.success('Actividad creada');
      setForm(initialForm);
    } catch (e: any) {
      toast.error(e.message);
    }
  };


  const openEdit = (act: Actividad) => {
    setEditing(act);
    setModalForm({
      titulo: act.titulo,
      slogan: act.slogan,
      titulo1: act.titulo1,
      texto1: act.texto1,
      titulo2: act.titulo2,
      texto2: act.texto2,
      imagenes: act.imagenes,
    });
  };

  const handleUpdate = async () => {
    if (!editing) return;

    // validación idéntica
    if (
      !modalForm.titulo.trim() ||
      !modalForm.slogan.trim() ||
      !modalForm.titulo1.trim() ||
      !modalForm.texto1.trim() ||
      !modalForm.titulo2.trim() ||
      !modalForm.texto2.trim() ||
      modalForm.imagenes.length === 0
    ) {
      toast.error('Todos los campos son obligatorios y debes seleccionar al menos una imagen');
      return;
    }

    try {
      await updateActividad(editing.id, modalForm);
      toast.success('Actividad actualizada');
      setEditing(null);
    } catch (e: any) {
      toast.error(e.message);
    }
  };




  return (
    <div className="px-4 py-6 max-w-full sm:max-w-2xl lg:max-w-4xl xl:max-w-6xl mx-auto space-y-8">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Formulario Crear Mejorado */}
      <div className="bg-[#26292e] p-6 sm:p-8 md:p-10 rounded-3xl shadow-2xl space-y-4">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white-800">
          Nueva Actividad
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Título */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-white-700">Título</label>
            <input
              type="text"
              placeholder="Ej. Ruta Salvaje"
              value={form.titulo}
              onChange={e => handleChange('titulo', e.target.value)}
              className="w-full border bg-[#33363b] placeholder-[#c5c5c5] border-[#26292e] focus:border-blue-500 focus:ring-blue-200 rounded-lg px-4 py-2 transition"
            />
          </div>
          {/* Slogan */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-white-700">Slogan</label>
            <input
              type="text"
              placeholder="Ej. ¡Despierta tu espíritu aventurero!"
              value={form.slogan}
              onChange={e => handleChange('slogan', e.target.value)}
              className="w-full border  bg-[#33363b] placeholder-[#c5c5c5] border-[#26292e] focus:border-blue-500 focus:ring-blue-200 rounded-lg px-4 py-2 transition"
            />
          </div>
        </div>

        {/* Sección 1 */}
        <div className="space-y-4">
          <h3 className="text-lg sm:text-xl font-semibold text-white-800">Sección 1</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-white-700">
                Título Sección 1
              </label>
              <input
                type="text"
                placeholder="Emoción al Máximo"
                value={form.titulo1}
                onChange={e => handleChange('titulo1', e.target.value)}
                className="w-full border bg-[#33363b] placeholder-[#c5c5c5] border-[#26292e] focus:border-blue-500 focus:ring-blue-200 rounded-lg px-4 py-2 transition"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-white-700">
                Texto Sección 1
              </label>
              <textarea
                placeholder="Descripción detallada de la sección 1..."
                value={form.texto1}
                onChange={e => handleChange('texto1', e.target.value)}
                className="w-full h-24 sm:h-32 border bg-[#33363b] placeholder-[#c5c5c5] border-[#26292e] focus:border-blue-500 focus:ring-blue-200 rounded-lg px-4 py-2 transition resize-none"
              />
            </div>
          </div>
        </div>

        {/* Sección 2 */}
        <div className="space-y-4">
          <h3 className="text-lg sm:text-xl font-semibold text-white-800">Sección 2</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-white-700">
                Título Sección 2
              </label>
              <input
                type="text"
                placeholder="Lo Esencial de tu Aventura"
                value={form.titulo2}
                onChange={e => handleChange('titulo2', e.target.value)}
                className="w-full border bg-[#33363b] placeholder-[#c5c5c5] border-[#26292e] focus:border-blue-500 focus:ring-blue-200 rounded-lg px-4 py-2 transition"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-white-700">
                Texto Sección 2
              </label>
              <textarea
                placeholder="Descripción detallada de la sección 2..."
                value={form.texto2}
                onChange={e => handleChange('texto2', e.target.value)}
                className="w-full h-24 sm:h-32 border bg-[#33363b] placeholder-[#c5c5c5] border-[#26292e] focus:border-blue-500 focus:ring-blue-200 rounded-lg px-4 py-2 transition resize-none"
              />
            </div>
          </div>
        </div>

        {/* Buscador de imágenes */}
        <div className="mt-4">
          <input
            type="text"
            placeholder="🔍 Buscar imagen por nombre"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full border bg-[#33363b] placeholder-[#c5c5c5] border-[#26292e] focus:border-blue-500 focus:ring-blue-200 rounded-lg px-4 py-2 transition"
          />
        </div>

        {/* Grid de imágenes filtradas */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mt-2 max-h-48 overflow-auto">
          {filteredFiles.map(file => (
            <div
              key={file.url}
              onClick={() => toggleImage(file.url, 'create')}
              className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition ${form.imagenes.includes(file.url)
                  ? 'border-blue-500 ring-2 ring-blue-200'
                  : 'border-gray-200'
                }`}
            >
              <img
                src={file.url}
                alt={file.name}
                className="w-full h-20 sm:h-24 object-cover"
              />
              {form.imagenes.includes(file.url) && (
                <span className="absolute top-1 right-1 bg-white rounded-full p-1 text-blue-500 shadow">
                  ✓
                </span>
              )}
            </div>
          ))}
          {filteredFiles.length === 0 && !loadingImgs && (
            <p className="col-span-full text-center text-gray-500">
              No se encontraron imágenes.
            </p>
          )}
        </div>

        {/* Botón Crear */}
        <div className="flex justify-end">
          <button
            onClick={handleCreate}
            className="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition"
          >
            Crear Actividad
          </button>
        </div>
      </div>

      {/* Grilla Compacta Mejorada */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {actividades.map(act => (
          <div
            key={act.id}
            className="relative bg-[#26292e] placeholder-[#c5c5c5] border-[#26292e] rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow"
          >
            {/* Miniaturas */}
            <div className="grid grid-cols-3 gap-1">
              {act.imagenes.slice(0, 3).map(url => (
                <img
                  key={url}
                  src={url}
                  alt=""
                  className="w-full h-24 sm:h-32 object-cover"
                />
              ))}
              {act.imagenes.length > 3 && (
                <div className="flex items-center justify-center bg-gray-200 text-gray-700 font-medium">
                  +{act.imagenes.length - 3}
                </div>
              )}
            </div>

            {/* Texto */}
            <div className="p-4 space-y-2">
              <h3 className="text-lg sm:text-xl font-semibold leading-snug">
                {act.titulo}
              </h3>
              <p className="text-[#adadad] line-clamp-2">{act.slogan}</p>
            </div>

            {/* Botones Verticales */}
            <div className="absolute top-4 right-4 flex flex-col space-y-2">
              <button
                onClick={() => setViewActivity(act)}
                className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full shadow-md transition"
                title="Ver más"
              >
                🔍
              </button>
              <button
                onClick={() => openEdit(act)}
                className="bg-yellow-400 hover:bg-yellow-500 text-white p-2 rounded-full shadow-md transition"
                title="Editar"
              >
                ✏️
              </button>
              <button
                onClick={() => handleDeleteClick(act.id)}
                className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-md transition"
                title="Eliminar"
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Confirmación Borrado */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-[#26292e] p-6 rounded shadow-lg max-w-sm w-full space-y-4">
            <h3 className="text-lg font-semibold">Confirmar borrado</h3>
            <p>¿Estás seguro de que quieres eliminar esta actividad?</p>
            <div className="flex justify-end space-x-2 pt-4">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 rounded border"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded bg-red-600 text-white"
              >
                Sí, eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL “VER MÁS” SOLO LECTURA --- */}

      {viewActivity && (
        <Modal onClose={() => setViewActivity(null)}>
          <div
            className="
        bg-[#26292e] rounded-2xl
        p-2 sm:p-6 md:p-8
        w-full
        max-w-xs sm:max-w md:max-w-lg lg:max-w-2xl
        mx-auto
        shadow-2xl
        overflow-auto max-h-[90vh]
      "
          >
            {/* Encabezado */}
            <div className="mb-8">
              <h4 className="text-sm text-[#cfcfcf] font-medium">{viewActivity.titulo}</h4>
              <h2 className="text-3xl text-[#ffffff] font-bold">{viewActivity.slogan}</h2>
            </div>

            {/* Sección 1 */}
            <section className="mb-10 flex flex-col md:flex-row items-center gap-6 bg-[#33363b] p-6 rounded-xl">
              <div className="flex-1">
                <h3 className="text-lg text-[#ffffff] font-semibold mb-2">{viewActivity.titulo1}</h3>
                <p className="text-[#cfcfcf] text-sm sm:text-base">
                  {viewActivity.texto1}
                </p>
              </div>
              <img
                src={viewActivity.imagenes[0]}
                alt=""
                className="w-full sm:w-56 md:w-48 lg:w-60 rounded-2xl shadow-lg object-cover"
              />
            </section>

            {/* Sección 2 */}
            <section className="mb-6 bg-[#33363b] p-6 rounded-xl">
              <h3 className="text-lg text-[#ffffff] font-semibold mb-2">{viewActivity.titulo2}</h3>
              <p className="text-[#cfcfcf] text-sm sm:text-base mb-4">{viewActivity.texto2}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {viewActivity.imagenes.map(url => (
                  <div key={url} className="w-full aspect-[3/2] bg-gray-300 rounded-xl overflow-hidden">
                    <img
                      src={url}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </section>
          </div>
        </Modal>
      )}


{/* Modal de edición con portal */}
{editing && createPortal(
  <div className="fixed inset-0 over bg-black/50 z-50 flex items-center justify-center p-4">
    <div className="bg-[#26292e] p-6 rounded-lg shadow-lg max-w-xl w-full text-white">
      <h2 className="text-2xl font-bold mb-4">Editar actividad</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Título */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-300">Título</label>
          <input
            type="text"
            placeholder="Ej. Ruta Salvaje"
            value={modalForm.titulo}
            onChange={e => handleModalChange('titulo', e.target.value)}
            className="w-full bg-[#33363b] border border-[#26292e] px-3 py-2 rounded placeholder-gray-400 text-white"
          />
        </div>

        {/* Slogan */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-300">Slogan</label>
          <input
            type="text"
            placeholder="¡Despierta tu espíritu aventurero!"
            value={modalForm.slogan}
            onChange={e => handleModalChange('slogan', e.target.value)}
            className="w-full bg-[#33363b] border border-[#26292e] px-3 py-2 rounded placeholder-gray-400 text-white"
          />
        </div>

        {/* Título sección 1 */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-300">Título Sección 1</label>
          <input
            type="text"
            placeholder="Emoción al Máximo"
            value={modalForm.titulo1}
            onChange={e => handleModalChange('titulo1', e.target.value)}
            className="w-full bg-[#33363b] border border-[#26292e] px-3 py-2 rounded placeholder-gray-400 text-white"
          />
        </div>

        {/* Texto sección 1 */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-300">Texto Sección 1</label>
          <textarea
            placeholder="Descripción detallada de la sección 1..."
            value={modalForm.texto1}
            onChange={e => handleModalChange('texto1', e.target.value)}
            rows={4}
            className="w-full bg-[#33363b] border border-[#26292e] px-3 py-2 rounded placeholder-gray-400 text-white resize-none"
          />
        </div>

        {/* Título sección 2 */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-300">Título Sección 2</label>
          <input
            type="text"
            placeholder="Lo Esencial de tu Aventura"
            value={modalForm.titulo2}
            onChange={e => handleModalChange('titulo2', e.target.value)}
            className="w-full bg-[#33363b] border border-[#26292e] px-3 py-2 rounded placeholder-gray-400 text-white"
          />
        </div>

        {/* Texto sección 2 */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-300">Texto Sección 2</label>
          <textarea
            placeholder="Descripción detallada de la sección 2..."
            value={modalForm.texto2}
            onChange={e => handleModalChange('texto2', e.target.value)}
            rows={4}
            className="w-full bg-[#33363b] border border-[#26292e] px-3 py-2 rounded placeholder-gray-400 text-white resize-none"
          />
        </div>
      </div>

      {/* Buscador de imágenes */}
      <div className="mt-4">
        <input
          type="text"
          placeholder="🔍 Buscar imagen por nombre"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full border bg-[#33363b] placeholder-[#c5c5c5] border-[#26292e] focus:border-blue-500 focus:ring-blue-200 rounded-lg px-4 py-2 transition  text-white"
        />
      </div>

      {/* Selector de imágenes */}
      <h4 className="mt-4 font-medium text-gray-300">
        {loadingImgs ? 'Cargando imágenes...' : 'Selecciona imágenes:'}
      </h4>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 max-h-48 overflow-auto mt-2">
        {filteredFiles.map(file => (
          <div
            key={file.url}
            onClick={() => toggleImage(file.url, 'edit')}
            className={`
              relative p-1 rounded cursor-pointer transition
              ${modalForm.imagenes.includes(file.url)
                ? 'border-2 border-green-400 ring-1 ring-green-600'
                : 'border border-gray-600 hover:border-gray-400'
              }
            `}
          >
            <img
              src={file.url}
              alt={file.name}
              className="w-full h-20 object-cover rounded-lg"
            />
            {modalForm.imagenes.includes(file.url) && (
              <span className="absolute top-1 right-1 bg-green-400 text-white rounded-full p-1 text-xs">
                ✓
              </span>
            )}
          </div>
        ))}
        {!loadingImgs && filteredFiles.length === 0 && (
          <p className="col-span-full text-center text-gray-400">
            No se encontraron imágenes.
          </p>
        )}
      </div>

      {/* Botones */}
      <div className="flex justify-end space-x-2 pt-4">
        <button
          onClick={() => setEditing(null)}
          className="px-4 py-2 rounded border border-gray-600 hover:border-gray-500"
        >
          Cancelar
        </button>
        <button
          onClick={handleUpdate}
          className="px-4 py-2 rounded bg-green-600 hover:bg-green-700 text-white"
        >
          Guardar
        </button>
      </div>
    </div>
  </div>,
  document.body
)}


    </div>
  );
}
