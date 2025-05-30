import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Task, TaskStatus } from '@/types'
import { 
  CheckSquare, 
  Clock, 
  Edit,
  Trash2,
  Brain
} from 'lucide-react'
import { formatRelativeTime, getTaskPriorityColor, getTaskStatusColor } from '@/lib/utils'

interface TaskCardProps {
  task: Task
  projectName?: string
  onStatusToggle: (task: Task) => void
  onEdit?: (task: Task) => void
  onDelete: (taskId: string) => void
}

export const TaskCard = ({ 
  task, 
  projectName,
  onStatusToggle, 
  onEdit, 
  onDelete 
}: TaskCardProps) => (
  <Card className="hover:shadow-md transition-shadow">
    <CardContent className="p-4">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-2">
            <h3 className="text-sm font-medium text-gray-900 truncate">
              {task.title}
            </h3>
            {task.aiMetadata?.confidence && (
              <Badge variant="outline" className="text-purple-600 bg-purple-50">
                <Brain className="w-3 h-3 mr-1" />
                AI
              </Badge>
            )}
          </div>
          
          {task.description && (
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
              {task.description}
            </p>
          )}

          <div className="flex items-center space-x-2 mb-3">
            <Badge 
              variant="outline" 
              className={getTaskPriorityColor(task.priority)}
            >
              {task.priority}
            </Badge>
            <Badge 
              variant="outline" 
              className={getTaskStatusColor(task.status)}
            >
              {task.status}
            </Badge>
            {projectName && (
              <Badge variant="outline">
                {projectName}
              </Badge>
            )}
          </div>

          {task.dueDate && (
            <div className="flex items-center text-sm text-gray-500 mb-3">
              <Clock className="w-4 h-4 mr-1" />
              {formatRelativeTime(task.dueDate)}
            </div>
          )}

          {task.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {task.tags.map((tag) => (
                <span 
                  key={tag}
                  className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col space-y-1 ml-4">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onStatusToggle(task)}
          >
            <CheckSquare className="w-4 h-4" />
          </Button>
          {onEdit && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onEdit(task)}
            >
              <Edit className="w-4 h-4" />
            </Button>
          )}
          <Button
            size="sm"
            variant="outline"
            onClick={() => onDelete(task.id)}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>
)
