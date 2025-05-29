// TaskMind AI 백엔드 API 타입 정의
export interface User {
  id: string;
  email: string;
  name?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  _id: string;
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dueDate?: string;
  tags: string[];
  userId: string;
  projectId?: string;
  createdAt: string;
  updatedAt: string;
  extractedEntities?: {
    people: string[];
    places: string[];
    organizations: string[];
    dates: string[];
  };
  estimatedDuration?: number;
}

export interface Project {
  _id: string;
  name: string;
  description?: string;
  status: 'active' | 'completed' | 'on_hold';
  userId: string;
  collaborators: string[];
  tasks: Task[];
  createdAt: string;
  updatedAt: string;
}

// LangGraph 워크플로우 결과
export interface WorkflowResult {
  title: string;
  description?: string;
  dueDate?: string;
  priority: Task['priority'];
  tags: string[];
  entities: {
    people: string[];
    places: string[];
    dates: string[];
  };
  confidence: number;
  needsConfirmation: boolean;
  suggestions: string[];
  processingTime?: string;
  workflow?: string;
  model?: string;
}

// API 응답 타입
export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
}

// 자연어 입력 요청
export interface NaturalLanguageTaskRequest {
  input: string;
}

// AI 질문 요청
export interface AiQuestionRequest {
  question: string;
  context?: string;
}

// AI 응답
export interface AiResponse {
  question: string;
  answer: string;
  timestamp: string;
}

// 대시보드 통계
export interface DashboardStats {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  overdueTasks: number;
  upcomingTasks: number;
  completionRate: number;
}

// 프로젝트 인사이트
export interface ProjectInsights {
  summary: string;
  risks: string[];
  suggestions: string[];
  estimatedCompletion?: string;
}

// 검색 결과
export interface SearchResult {
  tasks: Task[];
  projects: Project[];
  total: number;
}

// 인증 관련
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  expiresIn: number;
}
