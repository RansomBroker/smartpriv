import { createContext, useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Define API base URL based on environment
const API_BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://api.smartprivate.web.id/api"
    : "/api"; // For development, proxy will be used, ensure this matches existing logic for instance

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_BASE_URL, // Use the dynamic API_BASE_URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const authService = {
  async login(username, password) {
    try {
      const response = await api.post("/auth", { username, password });
      const { token, user } = response.data;

      // Store auth data
      localStorage.setItem("authToken", token);
      localStorage.setItem("user", JSON.stringify(user));

      return { success: true, user };
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        error: error.response?.data?.message || "Login failed",
      };
    }
  },

  async logout() {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear auth data regardless of API call success
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      localStorage.removeItem("level");
      localStorage.removeItem("user_id");
      localStorage.removeItem("user_nama");
      localStorage.removeItem("user_nohp");
      localStorage.removeItem("user_alamat");
    }
  },

  async checkAuth() {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) return { isAuthenticated: false };

      const response = await api.get("/auth/me");
      return {
        isAuthenticated: true,
        user: response.data,
      };
    } catch (error) {
      console.error("Auth check error:", error);
      return { isAuthenticated: false };
    }
  },

  getStoredUser() {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated() {
    return !!localStorage.getItem("authToken");
  },
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const initAuth = async () => {
      try {
        // First check if we have stored user data
        const storedUser = authService.getStoredUser();
        const token = localStorage.getItem("authToken");

        if (token && storedUser) {
          // If we have both token and stored user, set it immediately
          setUser(storedUser);

          // Then verify with API in the background
          try {
            const response = await api.get("/auth/me");
            setUser(response.data);
          } catch (error) {
            console.error("Auth verification failed:", error);
            // Only logout if token is invalid
            if (error.response?.status === 401) {
              authService.logout();
              setUser(null);
            }
          }
        } else {
          // No stored data, clear any stale data
          authService.logout();
          setUser(null);
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        authService.logout();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []); // Remove navigate dependency to prevent unnecessary re-renders

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
    navigate("/");
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: authService.isAuthenticated,
  };

  // Don't render anything during initial loading
  if (loading) {
    return null;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
