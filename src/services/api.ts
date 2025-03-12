import axios from "axios"
import toast from "react-hot-toast"

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
})

const getToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token")
  }
  return null
}

api.interceptors.request.use((config) => {
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || "Error en la operación"
    if (typeof window !== "undefined") {
      toast.error(message)
    }
    return Promise.reject(error)
  },
)

export const authService = {
  login: async (email: string, password: string, userType = 'reader') => {
    try {
      const response = await api.post("/login", { email, password })
      if (response.data.token && typeof window !== "undefined") {
        localStorage.setItem("token", response.data.token)
        localStorage.setItem("userType", userType) 
        toast.success(response.data.message || "Inicio de sesión exitoso")
      }
      return {
        user: response.data.user,
        token: response.data.token,
      }
    } catch (error) {
      throw error
    }
  },

  registro: async (nombre: string, email: string, password: string, userType = 'reader') => {
    try {
      const response = await api.post("/register", {
        name: nombre,
        email,
        password,
      })

      if (userType === 'reader' && response.data.user) {
        try {
          const { readerService } = await import('./readerService')
          
          await readerService.createReader({
            user_id: response.data.user.id,
            name: nombre,
            last_name: nombre.split(' ').slice(1).join(' ') || 'Apellido', 
            email: email
          })
        } catch (readerError) {
          console.error("Error al crear el lector:", readerError)
          throw readerError 
        }
      }

      if (response.data.user && typeof window !== "undefined") {
        localStorage.setItem("registeredUserType", userType) 
        toast.success(response.data.message || "Registro exitoso")
      }
      return response.data
    } catch (error) {
      throw error
    }
  },

  obtenerUsuario: async (id: string) => {
    try {
      const response = await api.get(`/users/${id}`)
      return response.data
    } catch (error) {
      throw error
    }
  },
}

export default api

