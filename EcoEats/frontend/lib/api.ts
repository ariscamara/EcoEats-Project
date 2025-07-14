// API utility functions for Django backend integration

// Get CSRF token for Django requests
export function getCsrfToken(): string {
  const name = "csrftoken"
  let cookieValue = ""
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";")
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim()
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1))
        break
      }
    }
  }
  return cookieValue
}

// Base API configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

// API endpoints
export const API_ENDPOINTS = {
  // Inventory endpoints
  inventory: "/inventory/",
  inventoryDetail: (id: string) => `/inventory/${id}/`,
  inventoryMarkUsed: (id: string) => `/inventory/${id}/mark-used/`,
  inventoryMarkDiscarded: (id: string) => `/inventory/${id}/mark-discarded/`,

  // Recipe endpoints
  recipes: "/recipes/",
  recipeDetail: (id: string) => `/recipes/${id}/`,
  recipeSuggestions: "/recipes/suggestions/",

  // User endpoints
  userSettings: "/user/settings/",
  userProfile: "/user/profile/",

  // Authentication endpoints
  login: "/auth/login/",
  logout: "/auth/logout/",
  register: "/auth/register/",
  refreshToken: "/auth/refresh/",
}

// Generic API request function
export async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`

  const defaultHeaders: HeadersInit = {
    "Content-Type": "application/json",
  }

  // Add CSRF token for non-GET requests
  if (options.method && options.method !== "GET") {
    defaultHeaders["X-CSRFToken"] = getCsrfToken()
  }

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
    credentials: "include", // Include cookies for Django session auth
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

export const userAPI = {
  getSettings: () => apiRequest(API_ENDPOINTS.userSettings),
  updateSettings: (data: any) =>
    apiRequest(API_ENDPOINTS.userSettings, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  getProfile: () => apiRequest(API_ENDPOINTS.userProfile),
  updateProfile: (data: any) =>
    apiRequest(API_ENDPOINTS.userProfile, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
}
