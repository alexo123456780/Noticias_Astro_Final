import { create } from "zustand"
import { redactionService } from "../services/redactionService"
import type { Redaction } from "../types/news"

interface RedactionState {
  redactions: Redaction[]
  selectedRedaction: Redaction | null
  loading: boolean
  error: string | null
  fetchRedactions: () => Promise<void>
  fetchRedactionsByRedactor: (redactorId: number) => Promise<void>
  getRedactionById: (id: number) => Promise<void>
  createRedaction: (redactionData: any) => Promise<void>
  updateRedaction: (id: number, redactionData: any) => Promise<void>
  deleteRedaction: (id: number) => Promise<void>
  uploadImage: (redactionId: number, imageFile: File) => Promise<void>
}

export const useRedactionStore = create<RedactionState>((set) => ({
  redactions: [],
  selectedRedaction: null,
  loading: false,
  error: null,

  fetchRedactions: async () => {
    set({ loading: true })
    try {
      const response = await redactionService.getAllRedactions()
      set({ redactions: response.data || [], loading: false })
    } catch (error: any) {
      set({ error: error.message, loading: false })
    }
  },

  fetchRedactionsByRedactor: async (redactorId: number) => {
    set({ loading: true })
    try {
      const response = await redactionService.getRedactionsByRedactor(redactorId)
      set({ redactions: response.data || [], loading: false })
    } catch (error: any) {
      set({ error: error.message, loading: false })
    }
  },

  getRedactionById: async (id: number) => {
    set({ loading: true })
    try {
      const response = await redactionService.getRedactionById(id)
      set({ selectedRedaction: response.data || null, loading: false })
    } catch (error: any) {
      set({ error: error.message, loading: false })
    }
  },

  createRedaction: async (redactionData: any) => {
    set({ loading: true })
    try {
      await redactionService.createRedaction(redactionData)
      const response = await redactionService.getAllRedactions()
      set({ redactions: response.data || [], loading: false })
    } catch (error: any) {
      set({ error: error.message, loading: false })
    }
  },

  updateRedaction: async (id: number, redactionData: any) => {
    set({ loading: true })
    try {
      await redactionService.updateRedaction(id, redactionData)
      const response = await redactionService.getAllRedactions()
      set({ redactions: response.data || [], loading: false })
    } catch (error: any) {
      set({ error: error.message, loading: false })
    }
  },

  deleteRedaction: async (id: number) => {
    set({ loading: true })
    try {
      await redactionService.deleteRedaction(id)
      const response = await redactionService.getAllRedactions()
      set({ redactions: response.data || [], loading: false })
    } catch (error: any) {
      set({ error: error.message, loading: false })
    }
  },

  uploadImage: async (redactionId: number, imageFile: File) => {
    set({ loading: true })
    try {
      // Convertir la imagen a una URL de datos (base64)
      const reader = new FileReader()
      reader.readAsDataURL(imageFile)

      reader.onload = async () => {
        const imageUrl = reader.result as string
        await redactionService.uploadRedactionImage(redactionId, imageUrl)
        const response = await redactionService.getRedactionById(redactionId)
        set({ selectedRedaction: response.data || null, loading: false })
      }
    } catch (error: any) {
      set({ error: error.message, loading: false })
    }
  },
}))

