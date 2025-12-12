/**
 * API Client for communicating with Spring Cloud Gateway
 * 
 * Configuration:
 * - Set VITE_API_BASE_URL in .env.development (default: http://localhost:8080)
 * - In development, Vite proxy forwards requests to the gateway
 * - Supports Firebase auth token in Authorization header
 */

// Get the API base URL from environment
const getApiUrl = (): string => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  if (!baseUrl) {
    console.warn('VITE_API_BASE_URL is not set. API calls may fail or use relative paths.');
    return ''; // Use relative paths (works with Vite proxy in dev)
  }
  return baseUrl;
};

// Store for auth token (set by auth context)
let authToken: string | null = null;

/**
 * Set the auth token for API requests
 * Call this after user login with Firebase idToken
 */
export const setAuthToken = (token: string | null): void => {
  authToken = token;
};

/**
 * Get the auth token (for debugging)
 */
export const getAuthToken = (): string | null => authToken;

// Build headers for API requests
const getHeaders = (): HeadersInit => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  // Add auth header if token is set
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  return headers;
};

/**
 * Centralized API client for all backend requests
 */
export const api = {
  /**
   * GET request
   */
  get: async <T>(endpoint: string): Promise<T> => {
    const headers = getHeaders();
    const url = `${getApiUrl()}${endpoint}`;

    const response = await fetch(url, {
      method: 'GET',
      headers,
      credentials: 'include', // Send cookies if needed
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`GET ${endpoint} failed: ${response.status} ${response.statusText} - ${errorText}`);
    }

    return response.json();
  },

  /**
   * POST request
   */
  post: async <T>(endpoint: string, body: unknown): Promise<T> => {
    const headers = getHeaders();
    const url = `${getApiUrl()}${endpoint}`;

    const response = await fetch(url, {
      method: 'POST',
      headers,
      credentials: 'include',
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('API POST Error:', errorBody);
      throw new Error(`POST ${endpoint} failed: ${response.status} ${response.statusText}`);
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return response.json();
    }

    return {} as T;
  },

  /**
   * PUT request
   */
  put: async <T>(endpoint: string, body: unknown): Promise<T> => {
    const headers = getHeaders();
    const url = `${getApiUrl()}${endpoint}`;

    const response = await fetch(url, {
      method: 'PUT',
      headers,
      credentials: 'include',
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('API PUT Error:', errorBody);
      throw new Error(`PUT ${endpoint} failed: ${response.status} ${response.statusText}`);
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return response.json();
    }

    return {} as T;
  },

  /**
   * DELETE request
   */
  delete: async <T>(endpoint: string): Promise<T> => {
    const headers = getHeaders();
    const url = `${getApiUrl()}${endpoint}`;

    const response = await fetch(url, {
      method: 'DELETE',
      headers,
      credentials: 'include',
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('API DELETE Error:', errorBody);
      throw new Error(`DELETE ${endpoint} failed: ${response.status} ${response.statusText}`);
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return response.json();
    }

    return {} as T;
  },
};
