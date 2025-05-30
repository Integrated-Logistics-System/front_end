import { create } from 'zustand'
import { Task, CreateTaskRequest, UpdateTaskRequest, TaskQuery, TaskStats, TaskStatus, TaskPriority } from '@/types'
import { apiClient } from '@/lib/api'

interface TaskState {
  tasks: Task[]
  selectedTask: Task | null
  stats: TaskStats | null
  isLoading: boolean
  error: string | null
  filters: TaskQuery
  
  // Actions
  fetchTasks: (query?: TaskQuery) => Promise<void>
  fetchTask: (id: string) => Promise<void>
  createTask: (data: CreateTaskRequest) => Promise<Task>
  createTaskFromNaturalLanguage: (input: string, projectId?: string) => Promise<Task>
  updateTask: (id: string, data: UpdateTaskRequest) => Promise<void>
  deleteTask: (id: string) => Promise<void>
  bulkUpdateTasks: (taskIds: string[], updateData: UpdateTaskRequest) => Promise<void>
  fetchStats: () => Promise<void>
  getDueTodayTasks: () => Promise<Task[]>
  getOverdueTasks: () => Promise<Task[]>
  getUpcomingTasks: (days?: number) => Promise<Task[]>
  setFilters: (filters: Partial<TaskQuery>) => void
  clearError: () => void
  setSelectedTask: (task: Task | null) => void
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  selectedTask: null,
  stats: null,
  isLoading: false,
  error: null,
  filters: {},

  fetchTasks: async (query?: TaskQuery) => {
    try {
      set({ isLoading: true, error: null })
      const finalQuery = { ...get().filters, ...query }
      const tasks = await apiClient.getTasks(finalQuery)
      set({ tasks, isLoading: false })
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || '작업을 불러오는데 실패했습니다.'
      set({ error: errorMessage, isLoading: false })
    }
  },

  fetchTask: async (id: string) => {
    try {
      set({ isLoading: true, error: null })
      const task = await apiClient.getTask(id)
      set({ selectedTask: task, isLoading: false })
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || '작업을 불러오는데 실패했습니다.'
      set({ error: errorMessage, isLoading: false })
    }
  },

  createTask: async (data: CreateTaskRequest) => {
    try {
      set({ isLoading: true, error: null })
      const newTask = await apiClient.createTask(data)
      set((state) => ({
        tasks: [newTask, ...state.tasks],
        isLoading: false,
      }))
      return newTask
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || '작업 생성에 실패했습니다.'
      set({ error: errorMessage, isLoading: false })
      throw error
    }
  },

  createTaskFromNaturalLanguage: async (input: string, projectId?: string) => {
    try {
      set({ isLoading: true, error: null })
      const newTask = await apiClient.createTaskFromNaturalLanguage({ input, projectId })
      set((state) => ({
        tasks: [newTask, ...state.tasks],
        isLoading: false,
      }))
      return newTask
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || '자연어 작업 생성에 실패했습니다.'
      set({ error: errorMessage, isLoading: false })
      throw error
    }
  },

  updateTask: async (id: string, data: UpdateTaskRequest) => {
    try {
      set({ isLoading: true, error: null })
      const updatedTask = await apiClient.updateTask(id, data)
      set((state) => ({
        tasks: state.tasks.map((task) => (task.id === id ? updatedTask : task)),
        selectedTask: state.selectedTask?.id === id ? updatedTask : state.selectedTask,
        isLoading: false,
      }))
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || '작업 수정에 실패했습니다.'
      set({ error: errorMessage, isLoading: false })
      throw error
    }
  },

  deleteTask: async (id: string) => {
    try {
      set({ isLoading: true, error: null })
      await apiClient.deleteTask(id)
      set((state) => ({
        tasks: state.tasks.filter((task) => task.id !== id),
        selectedTask: state.selectedTask?.id === id ? null : state.selectedTask,
        isLoading: false,
      }))
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || '작업 삭제에 실패했습니다.'
      set({ error: errorMessage, isLoading: false })
      throw error
    }
  },

  bulkUpdateTasks: async (taskIds: string[], updateData: UpdateTaskRequest) => {
    try {
      set({ isLoading: true, error: null })
      const updatedTasks = await apiClient.bulkUpdateTasks(taskIds, updateData)
      set((state) => ({
        tasks: state.tasks.map((task) => {
          const updatedTask = updatedTasks.find((ut) => ut.id === task.id)
          return updatedTask || task
        }),
        isLoading: false,
      }))
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || '일괄 수정에 실패했습니다.'
      set({ error: errorMessage, isLoading: false })
      throw error
    }
  },

  fetchStats: async () => {
    try {
      const stats = await apiClient.getTaskStats()
      set({ stats })
    } catch (error: any) {
      console.error('Failed to fetch task stats:', error)
    }
  },

  getDueTodayTasks: async () => {
    try {
      const tasks = await apiClient.getDueTodayTasks()
      return tasks
    } catch (error: any) {
      console.error('Failed to fetch due today tasks:', error)
      return []
    }
  },

  getOverdueTasks: async () => {
    try {
      const tasks = await apiClient.getOverdueTasks()
      return tasks
    } catch (error: any) {
      console.error('Failed to fetch overdue tasks:', error)
      return []
    }
  },

  getUpcomingTasks: async (days = 7) => {
    try {
      const tasks = await apiClient.getUpcomingTasks(days)
      return tasks
    } catch (error: any) {
      console.error('Failed to fetch upcoming tasks:', error)
      return []
    }
  },

  setFilters: (filters: Partial<TaskQuery>) => {
    set((state) => ({
      filters: { ...state.filters, ...filters },
    }))
  },

  clearError: () => set({ error: null }),
  
  setSelectedTask: (task: Task | null) => set({ selectedTask: task }),
}))
