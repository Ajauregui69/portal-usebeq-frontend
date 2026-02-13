import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import useAuthStore from '../store/authStore';
import { certificatesAPI } from '../services/api';

export default function DuplicadoCertificado() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [activeTab, setActiveTab] = useState('solicitud');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [folio, setFolio] = useState('');
  const [statusResult, setStatusResult] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [form, setForm] = useState({
    curp: '', nombre_alumno: '', a_paterno: '', a_materno: '', telefono: '', email: '',
    cct: '', nombre_esc: '', dom_esc: '', turno: 'MATUTINO', ciclo_terminacion: '',
    tipo_tramite: 'CERTIFICADO DE PRIMARIA', correccion: 'NO', core: ''
  });

  useEffect(() => {
    if (!isAuthenticated) { navigate('/login'); return; }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setResult(null);
    try {
      const res = await certificatesAPI.request(form);
      setResult({ success: res.data.success, message: res.data.message, folio: res.data.folio, requiresPayment: res.data.requires_payment, paymentUrl: res.data.payment_url });
    } catch (err) {
      const detail = err.response?.data?.detail;
      const message = Array.isArray(detail) ? detail.map(e => e.msg).join('. ') : (typeof detail === 'string' ? detail : 'Error al procesar la solicitud');
      setResult({ success: false, message });
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
      const res = await certificatesAPI.getStatus(folio.trim());
      setStatusResult({ success: true, data: res.data });
    } catch (err) {
      const detail = err.response?.data?.detail;
      const message = Array.isArray(detail) ? detail.map(e => e.msg).join('. ') : (typeof detail === 'string' ? detail : 'No se encontro solicitud con este folio');
      setStatusResult({ success: false, message });
    } finally {
      setIsSearching(false);
    }
  };

  const statusBadge = { SOLICITADO: 'bg-yellow-100 text-yellow-800', EN_PROCESO: 'bg-blue-100 text-blue-800', FIRMADO: 'bg-green-100 text-green-800', REIMPRESION: 'bg-purple-100 text-purple-800', RECHAZADO: 'bg-red-100 text-red-800' };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10">
          <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-slate-600 hover:text-blue-600 mb-4 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Volver al Panel
          </button>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Duplicado de Certificado</h1>
          <p className="text-slate-600 mt-2">Solicita la reimpresion de certificados de estudios</p>
        </div>

        <div className="flex gap-2 mb-8">
          {[{ id: 'solicitud', label: 'Solicitar Duplicado' }, { id: 'estatus', label: 'Consultar Estatus' }].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${activeTab === tab.id ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30' : 'bg-white/80 text-slate-600 hover:bg-blue-50 border border-slate-200'}`}>
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'solicitud' && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Tipo de Certificado</label>
                <select name="tipo_tramite" value={form.tipo_tramite} onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="CERTIFICADO DE PREESCOLAR">Preescolar</option>
                  <option value="CERTIFICADO DE PRIMARIA">Primaria</option>
                  <option value="CERTIFICADO DE SECUNDARIA">Secundaria</option>
                </select>
              </div>
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
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Telefono</label>
                  <input name="telefono" value={form.telefono} onChange={handleChange} required
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
                  <input name="email" type="email" value={form.email} onChange={handleChange} required
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">CCT de la Escuela</label>
                  <input name="cct" value={form.cct} onChange={handleChange} required placeholder="Ej: 22DPR0200G"
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent uppercase" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Nombre de la Escuela</label>
                  <input name="nombre_esc" value={form.nombre_esc} onChange={handleChange} required
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
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Ciclo de Terminacion</label>
                  <input name="ciclo_terminacion" value={form.ciclo_terminacion} onChange={handleChange} required placeholder="Ej: 2022-2023"
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
              </div>

              <button type="submit" disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg transition-all duration-300">
                {isSubmitting ? 'Procesando...' : 'Solicitar Duplicado'}
              </button>
            </form>

            {result && (
              <div className={`mt-6 p-4 rounded-xl ${result.success ? 'bg-emerald-50 border border-emerald-200' : 'bg-red-50 border border-red-200'}`}>
                <p className={`font-medium ${result.success ? 'text-emerald-800' : 'text-red-800'}`}>{result.message}</p>
                {result.folio && <p className="text-sm mt-1"><strong>Folio:</strong> {result.folio}</p>}
                {result.requiresPayment && result.paymentUrl && (
                  <a href={result.paymentUrl} target="_blank" rel="noopener noreferrer" className="inline-block mt-3 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg font-semibold text-sm">Realizar Pago</a>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'estatus' && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-8">
            <h2 className="text-xl font-bold text-slate-800 mb-6">Consultar Estatus</h2>
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
                    <div className="flex items-center gap-3 mb-4">
                      <h3 className="font-bold text-lg text-slate-800">Folio: {statusResult.data.folio}</h3>
                      <span className={`px-3 py-1 text-xs font-bold rounded-full ${statusBadge[statusResult.data.status] || 'bg-gray-100 text-gray-800'}`}>{statusResult.data.status}</span>
                    </div>
                    <p className="text-sm text-slate-600"><strong>Alumno:</strong> {statusResult.data.nombre_alumno} {statusResult.data.a_paterno} {statusResult.data.a_materno}</p>
                    <p className="text-sm text-slate-600"><strong>CURP:</strong> {statusResult.data.curp}</p>
                    <p className="text-sm text-slate-600"><strong>Tipo:</strong> {statusResult.data.tipo_tramite}</p>
                    <p className="text-sm text-slate-600"><strong>Fecha:</strong> {statusResult.data.fecha}</p>
                    {statusResult.data.requires_payment && (
                      <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                        <p className="text-amber-800 font-medium text-sm">Este tramite requiere pago.</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="font-medium text-red-800">{statusResult.message}</p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
