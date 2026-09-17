import { ref, computed } from 'vue';
import axios from 'axios';

// Configure Axios globally to support credentials / cookies for Sanctum
axios.defaults.withCredentials = true;

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Global shared state across components
const user = ref(JSON.parse(localStorage.getItem('auth_user') || 'null'));
const loading = ref(false);
const error = ref(null);

export function useAuth() {
  const isAuthenticated = computed(() => !!user.value);
  const userDisplayName = computed(() => {
    if (!user.value) return '';
    return user.value.name || user.value.email || 'Pengguna';
  });

  async function login({ email, password, remember = false }) {
    loading.value = true;
    error.value = null;

    try {
      // 1. Initialize CSRF protection for Sanctum SPA
      try {
        await axios.get(`${apiUrl}/sanctum/csrf-cookie`);
      } catch (csrfErr) {
        console.warn('CSRF cookie endpoint warning:', csrfErr);
      }

      // 2. Submit credentials to Laravel API
      const response = await axios.post(`${apiUrl}/api/login`, {
        email,
        password,
        remember
      });

      const authenticatedUser = response.data?.user || { email, name: email.split('@')[0] };
      user.value = authenticatedUser;
      localStorage.setItem('auth_user', JSON.stringify(authenticatedUser));

      return { success: true, user: authenticatedUser };
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.errors?.email?.[0] ||
        'Email atau kata sandi tidak valid. Pastikan server Laravel sedang berjalan.';
      error.value = message;
      return { success: false, error: message };
    } finally {
      loading.value = false;
    }
  }

  async function logout() {
    loading.value = true;
    try {
      await axios.post(`${apiUrl}/api/logout`);
    } catch (err) {
      console.warn('Logout request completed with warning:', err);
    } finally {
      user.value = null;
      localStorage.removeItem('auth_user');
      loading.value = false;
    }
  }

  async function checkAuth() {
    if (!user.value) return null;
    try {
      const response = await axios.get(`${apiUrl}/api/user`);
      user.value = response.data;
      localStorage.setItem('auth_user', JSON.stringify(response.data));
      return response.data;
    } catch (err) {
      if (err.response?.status === 401) {
        user.value = null;
        localStorage.removeItem('auth_user');
      }
      return null;
    }
  }

  return {
    user,
    isAuthenticated,
    userDisplayName,
    loading,
    error,
    login,
    logout,
    checkAuth
  };
}

