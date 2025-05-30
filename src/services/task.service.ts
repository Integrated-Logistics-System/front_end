import { BaseApiService, IRepository } from './base.service';
import { 
  Task, 
  TaskModel,
  CreateTaskDto, 
  UpdateTaskDto,
  TaskStatsDto,
  TaskStatus,
  TaskPriority
} from '@/models';

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

export interface ITaskService extends IRepository<Task, CreateTaskDto, UpdateTaskDto> {
  findAll(query?: TaskQuery): Promise<Task[]>;
  createFromNaturalLanguage(input: string, projectId?: string): Promise<Task>;
  getStats(): Promise<TaskStatsDto>;
  getDueTodayTasks(): Promise<Task[]>;
  getOverdueTasks(): Promise<Task[]>;
  getUpcomingTasks(days?: number): Promise<Task[]>;
  bulkUpdate(taskIds: string[], updateData: UpdateTaskDto): Promise<Task[]>;
  suggestPriority(id: string): Promise<any>;
}

export class TaskService extends BaseApiService implements ITaskService {
  private static instance: TaskService;

  public static getInstance(): TaskService {
    if (!TaskService.instance) {
      TaskService.instance = new TaskService();
    }
    return TaskService.instance;
  }

  async findAll(query?: TaskQuery): Promise<Task[]> {
    const response = await this.handleRequest<TaskModel[]>(
      this.client.get('/api/tasks', { params: query })
    );
    return response.map(task => Task.fromJson(task));
  }

  async findById(id: string): Promise<Task> {
    const response = await this.handleRequest<TaskModel>(
      this.client.get(`/api/tasks/${id}`)
    );
    return Task.fromJson(response);
  }

  async create(data: CreateTaskDto): Promise<Task> {
    const response = await this.handleRequest<TaskModel>(
      this.client.post('/api/tasks', data)
    );
    return Task.fromJson(response);
  }

  async createFromNaturalLanguage(input: string, projectId?: string): Promise<Task> {
    const response = await this.handleRequest<TaskModel>(
      this.client.post('/api/tasks/natural-language', { input, projectId })
    );
    return Task.fromJson(response);
  }

  async update(id: string, data: UpdateTaskDto): Promise<Task> {
    const response = await this.handleRequest<TaskModel>(
      this.client.patch(`/api/tasks/${id}`, data)
    );
    return Task.fromJson(response);
  }

  async delete(id: string): Promise<void> {
    await this.handleRequest<void>(
      this.client.delete(`/api/tasks/${id}`)
    );
  }

  async bulkUpdate(taskIds: string[], updateData: UpdateTaskDto): Promise<Task[]> {
    const response = await this.handleRequest<TaskModel[]>(
      this.client.patch('/api/tasks/bulk', { taskIds, updateData })
    );
    return response.map(task => Task.fromJson(task));
  }

  async getStats(): Promise<TaskStatsDto> {
    return this.handleRequest<TaskStatsDto>(
      this.client.get('/api/tasks/stats')
    );
  }

  async getDueTodayTasks(): Promise<Task[]> {
    const response = await this.handleRequest<TaskModel[]>(
      this.client.get('/api/tasks/due-today')
    );
    return response.map(task => Task.fromJson(task));
  }

  async getOverdueTasks(): Promise<Task[]> {
    const response = await this.handleRequest<TaskModel[]>(
      this.client.get('/api/tasks/overdue')
    );
    return response.map(task => Task.fromJson(task));
  }

  async getUpcomingTasks(days: number = 7): Promise<Task[]> {
    const response = await this.handleRequest<TaskModel[]>(
      this.client.get('/api/tasks/upcoming', { params: { days } })
    );
    return response.map(task => Task.fromJson(task));
  }

  async suggestPriority(id: string): Promise<any> {
    return this.handleRequest<any>(
      this.client.get(`/api/tasks/${id}/suggest-priority`)
    );
  }
}

// Export singleton instance
export const taskService = TaskService.getInstance();
