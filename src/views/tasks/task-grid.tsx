import { Button } from '@/components/ui/button'
import { Task } from '@/types'
import { TaskCard } from './task-card'
import { CheckSquare, AlertCircle } from 'lucide-react'

interface TaskGridProps {
  tasks: Task[]
  getProjectName: (projectId: string) => string
  onStatusToggle: (task: Task) => void
  onDelete: (taskId: string) => void
  onCreateNew?: () => void
  isLoading?: boolean
  error?: string | null
}

export const TaskGrid = ({ 
  tasks, 
  getProjectName, 
  onStatusToggle, 
  onDelete,
  onCreateNew,
  isLoading = false,
  error = null
}: TaskGridProps) => {
  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
        <p className="text-gray-600">작업을 불러오는 중...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <p className="text-red-600">{error}</p>
      </div>
    )
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <CheckSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">작업이 없습니다.</p>
        {onCreateNew && (
          <Button className="mt-4" onClick={onCreateNew}>
            첫 작업 만들기
          </Button>
        )}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {tasks.map((task) => (
        <TaskCard 
          key={task.id} 
          task={task} 
          projectName={task.projectId ? getProjectName(task.projectId) : undefined}
          onStatusToggle={onStatusToggle}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}
