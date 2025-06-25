import axios, { AxiosInstance } from 'axios';

class RecipeService {
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
        const token = localStorage.getItem('auth_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user_data');
          window.location.href = '/auth/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Search recipes
  async searchRecipes(query: string, filters?: any) {
    try {
      const response = await this.api.post('/recipe/search', {
        query,
        ...filters,
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || '레시피 검색 실패');
    }
  }

  // Get recipe detail
  async getRecipeDetail(recipeId: string) {
    try {
      const response = await this.api.get(`/recipe/detail/${recipeId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || '레시피 상세 조회 실패');
    }
  }

  // Get recipe steps (if separate endpoint exists)
  async getRecipeSteps(recipeId: string) {
    try {
      const response = await this.api.get(`/recipe/steps/${recipeId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || '레시피 단계 조회 실패');
    }
  }

  // Chat-based recipe search
  async chatSearch(message: string, userId?: string) {
    try {
      const response = await this.api.post('/recipe/chat', {
        message,
        userId,
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'AI 채팅 검색 실패');
    }
  }

  // Smart search with LangChain
  async smartSearch(query: string, userId?: string) {
    try {
      const response = await this.api.post('/langchain/search', {
        query,
        userId,
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || '스마트 검색 실패');
    }
  }

  // Get chat history
  async getChatHistory(userId: string) {
    try {
      const response = await this.api.get(`/langchain/chat-history/${userId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || '채팅 기록 조회 실패');
    }
  }

  // Clear chat history
  async clearChatHistory(userId: string) {
    try {
      const response = await this.api.delete(`/langchain/chat-history/${userId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || '채팅 기록 삭제 실패');
    }
  }
}

export const recipeService = new RecipeService();
