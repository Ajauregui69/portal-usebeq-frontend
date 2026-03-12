import { useState } from 'react';
import { Link } from 'react-router-dom';
import { consultaAPI } from '../services/api';

export default function ConsultaCalificaciones() {
  const [curp, setCurp] = useState('');
  const [resultado, setResultado] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResultado(null);
    setLoading(true);
    try {
      const res = await consultaAPI.buscarPorCurp(curp.trim().toUpperCase());
      setResultado(res.data);
    } catch (err) {
      if (err.response?.status === 404) {
        setError('No se encontró registro con la CURP proporcionada. Por favor intenta nuevamente.');
      } else {
        setError('Ocurrió un error al consultar las calificaciones. Intenta más tarde.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Navbar */}
      <nav className="bg-white/80 backdrop-blur-md shadow-lg border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center gap-3 group">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div>
                  <span className="text-xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">USEBEQ</span>
                  <p className="text-xs text-slate-500 font-medium">Portal de Padres</p>
                </div>
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/login" className="text-slate-600 hover:text-blue-600 font-medium text-sm transition-colors">Inicia Sesión</Link>
              <Link to="/register" className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-xl font-semibold text-sm shadow-lg shadow-blue-500/30 hover:scale-105 transition-transform">
                Regístrate
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-10">
          <Link to="/" className="flex items-center gap-2 text-slate-600 hover:text-blue-600 mb-4 transition-colors w-fit">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Volver al inicio
          </Link>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Consulta de Calificaciones
          </h1>
          <p className="text-slate-600 mt-2">
            Consulta las evaluaciones de un estudiante ingresando su CURP.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-8 mb-8">
          <h2 className="text-xl font-bold text-slate-800 mb-6 text-center">CONSULTA DE CALIFICACIONES</h2>
          <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Para conocer las calificaciones de un estudiante, ingresa su CURP:
              </label>
              <input
                type="text"
                value={curp}
                onChange={(e) => setCurp(e.target.value.toUpperCase())}
                placeholder="Captura la CURP aquí"
                required
                maxLength={18}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all uppercase font-mono tracking-wider"
              />
            </div>
            <div className="text-center">
              <button
                type="submit"
                disabled={loading || curp.length < 18}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-3 rounded-xl font-semibold shadow-lg shadow-blue-500/30 transition-all hover:scale-105"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Buscando...
                  </span>
                ) : 'Obtener calificaciones'}
              </button>
            </div>
          </form>

          <p className="text-center text-slate-600 text-sm mt-6">
            Para obtener una impresión de la boleta de evaluación{' '}
            <Link to="/login" className="text-blue-600 hover:underline font-medium">inicia sesión</Link>
            {' '}o{' '}
            <Link to="/register" className="text-blue-600 hover:underline font-medium">registra tu cuenta</Link>
            {' '}en el Portal de Padres de Familia.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-8">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-red-800 font-medium">{error}</p>
                <p className="text-red-600 text-sm mt-1">
                  Para obtener una impresión de la boleta de evaluación{' '}
                  <Link to="/login" className="underline font-medium">inicia sesión</Link>
                  {' '}o{' '}
                  <Link to="/register" className="underline font-medium">registra tu cuenta</Link>.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Resultados */}
        {resultado && (
          <div className="space-y-6">
            {/* Info del estudiante */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-xl">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">DATOS DEL ESTUDIANTE</p>
                    <p className="font-mono font-bold text-slate-800">{resultado.curp}</p>
                    {resultado.nivel && (
                      <p className="text-sm text-slate-600">{resultado.nivel} — {resultado.grado ? `${resultado.grado}° grado` : ''}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6">
                <p className="text-slate-700 text-sm font-medium">
                  Para obtener una <span className="text-blue-700 font-bold">impresión de la boleta</span> de evaluación,{' '}
                  <Link to="/login" className="text-blue-600 hover:underline font-semibold">inicia sesión</Link>
                  {' '}o{' '}
                  <Link to="/register" className="text-blue-600 hover:underline font-semibold">regístrate</Link>
                  {' '}en el Portal de Padres de Familia.
                </p>
              </div>
            </div>

            {/* Tabla de calificaciones */}
            {resultado.materias.length > 0 && (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden">
                <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-6 py-4">
                  <h3 className="text-white font-bold">Evaluaciones — Ciclo escolar: {resultado.ciclo}</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-700">
                      <tr>
                        <th className="text-left px-6 py-3 text-white text-xs font-semibold uppercase tracking-wide">Materia</th>
                        <th className="text-center px-4 py-3 text-white text-xs font-semibold uppercase tracking-wide" colSpan={3}>Periodos de Evaluación</th>
                        <th className="text-center px-4 py-3 text-white text-xs font-semibold uppercase tracking-wide">Promedio</th>
                      </tr>
                      <tr className="bg-slate-600">
                        <th className="px-6 py-2"></th>
                        <th className="text-center px-4 py-2 text-slate-200 text-xs font-medium">1er</th>
                        <th className="text-center px-4 py-2 text-slate-200 text-xs font-medium">2do</th>
                        <th className="text-center px-4 py-2 text-slate-200 text-xs font-medium">3er</th>
                        <th className="px-4 py-2"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {resultado.materias.map((mat, i) => (
                        <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                          <td className="px-6 py-3 text-sm font-medium text-slate-800">{mat.materia}</td>
                          <td className="px-4 py-3 text-center text-sm text-slate-700">{mat.calif1 ?? '—'}</td>
                          <td className="px-4 py-3 text-center text-sm text-slate-700">{mat.calif2 ?? '—'}</td>
                          <td className="px-4 py-3 text-center text-sm text-slate-700">{mat.calif3 ?? '—'}</td>
                          <td className="px-4 py-3 text-center text-sm font-bold text-slate-800">{mat.promedio ?? '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Componentes curriculares */}
            {resultado.componentes.length > 0 && (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden">
                <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-6 py-4">
                  <h3 className="text-white font-bold">Componentes curriculares</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-700">
                      <tr>
                        <th className="text-left px-6 py-3 text-white text-xs font-semibold uppercase tracking-wide">Campos</th>
                        <th className="text-center px-4 py-3 text-white text-xs font-semibold uppercase tracking-wide" colSpan={3}>Periodos de Evaluación</th>
                      </tr>
                      <tr className="bg-slate-600">
                        <th className="px-6 py-2"></th>
                        <th className="text-center px-4 py-2 text-slate-200 text-xs font-medium">1er</th>
                        <th className="text-center px-4 py-2 text-slate-200 text-xs font-medium">2do</th>
                        <th className="text-center px-4 py-2 text-slate-200 text-xs font-medium">3er</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {resultado.componentes.map((comp, i) => (
                        <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                          <td className="px-6 py-3 text-sm font-medium text-slate-800">{comp.campo}</td>
                          <td className="px-4 py-3 text-center text-sm text-slate-700">{comp.nivel1 ?? '—'}</td>
                          <td className="px-4 py-3 text-center text-sm text-slate-700">{comp.nivel2 ?? '—'}</td>
                          <td className="px-4 py-3 text-center text-sm text-slate-700">{comp.nivel3 ?? '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Observaciones */}
            {resultado.observaciones.length > 0 && (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden">
                <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-6 py-4">
                  <h3 className="text-white font-bold">Observaciones</h3>
                </div>
                <ul className="px-6 py-4 space-y-2">
                  {resultado.observaciones.map((obs, i) => (
                    <li key={i} className="text-sm text-slate-700">{obs}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Materias vacías */}
            {resultado.materias.length === 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-center">
                <svg className="w-10 h-10 mx-auto mb-3 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-amber-800 font-medium">El estudiante fue encontrado, pero aún no hay calificaciones registradas para el ciclo {resultado.ciclo}.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
