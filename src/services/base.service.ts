import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

// Base API Service
export abstract class BaseApiService {
  protected client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002',
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        const token = this.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          this.handleUnauthorized();
        }
        return Promise.reject(error);
      }
    );
  }

  protected getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('access_token');
    }
    return null;
  }

  protected setToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', token);
    }
  }

  protected removeToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
    }
  }

  protected handleUnauthorized(): void {
    this.removeToken();
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }

  protected async handleRequest<T>(request: Promise<any>): Promise<T> {
    try {
      const response = await request;
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message);
    }
  }
}

// Repository Pattern Interface
export interface IRepository<T, CreateDto, UpdateDto> {
  findAll(query?: any): Promise<T[]>;
  findById(id: string): Promise<T>;
  create(data: CreateDto): Promise<T>;
  update(id: string, data: UpdateDto): Promise<T>;
  delete(id: string): Promise<void>;
}
