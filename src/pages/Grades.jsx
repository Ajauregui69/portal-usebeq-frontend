import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import useAuthStore from '../store/authStore';
import api from '../services/api';

export default function Grades() {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [grades, setGrades] = useState([]);
  const [studentName, setStudentName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchGrades = async () => {
      try {
        const response = await api.get(`/grades/student/${studentId}`);
        setGrades(response.data);
        setIsLoading(false);
      } catch (err) {
        setError(err.response?.data?.detail || 'Error al cargar las calificaciones');
        setIsLoading(false);
      }
    };

    fetchGrades();
  }, [studentId, isAuthenticated, navigate]);

  const calculateAverage = (calificaciones) => {
    if (calificaciones.length === 0) return 0;
    const sum = calificaciones.reduce((acc, cal) => acc + parseFloat(cal.calificacion), 0);
    return (sum / calificaciones.length).toFixed(2);
  };

  const getColorByGrade = (calificacion) => {
    const grade = parseFloat(calificacion);
    if (grade >= 9) return 'text-green-600';
    if (grade >= 8) return 'text-blue-600';
    if (grade >= 7) return 'text-yellow-600';
    if (grade >= 6) return 'text-orange-600';
    return 'text-red-600';
  };

  const getGradeInfo = (grade) => {
    const g = parseFloat(grade);
    if (g >= 9) return { label: 'Excelente', color: 'from-emerald-500 to-emerald-600', textColor: 'text-emerald-600', bgColor: 'bg-emerald-50' };
    if (g >= 8) return { label: 'Muy Bien', color: 'from-blue-500 to-blue-600', textColor: 'text-blue-600', bgColor: 'bg-blue-50' };
    if (g >= 7) return { label: 'Bien', color: 'from-amber-500 to-amber-600', textColor: 'text-amber-600', bgColor: 'bg-amber-50' };
    if (g >= 6) return { label: 'Suficiente', color: 'from-orange-500 to-orange-600', textColor: 'text-orange-600', bgColor: 'bg-orange-50' };
    return { label: 'Insuficiente', color: 'from-red-500 to-red-600', textColor: 'text-red-600', bgColor: 'bg-red-50' };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-10">
          <button
            onClick={() => navigate('/dashboard')}
            className="group flex items-center gap-2 text-slate-600 hover:text-blue-600 mb-6 transition-colors"
          >
            <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="font-medium">Volver al Dashboard</span>
          </button>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            Calificaciones
          </h1>
          {studentName && <p className="text-slate-600 text-lg">{studentName}</p>}
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
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600"></div>
            <p className="mt-6 text-slate-600 text-lg font-medium">Cargando calificaciones...</p>
          </div>
        ) : grades.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-16 text-center border border-white/20">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-3">
                No hay calificaciones disponibles
              </h2>
              <p className="text-slate-600">
                Las calificaciones aparecerán aquí cuando estén disponibles
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {grades.map((periodData, index) => {
              const avg = calculateAverage(periodData.calificaciones);
              const avgInfo = getGradeInfo(avg);

              return (
                <div key={index} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden">
                  {/* Period Header */}
                  <div className={`bg-gradient-to-r ${avgInfo.color} p-6 text-white`}>
                    <div className="flex justify-between items-center flex-wrap gap-3">
                      <div>
                        <h2 className="text-2xl font-bold mb-1">{periodData.periodo}</h2>
                        <p className="text-white/80 text-sm">
                          {periodData.calificaciones.length} materias evaluadas
                        </p>
                      </div>
                      <div className="bg-white/20 backdrop-blur-sm rounded-xl px-6 py-3 border border-white/30">
                        <p className="text-white/80 text-xs font-medium mb-1">Promedio General</p>
                        <p className="text-3xl font-bold">{avg}</p>
                      </div>
                    </div>
                  </div>

                  {/* Grades Grid */}
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {periodData.calificaciones.map((calificacion) => {
                        const gradeInfo = getGradeInfo(calificacion.calificacion);
                        return (
                          <div key={calificacion.id} className={`${gradeInfo.bgColor} rounded-xl p-5 border-2 ${gradeInfo.bgColor.replace('bg-', 'border-')} hover:shadow-md transition-shadow`}>
                            <div className="flex justify-between items-start mb-3">
                              <h3 className="font-bold text-slate-800 text-sm flex-1 pr-2">
                                {calificacion.materia}
                              </h3>
                              <div className="text-right">
                                <div className={`text-3xl font-black ${gradeInfo.textColor}`}>
                                  {parseFloat(calificacion.calificacion).toFixed(1)}
                                </div>
                                <p className={`text-xs font-semibold ${gradeInfo.textColor} mt-1`}>
                                  {gradeInfo.label}
                                </p>
                              </div>
                            </div>
                            {calificacion.observaciones && (
                              <div className="mt-3 pt-3 border-t border-slate-200">
                                <p className="text-xs text-slate-600 italic">
                                  {calificacion.observaciones}
                                </p>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
