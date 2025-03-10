import { create } from "zustand"
import { newsService } from "../services/newsService"
import type { News, Category } from "../types/news"

interface NewsState {
  news: News[]
  categories: Category[]
  selectedNews: News | null
  loading: boolean
  error: string | null
  fetchNews: () => Promise<void>
  fetchCategories: () => Promise<void>
  getNewsById: (id: number) => Promise<void>
  createNews: (newsData: Partial<News>) => Promise<void>
  updateNews: (id: number, newsData: Partial<News>) => Promise<void>
  deleteNews: (id: number) => Promise<void>
  uploadImage: (newsId: number, imageFile: File) => Promise<void>
  filterNewsByCategory: (categoryId: number) => Promise<void>
}

export const useNewsStore = create<NewsState>((set, get) => ({
  news: [],
  categories: [],
  selectedNews: null,
  loading: false,
  error: null,

  fetchNews: async () => {
    set({ loading: true })
    try {
      const response = await newsService.getAllNews()
      set({ news: response.data || [], loading: false })
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Error al cargar noticias",
        loading: false,
      })
    }
  },

  fetchCategories: async () => {
    set({ loading: true })
    try {
      const response = await newsService.getAllCategories()
      set({ categories: response.data || [], loading: false })
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Error al cargar categorías",
        loading: false,
      })
    }
  },

  getNewsById: async (id: number) => {
    set({ loading: true })
    try {
      const response = await newsService.getNewsById(id)
      set({ selectedNews: response.data || null, loading: false })
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Error al cargar noticia",
        loading: false,
      })
    }
  },

  createNews: async (newsData: Partial<News>) => {
    set({ loading: true })
    try {
      await newsService.createNews(newsData)
      const response = await newsService.getAllNews()
      set({ news: response.data || [], loading: false })
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Error al crear noticia",
        loading: false,
      })
    }
  },

  updateNews: async (id: number, newsData: Partial<News>) => {
    set({ loading: true })
    try {
      await newsService.updateNews(id, newsData)
      const response = await newsService.getAllNews()
      set({ news: response.data || [], loading: false })
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Error al actualizar noticia",
        loading: false,
      })
    }
  },

  deleteNews: async (id: number) => {
    set({ loading: true })
    try {
      await newsService.deleteNews(id)
      const response = await newsService.getAllNews()
      set({ news: response.data || [], loading: false })
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Error al eliminar noticia",
        loading: false,
      })
    }
  },

  uploadImage: async (newsId: number, imageFile: File) => {
    set({ loading: true })
    try {
      // Convertir la imagen a una URL de datos (base64)
      const reader = new FileReader()
      reader.readAsDataURL(imageFile)

      reader.onload = async () => {
        const imageUrl = reader.result as string
        await newsService.uploadNewsImage(newsId, imageUrl)
        const response = await newsService.getNewsById(newsId)
        set({ selectedNews: response.data || null, loading: false })
      }
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Error al subir imagen",
        loading: false,
      })
    }
  },

  filterNewsByCategory: async (categoryId: number) => {
    set({ loading: true })
    try {
      const response = await newsService.getNewsByCategory(categoryId)
      set({ news: response.data || [], loading: false })
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Error al filtrar noticias",
        loading: false,
      })
    }
  },
}))

