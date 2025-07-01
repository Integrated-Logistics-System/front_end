import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { API_BASE_URL, API_CONFIG } from './constants';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: API_CONFIG.TIMEOUT, // 10분
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // 요청 인터셉터
    this.client.interceptors.request.use(
      (config) => {
        // localStorage에서 토큰 가져오기 (우선순위)
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // 응답 인터셉터
    this.client.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        if (error.response?.status === 401) {
          // localStorage에서 토큰 제거
          if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
          }
          toast.error('로그인이 필요합니다.');
          window.location.href = '/';
        } else if (error.response?.status >= 500) {
          toast.error('서버 오류가 발생했습니다.');
        } else if (error.response?.data?.message) {
          toast.error(error.response.data.message);
        }
        return Promise.reject(error);
      }
    );
  }

  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get(url, config);
    return response.data;
  }

  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post(url, data, config);
    return response.data;
  }

  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.put(url, data, config);
    return response.data;
  }

  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete(url, config);
    return response.data;
  }

  // 긴 처리 시간이 필요한 AI/RAG 요청용
  async postLongRunning<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const extendedConfig = {
      ...config,
      timeout: API_CONFIG.TIMEOUT, // 10분 보장
    };
    const response = await this.client.post(url, data, extendedConfig);
    return response.data;
  }
}

export const apiClient = new ApiClient();
