import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { authExtAPI } from '../services/api';

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres');
      return;
    }
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }
    setIsSubmitting(true);
    try {
      await authExtAPI.resetPassword(token, password);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.response?.data?.detail || 'Error al restablecer la contraseña. El enlace puede haber expirado.');
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-[#242B57]">Nueva Contraseña</h1>
            <p className="text-slate-600 mt-2 text-sm">Ingresa tu nueva contraseña.</p>
          </div>

          {success ? (
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-slate-800 mb-2">Contraseña actualizada</h2>
              <p className="text-slate-600 mb-4 text-sm">
                Tu contraseña ha sido actualizada correctamente. Serás redirigido al inicio de sesión...
              </p>
              <Link to="/login" className="text-[#4996C6] hover:text-[#242B57] font-medium transition-colors">
                Ir al inicio de sesión
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-red-800 text-sm">{error}</div>
              )}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Nueva contraseña</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  placeholder="Mínimo 8 caracteres"
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4996C6] focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Confirmar contraseña</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={8}
                  placeholder="Repite la contraseña"
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4996C6] focus:border-transparent transition-all"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#242B57] hover:bg-[#4996C6] disabled:bg-slate-400 text-white px-6 py-3 rounded-xl font-semibold shadow-lg transition-colors duration-300"
              >
                {isSubmitting ? 'Actualizando...' : 'Restablecer Contraseña'}
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
