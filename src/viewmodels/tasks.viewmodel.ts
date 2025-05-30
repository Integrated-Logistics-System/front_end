'use client'

import { useEffect, useState, useCallback } from 'react'
import { useTaskStore } from '@/stores/tasks'
import { useProjectStore } from '@/stores/projects'
import { Task, TaskStatus, TaskPriority } from '@/types'
import toast from 'react-hot-toast'

export const useTasksViewModel = () => {
  // Stores
  const { 
    tasks, 
    isLoading, 
    error, 
    fetchTasks, 
    updateTask, 
    deleteTask, 
    createTaskFromNaturalLanguage,
    setFilters 
  } = useTaskStore()
  
  const { projects, getUserProjects } = useProjectStore()
  
  // Local state
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'all'>('all')
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | 'all'>('all')
  const [projectFilter, setProjectFilter] = useState<string>('all')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [naturalLanguageInput, setNaturalLanguageInput] = useState('')
  const [isCreating, setIsCreating] = useState(false)

  // Computed values
  const filteredTasks = tasks.filter(task => {
    if (searchQuery && !task.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }
    return true
  })

  const taskStats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === TaskStatus.COMPLETED).length,
    inProgress: tasks.filter(t => t.status === TaskStatus.IN_PROGRESS).length,
    overdue: tasks.filter(t => 
      t.dueDate && new Date(t.dueDate) < new Date() && t.status !== TaskStatus.COMPLETED
    ).length
  }

  // Actions
  const initialize = useCallback(async () => {
    await Promise.all([
      fetchTasks(),
      getUserProjects()
    ])
  }, [fetchTasks, getUserProjects])

  const applyFilters = useCallback(() => {
    const filters: any = {}
    if (searchQuery) filters.search = searchQuery
    if (statusFilter !== 'all') filters.status = statusFilter
    if (priorityFilter !== 'all') filters.priority = priorityFilter
    if (projectFilter !== 'all') filters.projectId = projectFilter

    setFilters(filters)
    fetchTasks(filters)
  }, [searchQuery, statusFilter, priorityFilter, projectFilter, setFilters, fetchTasks])

  const handleStatusChange = useCallback(async (taskId: string, newStatus: TaskStatus) => {
    try {
      await updateTask(taskId, { 
        status: newStatus,
        ...(newStatus === TaskStatus.COMPLETED && { completedAt: new Date().toISOString() })
      })
      toast.success('작업 상태가 변경되었습니다.')
    } catch (error) {
      toast.error('작업 상태 변경에 실패했습니다.')
    }
  }, [updateTask])

  const handleDeleteTask = useCallback(async (taskId: string) => {
    if (!confirm('정말로 이 작업을 삭제하시겠습니까?')) return
    
    try {
      await deleteTask(taskId)
      toast.success('작업이 삭제되었습니다.')
    } catch (error) {
      toast.error('작업 삭제에 실패했습니다.')
    }
  }, [deleteTask])

  const handleCreateFromNaturalLanguage = useCallback(async () => {
    if (!naturalLanguageInput.trim()) return

    setIsCreating(true)
    try {
      await createTaskFromNaturalLanguage(naturalLanguageInput)
      setNaturalLanguageInput('')
      setShowCreateForm(false)
      toast.success('AI가 작업을 생성했습니다!')
    } catch (error) {
      toast.error('작업 생성에 실패했습니다.')
    } finally {
      setIsCreating(false)
    }
  }, [naturalLanguageInput, createTaskFromNaturalLanguage])

  const openCreateForm = useCallback(() => {
    setShowCreateForm(true)
  }, [])

  const closeCreateForm = useCallback(() => {
    setShowCreateForm(false)
    setNaturalLanguageInput('')
  }, [])

  const updateNaturalLanguageInput = useCallback((value: string) => {
    setNaturalLanguageInput(value)
  }, [])

  const getProjectName = useCallback((projectId: string) => {
    const project = (projects || []).find(p => p.id === projectId)
    return project?.name || 'Unknown Project'
  }, [projects])

  const toggleTaskStatus = useCallback((task: Task) => {
    const newStatus = task.status === TaskStatus.COMPLETED 
      ? TaskStatus.TODO 
      : TaskStatus.COMPLETED
    handleStatusChange(task.id, newStatus)
  }, [handleStatusChange])

  // Effects
  useEffect(() => {
    initialize()
  }, [initialize])

  useEffect(() => {
    applyFilters()
  }, [applyFilters])

  return {
    // State
    tasks: filteredTasks,
    projects,
    isLoading,
    error,
    searchQuery,
    statusFilter,
    priorityFilter,
    projectFilter,
    showCreateForm,
    naturalLanguageInput,
    isCreating,
    taskStats,
    
    // Actions
    setSearchQuery,
    setStatusFilter,
    setPriorityFilter,
    setProjectFilter,
    handleStatusChange,
    handleDeleteTask,
    handleCreateFromNaturalLanguage,
    openCreateForm,
    closeCreateForm,
    updateNaturalLanguageInput,
    toggleTaskStatus,
    getProjectName,
    
    // Computed
    hasTasks: tasks.length > 0,
    hasFilteredTasks: filteredTasks.length > 0,
    isFormValid: naturalLanguageInput.trim().length > 0
  }
}
