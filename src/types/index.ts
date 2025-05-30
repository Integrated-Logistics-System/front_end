// Auth Types
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  avatar?: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

// Task Types
export enum TaskStatus {
  TODO = "todo",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

export enum TaskPriority {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  URGENT = "urgent",
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  userId: string;
  projectId?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
  completedAt?: string;
  tags: string[];
  aiMetadata: {
    extractedEntities?: {
      people?: string[];
      places?: string[];
      organizations?: string[];
      dates?: string[];
    };
    suggestedPriority?: TaskPriority;
    estimatedDuration?: number;
    relatedTasks?: string[];
    confidence?: number;
  };
  subtasks: {
    title: string;
    completed: boolean;
    completedAt?: string;
  }[];
  reminderAt?: string;
  isArchived: boolean;
  originalInput?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
  projectId?: string;
  priority?: TaskPriority;
  dueDate?: string;
  tags?: string[];
  reminderAt?: string;
  originalInput?: string;
}

export interface CreateTaskFromNaturalLanguageRequest {
  input: string;
  projectId?: string;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string;
  tags?: string[];
  reminderAt?: string;
  isArchived?: boolean;
  completedAt?: string;
}

export interface TaskQuery {
  status?: TaskStatus;
  priority?: TaskPriority;
  projectId?: string;
  tags?: string[];
  search?: string;
  isArchived?: boolean;
  dueBefore?: string;
  dueAfter?: string;
}

export interface TaskStats {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  overdueTasks: number;
  completionRate: number;
}

// Project Types
export interface Project {
  id: string;
  name: string;
  description?: string;
  color?: string;
  userId: string;
  taskCount: number;
  completedTaskCount: number;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectRequest {
  name: string;
  description?: string;
  color?: string;
}

export interface UpdateProjectRequest {
  name?: string;
  description?: string;
  color?: string;
  isArchived?: boolean;
}

export interface ProjectQuery {
  search?: string;
  isArchived?: boolean;
}

export interface ProjectStats {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  overdueTasks: number;
  recentActivity: string[];
}

// AI Types
export interface AskQuestionRequest {
  question: string;
  context?: string;
}

export interface AskQuestionResponse {
  question: string;
  answer: string;
  timestamp: string;
}

export interface TestWorkflowRequest {
  input: string;
}

export interface CreateTaskWorkflowRequest {
  input: string;
  userId: string;
}

export interface ConversationRequest {
  message: string;
  conversationHistory?: any[];
  context?: any;
}

export interface ProjectAnalysisRequest {
  projectId: string;
  userId: string;
}

export interface SuggestPriorityRequest {
  title: string;
  description?: string;
  dueDate?: string;
  tags?: string[];
}

export interface AnalyzePatternsRequest {
  tasks: Task[];
}

export interface ProjectInsightsRequest {
  totalTasks: number;
  completedTasks: number;
  overdueTasks: number;
  upcomingDeadlines: string[];
  recentActivity: string[];
}

export interface WorkflowCapability {
  name: string;
  description: string;
  endpoint: string;
  type: string;
}

export interface AICapabilities {
  workflows: WorkflowCapability[];
  features: string[];
  models: {
    default: string;
    supported: string[];
  };
}

// Common Types
export interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  error?: string;
  status?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
