import { Link, useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import useAuthStore from '../../store/authStore';

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [showServices, setShowServices] = useState(false);
  const servicesRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => { if (servicesRef.current && !servicesRef.current.contains(e.target)) setShowServices(false); };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-lg border-b border-white/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center gap-3 group">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div>
                <span className="text-2xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  USEBEQ
                </span>
                <p className="text-xs text-slate-500 font-medium">Portal de Padres</p>
              </div>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl border border-slate-200">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">
                  {user?.u_nombre?.[0]}{user?.u_appat?.[0]}
                </span>
              </div>
              <span className="text-slate-700 font-semibold text-sm">
                {user?.u_nombre} {user?.u_appat}
              </span>
            </div>

            <div className="relative" ref={servicesRef}>
              <button onClick={() => setShowServices(!showServices)}
                className="flex items-center gap-2 px-4 py-2.5 text-slate-700 hover:bg-blue-50 hover:text-blue-600 rounded-xl font-medium transition-all">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                Servicios
                <svg className={`w-4 h-4 transition-transform ${showServices ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </button>
              {showServices && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-slate-200 py-2 z-50">
                  <div className="px-3 py-1.5 text-xs font-bold text-slate-400 uppercase">Tramites</div>
                  {[
                    { to: '/bajas-traslado', label: 'Bajas por Traslado' },
                    { to: '/duplicado-certificado', label: 'Duplicado de Certificado' },
                    { to: '/soluciones-en-linea', label: 'Soluciones en Linea' },
                    { to: '/revocacion-grado', label: 'Revocacion de Grado' },
                  ].map(item => (
                    <Link key={item.to} to={item.to} onClick={() => setShowServices(false)}
                      className="block px-4 py-2 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">{item.label}</Link>
                  ))}
                  <div className="border-t border-slate-100 my-1"></div>
                  <div className="px-3 py-1.5 text-xs font-bold text-slate-400 uppercase">Informacion</div>
                  {[
                    { to: '/documentos-normativos', label: 'Documentos Normativos' },
                    { to: '/avisos', label: 'Avisos Importantes' },
                    { to: '/faq', label: 'Preguntas Frecuentes' },
                    { to: '/becas', label: 'Becas' },
                  ].map(item => (
                    <Link key={item.to} to={item.to} onClick={() => setShowServices(false)}
                      className="block px-4 py-2 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">{item.label}</Link>
                  ))}
                  <div className="border-t border-slate-100 my-1"></div>
                  <div className="px-3 py-1.5 text-xs font-bold text-slate-400 uppercase">Otros</div>
                  <Link to="/boeva" onClick={() => setShowServices(false)}
                    className="block px-4 py-2 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                    Verificacion de Documentos
                  </Link>
                  <Link to="/buzon-padres" onClick={() => setShowServices(false)}
                    className="block px-4 py-2 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                    Buzon de Padres
                  </Link>
                  <div className="border-t border-slate-100 my-1"></div>
                  <div className="px-3 py-1.5 text-xs font-bold text-slate-400 uppercase">Enlaces USEBEQ</div>
                  {[
                    { href: 'https://www.usebeq.edu.mx/PaginaWEB/', label: 'Pagina Oficial USEBEQ' },
                    { href: 'https://www.usebeq.edu.mx/PaginaWeb/Home/MiCorreoInstitucional', label: 'Mi Correo Institucional' },
                    { href: 'https://said.usebeq.edu.mx/', label: 'Preinscripciones (SAID)' },
                    { href: 'https://www.usebeq.edu.mx/PaginaWEB/encuestas/evaluacionServicioSGC', label: 'Evaluacion del Servicio' },
                  ].map(item => (
                    <a key={item.href} href={item.href} target="_blank" rel="noopener noreferrer" onClick={() => setShowServices(false)}
                      className="flex items-center justify-between px-4 py-2 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                      {item.label}
                      <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                    </a>
                  ))}
                </div>
              )}
            </div>

            <Link
              to="/profile"
              className="flex items-center gap-2 px-4 py-2.5 text-slate-700 hover:bg-blue-50 hover:text-blue-600 rounded-xl font-medium transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Perfil
            </Link>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg shadow-red-500/30 transition-all duration-300 hover:scale-105"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Salir
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {showMenu ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMenu && (
          <div className="md:hidden py-4 border-t border-slate-200">
            <div className="space-y-2">
              <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 rounded-xl">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">
                    {user?.u_nombre?.[0]}{user?.u_appat?.[0]}
                  </span>
                </div>
                <div>
                  <p className="text-slate-800 font-semibold text-sm">
                    {user?.u_nombre} {user?.u_appat}
                  </p>
                  <p className="text-slate-500 text-xs">{user?.u_email}</p>
                </div>
              </div>

              <Link
                to="/profile"
                onClick={() => setShowMenu(false)}
                className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-blue-50 hover:text-blue-600 rounded-xl font-medium transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Mi Perfil
              </Link>

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-semibold shadow-lg shadow-red-500/30"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Cerrar sesión
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
