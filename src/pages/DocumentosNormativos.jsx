import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import Navbar from '../components/layout/Navbar';

const DOCUMENTOS = [
  {
    seccion: 'Documentos Normativos',
    docs: [
      {
        titulo: 'ACUERDO 10/09/23',
        descripcion: 'Por el que se establecen las normas generales para la evaluación del aprendizaje, acreditación, promoción, regularización y certificación en la educación básica.',
        url: 'https://portal.usebeq.edu.mx/portal/Resource/PDF/ACUERDO100923.pdf',
        categoria: 'Acuerdos',
        color: 'from-blue-500 to-blue-600',
        badge: 'bg-blue-100 text-blue-700',
      },
      {
        titulo: 'Normas Específicas de Control Escolar',
        descripcion: 'Relativas a la Inscripción, Reinscripción, Acreditación, Promoción, Regularización y Certificación en la Educación Básica.',
        url: 'https://portal.usebeq.edu.mx/portal/Resource/PDF/normas_29042019.pdf',
        categoria: 'Normas',
        color: 'from-indigo-500 to-indigo-600',
        badge: 'bg-indigo-100 text-indigo-700',
      },
      {
        titulo: 'Anexos Normas de Control Escolar Básica',
        descripcion: 'Anexos complementarios a las Normas de Control Escolar para Educación Básica.',
        url: 'https://portal.usebeq.edu.mx/portal/Resource/PDF/Anexo_02052019.pdf',
        categoria: 'Anexos',
        color: 'from-purple-500 to-purple-600',
        badge: 'bg-purple-100 text-purple-700',
      },
    ],
  },
  {
    seccion: 'Promoción Anticipada por Aptitudes Sobresalientes',
    docs: [
      {
        titulo: 'Lineamientos para la Acreditación, Promoción y Certificación Anticipada',
        descripcion: 'De alumnos con Aptitudes Sobresalientes en Educación Básica.',
        url: 'https://portal.usebeq.edu.mx/portal/Resource/PDF/linemientos_29042019.pdf',
        categoria: 'Lineamientos',
        color: 'from-emerald-500 to-emerald-600',
        badge: 'bg-emerald-100 text-emerald-700',
      },
    ],
  },
];

export default function DocumentosNormativos() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {isAuthenticated && <Navbar />}

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-10">
          <button
            onClick={() => navigate(isAuthenticated ? '/dashboard' : '/')}
            className="flex items-center gap-2 text-slate-600 hover:text-blue-600 mb-4 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            {isAuthenticated ? 'Volver al Panel' : 'Volver al Inicio'}
          </button>

          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl shadow">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Documentos Normativos
            </h1>
          </div>
          <p className="text-slate-600 ml-1">Consulta y descarga los documentos normativos de la USEBEQ</p>
        </div>

        {/* Secciones */}
        {DOCUMENTOS.map((seccion) => (
          <div key={seccion.seccion} className="mb-10">
            <h2 className="text-lg font-bold text-slate-700 uppercase tracking-wide mb-5 flex items-center gap-2">
              <span className="w-1 h-5 bg-gradient-to-b from-blue-600 to-indigo-600 rounded-full inline-block"></span>
              {seccion.seccion}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {seccion.docs.map((doc) => (
                <div
                  key={doc.url}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300 group flex flex-col justify-between"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`p-3 bg-gradient-to-br ${doc.color} rounded-xl shadow-lg flex-shrink-0 group-hover:scale-110 transition-transform`}>
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className={`inline-block px-2.5 py-0.5 text-xs font-semibold rounded-full mb-2 ${doc.badge}`}>
                        {doc.categoria}
                      </span>
                      <h3 className="text-base font-bold text-slate-800 leading-snug mb-1">{doc.titulo}</h3>
                      <p className="text-slate-500 text-sm leading-relaxed">{doc.descripcion}</p>
                    </div>
                  </div>
                  <a
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center justify-center gap-2 w-full bg-gradient-to-r ${doc.color} hover:opacity-90 text-white px-5 py-2.5 rounded-xl font-semibold text-sm shadow-md transition-all duration-300 hover:scale-[1.02]`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Ver / Descargar PDF
                  </a>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
