import { create } from 'zustand';
import { authService } from '../services/api';

interface User {
  id: number;
  name: string;
  email: string;
}

interface AuthState {
  usuario: User | null;
  token: string | null;
  cargando: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  registro: (nombre: string, email: string, password: string) => Promise<void>;
  cerrarSesion: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  usuario: null,
  token: localStorage.getItem('token'),
  cargando: false,
  error: null,

  login: async (email: string, password: string) => {
    set({ cargando: true, error: null });
    try {
      const respuesta = await authService.login(email, password);
      set({ 
        token: respuesta.token,
        usuario: respuesta.user,
        cargando: false 
      });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Error al iniciar sesión',
        cargando: false 
      });
      throw error;
    }
  },

  registro: async (nombre: string, email: string, password: string) => {
    set({ cargando: true, error: null });
    try {
      const respuesta = await authService.registro(nombre, email, password);
      set({ cargando: false });
      return respuesta;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al registrar usuario';
      set({ 
        error: errorMessage,
        cargando: false 
      });
      throw new Error(errorMessage);
    }
  },

  cerrarSesion: () => {
    localStorage.removeItem('token');
    set({ usuario: null, token: null });
  },
}));