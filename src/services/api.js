import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;//commentt

console.log('API URL:', API_URL);

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (formData) => {
    const data = new URLSearchParams();
    data.append('username', formData.u_correo);
    data.append('password', formData.u_pass);
    return api.post('/auth/login', data, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
  },
  activate: (token) => api.post(`/auth/activate/${token}`),
};

// User API
export const userAPI = {
  getProfile: () => api.get('/users/me'),
  updateProfile: (userData) => api.put('/users/me', userData),
};

// Student API
export const studentAPI = {
  getMyStudents: () => api.get('/students/my-students'),
  linkStudent: (studentData) => api.post('/students/link-student', studentData),
  linkStudentWithCCT: (curp, cct, relacion) => api.post('/students/link-student-with-cct', null, {
    params: { curp, cct, relacion }
  }),
  unlinkStudent: (studentId) => api.delete(`/students/unlink-student/${studentId}`),
};

// USEBEQ External API
export const usebeqAPI = {
  // Get student by CURP and CCT
  getStudentByCurpCct: (curp, cct) => api.get(`/usebeq/estudiante/${curp}/${cct}`),

  // Get student by ID
  getStudentById: (idAlumno) => api.get(`/usebeq/estudiante/${idAlumno}`),

  // Download current report card (boleta)
  getBoleta: (idAlumno) => api.get(`/usebeq/boleta/${idAlumno}`, {
    responseType: 'blob',
  }),

  // Download historical report card (boleta)
  getBoletaHistorica: (idAlumno, anioInicio) => api.get(`/usebeq/boleta-historica/${idAlumno}/${anioInicio}`, {
    responseType: 'blob',
  }),

  // Request student withdrawal (baja)
  solicitarBaja: (solicitudData) => api.post('/usebeq/baja/', solicitudData),

  // Get withdrawal types catalog
  getTiposBaja: () => api.get('/usebeq/catalogo/tipos-de-baja'),
};

// Documents API
export const documentsAPI = {
  getAll: () => api.get('/documents/'),
  getById: (id) => api.get(`/documents/${id}`),
};

// FAQ API
export const faqAPI = {
  getAll: () => api.get('/faq/'),
  getByCategory: (category) => api.get(`/faq/category/${category}`),
};

// Announcements API
export const announcementsAPI = {
  getActive: () => api.get('/announcements/'),
  getAll: () => api.get('/announcements/all'),
  create: (data) => api.post('/announcements/', data),
  update: (id, data) => api.put(`/announcements/${id}`, data),
  delete: (id) => api.delete(`/announcements/${id}`),
};

// Tramites API
export const tramitesAPI = {
  crearSolicitud: (data) => api.post('/tramites/solicitud', data),
  consultarEstatus: (folio) => api.get(`/tramites/solicitud/estatus/${folio}`),
  misTramites: () => api.get('/tramites/solicitudes/mis-tramites'),
  getTiposTramite: () => api.get('/tramites/tipos-tramite'),
  solicitarRevocacion: (data) => api.post('/tramites/revocacion', data),
  consultarEstatusRevocacion: (folio) => api.get(`/tramites/revocacion/estatus/${folio}`),
  misRevocaciones: () => api.get('/tramites/revocacion/mis-solicitudes'),
};

// Certificates API
export const certificatesAPI = {
  request: (data) => api.post('/certificates/request', data),
  getStatus: (folio) => api.get(`/certificates/status/${folio}`),
  listByCurp: (curp) => api.get(`/certificates/list/${curp}`),
};

// Grades PDF API
export const gradesAPI = {
  getStudentGrades: (studentId) => api.get(`/grades/student/${studentId}`),
  downloadPDF: (studentId) => api.get(`/grades/student/${studentId}/pdf`, { responseType: 'blob' }),
};

// Auth API extensions
export const authExtAPI = {
  forgotPassword: (email) => api.post(`/auth/forgot-password?email=${encodeURIComponent(email)}`),
  resetPassword: (token, newPassword) => api.post(`/auth/reset-password/${token}?new_password=${encodeURIComponent(newPassword)}`),
};

// BOEVA API (Document Verification)
export const boevaAPI = {
  verificar: (folio) => api.post('/boeva/verificar', { folio }),
  verificarQR: (encodedId) => api.get(`/boeva/verificar/${encodedId}`),
};

// Buzón de Padres API
export const buzonAPI = {
  enviar: (formData) => api.post('/buzon/enviar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
};

// PDF Receipts API
export const pdfAPI = {
  bajaPDF: (data) => api.post('/pdf/baja', data, { responseType: 'blob' }),
  revocacionPDF: (data) => api.post('/pdf/revocacion', data, { responseType: 'blob' }),
  revocacionComprobante: (folio) => api.get(`/pdf/revocacion/comprobante/${folio}`, { responseType: 'blob' }),
  solicitudPDF: (data) => api.post('/pdf/solicitud', data, { responseType: 'blob' }),
  duplicadoPDF: (data) => api.post('/pdf/duplicado', data, { responseType: 'blob' }),
};
