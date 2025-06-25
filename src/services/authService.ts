import axios, { AxiosInstance } from 'axios';
import { User } from '@/store/authStore';

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  user?: User;
  token?: string;
  error?: string;
  message?: string;
}

class AuthService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081/api',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      (config) => {
        if (typeof window !== 'undefined') {
          const token = localStorage.getItem('auth_token');
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401 && typeof window !== 'undefined') {
          // Unauthorized - clear local storage and redirect to home
          localStorage.removeItem('auth_token');
          window.location.href = '/';
        }
        return Promise.reject(error);
      }
    );
  }

  // Login
  async login(email: string, password: string): Promise<ApiResponse> {
    try {
      const response = await this.api.post('/auth/login', {
        email,
        password,
      });
      
      return {
        success: true,
        user: response.data.user,
        token: response.data.token,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || error.message || '로그인에 실패했습니다.',
      };
    }
  }

  // Register
  async register(email: string, password: string, name: string): Promise<ApiResponse> {
    try {
      const response = await this.api.post('/auth/register', {
        email,
        password,
        name,
      });
      
      return {
        success: true,
        user: response.data.user,
        token: response.data.token,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || error.message || '회원가입에 실패했습니다.',
      };
    }
  }

  // Get Profile
  async getProfile(token?: string): Promise<ApiResponse> {
    try {
      const headers: any = {};
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
      
      const response = await this.api.get('/auth/profile', { headers });
      
      return {
        success: true,
        user: response.data.user || response.data,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || error.message || '프로필 조회에 실패했습니다.',
      };
    }
  }

  // Update Profile
  async updateProfile(profileData: Partial<User>): Promise<ApiResponse> {
    try {
      const response = await this.api.put('/auth/profile', profileData);
      
      return {
        success: true,
        user: response.data.user || response.data,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || error.message || '프로필 업데이트에 실패했습니다.',
      };
    }
  }

  // Verify Token
  async verifyToken(token: string): Promise<ApiResponse> {
    try {
      const response = await this.api.get('/auth/verify', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      return {
        success: true,
        user: response.data.user || response.data,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || error.message || '토큰 검증에 실패했습니다.',
      };
    }
  }

  // Logout (clear client-side data)
  logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  }
}

export const authService = new AuthService();
