import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import useAuthStore from '../store/authStore';
import { tramitesAPI } from '../services/api';

export default function RevocacionGrado() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [activeTab, setActiveTab] = useState('solicitar');
  const [misRevocaciones, setMisRevocaciones] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [folio, setFolio] = useState('');
  const [statusResult, setStatusResult] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoadingRevocaciones, setIsLoadingRevocaciones] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [form, setForm] = useState({
    curp: '', nombre_alumno: '', a_paterno: '', a_materno: '',
    cct: '', nombre_escuela: '', grado: '', grupo: '', turno: 'MATUTINO', ciclo_escolar: '',
    motivo: '', nombre_padre: '', telefono: '', email: ''
  });

  useEffect(() => {
    if (activeTab === 'mis-solicitudes' && isAuthenticated) loadMisRevocaciones();
  }, [activeTab]);

  const loadMisRevocaciones = async () => {
    setIsLoadingRevocaciones(true);
    try {
      const res = await tramitesAPI.misRevocaciones();
      setMisRevocaciones(res.data);
    } catch (err) { console.error(err); }
    finally { setIsLoadingRevocaciones(false); }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!confirmed) return;
    setIsSubmitting(true);
    setResult(null);
    try {
      const res = await tramitesAPI.solicitarRevocacion({
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
        motivo: form.motivo,
        nombre_padre: form.nombre_padre,
        telefono: form.telefono,
        email: form.email
      });
      setResult({ success: res.data.success, message: res.data.message, folio: res.data.folio });
    } catch (err) {
      const detail = err.response?.data?.detail;
      const message = Array.isArray(detail) ? detail.map(e => e.msg).join('. ') : (typeof detail === 'string' ? detail : 'Error al registrar solicitud');
      setResult({ success: false, message });
    } finally { setIsSubmitting(false); }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!folio.trim()) return;
    setIsSearching(true);
    setStatusResult(null);
    try {
      const res = await tramitesAPI.consultarEstatusRevocacion(folio.trim());
      setStatusResult({ success: true, data: res.data });
    } catch (err) {
      const detail = err.response?.data?.detail;
      const message = Array.isArray(detail) ? detail.map(e => e.msg).join('. ') : (typeof detail === 'string' ? detail : 'No se encontró solicitud');
      setStatusResult({ success: false, message });
    } finally { setIsSearching(false); }
  };

  const statusBadge = { SOLICITADO: 'bg-[#E1A031]/15 text-[#7a5200]', RECHAZADA: 'bg-red-100 text-red-800', APROBADA: 'bg-green-100 text-green-800', CANCELADA: 'bg-gray-100 text-gray-800' };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-[#7CC6D8]/10 to-[#4996C6]/10">
      {isAuthenticated && <Navbar />}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10">
          <button onClick={() => navigate(isAuthenticated ? '/dashboard' : '/')} className="flex items-center gap-2 text-slate-600 hover:text-[#4996C6] mb-4 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            {isAuthenticated ? 'Volver al Panel' : 'Volver al Inicio'}
          </button>
          <h1 className="text-3xl font-bold text-[#242B57]">Revocación de Grado</h1>
          <p className="text-slate-600 mt-2">Solicita la revocación (repetición) de un grado escolar</p>
        </div>

        {/* Warning Banner */}
        <div className="bg-red-50 border-2 border-red-300 rounded-2xl p-6 mb-8">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-red-100 rounded-full flex-shrink-0">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-red-800">ADVERTENCIA: Proceso Irreversible</h3>
              <p className="text-red-700 mt-1">La revocación de grado implica que el alumno deberá repetir el grado escolar completo. Este proceso es <strong>IRREVERSIBLE</strong> una vez aprobado. Asegurese de entender las consecuencias antes de realizar esta solicitud.</p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {[
            { id: 'solicitar', label: 'Solicitar Revocación' },
            ...(isAuthenticated ? [{ id: 'mis-solicitudes', label: 'Mis Solicitudes' }] : []),
            { id: 'estatus', label: 'Consultar Estatus' },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${activeTab === tab.id ? 'bg-[#242B57] text-white shadow-lg shadow-[#242B57]/30' : 'bg-white/80 text-slate-600 hover:bg-[#7CC6D8]/15 border border-slate-200'}`}>
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'solicitar' && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Datos del alumno */}
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wide">Datos del Alumno</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">CURP del Alumno</label>
                  <input name="curp" value={form.curp} onChange={handleChange} maxLength={18} required placeholder="CURP (18 caracteres)"
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4996C6] focus:border-transparent uppercase" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Nombre(s)</label>
                  <input name="nombre_alumno" value={form.nombre_alumno} onChange={handleChange} required
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4996C6] focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Apellido Paterno</label>
                  <input name="a_paterno" value={form.a_paterno} onChange={handleChange} required
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4996C6] focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Apellido Materno</label>
                  <input name="a_materno" value={form.a_materno} onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4996C6] focus:border-transparent" />
                </div>
              </div>

              {/* Datos escolares */}
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wide pt-2">Datos Escolares</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">CCT de la Escuela</label>
                  <input name="cct" value={form.cct} onChange={handleChange} required placeholder="Ej: 22DPR0200G"
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4996C6] focus:border-transparent uppercase" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Nombre de la Escuela</label>
                  <input name="nombre_escuela" value={form.nombre_escuela} onChange={handleChange} required
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4996C6] focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Grado</label>
                  <input name="grado" value={form.grado} onChange={handleChange} required placeholder="Ej: 3"
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4996C6] focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Grupo</label>
                  <input name="grupo" value={form.grupo} onChange={handleChange} required placeholder="Ej: A"
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4996C6] focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Turno</label>
                  <select name="turno" value={form.turno} onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4996C6] focus:border-transparent">
                    <option value="MATUTINO">Matutino</option>
                    <option value="VESPERTINO">Vespertino</option>
                    <option value="COMPLETO">Tiempo Completo</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Ciclo Escolar</label>
                  <input name="ciclo_escolar" value={form.ciclo_escolar} onChange={handleChange} required placeholder="Ej: 2024-2025"
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4996C6] focus:border-transparent" />
                </div>
              </div>

              {/* Motivo y solicitante */}
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wide pt-2">Solicitud</h3>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Motivo de la revocación</label>
                <textarea name="motivo" value={form.motivo} onChange={handleChange} rows={4} required placeholder="Explique detalladamente el motivo por el cual solicita la revocación de grado..."
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4996C6] focus:border-transparent resize-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Nombre del padre/madre/tutor solicitante</label>
                <input name="nombre_padre" value={form.nombre_padre} onChange={handleChange} required
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4996C6] focus:border-transparent" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Teléfono</label>
                  <input name="telefono" value={form.telefono} onChange={handleChange} required
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4996C6] focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
                  <input name="email" type="email" value={form.email} onChange={handleChange} required
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4996C6] focus:border-transparent" />
                </div>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)}
                    className="mt-1 w-5 h-5 rounded border-red-300 text-red-600 focus:ring-red-500" />
                  <span className="text-sm text-red-800"><strong>Confirmo que entiendo</strong> que la revocación de grado es un proceso <strong>IRREVERSIBLE</strong> y que, de ser aprobada, mi hijo(a) deberá repetir el grado escolar completo. Acepto la responsabilidad de esta solicitud.</span>
                </label>
              </div>

              <button type="submit" disabled={isSubmitting || !confirmed}
                className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg transition-all">
                {isSubmitting ? 'Procesando...' : 'Solicitar Revocación de Grado'}
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

        {activeTab === 'mis-solicitudes' && (
          <div className="space-y-4">
            {isLoadingRevocaciones ? (
              <div className="text-center py-12"><div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#7CC6D8]/30 border-t-[#4996C6]"></div></div>
            ) : misRevocaciones.length === 0 ? (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-12 text-center border border-white/20">
                <p className="text-slate-600">No tienes solicitudes de revocacion registradas.</p>
              </div>
            ) : misRevocaciones.map((r, i) => (
              <div key={i} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-slate-800">Folio: {r.folio}</h3>
                  <span className={`px-3 py-1 text-xs font-bold rounded-full ${statusBadge[r.estatus] || 'bg-gray-100 text-gray-800'}`}>{r.estatus}</span>
                </div>
                {r.nombre && <p className="text-sm text-slate-600"><strong>Alumno:</strong> {r.nombre}</p>}
                <p className="text-sm text-slate-600"><strong>CURP:</strong> {r.curp}</p>
                {r.comentarios && <p className="text-sm text-slate-600"><strong>Comentarios:</strong> {r.comentarios}</p>}
                {r.fecha_solicitud && <p className="text-sm text-slate-500"><strong>Fecha:</strong> {r.fecha_solicitud}</p>}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'estatus' && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-8">
            <h2 className="text-xl font-bold text-slate-800 mb-6">Consultar Estatus por Folio</h2>
            <form onSubmit={handleSearch} className="flex gap-3 mb-6">
              <input type="text" value={folio} onChange={(e) => setFolio(e.target.value)} placeholder="Ingresa tu folio"
                className="flex-1 px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4996C6] focus:border-transparent" />
              <button type="submit" disabled={isSearching}
                className="bg-[#242B57] hover:bg-[#4996C6] text-white px-8 py-3 rounded-xl font-semibold shadow-lg transition-all">
                {isSearching ? 'Buscando...' : 'Buscar'}
              </button>
            </form>
            {statusResult && (
              <div className={`p-6 rounded-xl ${statusResult.success ? 'bg-[#7CC6D8]/10 border border-[#7CC6D8]/40' : 'bg-red-50 border border-red-200'}`}>
                {statusResult.success ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="font-bold text-lg text-slate-800">Folio: {statusResult.data.folio}</h3>
                      <span className={`px-3 py-1 text-xs font-bold rounded-full ${statusBadge[statusResult.data.estatus] || 'bg-gray-100 text-gray-800'}`}>{statusResult.data.estatus}</span>
                    </div>
                    {statusResult.data.nombre && <p className="text-sm text-slate-600"><strong>Alumno:</strong> {statusResult.data.nombre}</p>}
                    <p className="text-sm text-slate-600"><strong>CURP:</strong> {statusResult.data.curp}</p>
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
