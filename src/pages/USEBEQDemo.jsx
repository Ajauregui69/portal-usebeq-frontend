import { useState } from 'react';
import { usebeqAPI } from '../services/api';

export default function USEBEQDemo() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // Form states
  const [curp, setCurp] = useState('AAPR160106HQTLRNA6');
  const [cct, setCct] = useState('22DPR0200G');
  const [idAlumno, setIdAlumno] = useState('863309');
  const [anioInicio, setAnioInicio] = useState('2023');
  const [idMotivoBaja, setIdMotivoBaja] = useState('1');
  const [tiposBaja, setTiposBaja] = useState([]);

  const handleRequest = async (apiCall, successMessage) => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const response = await apiCall();
      setResult({
        success: true,
        message: successMessage,
        data: response.data
      });
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Error en la solicitud');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadBoleta = async (isHistorica = false) => {
    setLoading(true);
    setError(null);
    try {
      const response = isHistorica
        ? await usebeqAPI.getBoletaHistorica(idAlumno, anioInicio)
        : await usebeqAPI.getBoleta(idAlumno);

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `boleta_${idAlumno}${isHistorica ? '_' + anioInicio : ''}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      setResult({
        success: true,
        message: `Boleta ${isHistorica ? 'histórica' : 'actual'} descargada exitosamente`,
        data: { downloaded: true }
      });
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Error al descargar boleta');
    } finally {
      setLoading(false);
    }
  };

  const loadTiposBaja = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await usebeqAPI.getTiposBaja();
      setTiposBaja(response.data);
      setResult({
        success: true,
        message: 'Catálogo de tipos de baja cargado',
        data: response.data
      });
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Error al cargar catálogo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="bg-blue-600 px-6 py-4">
            <h1 className="text-2xl font-bold text-white">
              Demo de Endpoints USEBEQ API
            </h1>
            <p className="text-blue-100 mt-1">
              Prueba todos los endpoints de integración con la API externa de USEBEQ
            </p>
          </div>

          <div className="p-6 space-y-6">
            {/* Status Messages */}
            {loading && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center">
                  <svg className="animate-spin h-5 w-5 text-blue-600 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span className="text-blue-800 font-medium">Procesando solicitud...</span>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex">
                  <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Error</h3>
                    <p className="text-sm text-red-700 mt-1">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {result && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex">
                  <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div className="ml-3 flex-1">
                    <h3 className="text-sm font-medium text-green-800">{result.message}</h3>
                    {result.data && (
                      <pre className="mt-2 text-xs text-green-700 bg-green-100 p-3 rounded overflow-x-auto">
                        {JSON.stringify(result.data, null, 2)}
                      </pre>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Endpoint 1: Get Student by CURP and CCT */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                1. Consultar Estudiante por CURP y CCT
              </h2>
              <div className="grid grid-cols-2 gap-4 mb-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">CURP</label>
                  <input
                    type="text"
                    value={curp}
                    onChange={(e) => setCurp(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="AAPR160106HQTLRNA6"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">CCT</label>
                  <input
                    type="text"
                    value={cct}
                    onChange={(e) => setCct(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="22DPR0200G"
                  />
                </div>
              </div>
              <button
                onClick={() => handleRequest(
                  () => usebeqAPI.getStudentByCurpCct(curp, cct),
                  'Estudiante consultado exitosamente por CURP y CCT'
                )}
                disabled={loading}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
              >
                GET /usebeq/estudiante/{curp}/{cct}
              </button>
            </div>

            {/* Endpoint 2: Get Student by ID */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                2. Consultar Estudiante por ID
              </h2>
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">ID Alumno</label>
                <input
                  type="text"
                  value={idAlumno}
                  onChange={(e) => setIdAlumno(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="863309"
                />
              </div>
              <button
                onClick={() => handleRequest(
                  () => usebeqAPI.getStudentById(idAlumno),
                  'Estudiante consultado exitosamente por ID'
                )}
                disabled={loading}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
              >
                GET /usebeq/estudiante/{idAlumno}
              </button>
            </div>

            {/* Endpoint 3: Get Catalog of Withdrawal Types */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                3. Obtener Catálogo de Tipos de Baja
              </h2>
              <button
                onClick={loadTiposBaja}
                disabled={loading}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
              >
                GET /usebeq/catalogo/tipos-de-baja
              </button>
              {tiposBaja.length > 0 && (
                <div className="mt-3 bg-gray-50 rounded-lg p-3">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Tipos de baja disponibles:</h3>
                  <ul className="space-y-1">
                    {tiposBaja.map((tipo) => (
                      <li key={tipo.Id} className="text-sm text-gray-600">
                        <span className="font-medium">#{tipo.Id}</span> - {tipo.Descripcion}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Endpoint 4: Download Current Boleta */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                4. Descargar Boleta Actual (PDF)
              </h2>
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">ID Alumno</label>
                <input
                  type="text"
                  value={idAlumno}
                  onChange={(e) => setIdAlumno(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="863309"
                />
              </div>
              <button
                onClick={() => handleDownloadBoleta(false)}
                disabled={loading}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:bg-gray-400 transition-colors"
              >
                GET /usebeq/boleta/{idAlumno}
              </button>
            </div>

            {/* Endpoint 5: Download Historical Boleta */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                5. Descargar Boleta Histórica (PDF)
              </h2>
              <div className="grid grid-cols-2 gap-4 mb-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ID Alumno</label>
                  <input
                    type="text"
                    value={idAlumno}
                    onChange={(e) => setIdAlumno(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="863309"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Año Inicio</label>
                  <input
                    type="text"
                    value={anioInicio}
                    onChange={(e) => setAnioInicio(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="2023"
                  />
                </div>
              </div>
              <button
                onClick={() => handleDownloadBoleta(true)}
                disabled={loading}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:bg-gray-400 transition-colors"
              >
                GET /usebeq/boleta-historica/{idAlumno}/{anioInicio}
              </button>
            </div>

            {/* Endpoint 6: Request Student Withdrawal */}
            <div className="border border-red-200 bg-red-50 rounded-lg p-4">
              <h2 className="text-lg font-semibold text-red-900 mb-2">
                6. Solicitar Baja de Estudiante
              </h2>
              <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mb-3">
                <p className="text-sm text-yellow-800">
                  ⚠️ <strong>ADVERTENCIA:</strong> Este endpoint realiza cambios reales en el sistema.
                  Usar solo para pruebas con datos de prueba.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ID Alumno</label>
                  <input
                    type="text"
                    value={idAlumno}
                    onChange={(e) => setIdAlumno(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="863309"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ID Motivo Baja</label>
                  <select
                    value={idMotivoBaja}
                    onChange={(e) => setIdMotivoBaja(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    {tiposBaja.length > 0 ? (
                      tiposBaja.map((tipo) => (
                        <option key={tipo.Id} value={tipo.Id}>
                          {tipo.Id} - {tipo.Descripcion}
                        </option>
                      ))
                    ) : (
                      <>
                        <option value="1">1 - CAMBIO DE ESCUELA</option>
                        <option value="2">2 - CAMBIO DE ENTIDAD/PAÍS</option>
                        <option value="3">3 - BAJA POR DEFUNCIÓN</option>
                        <option value="4">4 - BLOQUEAR ESTUDIANTE</option>
                        <option value="7">7 - BAJA ADMINISTRATIVA</option>
                      </>
                    )}
                  </select>
                </div>
              </div>
              <button
                onClick={() => handleRequest(
                  () => usebeqAPI.solicitarBaja({
                    idAlumno: parseInt(idAlumno),
                    idMotivoBaja: parseInt(idMotivoBaja)
                  }),
                  'Solicitud de baja procesada'
                )}
                disabled={loading}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 disabled:bg-gray-400 transition-colors"
              >
                POST /usebeq/baja/
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
