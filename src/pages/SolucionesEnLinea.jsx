import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import useAuthStore from '../store/authStore';
import { tramitesAPI } from '../services/api';

export default function SolucionesEnLinea() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [activeTab, setActiveTab] = useState('nueva');
  const [tiposTramite, setTiposTramite] = useState([]);
  const [misTramites, setMisTramites] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [folio, setFolio] = useState('');
  const [statusResult, setStatusResult] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoadingTramites, setIsLoadingTramites] = useState(false);
  const [form, setForm] = useState({
    curp: '', nombre_alumno: '', a_paterno: '', a_materno: '',
    cct: '', nombre_escuela: '', grado: '', grupo: '', turno: 'MATUTINO', ciclo_escolar: '',
    tipo_tramite: '', descripcion: '', telefono: '', email: ''
  });

  useEffect(() => {
    loadTiposTramite();
  }, []);

  useEffect(() => {
    if (activeTab === 'mis-tramites' && isAuthenticated) loadMisTramites();
  }, [activeTab]);

  const loadTiposTramite = async () => {
    try {
      const res = await tramitesAPI.getTiposTramite();
      setTiposTramite(res.data);
    } catch (err) { console.error(err); }
  };

  const loadMisTramites = async () => {
    setIsLoadingTramites(true);
    try {
      const res = await tramitesAPI.misTramites();
      setMisTramites(res.data);
    } catch (err) { console.error(err); }
    finally { setIsLoadingTramites(false); }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setResult(null);
    try {
      const res = await tramitesAPI.crearSolicitud({
        curp: form.curp,
        nombre_alumno: form.nombre_alumno,
        a_paterno: form.a_paterno,
        a_materno: form.a_materno,
        cct: form.cct,
        nombre_escuela: form.nombre_escuela,
        grado: form.grado,
        grupo: form.grupo,
        turno: form.turno,
        ciclo_escolar: form.ciclo_escolar,
        tipo_tramite: form.tipo_tramite,
        descripcion: form.descripcion,
        telefono: form.telefono,
        email: form.email
      });
      setResult({ success: res.data.success, message: res.data.message, folio: res.data.folio });
    } catch (err) {
      setResult({ success: false, message: err.response?.data?.detail || 'Error al crear solicitud' });
    } finally { setIsSubmitting(false); }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!folio.trim()) return;
    setIsSearching(true);
    setStatusResult(null);
    try {
      const res = await tramitesAPI.consultarEstatus(folio.trim());
      setStatusResult({ success: true, data: res.data });
    } catch (err) {
      setStatusResult({ success: false, message: err.response?.data?.detail || 'No se encontro solicitud' });
    } finally { setIsSearching(false); }
  };

  const statusBadge = { SOLICITADO: 'bg-yellow-100 text-yellow-800', EN_PROCESO: 'bg-blue-100 text-blue-800', COMPLETADO: 'bg-green-100 text-green-800', RECHAZADO: 'bg-red-100 text-red-800' };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {isAuthenticated && <Navbar />}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10">
          <button onClick={() => navigate(isAuthenticated ? '/dashboard' : '/')} className="flex items-center gap-2 text-slate-600 hover:text-blue-600 mb-4 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            {isAuthenticated ? 'Volver al Panel' : 'Volver al Inicio'}
          </button>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Soluciones en Linea</h1>
          <p className="text-slate-600 mt-2">Realiza tramites y solicitudes administrativas en linea</p>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {[
            { id: 'nueva', label: 'Nueva Solicitud' },
            ...(isAuthenticated ? [{ id: 'mis-tramites', label: 'Mis Solicitudes' }] : []),
            { id: 'estatus', label: 'Consultar Estatus' },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${activeTab === tab.id ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30' : 'bg-white/80 text-slate-600 hover:bg-blue-50 border border-slate-200'}`}>
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'nueva' && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Datos del alumno */}
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wide">Datos del Alumno</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">CURP del Alumno</label>
                  <input name="curp" value={form.curp} onChange={handleChange} maxLength={18} required placeholder="CURP (18 caracteres)"
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent uppercase" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Nombre(s)</label>
                  <input name="nombre_alumno" value={form.nombre_alumno} onChange={handleChange} required
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Apellido Paterno</label>
                  <input name="a_paterno" value={form.a_paterno} onChange={handleChange} required
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Apellido Materno</label>
                  <input name="a_materno" value={form.a_materno} onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
              </div>

              {/* Datos escolares */}
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wide pt-2">Datos Escolares</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">CCT de la Escuela</label>
                  <input name="cct" value={form.cct} onChange={handleChange} required placeholder="Ej: 22DPR0200G"
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent uppercase" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Nombre de la Escuela</label>
                  <input name="nombre_escuela" value={form.nombre_escuela} onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Grado</label>
                  <input name="grado" value={form.grado} onChange={handleChange} placeholder="Ej: 3"
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Grupo</label>
                  <input name="grupo" value={form.grupo} onChange={handleChange} placeholder="Ej: A"
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Turno</label>
                  <select name="turno" value={form.turno} onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="MATUTINO">Matutino</option>
                    <option value="VESPERTINO">Vespertino</option>
                    <option value="COMPLETO">Tiempo Completo</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Ciclo Escolar</label>
                  <input name="ciclo_escolar" value={form.ciclo_escolar} onChange={handleChange} placeholder="Ej: 2024-2025"
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
              </div>

              {/* Solicitud */}
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wide pt-2">Solicitud</h3>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Tipo de Tramite</label>
                <select name="tipo_tramite" value={form.tipo_tramite} onChange={handleChange} required
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="">-- Seleccionar tipo --</option>
                  {tiposTramite.map(t => <option key={t.id} value={t.id}>{t.nombre} - {t.descripcion}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Descripcion de la solicitud</label>
                <textarea name="descripcion" value={form.descripcion} onChange={handleChange} rows={4} required placeholder="Describe detalladamente tu solicitud..."
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Telefono de contacto</label>
                  <input name="telefono" value={form.telefono} onChange={handleChange} placeholder="10 digitos"
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Email de contacto</label>
                  <input name="email" type="email" value={form.email} onChange={handleChange} required
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
              </div>

              <button type="submit" disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg transition-all">
                {isSubmitting ? 'Enviando...' : 'Enviar Solicitud'}
              </button>
            </form>
            {result && (
              <div className={`mt-6 p-4 rounded-xl ${result.success ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' : 'bg-red-50 border border-red-200 text-red-800'}`}>
                <p className="font-medium">{result.message}</p>
                {result.folio && <p className="text-sm mt-1"><strong>Folio:</strong> {result.folio}</p>}
              </div>
            )}
          </div>
        )}

        {activeTab === 'mis-tramites' && (
          <div className="space-y-4">
            {isLoadingTramites ? (
              <div className="text-center py-12"><div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600"></div></div>
            ) : misTramites.length === 0 ? (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-12 text-center border border-white/20">
                <p className="text-slate-600">No tienes solicitudes registradas.</p>
              </div>
            ) : misTramites.map((t, i) => (
              <div key={i} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-slate-800">Folio: {t.folio}</h3>
                  <span className={`px-3 py-1 text-xs font-bold rounded-full ${statusBadge[t.estatus] || 'bg-gray-100 text-gray-800'}`}>{t.estatus}</span>
                </div>
                <p className="text-sm text-slate-600"><strong>Tipo:</strong> {t.tipo_tramite}</p>
                {t.nombre && <p className="text-sm text-slate-600"><strong>Alumno:</strong> {t.nombre}</p>}
                {t.fecha_solicitud && <p className="text-sm text-slate-500"><strong>Fecha:</strong> {t.fecha_solicitud}</p>}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'estatus' && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-8">
            <h2 className="text-xl font-bold text-slate-800 mb-6">Consultar Estatus por Folio</h2>
            <form onSubmit={handleSearch} className="flex gap-3 mb-6">
              <input type="text" value={folio} onChange={(e) => setFolio(e.target.value)} placeholder="Ingresa tu folio"
                className="flex-1 px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              <button type="submit" disabled={isSearching}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg transition-all">
                {isSearching ? 'Buscando...' : 'Buscar'}
              </button>
            </form>
            {statusResult && (
              <div className={`p-6 rounded-xl ${statusResult.success ? 'bg-blue-50 border border-blue-200' : 'bg-red-50 border border-red-200'}`}>
                {statusResult.success ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="font-bold text-lg text-slate-800">Folio: {statusResult.data.folio}</h3>
                      <span className={`px-3 py-1 text-xs font-bold rounded-full ${statusBadge[statusResult.data.estatus] || 'bg-gray-100 text-gray-800'}`}>{statusResult.data.estatus}</span>
                    </div>
                    <p className="text-sm text-slate-600"><strong>Tipo:</strong> {statusResult.data.tipo_tramite}</p>
                    {statusResult.data.nombre && <p className="text-sm text-slate-600"><strong>Alumno:</strong> {statusResult.data.nombre}</p>}
                    {statusResult.data.comentarios && <p className="text-sm text-slate-600"><strong>Comentarios:</strong> {statusResult.data.comentarios}</p>}
                    {statusResult.data.fecha_solicitud && <p className="text-sm text-slate-500"><strong>Fecha:</strong> {statusResult.data.fecha_solicitud}</p>}
                  </div>
                ) : <p className="font-medium text-red-800">{statusResult.message}</p>}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
