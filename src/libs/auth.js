import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// API base URL
const API_BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://api.smartprivate.web.id"
    : "http://localhost:3000";

// Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Tambahkan token ke setiap request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Context & hook
export const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Ambil detail user berdasarkan level
const fetchUserDetail = async (level, id) => {
  try {
    const res = await api.get(`/api/${level}/${id}`);
    console.log("Detail user dari API:", res.data);
    return res.data;
  } catch (error) {
    console.error(`Gagal ambil detail user level ${level}:`, error);
    return {};
  }
};

// Service auth
export const authService = {
  async login(username, password) {
    try {
      const response = await api.post("/api/auth", { username, password });
      const { token, user } = response.data;
      console.log("User dari login API:", response.data);

      localStorage.setItem("authToken", token);

      // Ambil detail user (misalnya nama)
      const detail = await fetchUserDetail(user.level, user.id);

      // Gabungkan data login + detail
      const userWithDetail = { ...user, ...detail };
      console.log("User lengkap dengan nama:", userWithDetail);

      localStorage.setItem("user", JSON.stringify(userWithDetail));
      return { success: true, user: userWithDetail };
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        error: error.response?.data?.message || "Login gagal",
      };
    }
  },

  async logout() {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
  },

  async checkAuth() {
    const token = localStorage.getItem("authToken");
    const user = this.getStoredUser();
    return {
      isAuthenticated: !!token && !!user,
      user,
    };
  },

  getStoredUser() {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated() {
    return !!localStorage.getItem("authToken");
  },
};

// Provider
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("authToken");
      const storedUser = authService.getStoredUser();

      if (token && storedUser) {
        setUser(storedUser);
      } else {
        await authService.logout();
        setUser(null);
      }
      setLoading(false);
    };

    initAuth();
  }, []);

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

  if (loading) return null;

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
