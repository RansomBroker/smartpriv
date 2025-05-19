import { createContext, useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Create axios instance with base URL
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const authService = {
  async login(username, password) {
    try {
      const response = await api.post('/auth', { username, password });
      const { token, user } = response.data;
      
      // Store auth data
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      return { success: true, user };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Login failed'
      };
    }
  },

  async logout() {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear auth data regardless of API call success
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      localStorage.removeItem('level');
      localStorage.removeItem('user_id');
      localStorage.removeItem('user_nama');
      localStorage.removeItem('user_nohp');
      localStorage.removeItem('user_alamat');
    }
  },

  async checkAuth() {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) return { isAuthenticated: false };

      const response = await api.get('/auth/me');
      return { 
        isAuthenticated: true, 
        user: response.data 
      };
    } catch (error) {
      console.error('Auth check error:', error);
      return { isAuthenticated: false };
    }
  },

  getStoredUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated() {
    return !!localStorage.getItem('authToken');
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const initAuth = async () => {
      try {
        const { isAuthenticated, user } = await authService.checkAuth();
        if (isAuthenticated) {
          setUser(user);
        } else {
          // Just clear any stale auth data without redirecting
          authService.logout();
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        // Just clear any stale auth data without redirecting
        authService.logout();
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, [navigate]);

  const login = async (username, password) => {
    const result = await authService.login(username, password);
    if (result.success) {
      setUser(result.user);
    }
    return result;
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    navigate('/');
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: authService.isAuthenticated
  };

  if (loading) {
    return <div>Loading...</div>; // You can replace this with a proper loading component
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}