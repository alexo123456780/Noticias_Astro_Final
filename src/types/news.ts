export interface News {
    id: number
    title: string
    content: string
    editor_id: number
    redaction_id: number
    principal_image?: string
    publication_date: string
    isPremium: boolean
    is_featured?: boolean
    categories?: Category[] | number[] | string[]
    editor?: {
      id: number
      name: string
    }
    created_at?: string
    updated_at?: string
  }
  
  export interface Category {
    id: number
    category: string
    news_count?: number
  }
  
  export interface NewsImage {
    id: number
    new_id: number
    image: string
    created_at?: string
    updated_at?: string
  }
  
  export interface Redaction {
    id: number
    redactor_id: number
    redaction: string
    redaction_date: string
    created_at?: string
    updated_at?: string
    redactor?: {
      id: number
      name: string
    }
  }
  
  export interface RedactionImage {
    id: number
    redaction_id: number
    image: string
    created_at?: string
    updated_at?: string
  }
  
  export interface ApiResponse<T> {
    data?: T
    success?: boolean
    message?: string
    status?: string
  }
  
  