// TaskMind AI API 클라이언트
import { 
  Task, 
  Project, 
  WorkflowResult, 
  NaturalLanguageTaskRequest,
  AiQuestionRequest,
  AiResponse,
  DashboardStats,
  ProjectInsights,
  SearchResult,
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  ApiResponse 
} from './types';

class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api';
    
    // 토큰 초기화 (브라우저에서만)
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('taskmind_token');
    }
  }

  // 헤더 설정
  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    return headers;
  }

  // 기본 fetch 래퍼
  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`API Error: ${response.status} - ${error}`);
    }

    return response.json();
  }

  // 토큰 설정
  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('taskmind_token', token);
    }
  }

  // 토큰 제거
  clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('taskmind_token');
    }
  }

  // 인증 API
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    if (response.token) {
      this.setToken(response.token);
    }
    
    return response;
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  // 할 일 API
  async getTasks(): Promise<Task[]> {
    return this.request<Task[]>('/tasks');
  }

  async getTask(id: string): Promise<Task> {
    return this.request<Task>(`/tasks/${id}`);
  }

  async createTask(task: Partial<Task>): Promise<Task> {
    return this.request<Task>('/tasks', {
      method: 'POST',
      body: JSON.stringify(task),
    });
  }

  // 자연어 할 일 생성 (LangGraph)
  async createTaskFromNaturalLanguage(
    request: NaturalLanguageTaskRequest
  ): Promise<WorkflowResult | { task: WorkflowResult; needsConfirmation: boolean; suggestions: string[] }> {
    return this.request('/tasks/natural-language', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async updateTask(id: string, updates: Partial<Task>): Promise<Task> {
    return this.request<Task>(`/tasks/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }

  async deleteTask(id: string): Promise<void> {
    await this.request(`/tasks/${id}`, {
      method: 'DELETE',
    });
  }

  // 프로젝트 API
  async getProjects(): Promise<Project[]> {
    return this.request<Project[]>('/projects');
  }

  async getProject(id: string): Promise<Project> {
    return this.request<Project>(`/projects/${id}`);
  }

  async getProjectInsights(id: string): Promise<ProjectInsights> {
    return this.request<ProjectInsights>(`/projects/${id}/insights`);
  }

  // AI API
  async askQuestion(request: AiQuestionRequest): Promise<AiResponse> {
    return this.request<AiResponse>('/ai/ask', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  // LangGraph 워크플로우 테스트
  async testWorkflow(input: string): Promise<WorkflowResult> {
    return this.request<WorkflowResult>('/ai/test-workflow', {
      method: 'POST',
      body: JSON.stringify({ input }),
    });
  }

  // 대시보드 통계
  async getDashboardStats(): Promise<DashboardStats> {
    return this.request<DashboardStats>('/tasks/stats');
  }

  // 검색
  async search(query: string): Promise<SearchResult> {
    return this.request<SearchResult>(`/search?q=${encodeURIComponent(query)}`);
  }
}

// 싱글톤 인스턴스
export const apiClient = new ApiClient();
export default apiClient;
