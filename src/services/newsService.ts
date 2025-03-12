import api from "./api"
import type { News, Category, NewsImage, ApiResponse } from "../types/news"

export const newsService = {
  // Noticias
  getAllNews: async (): Promise<ApiResponse<News[]>> => {
    try {
      const response = await api.get("/news")
      return {
        success: true,
        data: Array.isArray(response.data) ? response.data : response.data.data || [],
        message: "Noticias obtenidas exitosamente"
      }
    } catch (error) {
      console.error("Error al obtener noticias:", error)
      return { success: false, data: [], message: "Error al obtener noticias" }
    }
  },

  getNewsById: async (id: number): Promise<ApiResponse<News>> => {
    try {
      const response = await api.get(`/news/${id}`)
      return {
        success: true,
        data: response.data.data || response.data,
        message: "Noticia obtenida exitosamente"
      }
    } catch (error) {
      console.error(`Error al obtener noticia con ID ${id}:`, error)
      throw error
    }
  },

  createNews: async (newsData: Partial<News>): Promise<ApiResponse<News>> => {
    try {
      const requiredFields = {
        title: newsData.title,
        content: newsData.content,
        editor_id: newsData.editor_id || 1, 
        redaction_id: newsData.redaction_id || 1, 
        principal_image: newsData.principal_image || "https://via.placeholder.com/800x400",
        publication_date: newsData.publication_date || new Date().toISOString(),
        isPremium: newsData.isPremium || false,
      }

      const response = await api.post("/news", requiredFields)

      if (newsData.categories && Array.isArray(newsData.categories) && newsData.categories.length > 0) {
        const newId = response.data?.data?.id
        if (newId) {
          await Promise.all(
            newsData.categories.map((categoryId) =>
              api.post("/news-category", {
                new_id: newId,
                category_id: Number(categoryId),
              }),
            ),
          )
        }
      }

      return response.data
    } catch (error) {
      console.error("Error al crear noticia:", error)
      throw error
    }
  },

  updateNews: async (id: number, newsData: Partial<News>): Promise<ApiResponse<News>> => {
    try {
      // Obtener la noticia actual para mantener los campos que no se actualizan
      const currentNews = await newsService.getNewsById(id)

      // Preparar los datos para la actualización
      const updateData = {
        title: newsData.title || currentNews.data?.title || "",
        content: newsData.content || currentNews.data?.content || "",
        editor_id: newsData.editor_id || currentNews.data?.editor_id || 1,
        redaction_id: newsData.redaction_id || currentNews.data?.redaction_id || 1,
        principal_image: newsData.principal_image || currentNews.data?.principal_image || "",
        publication_date: newsData.publication_date || currentNews.data?.publication_date || new Date().toISOString(),
        isPremium: newsData.isPremium !== undefined ? newsData.isPremium : currentNews.data?.isPremium || false,
      }

      const response = await api.put(`/news/${id}`, updateData)

      // Si hay categorías, actualizar las asociaciones
      if (newsData.categories && Array.isArray(newsData.categories)) {
        // Primero obtener las categorías actuales
        const currentCategories = await newsService.getCategoriesByNews(id)

        // Eliminar las categorías actuales
        if (currentCategories.data && Array.isArray(currentCategories.data)) {
          await Promise.all(currentCategories.data.map((cat: any) => api.delete(`/news-category/${cat.id}`)))
        }

        // Agregar las nuevas categorías
        await Promise.all(
          newsData.categories.map((categoryId) =>
            api.post("/news-category", {
              new_id: id,
              category_id: Number(categoryId),
            }),
          ),
        )
      }

      return response.data
    } catch (error) {
      console.error(`Error al actualizar noticia con ID ${id}:`, error)
      throw error
    }
  },

  deleteNews: async (id: number): Promise<ApiResponse<any>> => {
    try {
      const response = await api.delete(`/news/${id}`)
      return response.data
    } catch (error) {
      console.error(`Error al eliminar noticia con ID ${id}:`, error)
      throw error
    }
  },

  // Categorías
  getAllCategories: async (): Promise<ApiResponse<Category[]>> => {
    try {
      const response = await api.get("/categories")
      return response.data
    } catch (error) {
      console.error("Error al obtener categorías:", error)
      return { success: false, data: [], message: "Error al obtener categorías" }
    }
  },

  getCategoryById: async (id: number): Promise<ApiResponse<Category>> => {
    try {
      const response = await api.get(`/categories/${id}`)
      return response.data
    } catch (error) {
      console.error(`Error al obtener categoría con ID ${id}:`, error)
      throw error
    }
  },

  createCategory: async (categoryData: Partial<Category>): Promise<ApiResponse<Category>> => {
    try {
      const response = await api.post("/categories", categoryData)
      return response.data
    } catch (error) {
      console.error("Error al crear categoría:", error)
      throw error
    }
  },

  updateCategory: async (id: number, categoryData: Partial<Category>): Promise<ApiResponse<Category>> => {
    try {
      const response = await api.put(`/categories/${id}`, categoryData)
      return response.data
    } catch (error) {
      console.error(`Error al actualizar categoría con ID ${id}:`, error)
      throw error
    }
  },

  deleteCategory: async (id: number): Promise<ApiResponse<any>> => {
    try {
      const response = await api.delete(`/categories/${id}`)
      return response.data
    } catch (error) {
      console.error(`Error al eliminar categoría con ID ${id}:`, error)
      throw error
    }
  },

  // Relaciones entre noticias y categorías
  getNewsByCategory: async (categoryId: number): Promise<ApiResponse<News[]>> => {
    try {
      const response = await api.get(`/news-category/category/${categoryId}`)
      return response.data
    } catch (error) {
      console.error(`Error al obtener noticias por categoría ${categoryId}:`, error)
      return { success: false, data: [], message: "Error al obtener noticias por categoría" }
    }
  },

  getCategoriesByNews: async (newsId: number): Promise<ApiResponse<Category[]>> => {
    try {
      const response = await api.get(`/news-category/news/${newsId}`)
      return response.data
    } catch (error) {
      console.error(`Error al obtener categorías por noticia ${newsId}:`, error)
      return { success: false, data: [], message: "Error al obtener categorías por noticia" }
    }
  },

  addNewsToCategory: async (newsId: number, categoryId: number): Promise<ApiResponse<any>> => {
    try {
      const response = await api.post("/news-category", {
        new_id: newsId,
        category_id: categoryId,
      })
      return response.data
    } catch (error) {
      console.error(`Error al añadir noticia ${newsId} a categoría ${categoryId}:`, error)
      throw error
    }
  },

  removeNewsFromCategory: async (relationId: number): Promise<ApiResponse<any>> => {
    try {
      const response = await api.delete(`/news-category/${relationId}`)
      return response.data
    } catch (error) {
      console.error(`Error al eliminar relación ${relationId}:`, error)
      throw error
    }
  },

  // Imágenes de noticias
  getNewsImages: async (newsId: number): Promise<ApiResponse<NewsImage[]>> => {
    try {
      const response = await api.get(`/news-images/news/${newsId}`)
      return response.data
    } catch (error) {
      console.error(`Error al obtener imágenes de noticia ${newsId}:`, error)
      return { success: false, data: [], message: "Error al obtener imágenes de noticia" }
    }
  },

  uploadNewsImage: async (newsId: number, imageUrl: string): Promise<ApiResponse<NewsImage>> => {
    try {
      const response = await api.post("/news-images", {
        new_id: newsId,
        image: imageUrl,
      })
      return response.data
    } catch (error) {
      console.error("Error al subir imagen:", error)
      throw error
    }
  },

  updateNewsImage: async (imageId: number, newsId: number, imageUrl: string): Promise<ApiResponse<NewsImage>> => {
    try {
      const response = await api.put(`/news-images/${imageId}`, {
        new_id: newsId,
        image: imageUrl,
      })
      return response.data
    } catch (error) {
      console.error(`Error al actualizar imagen ${imageId}:`, error)
      throw error
    }
  },

  deleteNewsImage: async (imageId: number): Promise<ApiResponse<any>> => {
    try {
      const response = await api.delete(`/news-images/${imageId}`)
      return response.data
    } catch (error) {
      console.error(`Error al eliminar imagen ${imageId}:`, error)
      throw error
    }
  },

  deleteAllNewsImages: async (newsId: number): Promise<ApiResponse<any>> => {
    try {
      const response = await api.delete(`/news-images/news/${newsId}`)
      return response.data
    } catch (error) {
      console.error(`Error al eliminar todas las imágenes de noticia ${newsId}:`, error)
      throw error
    }
  },
}

