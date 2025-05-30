import { create } from 'zustand'
import { Project, CreateProjectRequest, UpdateProjectRequest, ProjectQuery, ProjectStats } from '@/types'
import { apiClient } from '@/lib/api'

interface ProjectState {
  projects: Project[]
  selectedProject: Project | null
  stats: ProjectStats | null
  isLoading: boolean
  error: string | null
  
  // Actions
  fetchProjects: (query?: ProjectQuery) => Promise<void>
  fetchProject: (id: string) => Promise<void>
  createProject: (data: CreateProjectRequest) => Promise<Project>
  updateProject: (id: string, data: UpdateProjectRequest) => Promise<void>
  deleteProject: (id: string) => Promise<void>
  fetchProjectStats: (id: string) => Promise<void>
  getUserProjects: () => Promise<void>
  clearError: () => void
  setSelectedProject: (project: Project | null) => void
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  projects: [],
  selectedProject: null,
  stats: null,
  isLoading: false,
  error: null,

  fetchProjects: async (query?: ProjectQuery) => {
    try {
      set({ isLoading: true, error: null })
      const projects = await apiClient.getProjects(query)
      set({ projects, isLoading: false })
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || '프로젝트를 불러오는데 실패했습니다.'
      set({ error: errorMessage, isLoading: false })
    }
  },

  fetchProject: async (id: string) => {
    try {
      set({ isLoading: true, error: null })
      const project = await apiClient.getProject(id)
      set({ selectedProject: project, isLoading: false })
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || '프로젝트를 불러오는데 실패했습니다.'
      set({ error: errorMessage, isLoading: false })
    }
  },

  createProject: async (data: CreateProjectRequest) => {
    try {
      set({ isLoading: true, error: null })
      const newProject = await apiClient.createProject(data)
      set((state) => ({
        projects: [newProject, ...state.projects],
        isLoading: false,
      }))
      return newProject
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || '프로젝트 생성에 실패했습니다.'
      set({ error: errorMessage, isLoading: false })
      throw error
    }
  },

  updateProject: async (id: string, data: UpdateProjectRequest) => {
    try {
      set({ isLoading: true, error: null })
      const updatedProject = await apiClient.updateProject(id, data)
      set((state) => ({
        projects: state.projects.map((project) =>
          project.id === id ? updatedProject : project
        ),
        selectedProject: state.selectedProject?.id === id ? updatedProject : state.selectedProject,
        isLoading: false,
      }))
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || '프로젝트 수정에 실패했습니다.'
      set({ error: errorMessage, isLoading: false })
      throw error
    }
  },

  deleteProject: async (id: string) => {
    try {
      set({ isLoading: true, error: null })
      await apiClient.deleteProject(id)
      set((state) => ({
        projects: state.projects.filter((project) => project.id !== id),
        selectedProject: state.selectedProject?.id === id ? null : state.selectedProject,
        isLoading: false,
      }))
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || '프로젝트 삭제에 실패했습니다.'
      set({ error: errorMessage, isLoading: false })
      throw error
    }
  },

  fetchProjectStats: async (id: string) => {
    try {
      const stats = await apiClient.getProjectStats(id)
      set({ stats })
    } catch (error: any) {
      console.error('Failed to fetch project stats:', error)
    }
  },

  getUserProjects: async () => {
    try {
      set({ isLoading: true, error: null })
      const projects = await apiClient.getUserProjects()
      set({ projects, isLoading: false })
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || '사용자 프로젝트를 불러오는데 실패했습니다.'
      set({ error: errorMessage, isLoading: false })
    }
  },

  clearError: () => set({ error: null }),
  
  setSelectedProject: (project: Project | null) => set({ selectedProject: project }),
}))
