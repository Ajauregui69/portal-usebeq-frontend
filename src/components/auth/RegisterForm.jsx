import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuthStore from '../../store/authStore';

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    u_correo: '',
    u_pass: '',
    u_pass_confirm: '',
    u_nombre: '',
    u_appat: '',
    u_apmat: '',
    u_tel: '',
    domicilio: '',
    sexo: '',
  });

  const [localError, setLocalError] = useState('');
  const [registerSuccess, setRegisterSuccess] = useState(false);
  const navigate = useNavigate();
  const { register, isLoading, error } = useAuthStore();

  const EMAIL_REGEX = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'u_tel') {
      setFormData({ ...formData, [name]: value.replace(/[^0-9\s\-]/g, '') });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    setLocalError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');

    if (!EMAIL_REGEX.test(formData.u_correo)) {
      setLocalError('Ingresa un correo electrónico válido (ejemplo: usuario@dominio.com).');
      return;
    }
    if (formData.u_pass !== formData.u_pass_confirm) {
      setLocalError('Las contraseñas no coinciden.');
      return;
    }

    const { u_pass_confirm, ...dataToSend } = formData;
    const success = await register(dataToSend);
    if (success) {
      setRegisterSuccess(true);
      setTimeout(() => navigate('/login'), 4000);
    }
  };

  const inputClass = "block w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4996C6] focus:border-transparent transition-all";
  const inputWithIconClass = "block w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4996C6] focus:border-transparent transition-all";

  if (registerSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-[#7CC6D8]/10 to-[#4996C6]/10 p-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8 text-center">
            <div className="flex items-center justify-center w-20 h-20 bg-emerald-100 rounded-full mx-auto mb-6">
              <svg className="w-10 h-10 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <img src="/logos/portal_padres.png" alt="Portal para Padres de Familia" className="h-8 w-auto mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-[#242B57] mb-3">Registro Exitoso</h2>
            <p className="text-slate-600 mb-6">
              Por favor revisa tu correo electrónico para activar tu cuenta. Serás redirigido al inicio de sesión en unos segundos.
            </p>
            <button
              onClick={() => navigate('/login')}
              className="bg-[#242B57] hover:bg-[#4996C6] text-white px-6 py-3 rounded-xl font-semibold shadow-lg transition-colors duration-300"
            >
              Ir a Iniciar Sesión
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-[#7CC6D8]/10 to-[#4996C6]/10 p-4 py-12">
      <div className="max-w-3xl w-full">
        {/* Logos institucionales */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center justify-center gap-3 mb-4">
            <img src="/logos/qro_juntos.png" alt="Querétaro Gobierno del Estado — Juntos, Adelante." className="h-12 w-auto" />
            <div className="w-px h-10 bg-slate-300" />
            <img src="/logos/USEBEQN.png" alt="USEBEQ" className="h-10 w-auto" />
          </Link>
          <img src="/logos/portal_padres.png" alt="Portal para Padres de Familia" className="h-10 w-auto mx-auto mt-2" />
          <p className="text-slate-600 mt-3 text-base">Únete al Portal para Padres de Familia</p>
        </div>

        {/* Tarjeta del formulario */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
          {(localError || error) && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 rounded-lg p-4">
              <div className="flex items-start">
                <svg className="h-5 w-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-red-800 text-sm font-medium">{localError || error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Información Personal */}
            <div>
              <h3 className="text-sm font-bold text-[#242B57] uppercase tracking-wide mb-4 border-b border-[#7CC6D8]/40 pb-2">
                Información Personal
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="u_nombre" className="block text-sm font-semibold text-slate-700 mb-2">Nombre(s) *</label>
                  <input type="text" id="u_nombre" name="u_nombre" value={formData.u_nombre} onChange={handleChange} required placeholder="Juan Carlos" className={inputClass} />
                </div>
                <div>
                  <label htmlFor="u_appat" className="block text-sm font-semibold text-slate-700 mb-2">Apellido Paterno *</label>
                  <input type="text" id="u_appat" name="u_appat" value={formData.u_appat} onChange={handleChange} required placeholder="García" className={inputClass} />
                </div>
                <div>
                  <label htmlFor="u_apmat" className="block text-sm font-semibold text-slate-700 mb-2">Apellido Materno</label>
                  <input type="text" id="u_apmat" name="u_apmat" value={formData.u_apmat} onChange={handleChange} placeholder="López" className={inputClass} />
                </div>
                <div>
                  <label htmlFor="sexo" className="block text-sm font-semibold text-slate-700 mb-2">Sexo</label>
                  <select id="sexo" name="sexo" value={formData.sexo} onChange={handleChange} className={inputClass}>
                    <option value="">Seleccionar</option>
                    <option value="M">Masculino</option>
                    <option value="F">Femenino</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Información de Contacto */}
            <div>
              <h3 className="text-sm font-bold text-[#242B57] uppercase tracking-wide mb-4 border-b border-[#7CC6D8]/40 pb-2">
                Información de Contacto
              </h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="u_correo" className="block text-sm font-semibold text-slate-700 mb-2">Correo Electrónico *</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                      </svg>
                    </div>
                    <input type="email" id="u_correo" name="u_correo" value={formData.u_correo} onChange={handleChange} required placeholder="tu@email.com" className={inputWithIconClass} />
                  </div>
                </div>
                <div>
                  <label htmlFor="u_tel" className="block text-sm font-semibold text-slate-700 mb-2">Teléfono</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <input type="tel" id="u_tel" name="u_tel" value={formData.u_tel} onChange={handleChange} placeholder="442 123 4567" inputMode="numeric" maxLength={15} className={inputWithIconClass} />
                  </div>
                </div>
                <div>
                  <label htmlFor="domicilio" className="block text-sm font-semibold text-slate-700 mb-2">Domicilio</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <input type="text" id="domicilio" name="domicilio" value={formData.domicilio} onChange={handleChange} placeholder="Calle, Número, Colonia, C.P." className={inputWithIconClass} />
                  </div>
                </div>
              </div>
            </div>

            {/* Seguridad */}
            <div>
              <h3 className="text-sm font-bold text-[#242B57] uppercase tracking-wide mb-4 border-b border-[#7CC6D8]/40 pb-2">
                Seguridad
              </h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="u_pass" className="block text-sm font-semibold text-slate-700 mb-2">Contraseña * (mínimo 6 caracteres)</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <input type="password" id="u_pass" name="u_pass" value={formData.u_pass} onChange={handleChange} required minLength={6} placeholder="••••••••" className={inputWithIconClass} />
                  </div>
                </div>
                <div>
                  <label htmlFor="u_pass_confirm" className="block text-sm font-semibold text-slate-700 mb-2">Confirmar Contraseña *</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <input type="password" id="u_pass_confirm" name="u_pass_confirm" value={formData.u_pass_confirm} onChange={handleChange} required minLength={6} placeholder="••••••••" className={inputWithIconClass} />
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#242B57] hover:bg-[#4996C6] disabled:bg-slate-400 text-white py-3.5 px-4 rounded-xl font-bold shadow-lg transition-colors duration-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Creando cuenta...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  Crear Cuenta
                </>
              )}
            </button>
          </form>

          {/* Google Sign Up */}
          {import.meta.env.VITE_GOOGLE_AUTH_ENABLED === 'true' && (
            <>
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-slate-500">O regístrate con</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => { window.location.href = `${import.meta.env.VITE_API_URL}/auth/google/login`; }}
                className="w-full bg-white hover:bg-slate-50 border-2 border-slate-200 text-slate-700 py-3.5 px-4 rounded-xl font-semibold shadow-sm transition-all duration-300 hover:border-slate-300 flex items-center justify-center gap-3"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Registrarse con Google
              </button>
            </>
          )}

          <div className="mt-8 text-center">
            <p className="text-slate-600">
              ¿Ya tienes cuenta?{' '}
              <Link to="/login" className="font-bold text-[#242B57] hover:text-[#4996C6] transition-colors">
                Inicia sesión
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-slate-500 text-sm mt-8">
          Portal de Padres de Familia USEBEQ — Querétaro, México
        </p>
      </div>
    </div>
  );
}
