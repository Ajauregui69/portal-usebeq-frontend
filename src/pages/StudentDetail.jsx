import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import useAuthStore from '../store/authStore';
import { usebeqAPI } from '../services/api';

export default function StudentDetail() {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [student, setStudent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const [downloadType, setDownloadType] = useState(null);
  const [notification, setNotification] = useState(null);
  const [showYearModal, setShowYearModal] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear() - 2);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchStudent = async () => {
      try {
        const response = await usebeqAPI.getStudentById(studentId);
        setStudent(response.data);
        setIsLoading(false);
      } catch (err) {
        setError(err.response?.data?.detail || 'Error al cargar la información del estudiante');
        setIsLoading(false);
      }
    };

    fetchStudent();
  }, [studentId, isAuthenticated, navigate]);

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const getCurrentSchoolYear = () => {
    const now = new Date();
    return now.getMonth() >= 7 ? now.getFullYear() : now.getFullYear() - 1;
  };

  const handleDownloadBoleta = async (historica = false, anio = null) => {
    setDownloading(true);
    setDownloadType(historica ? 'historica' : 'actual');
    try {
      const useCurrentEndpoint = !historica || anio === null || anio >= getCurrentSchoolYear();
      const response = useCurrentEndpoint
        ? await usebeqAPI.getBoleta(studentId)
        : await usebeqAPI.getBoletaHistorica(studentId, anio);

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      const fileName = historica
        ? `boleta_${student?.Nombre}_${student?.ApellidoPaterno}_${anio}.pdf`
        : `boleta_${student?.Nombre}_${student?.ApellidoPaterno}.pdf`;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      showNotification('success', 'Boleta descargada correctamente');
    } catch (err) {
      const status = err.response?.status;
      if (status === 500 || status === 404) {
        showNotification('error', 'El alumno no tiene boleta disponible para el ciclo seleccionado.');
      } else {
        showNotification('error', 'Error al descargar la boleta. Intenta nuevamente mas tarde.');
      }
    } finally {
      setDownloading(false);
      setDownloadType(null);
    }
  };

  const handleDownloadHistorica = () => {
    setShowYearModal(true);
  };

  const confirmDownloadHistorica = () => {
    setShowYearModal(false);
    handleDownloadBoleta(true, selectedYear);
  };

  const statusConfig = {
    'I': { label: 'Inscrito', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
    'B': { label: 'Baja', color: 'bg-red-100 text-red-800 border-red-200' },
    'A': { label: 'Con adeudo', color: 'bg-[#E1A031]/15 text-[#7a5200] border-[#E1A031]/30' },
    'E': { label: 'Egresado', color: 'bg-[#7CC6D8]/20 text-[#242B57] border-[#7CC6D8]/40' },
  };

  const getStatus = (estatus) => {
    const key = estatus?.trim() || 'I';
    return statusConfig[key] || statusConfig['I'];
  };

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 10 }, (_, i) => currentYear - 1 - i);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-[#7CC6D8]/10 to-[#4996C6]/10">
      <Navbar />

      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 max-w-md p-4 rounded-xl shadow-2xl border transform transition-all duration-300 ${
          notification.type === 'success'
            ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
            : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          <div className="flex items-start gap-3">
            {notification.type === 'success' ? (
              <svg className="w-5 h-5 text-emerald-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-red-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            <p className="font-medium text-sm">{notification.message}</p>
            <button
              onClick={() => setNotification(null)}
              className="ml-auto text-slate-400 hover:text-slate-600"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Year Selection Modal */}
      {showYearModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full transform transition-all">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-800">Seleccionar Ciclo Escolar</h2>
                <button
                  onClick={() => setShowYearModal(false)}
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <p className="text-slate-600 text-sm mb-4">
                Selecciona el año de inicio del ciclo escolar del que deseas descargar la boleta.
              </p>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Año de inicio
                </label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4996C6] focus:border-transparent transition-all text-lg font-medium"
                >
                  {yearOptions.map((year) => (
                    <option key={year} value={year}>
                      {year} - {year + 1}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={confirmDownloadHistorica}
                  className="flex-1 bg-[#242B57] hover:bg-[#4996C6] text-white px-6 py-3 rounded-xl font-semibold shadow-lg transition-all duration-300 hover:scale-105"
                >
                  Descargar
                </button>
                <button
                  onClick={() => setShowYearModal(false)}
                  className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-700 px-6 py-3 rounded-xl font-semibold transition-all duration-300"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="group flex items-center gap-2 text-slate-600 hover:text-[#4996C6] mb-6 transition-colors"
          >
            <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="font-medium">Volver al Inicio</span>
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-8 bg-red-50 border-l-4 border-red-500 rounded-lg p-4 shadow-sm">
            <div className="flex items-start">
              <svg className="h-6 w-6 text-red-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-800 font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Loading */}
        {isLoading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-[#7CC6D8]/30 border-t-[#4996C6]"></div>
            <p className="mt-6 text-slate-600 text-lg font-medium">Cargando información...</p>
          </div>
        ) : student ? (
          <div className="space-y-6">
            {/* Student Info Card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
              {/* Header */}
              <div className="bg-[#242B57] p-8 text-white">
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-3xl font-bold mb-2">
                      {student.Nombre} {student.ApellidoPaterno} {student.ApellidoMaterno}
                    </h1>
                    <p className="text-[#7CC6D8] text-lg">CURP: {student.CURP}</p>
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="p-8">
                <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                  <svg className="w-5 h-5 text-[#4996C6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  Información Escolar
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">
                    <p className="text-sm text-slate-500 font-medium mb-1">Escuela</p>
                    <p className="text-lg font-bold text-slate-800">{student.NombreCT?.trim() || 'N/A'}</p>
                    <p className="text-sm text-slate-500 mt-1">CCT: {student.CCT}</p>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">
                    <p className="text-sm text-slate-500 font-medium mb-1">Turno</p>
                    <p className="text-lg font-bold text-slate-800">
                      {student.Turno === 'MAT' ? 'Matutino' :
                       student.Turno === 'VES' ? 'Vespertino' : student.Turno || 'N/A'}
                    </p>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">
                    <p className="text-sm text-slate-500 font-medium mb-1">Grado</p>
                    <p className="text-lg font-bold text-slate-800">{student.Grado || 'N/A'}°</p>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">
                    <p className="text-sm text-slate-500 font-medium mb-1">Grupo</p>
                    <p className="text-lg font-bold text-slate-800">{student.Grupo || 'N/A'}</p>
                  </div>
                </div>

                <div className="mt-6 bg-[#7CC6D8]/10 rounded-xl p-5 border border-[#7CC6D8]/30">
                  <p className="text-sm text-[#4996C6] font-medium mb-1">Matrícula del Alumno</p>
                  <p className="text-lg font-bold text-[#242B57]">{student.IdAlumno}</p>
                </div>
              </div>
            </div>

            {/* Actions Card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
              <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                <svg className="w-5 h-5 text-[#4996C6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Boletas de Calificaciones
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => handleDownloadBoleta(false)}
                  disabled={downloading}
                  className="flex items-center justify-center gap-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:from-gray-400 disabled:to-gray-500 text-white px-6 py-4 rounded-xl font-semibold shadow-lg transition-all duration-300 hover:scale-105 disabled:hover:scale-100"
                >
                  {downloading && downloadType === 'actual' ? (
                    <>
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Descargando...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Descargar Boleta Actual
                    </>
                  )}
                </button>

                <button
                  onClick={handleDownloadHistorica}
                  disabled={downloading}
                  className="flex items-center justify-center gap-3 bg-[#242B57] hover:bg-[#4996C6] disabled:bg-gray-400 text-white px-6 py-4 rounded-xl font-semibold shadow-lg transition-all duration-300 hover:scale-105 disabled:hover:scale-100"
                >
                  {downloading && downloadType === 'historica' ? (
                    <>
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Descargando...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Descargar Boleta Histórica
                    </>
                  )}
                </button>
              </div>

              <p className="text-sm text-slate-500 mt-4 text-center">
                Las boletas se descargan en formato PDF
              </p>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
