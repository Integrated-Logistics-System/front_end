// Base Model Interface
export interface IModel {
  id?: string;
  createdAt?: string;
  updatedAt?: string;
}

// User Model
export interface UserModel extends IModel {
  email: string;
  name: string;
  avatar?: string;
}

// Task Model
export interface TaskModel extends IModel {
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
}

// Project Model
export interface ProjectModel extends IModel {
  name: string;
  description?: string;
  color?: string;
  userId: string;
  taskCount: number;
  completedTaskCount: number;
  isArchived: boolean;
}

// Enums
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

// Domain Entities
export class User implements UserModel {
  constructor(
    public id: string,
    public email: string,
    public name: string,
    public avatar?: string,
    public createdAt?: string,
    public updatedAt?: string
  ) {}

  static fromJson(json: any): User {
    return new User(
      json.id,
      json.email,
      json.name,
      json.avatar,
      json.createdAt,
      json.updatedAt
    );
  }

  toJson(): Partial<UserModel> {
    return {
      id: this.id,
      email: this.email,
      name: this.name,
      avatar: this.avatar,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

export class Task implements TaskModel {
  constructor(
    public id: string,
    public title: string,
    public userId: string,
    public status: TaskStatus,
    public priority: TaskPriority,
    public tags: string[],
    public aiMetadata: any,
    public subtasks: any[],
    public isArchived: boolean,
    public description?: string,
    public projectId?: string,
    public dueDate?: string,
    public completedAt?: string,
    public reminderAt?: string,
    public originalInput?: string,
    public createdAt?: string,
    public updatedAt?: string
  ) {}

  static fromJson(json: any): Task {
    return new Task(
      json.id,
      json.title,
      json.userId,
      json.status,
      json.priority,
      json.tags || [],
      json.aiMetadata || {},
      json.subtasks || [],
      json.isArchived || false,
      json.description,
      json.projectId,
      json.dueDate,
      json.completedAt,
      json.reminderAt,
      json.originalInput,
      json.createdAt,
      json.updatedAt
    );
  }

  toJson(): Partial<TaskModel> {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      userId: this.userId,
      projectId: this.projectId,
      status: this.status,
      priority: this.priority,
      dueDate: this.dueDate,
      completedAt: this.completedAt,
      tags: this.tags,
      aiMetadata: this.aiMetadata,
      subtasks: this.subtasks,
      reminderAt: this.reminderAt,
      isArchived: this.isArchived,
      originalInput: this.originalInput,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  // Business Logic Methods
  isOverdue(): boolean {
    if (!this.dueDate) return false;
    return new Date(this.dueDate) < new Date() && this.status !== TaskStatus.COMPLETED;
  }

  isDueToday(): boolean {
    if (!this.dueDate) return false;
    const today = new Date();
    const dueDate = new Date(this.dueDate);
    return dueDate.toDateString() === today.toDateString();
  }

  getCompletionRate(): number {
    if (this.subtasks.length === 0) return 0;
    const completed = this.subtasks.filter(st => st.completed).length;
    return (completed / this.subtasks.length) * 100;
  }

  markAsCompleted(): void {
    this.status = TaskStatus.COMPLETED;
    this.completedAt = new Date().toISOString();
  }

  markAsTodo(): void {
    this.status = TaskStatus.TODO;
    this.completedAt = undefined;
  }
}

export class Project implements ProjectModel {
  constructor(
    public id: string,
    public name: string,
    public userId: string,
    public taskCount: number,
    public completedTaskCount: number,
    public isArchived: boolean,
    public description?: string,
    public color?: string,
    public createdAt?: string,
    public updatedAt?: string
  ) {}

  static fromJson(json: any): Project {
    return new Project(
      json.id,
      json.name,
      json.userId,
      json.taskCount || 0,
      json.completedTaskCount || 0,
      json.isArchived || false,
      json.description,
      json.color,
      json.createdAt,
      json.updatedAt
    );
  }

  toJson(): Partial<ProjectModel> {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      color: this.color,
      userId: this.userId,
      taskCount: this.taskCount,
      completedTaskCount: this.completedTaskCount,
      isArchived: this.isArchived,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  // Business Logic Methods
  getCompletionRate(): number {
    if (this.taskCount === 0) return 0;
    return (this.completedTaskCount / this.taskCount) * 100;
  }

  isActive(): boolean {
    return !this.isArchived;
  }

  hasActiveTasks(): boolean {
    return this.taskCount > this.completedTaskCount;
  }
}

// DTO Interfaces for API communication
export interface CreateUserDto {
  email: string;
  password: string;
  name: string;
  avatar?: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface CreateTaskDto {
  title: string;
  description?: string;
  projectId?: string;
  priority?: TaskPriority;
  dueDate?: string;
  tags?: string[];
  reminderAt?: string;
  originalInput?: string;
}

export interface UpdateTaskDto {
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

export interface CreateProjectDto {
  name: string;
  description?: string;
  color?: string;
}

export interface UpdateProjectDto {
  name?: string;
  description?: string;
  color?: string;
  isArchived?: boolean;
}

// Response DTOs
export interface AuthResponseDto {
  access_token: string;
  user: UserModel;
}

export interface TaskStatsDto {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  overdueTasks: number;
  completionRate: number;
}

export interface ProjectStatsDto {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  overdueTasks: number;
  recentActivity: string[];
}
