import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import useAuthStore from '../store/authStore';
import { faqAPI } from '../services/api';

export default function FAQ() {
  const { isAuthenticated } = useAuthStore();
  const [faqItems, setFaqItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openItem, setOpenItem] = useState(null);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('Todas');

  useEffect(() => {
    loadFAQ();
  }, []);

  const loadFAQ = async () => {
    try {
      const res = await faqAPI.getAll();
      setFaqItems(res.data);
    } catch (err) {
      console.error('Error loading FAQ:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const categories = ['Todas', ...new Set(faqItems.map(item => item.category))];

  const filtered = faqItems.filter(item => {
    const matchesSearch = item.question.toLowerCase().includes(search.toLowerCase()) || item.answer.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === 'Todas' || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-[#7CC6D8]/10 to-[#4996C6]/10">
      {isAuthenticated ? (
        <Navbar />
      ) : (
        <nav className="bg-white/80 backdrop-blur-md shadow-lg border-b border-white/20 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-20">
              <div className="flex items-center">
                <Link to="/" className="flex items-center gap-3 group">
                  <div className="w-12 h-12 bg-[#242B57] rounded-xl flex items-center justify-center shadow-lg shadow-[#242B57]/30 group-hover:scale-110 transition-transform">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-2xl font-black text-[#242B57]">USEBEQ</span>
                    <p className="text-xs text-slate-500 font-medium">Portal de Padres</p>
                  </div>
                </Link>
              </div>
              <div className="flex items-center gap-3">
                <Link to="/login" className="text-slate-600 hover:text-[#4996C6] font-medium transition-colors px-4 py-2">Inicia Sesión</Link>
                <Link to="/register" className="bg-[#242B57] hover:bg-[#4996C6] text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg shadow-[#242B57]/30 transition-all duration-300 hover:scale-105">
                  Regístrate
                </Link>
              </div>
            </div>
          </div>
        </nav>
      )}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10">
          <Link to={isAuthenticated ? '/dashboard' : '/'} className="flex items-center gap-2 text-slate-600 hover:text-[#4996C6] mb-4 transition-colors w-fit">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            {isAuthenticated ? 'Volver al Panel' : 'Volver al inicio'}
          </Link>
          <h1 className="text-3xl font-bold text-[#242B57]">Preguntas Frecuentes</h1>
          <p className="text-slate-600 mt-2">Encuentra respuestas a las dudas más comunes</p>
        </div>

        <div className="mb-6">
          <input type="text" placeholder="Buscar pregunta..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full px-5 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4996C6] focus:border-transparent transition-all bg-white/80 backdrop-blur-sm" />
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${activeCategory === cat ? 'bg-[#242B57] text-white shadow-lg shadow-[#242B57]/30' : 'bg-white/80 text-slate-600 hover:bg-[#7CC6D8]/15 border border-slate-200'}`}>
              {cat}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-[#7CC6D8]/30 border-t-[#4996C6]"></div>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((item) => (
              <div key={item.id} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden transition-all duration-300 hover:shadow-xl">
                <button onClick={() => setOpenItem(openItem === item.id ? null : item.id)}
                  className="w-full flex items-center justify-between p-5 text-left">
                  <div className="flex items-center gap-3 flex-1">
                    <span className="px-2.5 py-1 bg-[#7CC6D8]/20 text-[#242B57] text-xs font-semibold rounded-full whitespace-nowrap">{item.category}</span>
                    <span className="font-semibold text-slate-800">{item.question}</span>
                  </div>
                  <svg className={`w-5 h-5 text-slate-400 transition-transform duration-300 flex-shrink-0 ${openItem === item.id ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openItem === item.id && (
                  <div className="px-5 pb-5 border-t border-slate-100">
                    <p className="text-slate-600 pt-4 leading-relaxed">
                      {item.answer}
                      {item.link_url && (
                        <> <Link to={item.link_url} className="text-[#4996C6] hover:underline font-medium">{item.link_text || 'aquí'}</Link>.</>
                      )}
                    </p>
                    {item.video_url && (
                      <div className="mt-4">
                        <video controls className="w-full rounded-xl border border-slate-200" src={item.video_url}>
                          Tu navegador no soporta la reproducción de video.
                        </video>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="text-center py-12 text-slate-500">No se encontraron resultados para tu búsqueda.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
