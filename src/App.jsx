import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import OAuthCallback from './pages/OAuthCallback';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Grades from './pages/Grades';
import StudentDetail from './pages/StudentDetail';
import USEBEQDemo from './pages/USEBEQDemo';
import DocumentosNormativos from './pages/DocumentosNormativos';
import FAQ from './pages/FAQ';
import Avisos from './pages/Avisos';
import BajasTraslado from './pages/BajasTraslado';
import DuplicadoCertificado from './pages/DuplicadoCertificado';
import SolucionesEnLinea from './pages/SolucionesEnLinea';
import RevocacionGrado from './pages/RevocacionGrado';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import LandingPage from './pages/LandingPage';
import Becas from './pages/Becas';
import Boeva from './pages/Boeva';
import BuzonPadres from './pages/BuzonPadres';
import useAuthStore from './store/authStore';

function App() {
  const { loadUser } = useAuthStore();

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/auth/callback" element={<OAuthCallback />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/grades/:studentId" element={<Grades />} />
        <Route path="/student/:studentId" element={<StudentDetail />} />
        <Route path="/documentos-normativos" element={<DocumentosNormativos />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/avisos" element={<Avisos />} />
        <Route path="/bajas-traslado" element={<BajasTraslado />} />
        <Route path="/duplicado-certificado" element={<DuplicadoCertificado />} />
        <Route path="/soluciones-en-linea" element={<SolucionesEnLinea />} />
        <Route path="/revocacion-grado" element={<RevocacionGrado />} />
        <Route path="/usebeq-demo" element={<USEBEQDemo />} />
        <Route path="/becas" element={<Becas />} />
        <Route path="/boeva" element={<Boeva />} />
        <Route path="/buzon-padres" element={<BuzonPadres />} />
        <Route path="/" element={<LandingPage />} />
      </Routes>
    </Router>
  );
}

export default App;
