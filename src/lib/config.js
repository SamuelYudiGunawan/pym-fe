// API Configuration
// 
// For Vercel: Set VITE_API_URL environment variable to your ngrok URL
// Example: https://unrationed-nondisparate-sharmaine.ngrok-free.dev/api

export const API_URL = import.meta.env.VITE_API_URL || 'https://unrationed-nondisparate-sharmaine.ngrok-free.dev/api';

// Helper function to make API calls with ngrok headers
export async function apiFetch(endpoint, options = {}) {
  const url = endpoint.startsWith('http') ? endpoint : `${API_URL}${endpoint}`;
  
  const defaultHeaders = {
    'ngrok-skip-browser-warning': 'true',
    'Content-Type': 'application/json',
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
