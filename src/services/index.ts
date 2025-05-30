export * from './base.service';
export * from './auth.service';
export * from './task.service';
export * from './project.service';

// Service Locator Pattern
export class ServiceLocator {
  private static services = new Map<string, any>();

  static register<T>(name: string, service: T): void {
    this.services.set(name, service);
  }

  static get<T>(name: string): T {
    const service = this.services.get(name);
    if (!service) {
      throw new Error(`Service ${name} not found`);
    }
    return service;
  }

  static has(name: string): boolean {
    return this.services.has(name);
  }
}

// Register services
import { authService } from './auth.service';
import { taskService } from './task.service';
import { projectService } from './project.service';

ServiceLocator.register('authService', authService);
ServiceLocator.register('taskService', taskService);
ServiceLocator.register('projectService', projectService);
