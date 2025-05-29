import { create } from 'zustand';
import { Task, WorkflowResult } from '@/lib/types';
import apiClient from '@/lib/api';

interface TaskState {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchTasks: () => Promise<void>;
  createTask: (task: Partial<Task>) => Promise<void>;
  createTaskFromNaturalLanguage: (input: string) => Promise<WorkflowResult | any>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  clearError: () => void;
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  isLoading: false,
  error: null,

  fetchTasks: async () => {
    set({ isLoading: true, error: null });
    try {
      const tasks = await apiClient.getTasks();
      set({ tasks, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch tasks',
        isLoading: false 
      });
    }
  },

  createTask: async (taskData) => {
    set({ isLoading: true, error: null });
    try {
      const newTask = await apiClient.createTask(taskData);
      set(state => ({ 
        tasks: [newTask, ...state.tasks],
        isLoading: false 
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to create task',
        isLoading: false 
      });
    }
  },

  createTaskFromNaturalLanguage: async (input: string) => {
    set({ isLoading: true, error: null });
    try {
      const result = await apiClient.createTaskFromNaturalLanguage({ input });
      set({ isLoading: false });
      
      // 확인이 필요하지 않은 경우 자동으로 할 일 목록에 추가
      if ('_id' in result) {
        set(state => ({ 
          tasks: [result as Task, ...state.tasks]
        }));
      }
      
      return result;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to process natural language input',
        isLoading: false 
      });
      throw error;
    }
  },

  updateTask: async (id: string, updates: Partial<Task>) => {
    set({ isLoading: true, error: null });
    try {
      const updatedTask = await apiClient.updateTask(id, updates);
      set(state => ({
        tasks: state.tasks.map(task => 
          task._id === id ? updatedTask : task
        ),
        isLoading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update task',
        isLoading: false 
      });
    }
  },

  deleteTask: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await apiClient.deleteTask(id);
      set(state => ({
        tasks: state.tasks.filter(task => task._id !== id),
        isLoading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to delete task',
        isLoading: false 
      });
    }
  },

  clearError: () => set({ error: null }),
}));
