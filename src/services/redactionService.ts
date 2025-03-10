import api from "./api"
import type { Redaction, RedactionImage, ApiResponse } from "../types/news"

export const redactionService = {
  // Redacciones
  getAllRedactions: async (): Promise<ApiResponse<Redaction[]>> => {
    try {
      const response = await api.get("/redactions")
      return response.data
    } catch (error) {
      console.error("Error al obtener redacciones:", error)
      return { success: false, data: [], message: "Error al obtener redacciones" }
    }
  },

  getRedactionById: async (id: number): Promise<ApiResponse<Redaction>> => {
    try {
      const response = await api.get(`/redactions/${id}`)
      return response.data
    } catch (error) {
      console.error(`Error al obtener redacción con ID ${id}:`, error)
      throw error
    }
  },

  getRedactionsByRedactor: async (redactorId: number): Promise<ApiResponse<Redaction[]>> => {
    try {
      const response = await api.get(`/redactions/redactor/${redactorId}`)
      return response.data
    } catch (error) {
      console.error(`Error al obtener redacciones del redactor ${redactorId}:`, error)
      return { success: false, data: [], message: "Error al obtener redacciones del redactor" }
    }
  },

  createRedaction: async (redactionData: Partial<Redaction>): Promise<ApiResponse<Redaction>> => {
    try {
      const data = {
        redactor_id: redactionData.redactor_id,
        redaction: redactionData.redaction,
        redaction_date: redactionData.redaction_date || new Date().toISOString(),
      }

      const response = await api.post("/redactions", data)
      return response.data
    } catch (error) {
      console.error("Error al crear redacción:", error)
      throw error
    }
  },

  updateRedaction: async (id: number, redactionData: Partial<Redaction>): Promise<ApiResponse<Redaction>> => {
    try {
      const data = {
        redactor_id: redactionData.redactor_id,
        redaction: redactionData.redaction,
        redaction_date: redactionData.redaction_date,
      }

      const response = await api.put(`/redactions/${id}`, data)
      return response.data
    } catch (error) {
      console.error(`Error al actualizar redacción con ID ${id}:`, error)
      throw error
    }
  },

  deleteRedaction: async (id: number): Promise<ApiResponse<any>> => {
    try {
      const response = await api.delete(`/redactions/${id}`)
      return response.data
    } catch (error) {
      console.error(`Error al eliminar redacción con ID ${id}:`, error)
      throw error
    }
  },

  // Imágenes de redacciones
  getRedactionImages: async (redactionId: number): Promise<ApiResponse<RedactionImage[]>> => {
    try {
      const response = await api.get(`/redaction-images/redaction/${redactionId}`)
      return response.data
    } catch (error) {
      console.error(`Error al obtener imágenes de redacción ${redactionId}:`, error)
      return { success: false, data: [], message: "Error al obtener imágenes de redacción" }
    }
  },

  uploadRedactionImage: async (redactionId: number, imageUrl: string): Promise<ApiResponse<RedactionImage>> => {
    try {
      const response = await api.post("/redaction-images", {
        redaction_id: redactionId,
        image: imageUrl,
      })
      return response.data
    } catch (error) {
      console.error("Error al subir imagen de redacción:", error)
      throw error
    }
  },

  updateRedactionImage: async (
    imageId: number,
    redactionId: number,
    imageUrl: string,
  ): Promise<ApiResponse<RedactionImage>> => {
    try {
      const response = await api.put(`/redaction-images/${imageId}`, {
        redaction_id: redactionId,
        image: imageUrl,
      })
      return response.data
    } catch (error) {
      console.error(`Error al actualizar imagen de redacción ${imageId}:`, error)
      throw error
    }
  },

  deleteRedactionImage: async (imageId: number): Promise<ApiResponse<any>> => {
    try {
      const response = await api.delete(`/redaction-images/${imageId}`)
      return response.data
    } catch (error) {
      console.error(`Error al eliminar imagen de redacción ${imageId}:`, error)
      throw error
    }
  },

  deleteAllRedactionImages: async (redactionId: number): Promise<ApiResponse<any>> => {
    try {
      const response = await api.delete(`/redaction-images/redaction/${redactionId}`)
      return response.data
    } catch (error) {
      console.error(`Error al eliminar todas las imágenes de redacción ${redactionId}:`, error)
      throw error
    }
  },
}

