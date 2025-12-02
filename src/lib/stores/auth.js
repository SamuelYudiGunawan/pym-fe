import { writable } from 'svelte/store';
import { API_URL } from '$lib/config.js';

function createAuthStore() {
  const { subscribe, set, update } = writable({
    user: null,
    authenticated: false,
    loading: true
  });

  return {
    subscribe,
    
    // Check if user is logged in
    async checkAuth() {
      try {
        const response = await fetch(`${API_URL}/auth/user/`, {
          credentials: 'include'
        });
        
        if (response.ok) {
          const data = await response.json();
          set({
            user: data.user,
            authenticated: data.authenticated,
            loading: false
          });
        } else {
          set({ user: null, authenticated: false, loading: false });
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        set({ user: null, authenticated: false, loading: false });
      }
    },

    // Login
    async login(username, password) {
      try {
        const response = await fetch(`${API_URL}/auth/login/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (response.ok && data.success) {
          set({
            user: data.user,
            authenticated: true,
            loading: false
          });
          return { success: true };
        } else {
          return { success: false, error: data.error || 'Login failed' };
        }
      } catch (error) {
        return { success: false, error: 'Network error' };
      }
    },

    // Register
    async register(username, password, email) {
      try {
        const response = await fetch(`${API_URL}/auth/register/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ username, password, email })
        });

        const data = await response.json();

        if (response.ok && data.success) {
          set({
            user: data.user,
            authenticated: true,
            loading: false
          });
          return { success: true };
        } else {
          return { success: false, error: data.error || 'Registration failed' };
        }
      } catch (error) {
        return { success: false, error: 'Network error' };
      }
    },

    // Logout
    async logout() {
      try {
        await fetch(`${API_URL}/auth/logout/`, {
          method: 'POST',
          credentials: 'include'
        });
        
        set({ user: null, authenticated: false, loading: false });
        return { success: true };
      } catch (error) {
        return { success: false, error: 'Logout failed' };
      }
    }
  };
}

export const auth = createAuthStore();

