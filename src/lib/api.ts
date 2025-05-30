import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'
import {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  Task,
  CreateTaskRequest,
  CreateTaskFromNaturalLanguageRequest,
  UpdateTaskRequest,
  TaskQuery,
  TaskStats,
  Project,
  CreateProjectRequest,
  UpdateProjectRequest,
  ProjectQuery,
  ProjectStats,
  AskQuestionRequest,
  AskQuestionResponse,
  TestWorkflowRequest,
  CreateTaskWorkflowRequest,
  ConversationRequest,
  ProjectAnalysisRequest,
  SuggestPriorityRequest,
  AnalyzePatternsRequest,
  ProjectInsightsRequest,
  AICapabilities,
} from '@/types'

class ApiClient {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('access_token')
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Unauthorized - clear token and redirect to login
          localStorage.removeItem('access_token')
          localStorage.removeItem('user')
          window.location.href = '/login'
        }
        return Promise.reject(error)
      }
    )
  }

  // Auth endpoints
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await this.client.post('/auth/login', data)
    return response.data
  }

  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await this.client.post('/auth/register', data)
    return response.data
  }

  // Task endpoints
  async getTasks(query?: TaskQuery): Promise<Task[]> {
    const response = await this.client.get('/tasks', { params: query })
    return response.data
  }

  async getTask(id: string): Promise<Task> {
    const response = await this.client.get(`/tasks/${id}`)
    return response.data
  }

  async createTask(data: CreateTaskRequest): Promise<Task> {
    const response = await this.client.post('/tasks', data)
    return response.data
  }

  async createTaskFromNaturalLanguage(data: CreateTaskFromNaturalLanguageRequest): Promise<Task> {
    const response = await this.client.post('/tasks/natural-language', data)
    return response.data
  }

  async updateTask(id: string, data: UpdateTaskRequest): Promise<Task> {
    const response = await this.client.patch(`/tasks/${id}`, data)
    return response.data
  }

  async deleteTask(id: string): Promise<void> {
    await this.client.delete(`/tasks/${id}`)
  }

  async getTaskStats(): Promise<TaskStats> {
    const response = await this.client.get('/tasks/stats')
    return response.data
  }

  async getDueTodayTasks(): Promise<Task[]> {
    const response = await this.client.get('/tasks/due-today')
    return response.data
  }

  async getOverdueTasks(): Promise<Task[]> {
    const response = await this.client.get('/tasks/overdue')
    return response.data
  }

  async getUpcomingTasks(days: number = 7): Promise<Task[]> {
    const response = await this.client.get('/tasks/upcoming', { params: { days } })
    return response.data
  }

  async suggestTaskPriority(id: string): Promise<any> {
    const response = await this.client.get(`/tasks/${id}/suggest-priority`)
    return response.data
  }

  async bulkUpdateTasks(taskIds: string[], updateData: UpdateTaskRequest): Promise<Task[]> {
    const response = await this.client.patch('/tasks/bulk', { taskIds, updateData })
    return response.data
  }

  // Project endpoints
  async getProjects(query?: ProjectQuery): Promise<Project[]> {
    const response = await this.client.get('/projects', { params: query })
    return response.data
  }

  async getProject(id: string): Promise<Project> {
    const response = await this.client.get(`/projects/${id}`)
    return response.data
  }

  async createProject(data: CreateProjectRequest): Promise<Project> {
    const response = await this.client.post('/projects', data)
    return response.data
  }

  async updateProject(id: string, data: UpdateProjectRequest): Promise<Project> {
    const response = await this.client.patch(`/projects/${id}`, data)
    return response.data
  }

  async deleteProject(id: string): Promise<void> {
    await this.client.delete(`/projects/${id}`)
  }

  async getUserProjects(): Promise<Project[]> {
    const response = await this.client.get('/projects/overview')
    return response.data
  }

  async getProjectTasks(id: string): Promise<Task[]> {
    const response = await this.client.get(`/projects/${id}/tasks`)
    return response.data
  }

  async getProjectStats(id: string): Promise<ProjectStats> {
    const response = await this.client.get(`/projects/${id}/stats`)
    return response.data
  }

  async getProjectInsights(id: string): Promise<any> {
    const response = await this.client.get(`/projects/${id}/insights`)
    return response.data
  }

  // AI endpoints
  async askQuestion(data: AskQuestionRequest): Promise<AskQuestionResponse> {
    const response = await this.client.post('/ai/ask', data)
    return response.data
  }

  async testWorkflow(data: TestWorkflowRequest): Promise<any> {
    const response = await this.client.post('/ai/test-workflow', data)
    return response.data
  }

  async createTaskWorkflow(data: CreateTaskWorkflowRequest): Promise<any> {
    const response = await this.client.post('/ai/create-task-workflow', data)
    return response.data
  }

  async advancedTaskCreation(data: CreateTaskWorkflowRequest): Promise<any> {
    const response = await this.client.post('/ai/advanced-task-creation', data)
    return response.data
  }

  async conversation(data: ConversationRequest): Promise<any> {
    const response = await this.client.post('/ai/conversation', data)
    return response.data
  }

  async analyzeProject(data: ProjectAnalysisRequest): Promise<any> {
    const response = await this.client.post('/ai/analyze-project', data)
    return response.data
  }

  async parseTask(data: TestWorkflowRequest): Promise<any> {
    const response = await this.client.post('/ai/parse-task', data)
    return response.data
  }

  async suggestPriority(data: SuggestPriorityRequest): Promise<any> {
    const response = await this.client.post('/ai/suggest-priority', data)
    return response.data
  }

  async analyzePatterns(data: AnalyzePatternsRequest): Promise<any> {
    const response = await this.client.post('/ai/analyze-patterns', data)
    return response.data
  }

  async projectInsights(data: ProjectInsightsRequest): Promise<any> {
    const response = await this.client.post('/ai/project-insights', data)
    return response.data
  }

  async getAIHealth(): Promise<any> {
    const response = await this.client.get('/ai/health')
    return response.data
  }

  async getAICapabilities(): Promise<AICapabilities> {
    const response = await this.client.get('/ai/capabilities')
    return response.data
  }
}

export const apiClient = new ApiClient()
export default apiClient
