// API Configuration
// 
// Environment Variable Priority:
// 1. VITE_API_URL (set at build time for Docker/K8s)
// 2. Default fallback for local development
//
// For Kubernetes (OKE):
//   - Build with: docker build --build-arg VITE_API_URL=http://<backend-lb-ip>/api .
//   - Or use the in-cluster service: http://django-service/api
//
// For Local Development with ngrok:
//   - Set VITE_API_URL in .env file or environment
//

// Determine the API URL based on environment
const getApiUrl = () => {
  // Check for build-time environment variable
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // For browser-side requests in Kubernetes, try to use the same origin
  if (typeof window !== 'undefined') {
    // If running on a custom port (development), use localhost
    if (window.location.port === '5173') {
      return 'http://localhost:8000/api';
    }
    
    // In production (K8s), API is typically on a different service
    // This fallback is for when VITE_API_URL wasn't set at build time
    return `${window.location.protocol}//${window.location.hostname}:8000/api`;
  }
  
  // Server-side fallback (for SSR in K8s)
  return 'http://django-service/api';
};

export const API_URL = getApiUrl();

// Helper function to make API calls
// Includes ngrok headers for development compatibility
export async function apiFetch(endpoint, options = {}) {
  const url = endpoint.startsWith('http') ? endpoint : `${API_URL}${endpoint}`;
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
    // ngrok header - harmless for non-ngrok environments
    'ngrok-skip-browser-warning': 'true',
  };

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
    credentials: 'include',
  };

  return fetch(url, config);
}

// Export the current environment for debugging
export const IS_DEVELOPMENT = import.meta.env.DEV;
export const IS_PRODUCTION = import.meta.env.PROD;
