import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  withCredentials: true, // Include cookies in requests
});

// Token management
let accessToken = localStorage.getItem('accessToken');

// Request interceptor to add auth header
api.interceptors.request.use(
  (config) => {
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh the token
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/refresh-token`,
          {},
          { withCredentials: true }
        );

        const { accessToken: newAccessToken } = response.data;
        
        // Update stored token
        accessToken = newAccessToken;
        localStorage.setItem('accessToken', newAccessToken);

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed, redirect to login
        accessToken = null;
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        
        // Only redirect if we're not already on login/register pages
        if (!window.location.pathname.includes('/login') && 
            !window.location.pathname.includes('/register')) {
          window.location.href = '/login';
        }
        
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Auth utility functions
export const authUtils = {
  // Set access token
  setAccessToken: (token) => {
    accessToken = token;
    localStorage.setItem('accessToken', token);
  },

  // Get access token
  getAccessToken: () => {
    return accessToken || localStorage.getItem('accessToken');
  },

  // Clear tokens
  clearTokens: () => {
    accessToken = null;
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!authUtils.getAccessToken();
  },

  // Login
  login: async (email, password) => {
    try {
      const response = await api.post('/login', { email, password });
      const { accessToken: newAccessToken, user } = response.data;
      
      authUtils.setAccessToken(newAccessToken);
      localStorage.setItem('user', JSON.stringify(user));
      
      return { success: true, user };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Login failed' 
      };
    }
  },

  // Register
  register: async (username, email, password) => {
    try {
      const response = await api.post('/register', { username, email, password });
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Registration failed' 
      };
    }
  },

  // Logout
  logout: async () => {
    try {
      await api.post('/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      authUtils.clearTokens();
    }
  },

  // Get user profile
  getProfile: async () => {
    try {
      const response = await api.get('/profile');
      return { success: true, user: response.data.user };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to get profile' 
      };
    }
  },

  // Get stored user
  getStoredUser: () => {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch (error) {
      return null;
    }
  }
};

export default api;