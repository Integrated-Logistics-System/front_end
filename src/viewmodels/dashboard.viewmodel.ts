'use client'

import { useEffect, useState, useCallback } from 'react'
import { useTaskStore } from '@/stores/tasks'
import { useProjectStore } from '@/stores/projects'
import { Task, TaskStats } from '@/types'

export const useDashboardViewModel = () => {
  // Stores
  const { 
    stats, 
    fetchStats, 
    getDueTodayTasks, 
    getOverdueTasks, 
    getUpcomingTasks 
  } = useTaskStore()
  
  const { projects, getUserProjects } = useProjectStore()
  
  // Local state
  const [dueTodayTasks, setDueTodayTasks] = useState<Task[]>([])
  const [overdueTasks, setOverdueTasks] = useState<Task[]>([])
  const [upcomingTasks, setUpcomingTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Computed values
  const activeProjects = (projects || []).filter(p => !p.isArchived)
  const completionRate = stats?.completionRate || 0

  // Actions
  const loadTaskData = useCallback(async () => {
    try {
      const [dueToday, overdue, upcoming] = await Promise.all([
        getDueTodayTasks(),
        getOverdueTasks(),
        getUpcomingTasks(7),
      ])
      
      setDueTodayTasks(dueToday)
      setOverdueTasks(overdue)
      setUpcomingTasks(upcoming)
    } catch (err) {
      setError('작업 데이터를 불러오는데 실패했습니다.')
      console.error('Error loading task data:', err)
    }
  }, [getDueTodayTasks, getOverdueTasks, getUpcomingTasks])

  const fetchDashboardData = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      await Promise.all([
        fetchStats(),
        getUserProjects(),
        loadTaskData(),
      ])
    } catch (err) {
      setError('대시보드 데이터를 불러오는데 실패했습니다.')
      console.error('Error fetching dashboard data:', err)
    } finally {
      setIsLoading(false)
    }
  }, [fetchStats, getUserProjects, loadTaskData])

  const refresh = useCallback(() => {
    fetchDashboardData()
  }, [fetchDashboardData])

  // Effects
  useEffect(() => {
    fetchDashboardData()
  }, [fetchDashboardData])

  // Helper functions
  const getProjectProgress = useCallback((project: any) => {
    return project.taskCount > 0 
      ? (project.completedTaskCount / project.taskCount) * 100 
      : 0
  }, [])

  const getStatsData = useCallback(() => [
    {
      title: '전체 작업',
      value: stats?.totalTasks || 0,
      icon: 'CheckSquare',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: '완료된 작업',
      value: stats?.completedTasks || 0,
      icon: 'TrendingUp',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: '진행 중',
      value: stats?.pendingTasks || 0,
      icon: 'Clock',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      title: '지연된 작업',
      value: stats?.overdueTasks || 0,
      icon: 'AlertCircle',
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    }
  ], [stats])

  return {
    // State
    dueTodayTasks,
    overdueTasks,
    upcomingTasks,
    projects: activeProjects,
    stats,
    isLoading,
    error,
    
    // Computed
    completionRate,
    statsData: getStatsData(),
    
    // Actions
    refresh,
    getProjectProgress,
    
    // Helpers
    hasProjects: activeProjects.length > 0,
    hasTasks: (dueTodayTasks.length + overdueTasks.length + upcomingTasks.length) > 0
  }
}
