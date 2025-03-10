import { create } from "zustand"
import { authService } from "../services/api"

interface User {
  id: number
  name: string
  email: string
}

interface AuthState {
  usuario: User | null
  token: string | null
  cargando: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  registro: (nombre: string, email: string, password: string) => Promise<void>
  cerrarSesion: () => void
  obtenerPerfilUsuario: () => Promise<void>
}

// Función para obtener el token de forma segura (compatible con SSR)
const getToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token")
  }
  return null
}

// Intentar cargar el usuario desde localStorage al inicializar el store
const getUserFromStorage = () => {
  if (typeof window !== "undefined") {
    const userStr = localStorage.getItem("user")
    return userStr ? JSON.parse(userStr) : null
  }
  return null
}

export const useAuthStore = create<AuthState>((set) => ({
  usuario: getUserFromStorage(),
  token: getToken(),
  cargando: false,
  error: null,

  login: async (email: string, password: string) => {
    set({ cargando: true, error: null })
    try {
      const respuesta = await authService.login(email, password)
      // Guardar el usuario en localStorage
      if (typeof window !== "undefined" && respuesta.user) {
        localStorage.setItem("user", JSON.stringify(respuesta.user))
      }
      set({
        token: respuesta.token,
        usuario: respuesta.user,
        cargando: false,
      })
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Error al iniciar sesión",
        cargando: false,
      })
      throw error
    }
  },

  registro: async (nombre: string, email: string, password: string) => {
    set({ cargando: true, error: null })
    try {
      const respuesta = await authService.registro(nombre, email, password)
      set({ cargando: false })
      return respuesta
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Error al registrar usuario"
      set({
        error: errorMessage,
        cargando: false,
      })
      throw new Error(errorMessage)
    }
  },

  cerrarSesion: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token")
      localStorage.removeItem("user")
    }
    set({ usuario: null, token: null })
  },
  
  obtenerPerfilUsuario: async () => {
    const state = useAuthStore.getState()
    if (!state.token) return
    
    set({ cargando: true, error: null })
    try {
      // Si tenemos el ID del usuario actual
      if (state.usuario?.id) {
        const respuesta = await authService.obtenerUsuario(state.usuario.id.toString())
        // Actualizar el localStorage con los datos más recientes
        if (typeof window !== "undefined") {
          localStorage.setItem("user", JSON.stringify(respuesta.user))
        }
        set({
          usuario: respuesta.user,
          cargando: false,
        })
      }
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Error al obtener perfil de usuario",
        cargando: false,
      })
      throw error
    }
  },
}))

