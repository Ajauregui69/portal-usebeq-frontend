import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../services/api';

export default function ActivateAccount() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('loading'); // loading | success | error | already
  const [message, setMessage] = useState('');

  useEffect(() => {
    const activate = async () => {
      try {
        const response = await authAPI.activate(token);
        const msg = response.data?.message || 'Cuenta activada exitosamente';
        if (msg.includes('ya fue activada')) {
          setStatus('already');
        } else {
          setStatus('success');
        }
        setMessage(msg);
      } catch (error) {
        const detail = error.response?.data?.detail || 'El enlace de activacion no es valido o ya expiro.';
        if (detail.includes('ya fue activada')) {
          setStatus('already');
          setMessage(detail);
        } else {
          setStatus('error');
          setMessage(detail);
        }
      }
    };

    if (token) {
      activate();
    } else {
      setStatus('error');
      setMessage('Token de activacion no encontrado.');
    }
  }, [token]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4">
        <div className="max-w-md w-full">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <svg className="animate-spin w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">Activando tu cuenta...</h2>
            <p className="text-slate-600">Por favor espera un momento.</p>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4">
        <div className="max-w-md w-full">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 p-8 text-center">
            <div className="flex items-center justify-center w-20 h-20 bg-emerald-100 rounded-full mx-auto mb-6">
              <svg className="w-10 h-10 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-3">Cuenta Activada</h2>
            <p className="text-slate-600 mb-6">
              Tu cuenta ha sido activada exitosamente. Ya puedes iniciar sesion en el portal.
            </p>
            <button
              onClick={() => navigate('/login')}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 px-4 rounded-xl font-bold shadow-lg shadow-blue-500/30 transition-all duration-300 hover:scale-[1.02]"
            >
              Iniciar Sesion
            </button>
          </div>
        </div>
        <p className="text-center text-slate-500 text-sm mt-8">
          Portal de Padres de Familia USEBEQ - Queretaro, Mexico
        </p>
      </div>
    );
  }

  if (status === 'already') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4">
        <div className="max-w-md w-full">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 p-8 text-center">
            <div className="flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mx-auto mb-6">
              <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-3">Cuenta ya Activada</h2>
            <p className="text-slate-600 mb-6">
              Esta cuenta ya fue activada anteriormente. Puedes iniciar sesion directamente.
            </p>
            <button
              onClick={() => navigate('/login')}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 px-4 rounded-xl font-bold shadow-lg shadow-blue-500/30 transition-all duration-300 hover:scale-[1.02]"
            >
              Ir a Iniciar Sesion
            </button>
          </div>
        </div>
        <p className="text-center text-slate-500 text-sm mt-8">
          Portal de Padres de Familia USEBEQ - Queretaro, Mexico
        </p>
      </div>
    );
  }

  // error
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4">
      <div className="max-w-md w-full">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 p-8 text-center">
          <div className="flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mx-auto mb-6">
            <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-3">Enlace Invalido</h2>
          <p className="text-slate-600 mb-6">{message}</p>
          <div className="space-y-3">
            <button
              onClick={() => navigate('/login')}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 px-4 rounded-xl font-bold shadow-lg shadow-blue-500/30 transition-all duration-300"
            >
              Ir a Iniciar Sesion
            </button>
            <Link
              to="/register"
              className="block text-center text-sm text-slate-500 hover:text-blue-600 transition-colors"
            >
              Crear nueva cuenta
            </Link>
          </div>
        </div>
      </div>
      <p className="text-center text-slate-500 text-sm mt-8">
        Portal de Padres de Familia USEBEQ - Queretaro, Mexico
      </p>
    </div>
  );
}
