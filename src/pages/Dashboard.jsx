import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import StudentCard from '../components/dashboard/StudentCard';
import useStudentStore from '../store/studentStore';
import useAuthStore from '../store/authStore';

export default function Dashboard() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();
  const { students, fetchStudents, unlinkStudent, isLoading, error, clearError } = useStudentStore();
  const [showAddModal, setShowAddModal] = useState(false);
  const [curp, setCurp] = useState('');
  const [cct, setCct] = useState('');
  const [relacion, setRelacion] = useState('padre');
  const [linkingStudent, setLinkingStudent] = useState(false);
  const [notification, setNotification] = useState(null);
  const [confirmUnlink, setConfirmUnlink] = useState(null);

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchStudents();
  }, [isAuthenticated, navigate, fetchStudents]);

  const handleAddStudent = async (e) => {
    e.preventDefault();
    setLinkingStudent(true);

    try {
      const { studentAPI } = await import('../services/api');
      const response = await studentAPI.linkStudentWithCCT(curp, cct, relacion);

      if (response.data.success) {
        // Refresh student list
        await fetchStudents();
        setShowAddModal(false);
        setCurp('');
        setCct('');
        setRelacion('padre');
        clearError();
      }
    } catch (error) {
      // Error will be shown by the error state
      console.error('Error linking student:', error);
    } finally {
      setLinkingStudent(false);
    }
  };

  const handleUnlink = (studentId) => {
    const student = students.find(s => s.al_id === studentId);
    setConfirmUnlink({ id: studentId, name: `${student?.al_nombre} ${student?.al_appat}` });
  };

  const confirmUnlinkStudent = async () => {
    if (confirmUnlink) {
      await unlinkStudent(confirmUnlink.id);
      showNotification('success', 'Estudiante desvinculado correctamente');
      setConfirmUnlink(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
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

      {/* Confirm Unlink Modal */}
      {confirmUnlink && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full transform transition-all">
            <div className="p-6">
              <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-slate-800 text-center mb-2">Desvincular Estudiante</h2>
              <p className="text-slate-600 text-center mb-6">
                ¿Estas seguro de desvincular a <strong>{confirmUnlink.name}</strong>? Esta accion no se puede deshacer.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={confirmUnlinkStudent}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg transition-all duration-300"
                >
                  Desvincular
                </button>
                <button
                  onClick={() => setConfirmUnlink(null)}
                  className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-700 px-6 py-3 rounded-xl font-semibold transition-all duration-300"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                Hola, {user?.u_nombre || 'Usuario'}
              </h1>
              <p className="text-slate-600 text-lg">
                Portal de Gestión Académica USEBEQ
              </p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-blue-500/30 transition-all duration-300 hover:scale-105"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Vincular Estudiante
            </button>
          </div>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="mb-8 bg-red-50 border-l-4 border-red-500 rounded-lg p-4 shadow-sm">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-red-800 font-medium">{error}</p>
              </div>
              <button
                onClick={clearError}
                className="ml-3 flex-shrink-0 text-red-500 hover:text-red-700 transition-colors"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium">Estudiantes</p>
                <p className="text-3xl font-bold text-slate-800">{students.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-lg">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium">Activos</p>
                <p className="text-3xl font-bold text-slate-800">
                  {students.filter(s => s.al_estatus === 'I').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium">Niveles</p>
                <p className="text-2xl font-bold text-slate-800">
                  {new Set(students.map(s => s.current_enrollment?.nivel).filter(Boolean)).size || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Students Grid */}
        {isLoading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600"></div>
            <p className="mt-6 text-slate-600 text-lg font-medium">Cargando estudiantes...</p>
          </div>
        ) : students.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-16 text-center border border-white/20">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-3">
                No hay estudiantes vinculados
              </h2>
              <p className="text-slate-600 mb-8">
                Comienza vinculando un estudiante para acceder a su información académica y calificaciones
              </p>
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 rounded-xl font-semibold shadow-lg shadow-blue-500/30 transition-all duration-300 hover:scale-105"
              >
                Vincular mi primer estudiante
              </button>
            </div>
          </div>
        ) : (
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Mis Estudiantes</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {students.map((student) => (
                <StudentCard key={student.al_id} student={student} onUnlink={handleUnlink} onNotification={showNotification} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Add Student Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full transform transition-all">
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-800">Vincular Estudiante</h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleAddStudent} className="space-y-5">
                <div>
                  <label htmlFor="curp" className="block text-sm font-semibold text-slate-700 mb-2">
                    CURP del Estudiante
                  </label>
                  <input
                    type="text"
                    id="curp"
                    value={curp}
                    onChange={(e) => setCurp(e.target.value.toUpperCase())}
                    maxLength={18}
                    required
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="AAPR160106HQTLRNA6"
                  />
                  <p className="text-xs text-slate-500 mt-1">18 caracteres</p>
                </div>

                <div>
                  <label htmlFor="cct" className="block text-sm font-semibold text-slate-700 mb-2">
                    CCT de la Escuela
                  </label>
                  <input
                    type="text"
                    id="cct"
                    value={cct}
                    onChange={(e) => setCct(e.target.value.toUpperCase())}
                    maxLength={20}
                    required
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="22DPR0200G"
                  />
                  <p className="text-xs text-slate-500 mt-1">Clave del Centro de Trabajo</p>
                </div>

                <div>
                  <label htmlFor="relacion" className="block text-sm font-semibold text-slate-700 mb-2">
                    Relación
                  </label>
                  <select
                    id="relacion"
                    value={relacion}
                    onChange={(e) => setRelacion(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    <option value="padre">Padre</option>
                    <option value="madre">Madre</option>
                    <option value="tutor">Tutor</option>
                  </select>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={linkingStudent}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-blue-500/30 transition-all duration-300 hover:scale-105 disabled:hover:scale-100 flex items-center justify-center gap-2"
                  >
                    {linkingStudent ? (
                      <>
                        <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Vinculando...
                      </>
                    ) : (
                      'Vincular'
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    disabled={linkingStudent}
                    className="flex-1 bg-slate-200 hover:bg-slate-300 disabled:bg-slate-100 text-slate-700 px-6 py-3 rounded-xl font-semibold transition-all duration-300"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
