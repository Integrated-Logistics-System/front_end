import { BaseApiService, IRepository } from './base.service';
import { 
  Project, 
  ProjectModel,
  CreateProjectDto, 
  UpdateProjectDto,
  ProjectStatsDto
} from '@/models';

export interface ProjectQuery {
  search?: string;
  isArchived?: boolean;
}

export interface IProjectService extends IRepository<Project, CreateProjectDto, UpdateProjectDto> {
  findAll(query?: ProjectQuery): Promise<Project[]>;
  getUserProjects(): Promise<Project[]>;
  getProjectTasks(id: string): Promise<any[]>;
  getProjectStats(id: string): Promise<ProjectStatsDto>;
  getProjectInsights(id: string): Promise<any>;
}

export class ProjectService extends BaseApiService implements IProjectService {
  private static instance: ProjectService;

  public static getInstance(): ProjectService {
    if (!ProjectService.instance) {
      ProjectService.instance = new ProjectService();
    }
    return ProjectService.instance;
  }

  async findAll(query?: ProjectQuery): Promise<Project[]> {
    const response = await this.handleRequest<ProjectModel[]>(
      this.client.get('/api/projects', { params: query })
    );
    return response.map(project => Project.fromJson(project));
  }

  async findById(id: string): Promise<Project> {
    const response = await this.handleRequest<ProjectModel>(
      this.client.get(`/api/projects/${id}`)
    );
    return Project.fromJson(response);
  }

  async create(data: CreateProjectDto): Promise<Project> {
    const response = await this.handleRequest<ProjectModel>(
      this.client.post('/api/projects', data)
    );
    return Project.fromJson(response);
  }

  async update(id: string, data: UpdateProjectDto): Promise<Project> {
    const response = await this.handleRequest<ProjectModel>(
      this.client.patch(`/api/projects/${id}`, data)
    );
    return Project.fromJson(response);
  }

  async delete(id: string): Promise<void> {
    await this.handleRequest<void>(
      this.client.delete(`/api/projects/${id}`)
    );
  }

  async getUserProjects(): Promise<Project[]> {
    const response = await this.handleRequest<ProjectModel[]>(
      this.client.get('/api/projects/overview')
    );
    return response.map(project => Project.fromJson(project));
  }

  async getProjectTasks(id: string): Promise<any[]> {
    return this.handleRequest<any[]>(
      this.client.get(`/api/projects/${id}/tasks`)
    );
  }

  async getProjectStats(id: string): Promise<ProjectStatsDto> {
    return this.handleRequest<ProjectStatsDto>(
      this.client.get(`/api/projects/${id}/stats`)
    );
  }

  async getProjectInsights(id: string): Promise<any> {
    return this.handleRequest<any>(
      this.client.get(`/api/projects/${id}/insights`)
    );
  }
}

// Export singleton instance
export const projectService = ProjectService.getInstance();
