import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usebeqAPI } from '../../services/api';

export default function StudentCard({ student, onUnlink, onNotification }) {
  const navigate = useNavigate();
  const { al_id, al_nombre, al_appat, al_apmat, al_curp, al_estatus, current_enrollment } = student;
  const [downloading, setDownloading] = useState(false);
  const [showBoletaMenu, setShowBoletaMenu] = useState(false);
  const [showYearModal, setShowYearModal] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear() - 2);

  const statusConfig = {
    I: {
      label: 'Inscrito',
      color: 'from-emerald-500 to-emerald-600',
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      border: 'border-emerald-200'
    },
    B: {
      label: 'Baja',
      color: 'from-red-500 to-red-600',
      bg: 'bg-red-50',
      text: 'text-red-700',
      border: 'border-red-200'
    },
    A: {
      label: 'Con adeudo',
      color: 'from-amber-500 to-amber-600',
      bg: 'bg-amber-50',
      text: 'text-amber-700',
      border: 'border-amber-200'
    },
    E: {
      label: 'Egresado',
      color: 'from-blue-500 to-blue-600',
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      border: 'border-blue-200'
    },
  };

  const status = statusConfig[al_estatus?.trim()] || statusConfig.I;

  const handleDownloadBoleta = async (isHistorica = false, anio = null) => {
    setDownloading(true);
    setShowBoletaMenu(false);
    setShowYearModal(false);
    try {
      const response = isHistorica && anio
        ? await usebeqAPI.getBoletaHistorica(al_id, anio)
        : await usebeqAPI.getBoleta(al_id);

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `boleta_${al_nombre}_${al_appat}${isHistorica ? '_' + anio : ''}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      if (onNotification) {
        onNotification('success', 'Boleta descargada correctamente');
      }
    } catch (error) {
      if (onNotification) {
        const status = error.response?.status;
        if (status === 500 || status === 404) {
          onNotification('error', 'El alumno no tiene boleta disponible para el ciclo seleccionado.');
        } else {
          onNotification('error', 'Error al descargar la boleta. Intenta nuevamente mas tarde.');
        }
      }
    } finally {
      setDownloading(false);
    }
  };

  const handleBoletaHistorica = () => {
    setShowBoletaMenu(false);
    setShowYearModal(true);
  };

  const confirmDownloadHistorica = () => {
    handleDownloadBoleta(true, selectedYear);
  };

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 10 }, (_, i) => currentYear - 1 - i);

  return (
    <>
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
                Selecciona el año de inicio del ciclo escolar para <strong>{al_nombre} {al_appat}</strong>.
              </p>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Año de inicio
                </label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-lg font-medium"
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
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg transition-all duration-300 hover:scale-105"
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

      <div className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
        {/* Header with Gradient */}
        <div className={`bg-gradient-to-r ${status.color} p-6 text-white`}>
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-1 line-clamp-2">
                {al_nombre} {al_appat} {al_apmat}
              </h3>
              <p className="text-white/80 text-sm font-medium">
                CURP: {al_curp}
              </p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          {current_enrollment ? (
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-3">
                Informacion Academica
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                  <p className="text-xs text-slate-500 font-medium mb-1">Nivel</p>
                  <p className="text-sm font-bold text-slate-800">{current_enrollment.nivel}</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                  <p className="text-xs text-slate-500 font-medium mb-1">Grado</p>
                  <p className="text-sm font-bold text-slate-800">{current_enrollment.eg_grado}°</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                  <p className="text-xs text-slate-500 font-medium mb-1">Grupo</p>
                  <p className="text-sm font-bold text-slate-800">{current_enrollment.eg_grupo}</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                  <p className="text-xs text-slate-500 font-medium mb-1">Ciclo</p>
                  <p className="text-sm font-bold text-slate-800">{current_enrollment.ciclo_escolar}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-slate-400 text-sm">Sin informacion academica local</p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 pb-6 space-y-3">
          {/* Primary Actions */}
          <div className="flex gap-3">
            <button
              onClick={() => navigate(`/student/${student.al_id}`)}
              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-3 rounded-xl text-sm font-semibold shadow-md shadow-blue-500/30 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Ver Detalle
            </button>
            <button
              onClick={() => onUnlink(student.al_id)}
              className="bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 p-3 rounded-xl transition-all duration-300 border border-slate-200 hover:border-red-200"
              title="Desvincular estudiante"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
            </button>
          </div>

          {/* Boleta Actions */}
          <div className="relative">
            {!showBoletaMenu ? (
              <button
                onClick={() => setShowBoletaMenu(true)}
                disabled={downloading}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-3 rounded-xl text-sm font-semibold shadow-md transition-all duration-300 flex items-center justify-center gap-2"
              >
                {downloading ? (
                  <>
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Descargando...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Descargar Boleta
                  </>
                )}
              </button>
            ) : (
              <div className="space-y-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <button
                  onClick={() => handleDownloadBoleta(false)}
                  className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3" />
                  </svg>
                  Boleta Actual
                </button>
                <button
                  onClick={handleBoletaHistorica}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Boleta Historica
                </button>
                <button
                  onClick={() => setShowBoletaMenu(false)}
                  className="w-full bg-slate-200 hover:bg-slate-300 text-slate-700 px-4 py-2 rounded-lg text-sm font-semibold transition-all"
                >
                  Cancelar
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
