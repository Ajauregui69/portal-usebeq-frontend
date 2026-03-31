import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import useAuthStore from '../store/authStore';
import { announcementsAPI } from '../services/api';

export default function Avisos() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [avisos, setAvisos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAviso, setSelectedAviso] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) { navigate('/login'); return; }
    loadAvisos();
  }, [isAuthenticated, navigate]);

  const loadAvisos = async () => {
    try {
      const res = await announcementsAPI.getActive();
      setAvisos(res.data);
    } catch (err) {
      console.error('Error loading avisos:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const tipoBadge = {
    info: 'bg-[#7CC6D8]/20 text-[#242B57]',
    warning: 'bg-[#E1A031]/15 text-[#7a5200]',
    urgent: 'bg-red-100 text-red-700',
  };
  const tipoLabel = { info: 'Informativo', warning: 'Importante', urgent: 'Urgente' };
  const tipoBorder = { info: 'border-l-[#4996C6]', warning: 'border-l-[#E1A031]', urgent: 'border-l-red-500' };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-[#7CC6D8]/10 to-[#4996C6]/10">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10">
          <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-slate-600 hover:text-[#4996C6] mb-4 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Volver al Panel
          </button>
          <h1 className="text-3xl font-bold text-[#242B57]">Avisos Importantes</h1>
          <p className="text-slate-600 mt-2">Mantente informado sobre las novedades de la USEBEQ</p>
        </div>

        {isLoading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-[#7CC6D8]/30 border-t-[#4996C6]"></div>
          </div>
        ) : avisos.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-16 text-center border border-white/20">
            <div className="w-20 h-20 bg-[#7CC6D8]/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-[#4996C6]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">No hay avisos por el momento</h2>
            <p className="text-slate-600">Cuando haya avisos importantes, aparecerán aquí.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {avisos.map((aviso) => (
              <div key={aviso.id} onClick={() => setSelectedAviso(aviso)}
                className={`bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 border-l-4 ${tipoBorder[aviso.tipo] || tipoBorder.info} p-6 hover:shadow-xl transition-all duration-300 cursor-pointer`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${tipoBadge[aviso.tipo] || tipoBadge.info}`}>{tipoLabel[aviso.tipo] || 'Informativo'}</span>
                      <span className="text-xs text-slate-500">{new Date(aviso.created_at).toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 mb-2">{aviso.titulo}</h3>
                    <p className="text-slate-600 text-sm line-clamp-2">{aviso.contenido}</p>
                  </div>
                  <svg className="w-5 h-5 text-slate-400 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedAviso && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setSelectedAviso(null)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${tipoBadge[selectedAviso.tipo] || tipoBadge.info}`}>{tipoLabel[selectedAviso.tipo] || 'Informativo'}</span>
                <button onClick={() => setSelectedAviso(null)} className="text-slate-400 hover:text-slate-600"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">{selectedAviso.titulo}</h2>
              <p className="text-xs text-slate-500 mb-4">{new Date(selectedAviso.created_at).toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
              {selectedAviso.imagen_url && <img src={selectedAviso.imagen_url} alt="" className="w-full rounded-xl mb-4" />}
              <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{selectedAviso.contenido}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
