import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { announcementsAPI } from '../services/api';

export default function LandingPage() {
  const [faqOpen, setFaqOpen] = useState(null);
  const [avisos, setAvisos] = useState([]);
  const [avisosLoading, setAvisosLoading] = useState(true);

  useEffect(() => {
    announcementsAPI.getActive()
      .then((res) => setAvisos(res.data || []))
      .catch(() => setAvisos([]))
      .finally(() => setAvisosLoading(false));
  }, []);

  const servicios = [
    { to: '/consulta', title: 'Consulta e Impresion', desc: 'Consulta calificaciones por CURP del estudiante', color: 'from-teal-500 to-teal-600', icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    { to: '/documentos-normativos', title: 'Documentos Normativos', desc: 'Acuerdos y normas de control escolar', color: 'from-amber-500 to-amber-600', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    { to: '/boeva', title: 'Verificacion de Documentos', desc: 'Verifica autenticidad de boletas', color: 'from-cyan-500 to-cyan-600', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
    { to: '/becas', title: 'Becas', desc: 'Informacion sobre becas disponibles', color: 'from-purple-500 to-purple-600', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
    { to: '/buzon-padres', title: 'Buzon de Padres', desc: 'Envia documentos y consultas', color: 'from-rose-500 to-rose-600', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
  ];

  const tramites = [
    { to: '/bajas-traslado', title: 'Baja por Traslado', desc: 'Solicita baja por cambio de escuela', color: 'from-red-500 to-red-600', icon: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4' },
    { to: '/duplicado-certificado', title: 'Duplicado de Certificado', desc: 'Reimpresion de certificados oficiales', color: 'from-emerald-500 to-emerald-600', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4' },
    { to: '/soluciones-en-linea', title: 'Solicitudes en Linea', desc: 'Tramites y solicitudes digitales', color: 'from-indigo-500 to-indigo-600', icon: 'M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9' },
    { to: '/revocacion-grado', title: 'Revocacion de Grado', desc: 'Solicita repeticion de grado escolar', color: 'from-purple-500 to-purple-600', icon: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15' },
    { href: 'https://siged.sep.gob.mx/SIGED/documentos.html', title: 'Verificacion SEP/SIGED', desc: 'Verifica documentos en el portal SEP', color: 'from-slate-500 to-slate-600', icon: 'M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14', external: true },
  ];

  const faqs = [
    { q: '¿Que es el Portal para Padres?', a: 'Es una opcion adicional a la escuela que permite a los padres, madres de familia o tutores conocer la informacion academica de los estudiantes de preescolar, primaria y secundaria del estado de Queretaro.' },
    { q: '¿Por que es necesario registrar una cuenta?', a: 'Para tener acceso a la impresion de los documentos oficiales de acreditacion de sus hijos.' },
    { q: '¿Como registro mi cuenta?', a: 'Ingresa a la seccion "Registra tu cuenta", completa el formulario con un correo electronico valido y una contrasena.' },
    { q: '¿Como visualizo la informacion del estudiante?', a: 'Debes agregar al estudiante a tu perfil de usuario. Una vez agregado, podras ver sus calificaciones, informacion escolar y mas.' },
    { q: '¿Puedo agregar varios estudiantes a mi perfil?', a: 'Si, siempre y cuando sea posible realizar la verificacion de vinculacion parental con los datos del estudiante.' },
    { q: '¿Que es la Vinculacion de Hermanos?', a: 'Es un procedimiento para identificar la relacion consanguinea o por afinidad entre estudiantes de educacion basica en Queretaro.' },
    { q: '¿Que es una Baja por Traslado?', a: 'Es la asignacion del estatus de baja al alumno que sera trasladado de escuela dentro o fuera del estado.' },
    { q: '¿Que es un duplicado de certificado?', a: 'Es la expedicion de un certificado o constancia que acredita un nivel educativo, solicitado cuando el original se extravie o requiera actualizacion.' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Navbar */}
      <nav className="bg-white/80 backdrop-blur-md shadow-lg border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <div className="flex items-center">
              <Link to="/" className="flex items-center gap-3 group">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div>
                  <span className="text-2xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">USEBEQ</span>
                  <p className="text-xs text-slate-500 font-medium">Portal de Padres</p>
                </div>
              </Link>
            </div>
            <div className="hidden md:flex items-center gap-4">
              <a href="#avisos" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">Avisos</a>
              <a href="#servicios" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">Servicios</a>
              <a href="#tramites" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">Tramites</a>
              <a href="#faq" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">FAQ</a>
              <Link to="/login" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-2.5 rounded-xl font-semibold shadow-lg shadow-blue-500/30 transition-all duration-300 hover:scale-105">
                Inicia Sesion
              </Link>
            </div>
            <div className="md:hidden flex items-center">
              <Link to="/login" className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-xl font-semibold text-sm">
                Inicia Sesion
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-transparent to-indigo-600/5 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Portal Academico USEBEQ
              </div>
              <h1 className="text-5xl lg:text-6xl font-black text-slate-900 mb-6 leading-tight">
                Consultas de{' '}
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  informacion academica
                </span>
              </h1>
              <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                Accede a calificaciones, certificados, tramites y mas.
                El portal para padres de familia del estado de Queretaro.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/login" className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 rounded-xl font-bold shadow-xl shadow-blue-500/30 transition-all duration-300 hover:scale-105 text-lg">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  Inicia Sesion
                </Link>
                <Link to="/register" className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 px-8 py-4 rounded-xl font-bold border-2 border-slate-200 hover:border-blue-300 transition-all duration-300 text-lg">
                  Registrate
                </Link>
              </div>
            </div>
            <div className="hidden lg:flex justify-center">
              <div className="relative">
                <div className="w-80 h-80 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl shadow-2xl flex items-center justify-center transform rotate-3 hover:rotate-0 transition-transform duration-500">
                  <div className="text-center text-white p-8">
                    <svg className="w-24 h-24 mx-auto mb-4 opacity-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    <h3 className="text-2xl font-bold mb-2">Portal USEBEQ</h3>
                    <p className="text-white/80">Educacion Basica - Queretaro</p>
                  </div>
                </div>
                <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl shadow-lg flex items-center justify-center transform -rotate-6">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-2xl shadow-lg flex items-center justify-center transform rotate-12">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Avisos Importantes Section */}
      <section id="avisos" className="py-16 bg-amber-50/60 border-y border-amber-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-10">
            <div className="p-2 bg-amber-500 rounded-xl shadow">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <div>
              <h2 className="text-3xl font-black text-slate-900">Avisos Importantes</h2>
              <p className="text-slate-600 text-sm">Informacion relevante para padres de familia</p>
            </div>
          </div>

          {avisosLoading ? (
            <div className="flex items-center justify-center py-12">
              <svg className="animate-spin h-8 w-8 text-amber-500" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          ) : avisos.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <svg className="w-12 h-12 mx-auto mb-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <p className="font-medium">No hay avisos activos en este momento.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {avisos.map((aviso) => {
                const tipoConfig = {
                  urgent: { border: 'border-red-200', bg: 'bg-red-50', icon: 'text-red-500', iconBg: 'bg-red-100', badge: 'bg-red-100 text-red-700', label: 'Urgente' },
                  warning: { border: 'border-amber-200', bg: 'bg-amber-50', icon: 'text-amber-600', iconBg: 'bg-amber-100', badge: 'bg-amber-100 text-amber-700', label: 'Importante' },
                  info: { border: 'border-blue-100', bg: 'bg-white', icon: 'text-blue-500', iconBg: 'bg-blue-100', badge: 'bg-blue-100 text-blue-700', label: 'Aviso' },
                };
                const t = tipoConfig[aviso.tipo] || tipoConfig.info;
                return (
                  <div
                    key={aviso.id}
                    className={`rounded-2xl shadow-md border ${t.border} ${t.bg} p-6 hover:shadow-lg transition-all duration-300`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-0.5">
                        <div className={`w-8 h-8 ${t.iconBg} rounded-lg flex items-center justify-center`}>
                          <svg className={`w-4 h-4 ${t.icon}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h3 className="font-bold text-slate-800 text-sm leading-snug">{aviso.titulo}</h3>
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${t.badge}`}>{t.label}</span>
                        </div>
                        <p className="text-slate-600 text-sm leading-relaxed">{aviso.contenido}</p>
                        {aviso.created_at && (
                          <p className="text-xs text-slate-400 mt-2">
                            {new Date(aviso.created_at).toLocaleDateString('es-MX', { day: '2-digit', month: 'long', year: 'numeric' })}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Servicios Section */}
      <section id="servicios" className="py-20 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-black text-slate-900 mb-4">Servicios del Portal</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Accede a todos los servicios disponibles para padres de familia
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {servicios.map((item, i) => (
              <Link key={i} to={item.to} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 group">
                <div className={`p-3 bg-gradient-to-br ${item.color} rounded-xl shadow-lg w-fit mb-4 group-hover:scale-110 transition-transform`}>
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                  </svg>
                </div>
                <h3 className="font-bold text-slate-800 mb-2">{item.title}</h3>
                <p className="text-slate-500 text-sm">{item.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Tramites Section */}
      <section id="tramites" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-black text-slate-900 mb-4">Tramites</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Realiza tus tramites escolares de forma digital
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {tramites.map((item, i) => item.external ? (
              <a key={i} href={item.href} target="_blank" rel="noopener noreferrer" className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 group">
                <div className={`p-3 bg-gradient-to-br ${item.color} rounded-xl shadow-lg w-fit mb-4 group-hover:scale-110 transition-transform`}>
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                  </svg>
                </div>
                <h3 className="font-bold text-slate-800 mb-2">{item.title}</h3>
                <p className="text-slate-500 text-sm mb-3">{item.desc}</p>
                <span className="text-xs text-blue-600 inline-flex items-center gap-1">
                  Enlace externo
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                </span>
              </a>
            ) : (
              <Link key={i} to={item.to} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 group">
                <div className={`p-3 bg-gradient-to-br ${item.color} rounded-xl shadow-lg w-fit mb-4 group-hover:scale-110 transition-transform`}>
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                  </svg>
                </div>
                <h3 className="font-bold text-slate-800 mb-2">{item.title}</h3>
                <p className="text-slate-500 text-sm">{item.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-white/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-black text-slate-900 mb-4">Preguntas Frecuentes</h2>
            <p className="text-lg text-slate-600">
              Resolvemos tus dudas sobre el portal
            </p>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white/80 backdrop-blur-sm rounded-xl border border-white/20 shadow-sm overflow-hidden">
                <button
                  onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left"
                >
                  <span className="font-semibold text-slate-800">{faq.q}</span>
                  <svg className={`w-5 h-5 text-slate-400 transition-transform flex-shrink-0 ml-4 ${faqOpen === i ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {faqOpen === i && (
                  <div className="px-5 pb-5">
                    <p className="text-slate-600">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link to="/faq" className="text-blue-600 hover:text-indigo-600 font-semibold transition-colors">
              Ver todas las preguntas frecuentes →
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <h3 className="text-xl font-bold mb-4">Mas de USEBEQ</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Somos un organismo publico descentralizado, con personalidad juridica y patrimonio propio,
                que tiene por objeto la aplicacion, administracion y coordinacion operativa del Sistema de
                Educacion Basica a cargo de la Secretaria de Educacion en el Estado de Queretaro.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Portal</h3>
              <ul className="space-y-2">
                <li><a href="#tramites" className="text-slate-400 hover:text-white transition-colors text-sm">Tramites</a></li>
                <li><a href="#faq" className="text-slate-400 hover:text-white transition-colors text-sm">Preguntas Frecuentes</a></li>
                <li><Link to="/login" className="text-slate-400 hover:text-white transition-colors text-sm">Ingresa</Link></li>
                <li><Link to="/register" className="text-slate-400 hover:text-white transition-colors text-sm">Registrate</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Contacto</h3>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li>epena@usebeq.edu.mx</li>
                <li>442-238-6000 ext. 1330</li>
                <li>Queretaro, Mexico</li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-slate-800 text-center">
            <p className="text-slate-500 text-sm">&copy; {new Date().getFullYear()} USEBEQ - Portal de Padres de Familia</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
