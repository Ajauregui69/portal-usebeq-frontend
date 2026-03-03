import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import useAuthStore from '../store/authStore';
import { usebeqAPI } from '../services/api';

export default function BajasTraslado() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [activeTab, setActiveTab] = useState('solicitud');
  const [tiposBaja, setTiposBaja] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [folio, setFolio] = useState('');
  const [statusResult, setStatusResult] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [form, setForm] = useState({
    curp: '', nombre_alumno: '', a_paterno: '', a_materno: '',
    cct: '', nombre_escuela: '', grado: '', grupo: '', turno: 'MATUTINO', ciclo_escolar: '',
    idMotivoBaja: ''
  });

  useEffect(() => {
    loadTiposBaja();
  }, []);

  const loadTiposBaja = async () => {
    try {
      const res = await usebeqAPI.getTiposBaja();
      setTiposBaja(res.data);
    } catch (err) {
      console.error('Error loading tipos de baja:', err);
    }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setResult(null);
    try {
      const res = await usebeqAPI.solicitarBaja({
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
        idMotivoBaja: parseInt(form.idMotivoBaja)
      });
      setResult({ success: true, message: res.data.mensaje || 'Solicitud de baja procesada correctamente' });
      setShowConfirm(false);
    } catch (err) {
      setResult({ success: false, message: err.response?.data?.detail || 'Error al procesar la solicitud' });
      setShowConfirm(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!folio.trim()) return;
    setIsSearching(true);
    setStatusResult(null);
    try {
      const res = await usebeqAPI.solicitarBaja({ folio: folio.trim() });
      setStatusResult({ success: true, data: res.data });
    } catch (err) {
      setStatusResult({ success: false, message: 'No se encontró información para este folio' });
    } finally {
      setIsSearching(false);
    }
  };

  const canSubmit = form.curp && form.nombre_alumno && form.a_paterno && form.cct && form.idMotivoBaja;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {isAuthenticated && <Navbar />}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10">
          <button onClick={() => navigate(isAuthenticated ? '/dashboard' : '/')} className="flex items-center gap-2 text-slate-600 hover:text-blue-600 mb-4 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            {isAuthenticated ? 'Volver al Panel' : 'Volver al Inicio'}
          </button>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Bajas por Traslado</h1>
          <p className="text-slate-600 mt-2">Solicita una baja por traslado para tus estudiantes</p>
        </div>

        <div className="flex gap-2 mb-8">
          {[{ id: 'solicitud', label: 'Nueva Solicitud' }, { id: 'estatus', label: 'Consultar Estatus' }].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${activeTab === tab.id ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30' : 'bg-white/80 text-slate-600 hover:bg-blue-50 border border-slate-200'}`}>
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'solicitud' && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-8">
            <div className="bg-amber-50 border-l-4 border-amber-500 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 text-amber-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                <div>
                  <h3 className="font-bold text-amber-800">Aviso importante</h3>
                  <p className="text-amber-700 text-sm">La baja por traslado es el proceso para cambiar a un estudiante de escuela. Una vez procesada, el estudiante sera dado de baja en su escuela actual.</p>
                </div>
              </div>
            </div>

            <div className="space-y-5">
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

              {/* Motivo */}
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wide pt-2">Motivo de la Baja</h3>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Motivo</label>
                <select name="idMotivoBaja" value={form.idMotivoBaja} onChange={handleChange} required
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="">-- Seleccionar motivo --</option>
                  {tiposBaja.map(t => (
                    <option key={t.Id} value={t.Id}>{t.Descripcion}</option>
                  ))}
                </select>
              </div>

              <button onClick={() => setShowConfirm(true)} disabled={!canSubmit || isSubmitting}
                className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg transition-all duration-300">
                Solicitar Baja por Traslado
              </button>
            </div>

            {result && (
              <div className={`mt-6 p-4 rounded-xl ${result.success ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' : 'bg-red-50 border border-red-200 text-red-800'}`}>
                <p className="font-medium">{result.message}</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'estatus' && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-8">
            <h2 className="text-xl font-bold text-slate-800 mb-6">Consultar Estatus de Baja</h2>
            <form onSubmit={handleSearch} className="flex gap-3">
              <input type="text" value={folio} onChange={(e) => setFolio(e.target.value)} placeholder="Ingresa tu folio de solicitud"
                className="flex-1 px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" />
              <button type="submit" disabled={isSearching}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg transition-all">
                {isSearching ? 'Buscando...' : 'Buscar'}
              </button>
            </form>
            {statusResult && (
              <div className={`mt-6 p-4 rounded-xl ${statusResult.success ? 'bg-blue-50 border border-blue-200' : 'bg-red-50 border border-red-200 text-red-800'}`}>
                {statusResult.success ? (
                  <pre className="text-sm text-slate-700 whitespace-pre-wrap">{JSON.stringify(statusResult.data, null, 2)}</pre>
                ) : (
                  <p className="font-medium">{statusResult.message}</p>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {showConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6">
            <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            </div>
            <h2 className="text-xl font-bold text-slate-800 text-center mb-2">Confirmar Baja</h2>
            <p className="text-slate-600 text-center text-sm mb-2">
              <strong>{form.nombre_alumno} {form.a_paterno} {form.a_materno}</strong>
            </p>
            <p className="text-slate-600 text-center mb-6">¿Estas seguro de solicitar la baja por traslado? Esta accion no se puede deshacer facilmente.</p>
            <div className="flex gap-3">
              <button onClick={handleSubmit} disabled={isSubmitting}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-semibold transition-all">
                {isSubmitting ? 'Procesando...' : 'Confirmar Baja'}
              </button>
              <button onClick={() => setShowConfirm(false)} className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-700 px-6 py-3 rounded-xl font-semibold transition-all">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
