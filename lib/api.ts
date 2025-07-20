// API utility functions for FastAPI backend integration

// Base API configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://ecoeats-backend.fly.dev"

// API endpoints
export const API_ENDPOINTS = {
  // Inventory endpoints
  inventory: "/api/inventory/",
  inventoryDetail: (id: string) => `/api/inventory/${id}/`,
  inventoryMarkUsed: (id: string) => `/api/inventory/${id}/mark-used/`,
  inventoryMarkDiscarded: (id: string) => `/api/inventory/${id}/mark-discarded/`,

  // Recipe endpoints
  recipes: "/api/recipes/",
  recipeDetail: (id: string) => `/api/recipes/${id}/`,
  recipeSuggestions: "/api/recipes/suggestions/",
}

// Generic API request function
export async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`

  const defaultHeaders: HeadersInit = {
    "Content-Type": "application/json",
  }

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  }

  const response = await fetch(url, config)

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`)
  }

  return response.json()
}

// Specific API functions for different resources
export const inventoryAPI = {
  getAll: () => apiRequest(API_ENDPOINTS.inventory),
  getById: (id: string) => apiRequest(API_ENDPOINTS.inventoryDetail(id)),
  create: (data: any) =>
    apiRequest(API_ENDPOINTS.inventory, {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id: string, data: any) =>
    apiRequest(API_ENDPOINTS.inventoryDetail(id), {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    apiRequest(API_ENDPOINTS.inventoryDetail(id), {
      method: "DELETE",
    }),
  markUsed: (id: string) =>
    apiRequest(API_ENDPOINTS.inventoryMarkUsed(id), {
      method: "POST",
    }),
  markDiscarded: (id: string) =>
    apiRequest(API_ENDPOINTS.inventoryMarkDiscarded(id), {
      method: "POST",
    }),
}

export const recipeAPI = {
  getAll: () => apiRequest(API_ENDPOINTS.recipes),
  getById: (id: string) => apiRequest(API_ENDPOINTS.recipeDetail(id)),
  getSuggestions: () => apiRequest(API_ENDPOINTS.recipeSuggestions),
}
