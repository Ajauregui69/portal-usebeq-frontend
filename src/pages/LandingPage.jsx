import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { announcementsAPI } from '../services/api';
import useAuthStore from '../store/authStore';

export default function LandingPage() {
  const { isAuthenticated } = useAuthStore();
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
    { to: '/consulta',               title: 'Consulta e Impresión',      desc: 'Consulta calificaciones por CURP del estudiante',          color: 'from-[#4996C6] to-[#242B57]', icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    { to: '/documentos-normativos',  title: 'Documentos Normativos',     desc: 'Acuerdos y normas de control escolar',                     color: 'from-[#7CC6D8] to-[#4996C6]', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    { to: '/boeva',                  title: 'Verificación de Documentos', desc: 'Verifica la autenticidad de boletas',                      color: 'from-[#242B57] to-[#4996C6]', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
    { to: '/becas',                  title: 'Becas',                     desc: 'Información sobre becas disponibles',                      color: 'from-[#E1A031] to-[#c8891f]',  icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
    { to: '/buzon-padres',           title: 'Buzón de Padres',           desc: 'Envía documentos y consultas',                             color: 'from-[#4996C6] to-[#7CC6D8]', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
  ];

  const tramites = [
    { to: '/bajas-traslado',        title: 'Baja por Traslado',         desc: 'Solicita baja por cambio de escuela',                      color: 'from-red-500 to-red-600',      icon: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4' },
    { to: '/duplicado-certificado', title: 'Duplicado de Certificado',  desc: 'Reimpresión de certificados oficiales',                    color: 'from-[#4996C6] to-[#242B57]', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4' },
    { to: '/soluciones-en-linea',   title: 'Solicitudes en Línea',      desc: 'Trámites y solicitudes digitales',                         color: 'from-[#242B57] to-[#4996C6]', icon: 'M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9' },
    { to: '/revocacion-grado',      title: 'Revocación de Grado',       desc: 'Solicita repetición de grado escolar',                     color: 'from-[#242B57] to-[#4996C6]', icon: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15' },
    { href: 'https://siged.sep.gob.mx/SIGED/documentos.html', title: 'Verificación SEP/SIGED', desc: 'Verifica documentos en el portal SEP', color: 'from-slate-500 to-slate-600', icon: 'M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14', external: true },
  ];

  const faqs = [
    { q: '¿Qué es el Portal para Padres?',                    a: 'Es una opción adicional a la escuela que permite a los padres, madres de familia o tutores conocer la información académica de los estudiantes de preescolar, primaria y secundaria del estado de Querétaro.' },
    { q: '¿Por qué es necesario registrar una cuenta?',       a: 'Para tener acceso a la impresión de los documentos oficiales de acreditación de sus hijos.' },
    { q: '¿Cómo registro mi cuenta?',                         a: 'Ingresa a la sección "Registra tu cuenta", completa el formulario con un correo electrónico válido y una contraseña. Consulta el tutorial a continuación.', video_url: '/videos/registro.webm' },
    { q: '¿Cómo visualizo la información del estudiante?',    a: 'Debes agregar al estudiante a tu perfil de usuario. Una vez agregado, podrás ver sus calificaciones, información escolar y más. Consulta el tutorial a continuación.', video_url: '/videos/sesion.webm' },
    { q: '¿Puedo agregar varios estudiantes a mi perfil?',    a: 'Sí, siempre y cuando sea posible realizar la verificación de vinculación parental con los datos del estudiante.' },
    { q: '¿Qué es la Vinculación de Hermanos?',               a: 'Es un procedimiento para identificar la relación consanguínea o por afinidad entre estudiantes de educación básica en Querétaro.' },
    { q: '¿Qué es una Baja por Traslado?',                    a: 'Es la asignación del estatus de baja al alumno que será trasladado de escuela dentro o fuera del estado.' },
    { q: '¿Qué es un duplicado de certificado?',              a: 'Es la expedición de un certificado o constancia que acredita un nivel educativo, solicitado cuando el original se extravíe o requiera actualización.' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-[#7CC6D8]/10">
      {/* Navbar */}
      <nav className="bg-white shadow-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logos institucionales */}
            <Link to="/" className="flex items-center gap-4">
              <img
                src="/logos/qro_juntos.png"
                alt="Querétaro Gobierno del Estado — Juntos, Adelante."
                className="h-12 w-auto object-contain"
              />
              <div className="w-px h-10 bg-slate-300 hidden sm:block" />
              <img
                src="/logos/USEBEQN.png"
                alt="Unidad de Servicios para la Educación Básica en el Estado de Querétaro"
                className="h-10 w-auto object-contain hidden sm:block"
              />
            </Link>

            {/* Desktop links */}
            <div className="hidden md:flex items-center gap-4">
              <a href="#avisos"    className="text-slate-600 hover:text-[#4996C6] font-medium transition-colors text-sm">Avisos</a>
              <a href="#servicios" className="text-slate-600 hover:text-[#4996C6] font-medium transition-colors text-sm">Servicios</a>
              <a href="#tramites"  className="text-slate-600 hover:text-[#4996C6] font-medium transition-colors text-sm">Trámites</a>
              <a href="#faq"       className="text-slate-600 hover:text-[#4996C6] font-medium transition-colors text-sm">Preguntas frecuentes</a>
              {isAuthenticated ? (
                <Link to="/dashboard" className="bg-[#242B57] hover:bg-[#4996C6] text-white px-5 py-2.5 rounded-xl font-semibold shadow transition-colors duration-300 text-sm">
                  Ir al tablero
                </Link>
              ) : (
                <Link to="/login" className="bg-[#242B57] hover:bg-[#4996C6] text-white px-5 py-2.5 rounded-xl font-semibold shadow transition-colors duration-300 text-sm">
                  Iniciar sesión
                </Link>
              )}
            </div>

            {/* Mobile button */}
            <div className="md:hidden flex items-center">
              {isAuthenticated ? (
                <Link to="/dashboard" className="bg-[#242B57] text-white px-4 py-2 rounded-xl font-semibold text-sm">
                  Tablero
                </Link>
              ) : (
                <Link to="/login" className="bg-[#242B57] text-white px-4 py-2 rounded-xl font-semibold text-sm">
                  Iniciar sesión
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#242B57]/5 via-transparent to-[#4996C6]/5 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              {/* Logo del portal como título principal */}
              <img
                src="/logos/portal_padres.png"
                alt="Portal para Padres de Familia"
                className="h-24 w-auto mb-8"
              />
              <p className="text-xl text-slate-600 mb-3 leading-relaxed">
                Accede a calificaciones, certificados, trámites y más.
              </p>
              <p className="text-base text-slate-500 mb-8">
                El portal para padres de familia del estado de Querétaro.
              </p>
              <div className="flex flex-wrap gap-4">
                {isAuthenticated ? (
                  <Link to="/dashboard" className="flex items-center gap-2 bg-[#242B57] hover:bg-[#4996C6] text-white px-8 py-4 rounded-xl font-bold shadow-xl transition-colors duration-300 text-lg">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    Ir al tablero
                  </Link>
                ) : (
                  <>
                    <Link to="/login" className="flex items-center gap-2 bg-[#242B57] hover:bg-[#4996C6] text-white px-8 py-4 rounded-xl font-bold shadow-xl transition-colors duration-300 text-lg">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                      </svg>
                      Iniciar sesión
                    </Link>
                    <Link to="/register" className="flex items-center gap-2 bg-white hover:bg-slate-50 text-[#242B57] px-8 py-4 rounded-xl font-bold border-2 border-[#242B57] hover:border-[#4996C6] hover:text-[#4996C6] transition-all duration-300 text-lg">
                      Registrarse
                    </Link>
                  </>
                )}
              </div>
            </div>

            {/* Lado derecho: tarjeta decorativa con logos */}
            <div className="hidden lg:flex justify-center">
              <div className="relative">
                <div className="w-96 bg-[#242B57] rounded-3xl shadow-2xl p-10 flex flex-col items-center gap-6">
                  <img
                    src="/logos/qro_juntos.png"
                    alt="Querétaro Gobierno del Estado"
                    className="w-56 object-contain brightness-0 invert"
                  />
                  <div className="w-16 h-px bg-white/30" />
                  <img
                    src="/logos/USEBEQN.png"
                    alt="USEBEQ"
                    className="w-64 object-contain brightness-0 invert"
                  />
                </div>
                <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-[#FF3E8D] rounded-2xl shadow-lg flex items-center justify-center transform rotate-6">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="absolute -top-4 -left-4 w-16 h-16 bg-[#7CC6D8] rounded-2xl shadow-lg flex items-center justify-center transform -rotate-6">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Avisos Importantes */}
      <section id="avisos" className="py-16 bg-[#E1A031]/8 border-y border-[#E1A031]/25">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-10">
            <div className="p-2 bg-[#E1A031] rounded-xl shadow">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <div>
              <h2 className="text-3xl font-black text-[#242B57]">Avisos Importantes</h2>
              <p className="text-slate-600 text-sm">Información relevante para padres de familia</p>
            </div>
          </div>

          {avisosLoading ? (
            <div className="flex items-center justify-center py-12">
              <svg className="animate-spin h-8 w-8 text-[#E1A031]" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
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
                  urgent:  { border: 'border-red-200',    bg: 'bg-red-50',   icon: 'text-red-500',    iconBg: 'bg-red-100',    badge: 'bg-red-100 text-red-700',    label: 'Urgente'    },
                  warning: { border: 'border-[#E1A031]/35',  bg: 'bg-[#E1A031]/8', icon: 'text-[#c8891f]',  iconBg: 'bg-[#E1A031]/15',  badge: 'bg-[#E1A031]/15 text-[#7a5200]', label: 'Importante' },
                  info:    { border: 'border-[#7CC6D8]/40', bg: 'bg-white',  icon: 'text-[#4996C6]', iconBg: 'bg-[#7CC6D8]/20', badge: 'bg-[#7CC6D8]/20 text-[#242B57]', label: 'Aviso' },
                };
                const t = tipoConfig[aviso.tipo] || tipoConfig.info;
                return (
                  <div key={aviso.id} className={`rounded-2xl shadow-md border ${t.border} ${t.bg} p-6 hover:shadow-lg transition-all duration-300`}>
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

      {/* Servicios */}
      <section id="servicios" className="py-20 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-black text-[#242B57] mb-4">Servicios del Portal</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Accede a todos los servicios disponibles para padres de familia
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {servicios.map((item, i) => (
              <Link key={i} to={item.to} className="bg-white rounded-2xl p-6 shadow-md border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                <div className={`p-3 bg-gradient-to-br ${item.color} rounded-xl shadow w-fit mb-4 group-hover:scale-110 transition-transform`}>
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                  </svg>
                </div>
                <h3 className="font-bold text-[#242B57] mb-2">{item.title}</h3>
                <p className="text-slate-500 text-sm">{item.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trámites */}
      <section id="tramites" className="py-20 bg-[#242B57]/3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-black text-[#242B57] mb-4">Trámites</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Realiza tus trámites escolares de forma digital
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {tramites.map((item, i) => item.external ? (
              <a key={i} href={item.href} target="_blank" rel="noopener noreferrer" className="bg-white rounded-2xl p-6 shadow-md border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                <div className={`p-3 bg-gradient-to-br ${item.color} rounded-xl shadow w-fit mb-4 group-hover:scale-110 transition-transform`}>
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                  </svg>
                </div>
                <h3 className="font-bold text-[#242B57] mb-2">{item.title}</h3>
                <p className="text-slate-500 text-sm mb-3">{item.desc}</p>
                <span className="text-xs text-[#4996C6] inline-flex items-center gap-1 font-medium">
                  Enlace externo
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </span>
              </a>
            ) : (
              <Link key={i} to={item.to} className="bg-white rounded-2xl p-6 shadow-md border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                <div className={`p-3 bg-gradient-to-br ${item.color} rounded-xl shadow w-fit mb-4 group-hover:scale-110 transition-transform`}>
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                  </svg>
                </div>
                <h3 className="font-bold text-[#242B57] mb-2">{item.title}</h3>
                <p className="text-slate-500 text-sm">{item.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Preguntas Frecuentes */}
      <section id="faq" className="py-20 bg-white/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-black text-[#242B57] mb-4">Preguntas Frecuentes</h2>
            <p className="text-lg text-slate-600">Resolvemos tus dudas sobre el portal</p>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <button
                  onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-[#7CC6D8]/10 transition-colors"
                >
                  <span className="font-semibold text-[#242B57]">{faq.q}</span>
                  <svg className={`w-5 h-5 text-[#4996C6] transition-transform flex-shrink-0 ml-4 ${faqOpen === i ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {faqOpen === i && (
                  <div className="px-5 pb-5">
                    <p className="text-slate-600">{faq.a}</p>
                    {faq.video_url && (
                      <div className="mt-4">
                        <video controls className="w-full rounded-xl border border-slate-200" src={faq.video_url}>
                          Tu navegador no soporta la reproducción de video.
                        </video>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link to="/faq" className="text-[#4996C6] hover:text-[#242B57] font-semibold transition-colors">
              Ver todas las preguntas frecuentes →
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#242B57] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <img src="/logos/USEBEQN.png" alt="USEBEQ" className="h-12 w-auto mb-4 brightness-0 invert opacity-90" />
              <p className="text-slate-300 text-sm leading-relaxed mt-4">
                Somos un organismo público descentralizado, con personalidad jurídica y patrimonio propio,
                que tiene por objeto la aplicación, administración y coordinación operativa del Sistema de
                Educación Básica a cargo de la Secretaría de Educación en el Estado de Querétaro.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4 text-[#7CC6D8]">Portal</h3>
              <ul className="space-y-2">
                <li><a href="#tramites"  className="text-slate-300 hover:text-white transition-colors text-sm">Trámites</a></li>
                <li><a href="#faq"       className="text-slate-300 hover:text-white transition-colors text-sm">Preguntas Frecuentes</a></li>
                <li><Link to="/login"    className="text-slate-300 hover:text-white transition-colors text-sm">Ingresar</Link></li>
                <li><Link to="/register" className="text-slate-300 hover:text-white transition-colors text-sm">Registrarse</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4 text-[#7CC6D8]">Contacto</h3>
              <ul className="space-y-2 text-slate-300 text-sm">
                <li>epena@usebeq.edu.mx</li>
                <li>442-238-6000 ext. 1330</li>
                <li>Querétaro, México</li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-white/10 text-center">
            <img src="/logos/qro_juntos.png" alt="Querétaro Gobierno del Estado" className="h-8 w-auto mx-auto mb-4 brightness-0 invert opacity-60" />
            <p className="text-slate-400 text-sm">&copy; {new Date().getFullYear()} USEBEQ — Portal de Padres de Familia</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
