import { useState } from 'react';
import { Link } from 'react-router-dom';
import { authExtAPI } from '../services/api';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    try {
      await authExtAPI.forgotPassword(email);
      setSent(true);
    } catch (err) {
      setError(err.response?.data?.detail || 'Error al enviar la solicitud');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-[#7CC6D8]/10 to-[#4996C6]/10 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Logos */}
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center justify-center gap-3 mb-3">
            <img src="/logos/qro_juntos.png" alt="Querétaro Gobierno del Estado" className="h-11 w-auto" />
            <div className="w-px h-9 bg-slate-300" />
            <img src="/logos/USEBEQN.png" alt="USEBEQ" className="h-9 w-auto" />
          </Link>
          <img src="/logos/portal_padres.png" alt="Portal para Padres de Familia" className="h-8 w-auto mx-auto mt-2" />
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-[#242B57] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-[#242B57]">Recuperar Contraseña</h1>
            <p className="text-slate-600 mt-2 text-sm">
              Ingresa tu correo electrónico y te enviaremos instrucciones para restablecer tu contraseña.
            </p>
          </div>

          {sent ? (
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-slate-800 mb-2">Correo enviado</h2>
              <p className="text-slate-600 mb-6 text-sm">
                Si el correo está registrado, recibirás instrucciones para restablecer tu contraseña. Revisa tu bandeja de entrada y spam.
              </p>
              <Link to="/login" className="inline-block bg-[#242B57] hover:bg-[#4996C6] text-white px-6 py-3 rounded-xl font-semibold shadow-lg transition-colors duration-300">
                Volver al inicio de sesión
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-red-800 text-sm">{error}</div>
              )}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Correo electrónico</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="tu@correo.com"
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4996C6] focus:border-transparent transition-all"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#242B57] hover:bg-[#4996C6] disabled:bg-slate-400 text-white px-6 py-3 rounded-xl font-semibold shadow-lg transition-colors duration-300"
              >
                {isSubmitting ? 'Enviando...' : 'Enviar instrucciones'}
              </button>
              <div className="text-center">
                <Link to="/login" className="text-[#4996C6] hover:text-[#242B57] font-medium text-sm transition-colors">
                  Volver al inicio de sesión
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
