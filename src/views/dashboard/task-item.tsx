import { Badge } from '@/components/ui/badge'
import { Task } from '@/types'
import { formatRelativeTime, getTaskPriorityColor, getTaskStatusColor } from '@/lib/utils'

interface TaskItemProps {
  task: Task
}

export const TaskItem = ({ task }: TaskItemProps) => (
  <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
    <div className="flex-1 min-w-0">
      <h4 className="text-sm font-medium text-gray-900 truncate">
        {task.title}
      </h4>
      {task.description && (
        <p className="text-xs text-gray-500 truncate mt-1">
          {task.description}
        </p>
      )}
      <div className="flex items-center space-x-2 mt-2">
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
        {task.dueDate && (
          <span className="text-xs text-gray-500">
            {formatRelativeTime(task.dueDate)}
          </span>
        )}
      </div>
    </div>
  </div>
)
