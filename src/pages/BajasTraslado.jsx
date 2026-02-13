import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import useAuthStore from '../store/authStore';
import useStudentStore from '../store/studentStore';
import { usebeqAPI } from '../services/api';

export default function BajasTraslado() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { students, fetchStudents } = useStudentStore();
  const [activeTab, setActiveTab] = useState('solicitud');
  const [tiposBaja, setTiposBaja] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedTipo, setSelectedTipo] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [folio, setFolio] = useState('');
  const [statusResult, setStatusResult] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) { navigate('/login'); return; }
    fetchStudents();
    loadTiposBaja();
  }, [isAuthenticated, navigate]);

  const loadTiposBaja = async () => {
    try {
      const res = await usebeqAPI.getTiposBaja();
      setTiposBaja(res.data);
    } catch (err) {
      console.error('Error loading tipos de baja:', err);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setResult(null);
    try {
      const res = await usebeqAPI.solicitarBaja({
        idAlumno: parseInt(selectedStudent),
        idMotivoBaja: parseInt(selectedTipo)
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

  const selectedStudentInfo = students.find(s => s.al_id === parseInt(selectedStudent));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10">
          <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-slate-600 hover:text-blue-600 mb-4 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Volver al Panel
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
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Selecciona un estudiante</label>
                <select value={selectedStudent} onChange={(e) => setSelectedStudent(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
                  <option value="">-- Seleccionar --</option>
                  {students.map(s => (
                    <option key={s.al_id} value={s.al_id}>{s.al_nombre} {s.al_appat} {s.al_apmat} - CURP: {s.al_curp}</option>
                  ))}
                </select>
              </div>

              {selectedStudentInfo && (
                <div className="bg-slate-50 rounded-xl p-4">
                  <h4 className="font-semibold text-slate-700 mb-2">Datos del estudiante:</h4>
                  <p className="text-sm text-slate-600"><strong>Nombre:</strong> {selectedStudentInfo.al_nombre} {selectedStudentInfo.al_appat} {selectedStudentInfo.al_apmat}</p>
                  <p className="text-sm text-slate-600"><strong>CURP:</strong> {selectedStudentInfo.al_curp}</p>
                  {selectedStudentInfo.current_enrollment && (
                    <>
                      <p className="text-sm text-slate-600"><strong>Escuela:</strong> {selectedStudentInfo.current_enrollment.clavecct}</p>
                      <p className="text-sm text-slate-600"><strong>Grado:</strong> {selectedStudentInfo.current_enrollment.eg_grado} | <strong>Grupo:</strong> {selectedStudentInfo.current_enrollment.eg_grupo}</p>
                    </>
                  )}
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Motivo de la baja</label>
                <select value={selectedTipo} onChange={(e) => setSelectedTipo(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
                  <option value="">-- Seleccionar motivo --</option>
                  {tiposBaja.map(t => (
                    <option key={t.Id} value={t.Id}>{t.Descripcion}</option>
                  ))}
                </select>
              </div>

              <button onClick={() => setShowConfirm(true)} disabled={!selectedStudent || !selectedTipo || isSubmitting}
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
