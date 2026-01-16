import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;//comment

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
