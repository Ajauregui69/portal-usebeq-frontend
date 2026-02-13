import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import useAuthStore from '../store/authStore';
import { faqAPI } from '../services/api';

export default function FAQ() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [faqItems, setFaqItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openItem, setOpenItem] = useState(null);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('Todas');

  useEffect(() => {
    if (!isAuthenticated) { navigate('/login'); return; }
    loadFAQ();
  }, [isAuthenticated, navigate]);

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10">
          <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-slate-600 hover:text-blue-600 mb-4 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Volver al Panel
          </button>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Preguntas Frecuentes</h1>
          <p className="text-slate-600 mt-2">Encuentra respuestas a las dudas mas comunes</p>
        </div>

        <div className="mb-6">
          <input type="text" placeholder="Buscar pregunta..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full px-5 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white/80 backdrop-blur-sm" />
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${activeCategory === cat ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30' : 'bg-white/80 text-slate-600 hover:bg-blue-50 border border-slate-200'}`}>
              {cat}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600"></div>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((item) => (
              <div key={item.id} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden transition-all duration-300 hover:shadow-xl">
                <button onClick={() => setOpenItem(openItem === item.id ? null : item.id)}
                  className="w-full flex items-center justify-between p-5 text-left">
                  <div className="flex items-center gap-3 flex-1">
                    <span className="px-2.5 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full whitespace-nowrap">{item.category}</span>
                    <span className="font-semibold text-slate-800">{item.question}</span>
                  </div>
                  <svg className={`w-5 h-5 text-slate-400 transition-transform duration-300 flex-shrink-0 ${openItem === item.id ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openItem === item.id && (
                  <div className="px-5 pb-5 border-t border-slate-100">
                    <p className="text-slate-600 pt-4 leading-relaxed">{item.answer}</p>
                  </div>
                )}
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="text-center py-12 text-slate-500">No se encontraron resultados para tu busqueda.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
