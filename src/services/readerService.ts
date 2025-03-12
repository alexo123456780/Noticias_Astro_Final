import api from "./api"
import type { ApiResponse } from "../types/news"

// Interfaces para Reader y Suscriptor
interface Reader {
  id: number
  user_id: number
  name: string
  last_name: string
  email?: string
  created_at?: string
  updated_at?: string
}

interface Suscriptor {
  id: number
  reader_id: number
  subscription_type: string
  subscription_date: string
  expiration_date: string
  is_active: boolean
  created_at?: string
  updated_at?: string
}

export const readerService = {
  // Readers
  getAllReaders: async (): Promise<ApiResponse<Reader[]>> => {
    try {
      const response = await api.get("/readers")
      return response.data
    } catch (error) {
      console.error("Error al obtener lectores:", error)
      return { success: false, data: [], message: "Error al obtener lectores" }
    }
  },

  getReaderById: async (id: number): Promise<ApiResponse<Reader>> => {
    try {
      const response = await api.get(`/readers/${id}`)
      return response.data
    } catch (error) {
      console.error(`Error al obtener lector con ID ${id}:`, error)
      throw error
    }
  },

  createReader: async (userData: { name: string; last_name: string; email?: string; user_id: number }): Promise<ApiResponse<Reader>> => {
    try {
      const response = await api.post("/readers", userData)
      return response.data
    } catch (error) {
      console.error("Error al crear lector:", error)
      throw error
    }
  },

  updateReader: async (id: number, userData: Partial<Reader>): Promise<ApiResponse<Reader>> => {
    try {
      const response = await api.put(`/readers/${id}`, userData)
      return response.data
    } catch (error) {
      console.error(`Error al actualizar lector con ID ${id}:`, error)
      throw error
    }
  },

  // Suscriptores
  getAllSuscriptors: async (): Promise<ApiResponse<Suscriptor[]>> => {
    try {
      const response = await api.get("/suscriptors")
      return response.data
    } catch (error) {
      console.error("Error al obtener suscriptores:", error)
      return { success: false, data: [], message: "Error al obtener suscriptores" }
    }
  },

  getSuscriptorById: async (id: number): Promise<ApiResponse<Suscriptor>> => {
    try {
      const response = await api.get(`/suscriptors/${id}`)
      return response.data
    } catch (error) {
      console.error(`Error al obtener suscriptor con ID ${id}:`, error)
      throw error
    }
  },

  createSuscription: async (suscriptionData: {
    reader_id: number
    subscription_type: string
    subscription_date?: string
    expiration_date?: string
    is_active?: boolean
  }): Promise<ApiResponse<Suscriptor>> => {
    try {
      // Asegurarse de que los campos requeridos estén presentes
      const requiredFields = {
        reader_id: suscriptionData.reader_id,
        subscription_type: suscriptionData.subscription_type,
        subscription_date: suscriptionData.subscription_date || new Date().toISOString(),
        // Calcular fecha de expiración (1 mes o 1 año según el tipo)
        expiration_date: suscriptionData.expiration_date || calculateExpirationDate(suscriptionData.subscription_type),
        is_active: suscriptionData.is_active !== undefined ? suscriptionData.is_active : true,
      }

      const response = await api.post("/suscriptors", requiredFields)
      return response.data
    } catch (error) {
      console.error("Error al crear suscripción:", error)
      throw error
    }
  },

  updateSuscription: async (id: number, suscriptionData: Partial<Suscriptor>): Promise<ApiResponse<Suscriptor>> => {
    try {
      const response = await api.put(`/suscriptors/${id}`, suscriptionData)
      return response.data
    } catch (error) {
      console.error(`Error al actualizar suscripción con ID ${id}:`, error)
      throw error
    }
  },

  cancelSuscription: async (id: number): Promise<ApiResponse<any>> => {
    try {
      // En lugar de eliminar, marcamos como inactiva
      const response = await api.put(`/suscriptors/${id}`, { is_active: false })
      return response.data
    } catch (error) {
      console.error(`Error al cancelar suscripción con ID ${id}:`, error)
      throw error
    }
  },

  // Simulación de pago (para propósitos de demostración)
  processPremiumPayment: async (readerId: number, planType: 'mensual' | 'anual'): Promise<{
    success: boolean
    message: string
    subscription?: Suscriptor
  }> => {
    try {
      // Simulamos un proceso de pago exitoso
      console.log(`Procesando pago para plan ${planType} del lector ${readerId}`)
      
      // Crear suscripción después del pago exitoso
      const subscriptionData = {
        reader_id: readerId,
        subscription_type: planType,
      }
      
      const response = await readerService.createSuscription(subscriptionData)
      
      return {
        success: true,
        message: `Pago procesado correctamente. Suscripción ${planType} activada.`,
        subscription: response.data
      }
    } catch (error) {
      console.error("Error al procesar el pago:", error)
      return {
        success: false,
        message: "Error al procesar el pago. Por favor, inténtalo de nuevo."
      }
    }
  },

  // Verificar si un usuario tiene suscripción activa
  checkActiveSuscription: async (readerId: number): Promise<{
    hasActiveSuscription: boolean
    suscription?: Suscriptor
  }> => {
    try {
      const response = await api.get(`/suscriptors`)
      const suscriptions = response.data.data || []
      
      // Filtrar suscripciones por reader_id y is_active
      const activeSuscription = suscriptions.find(
        (sub: Suscriptor) => sub.reader_id === readerId && sub.is_active
      )
      
      return {
        hasActiveSuscription: !!activeSuscription,
        suscription: activeSuscription
      }
    } catch (error) {
      console.error(`Error al verificar suscripción para el lector ${readerId}:`, error)
      return { hasActiveSuscription: false }
    }
  }
}

// Función auxiliar para calcular la fecha de expiración
function calculateExpirationDate(subscriptionType: string): string {
  const now = new Date()
  let expirationDate = new Date(now)
  
  if (subscriptionType === 'anual') {
    expirationDate.setFullYear(now.getFullYear() + 1)
  } else {
    // Por defecto, plan mensual
    expirationDate.setMonth(now.getMonth() + 1)
  }
  
  return expirationDate.toISOString()
}