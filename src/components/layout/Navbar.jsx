import { Link, useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import useAuthStore from '../../store/authStore';

const SERVICIOS_MENU = {
  informacion: [
    { to: '/consulta',              label: 'Consulta e Impresión',      icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    { to: '/documentos-normativos', label: 'Documentos Normativos',      icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    { to: '/becas',                 label: 'Becas',                      icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
    { to: '/avisos',                label: 'Avisos',                     icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9' },
    { to: '/faq',                   label: 'Preguntas Frecuentes',       icon: 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
  ],
  enlaces: [
    { to: '/boeva',        label: 'Verificación de Documentos', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
    { to: '/buzon-padres', label: 'Buzón de Padres',            icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
    { href: 'https://siged.sep.gob.mx/SIGED/documentos.html', label: 'Verificación SEP/SIGED', icon: 'M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14', external: true },
  ],
};

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [showServicios, setShowServicios] = useState(false);
  const serviciosRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (serviciosRef.current && !serviciosRef.current.contains(e.target)) {
        setShowServicios(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
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
            {/* Servicios Dropdown */}
            <div className="relative" ref={serviciosRef}>
              <button
                onClick={() => setShowServicios(!showServicios)}
                className="flex items-center gap-1.5 px-4 py-2.5 text-slate-700 hover:bg-blue-50 hover:text-blue-600 rounded-xl font-medium transition-all"
              >
                Servicios
                <svg className={`w-4 h-4 transition-transform ${showServicios ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {showServicios && (
                <div className="absolute left-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50">
                  {/* Información */}
                  <div className="px-4 pt-4 pb-2">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Información</p>
                    {SERVICIOS_MENU.informacion.map((item) => (
                      <Link
                        key={item.to}
                        to={item.to}
                        onClick={() => setShowServicios(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-all"
                      >
                        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                        </svg>
                        {item.label}
                      </Link>
                    ))}
                  </div>
                  <div className="border-t border-slate-100 px-4 pt-2 pb-4">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Enlaces USEBEQ</p>
                    {SERVICIOS_MENU.enlaces.map((item) =>
                      item.external ? (
                        <a
                          key={item.href}
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => setShowServicios(false)}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-all"
                        >
                          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                          </svg>
                          {item.label}
                          <svg className="w-3 h-3 ml-auto text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      ) : (
                        <Link
                          key={item.to}
                          to={item.to}
                          onClick={() => setShowServicios(false)}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-all"
                        >
                          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                          </svg>
                          {item.label}
                        </Link>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>

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

              {/* Servicios - Información */}
              <div className="px-4 pt-2 pb-1">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Información</p>
              </div>
              {SERVICIOS_MENU.informacion.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setShowMenu(false)}
                  className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-blue-50 hover:text-blue-600 rounded-xl font-medium transition-all"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                  </svg>
                  {item.label}
                </Link>
              ))}

              {/* Servicios - Enlaces USEBEQ */}
              <div className="px-4 pt-2 pb-1">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Enlaces USEBEQ</p>
              </div>
              {SERVICIOS_MENU.enlaces.map((item) =>
                item.external ? (
                  <a
                    key={item.href}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setShowMenu(false)}
                    className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-blue-50 hover:text-blue-600 rounded-xl font-medium transition-all"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                    </svg>
                    {item.label}
                  </a>
                ) : (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setShowMenu(false)}
                    className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-blue-50 hover:text-blue-600 rounded-xl font-medium transition-all"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                    </svg>
                    {item.label}
                  </Link>
                )
              )}

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
