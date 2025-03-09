import axios from 'axios';
import toast from 'react-hot-toast';


const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || 'Error en la operación';
    toast.error(message);
    return Promise.reject(error);
  }
);


export const authService = {
  login: async (email: string, password: string) => {
    try {
      const response = await api.post('/login', { email, password });
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        toast.success(response.data.message || 'Inicio de sesión exitoso tilin');
      }
      return {
        user: response.data.user,
        token: response.data.token
      };
    } catch (error) {
      throw error;
    }
  },

  registro: async (nombre: string, email: string, password: string) => {
    try {
      const response = await api.post('/register', { 
        name: nombre,
        email, 
        password
      });
      
      if (response.data.user) {
        toast.success(response.data.message || 'Registro exitoso');
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  obtenerUsuario: async (id: string) => {
    try {
      const response = await api.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default api;