import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import useAuthStore from '../store/authStore';
import api from '../services/api';

export default function BuzonPadres() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    folio_preinscripcion: '',
    correo: '',
    telefono: '',
    descripcion: '',
  });
  const [archivos, setArchivos] = useState({ archivo1: null, archivo2: null, archivo3: null });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files[0]) {
      const file = files[0];
      const ext = file.name.split('.').pop().toLowerCase();
      const allowed = ['png', 'jpeg', 'jpg', 'pdf'];
      if (!allowed.includes(ext)) {
        setError(`Formato no permitido: .${ext}. Use PNG, JPEG, JPG o PDF.`);
        e.target.value = '';
        return;
      }
      if (file.size > 1024 * 1024) {
        setError(`El archivo ${file.name} excede 1 MB.`);
        e.target.value = '';
        return;
      }
      setError(null);
    }
    setArchivos({ ...archivos, [name]: files[0] || null });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    if (!archivos.archivo1) {
      setError('El Archivo 1 es obligatorio.');
      setIsSubmitting(false);
      return;
    }

    const data = new FormData();
    data.append('folio_preinscripcion', formData.folio_preinscripcion);
    data.append('correo', formData.correo);
    data.append('telefono', formData.telefono);
    data.append('descripcion', formData.descripcion);
    data.append('archivo1', archivos.archivo1);
    if (archivos.archivo2) data.append('archivo2', archivos.archivo2);
    if (archivos.archivo3) data.append('archivo3', archivos.archivo3);

    try {
      const response = await api.post('/buzon/enviar', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setSuccess(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Error al enviar la informacion');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        {isAuthenticated && <Navbar />}
        <div className="max-w-2xl mx-auto px-4 py-20 text-center">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 p-12">
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Informacion Enviada</h2>
            <p className="text-slate-600 mb-2">{success.message}</p>
            {success.folio_referencia && (
              <p className="text-sm text-slate-500 mt-4">
                Folio de referencia: <span className="font-mono font-bold text-blue-600">{success.folio_referencia}</span>
              </p>
            )}
            <button
              onClick={() => navigate(isAuthenticated ? '/dashboard' : '/')}
              className="mt-8 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg transition-all duration-300 hover:scale-105"
            >
              Volver al Inicio
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {isAuthenticated && <Navbar />}

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-10">
          <button
            onClick={() => navigate(isAuthenticated ? '/dashboard' : '/')}
            className="group flex items-center gap-2 text-slate-600 hover:text-blue-600 mb-6 transition-colors"
          >
            <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="font-medium">Volver</span>
          </button>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent mb-2">
            Buzon Portal de Padres
          </h1>
          <p className="text-slate-600 text-lg">
            Este es el buzon a traves del cual recibimos los documentos que permitan aclarar
            situaciones vinculadas al proceso de preinscripciones y sus etapas.
          </p>
          <p className="text-slate-500 text-sm mt-2">
            El correo electronico o telefono que proporcione, sera el medio de respuesta.
          </p>
        </div>

        {/* Form */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 p-8">
          {error && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 rounded-lg p-4">
              <div className="flex items-start">
                <svg className="h-5 w-5 text-red-500 mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-red-800 text-sm font-medium">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Folio de Ficha Preinscripcion *
                </label>
                <input
                  type="text"
                  name="folio_preinscripcion"
                  value={formData.folio_preinscripcion}
                  onChange={handleChange}
                  maxLength={7}
                  required
                  placeholder="Folio"
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Correo Electronico *
                </label>
                <input
                  type="email"
                  name="correo"
                  value={formData.correo}
                  onChange={handleChange}
                  required
                  placeholder="nombre@example.com"
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Telefono de Contacto (10 digitos) *
              </label>
              <input
                type="text"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                maxLength={10}
                required
                placeholder="442XXXXXXX"
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Describe brevemente la situacion
              </label>
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                rows={4}
                placeholder="Describe la situacion que requiere atencion..."
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
              ></textarea>
            </div>

            {/* File Uploads */}
            <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
              <h3 className="font-semibold text-slate-700 mb-1">Carga de Documentos</h3>
              <p className="text-xs text-slate-500 mb-4">
                Formatos permitidos: PNG, JPEG, JPG y PDF. Peso maximo: 1 MB por archivo.
              </p>

              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">Archivo 1 *</label>
                  <input
                    type="file"
                    name="archivo1"
                    onChange={handleFileChange}
                    accept=".png,.jpeg,.jpg,.pdf"
                    required
                    className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">Archivo 2 (opcional)</label>
                  <input
                    type="file"
                    name="archivo2"
                    onChange={handleFileChange}
                    accept=".png,.jpeg,.jpg,.pdf"
                    className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">Archivo 3 (opcional)</label>
                  <input
                    type="file"
                    name="archivo3"
                    onChange={handleFileChange}
                    accept=".png,.jpeg,.jpg,.pdf"
                    className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 disabled:from-slate-400 disabled:to-slate-500 text-white py-3.5 px-4 rounded-xl font-bold shadow-lg transition-all duration-300 hover:scale-[1.02] disabled:hover:scale-100 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Enviando Informacion...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  Enviar Informacion
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
