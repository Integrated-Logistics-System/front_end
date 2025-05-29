'use client'

import { useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { MoreHorizontal, Calendar, User, Tag } from 'lucide-react'
import { useTaskStore } from '@/stores/tasks'
import { Task } from '@/lib/types'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'

interface TaskCardProps {
  task: Task
  onUpdate: (id: string, updates: Partial<Task>) => void
}

function TaskCard({ task, onUpdate }: TaskCardProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200'
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'medium': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'low': return 'bg-gray-100 text-gray-800 border-gray-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'in_progress': return 'bg-yellow-100 text-yellow-800'
      case 'pending': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const handleStatusChange = (completed: boolean) => {
    onUpdate(task._id, {
      status: completed ? 'completed' : 'pending'
    })
  }

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'completed'

  return (
    <Card className={`transition-all hover:shadow-md ${isOverdue ? 'border-red-200 bg-red-50' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <Checkbox 
            checked={task.status === 'completed'}
            onCheckedChange={handleStatusChange}
            className="mt-1"
          />
          
          <div className="flex-1 space-y-2">
            <div className="flex items-start justify-between">
              <h3 className={`font-medium ${task.status === 'completed' ? 'line-through text-gray-500' : ''}`}>
                {task.title}
              </h3>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>

            {task.description && (
              <p className="text-sm text-gray-600">{task.description}</p>
            )}

            <div className="flex flex-wrap gap-2 items-center">
              <Badge className={getPriorityColor(task.priority)}>
                {task.priority}
              </Badge>
              
              <Badge className={getStatusColor(task.status)}>
                {task.status}
              </Badge>

              {task.dueDate && (
                <div className="flex items-center text-xs text-gray-500">
                  <Calendar className="h-3 w-3 mr-1" />
                  {format(new Date(task.dueDate), 'MM/dd', { locale: ko })}
                  {isOverdue && <span className="text-red-500 ml-1">지연</span>}
                </div>
              )}

              {task.estimatedDuration && (
                <div className="text-xs text-gray-500">
                  {task.estimatedDuration}분
                </div>
              )}
            </div>

            {task.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {task.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    <Tag className="h-2 w-2 mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            {task.extractedEntities && (
              <div className="flex flex-wrap gap-1 text-xs">
                {task.extractedEntities.people.map((person, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    <User className="h-2 w-2 mr-1" />
                    {person}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function TaskList() {
  const { tasks, isLoading, error, fetchTasks, updateTask } = useTaskStore()

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="flex space-x-3">
                <div className="w-4 h-4 bg-gray-200 rounded"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="flex space-x-2">
                    <div className="h-5 bg-gray-200 rounded w-16"></div>
                    <div className="h-5 bg-gray-200 rounded w-16"></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-4 text-center">
          <p className="text-red-600">할 일을 불러오는데 실패했습니다: {error}</p>
          <Button onClick={fetchTasks} className="mt-2">
            다시 시도
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (tasks.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-gray-500 mb-4">아직 할 일이 없습니다.</p>
          <p className="text-sm text-gray-400">
            위에서 자연어로 할 일을 추가해보세요!
          </p>
        </CardContent>
      </Card>
    )
  }

  // 할 일 정렬 (우선순위, 마감일, 상태 순)
  const sortedTasks = [...tasks].sort((a, b) => {
    const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 }
    const statusOrder = { pending: 3, in_progress: 2, completed: 1 }
    
    // 우선순위 비교
    if (a.priority !== b.priority) {
      return priorityOrder[b.priority] - priorityOrder[a.priority]
    }
    
    // 상태 비교
    if (a.status !== b.status) {
      return statusOrder[b.status] - statusOrder[a.status]
    }
    
    // 마감일 비교
    if (a.dueDate && b.dueDate) {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    }
    
    return 0
  })

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>할 일 목록</span>
            <Badge variant="secondary">
              {tasks.filter(t => t.status !== 'completed').length}개 남음
            </Badge>
          </CardTitle>
        </CardHeader>
      </Card>

      {sortedTasks.map((task) => (
        <TaskCard 
          key={task._id} 
          task={task} 
          onUpdate={updateTask}
        />
      ))}
    </div>
  )
}
