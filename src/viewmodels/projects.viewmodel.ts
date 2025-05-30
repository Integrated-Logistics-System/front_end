'use client'

import { useEffect, useState, useCallback } from 'react'
import { useProjectStore } from '@/stores/projects'
import { useTaskStore } from '@/stores/tasks'
import { Project } from '@/types'
import toast from 'react-hot-toast'

export const useProjectsViewModel = () => {
  // Stores
  const { 
    projects, 
    isLoading, 
    error, 
    fetchProjects, 
    createProject, 
    updateProject, 
    deleteProject 
  } = useProjectStore()
  
  const { fetchTasks } = useTaskStore()
  
  // Local state
  const [searchQuery, setSearchQuery] = useState('')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: '#3B82F6'
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Computed values
  const filteredProjects = (projects || []).filter(project => 
    project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (project.description && project.description.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const activeProjects = filteredProjects.filter(p => !p.isArchived)
  const archivedProjects = filteredProjects.filter(p => p.isArchived)

  const stats = {
    total: (projects || []).length,
    active: activeProjects.length,
    totalTasks: (projects || []).reduce((sum, p) => sum + p.taskCount, 0),
    completedTasks: (projects || []).reduce((sum, p) => sum + p.completedTaskCount, 0)
  }

  // Actions
  const initialize = useCallback(async () => {
    await fetchProjects()
  }, [fetchProjects])

  const resetForm = useCallback(() => {
    setFormData({ name: '', description: '', color: '#3B82F6' })
    setShowCreateForm(false)
    setEditingProject(null)
  }, [])

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim()) return

    setIsSubmitting(true)
    try {
      if (editingProject) {
        await updateProject(editingProject.id, formData)
        toast.success('프로젝트가 수정되었습니다.')
      } else {
        await createProject(formData)
        toast.success('프로젝트가 생성되었습니다.')
      }
      resetForm()
    } catch (error) {
      toast.error(editingProject ? '프로젝트 수정에 실패했습니다.' : '프로젝트 생성에 실패했습니다.')
    } finally {
      setIsSubmitting(false)
    }
  }, [formData, editingProject, updateProject, createProject, resetForm])

  const handleEdit = useCallback((project: Project) => {
    setEditingProject(project)
    setFormData({
      name: project.name,
      description: project.description || '',
      color: project.color || '#3B82F6'
    })
    setShowCreateForm(true)
  }, [])

  const handleDelete = useCallback(async (projectId: string) => {
    if (!confirm('정말로 이 프로젝트를 삭제하시겠습니까? 관련된 모든 작업도 함께 삭제됩니다.')) return
    
    try {
      await deleteProject(projectId)
      toast.success('프로젝트가 삭제되었습니다.')
    } catch (error) {
      toast.error('프로젝트 삭제에 실패했습니다.')
    }
  }, [deleteProject])

  const getCompletionRate = useCallback((project: Project) => {
    return project.taskCount > 0 
      ? (project.completedTaskCount / project.taskCount) * 100 
      : 0
  }, [])

  const updateFormData = useCallback((updates: Partial<typeof formData>) => {
    setFormData(prev => ({ ...prev, ...updates }))
  }, [])

  const openCreateForm = useCallback(() => {
    setShowCreateForm(true)
  }, [])

  const closeForm = useCallback(() => {
    resetForm()
  }, [resetForm])

  // Effects
  useEffect(() => {
    initialize()
  }, [initialize])

  return {
    // State
    projects: filteredProjects,
    activeProjects,
    archivedProjects,
    isLoading,
    error,
    searchQuery,
    showCreateForm,
    editingProject,
    formData,
    isSubmitting,
    stats,
    
    // Actions
    setSearchQuery,
    handleSubmit,
    handleEdit,
    handleDelete,
    updateFormData,
    openCreateForm,
    closeForm,
    getCompletionRate,
    
    // Computed
    hasProjects: (projects || []).length > 0,
    hasActiveProjects: activeProjects.length > 0,
    hasArchivedProjects: archivedProjects.length > 0,
    isFormValid: formData.name.trim().length > 0
  }
}
