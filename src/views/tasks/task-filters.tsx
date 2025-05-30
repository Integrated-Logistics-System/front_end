import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { TaskStatus, TaskPriority } from '@/types'
import { Search } from 'lucide-react'

interface TaskFiltersProps {
  searchQuery: string
  statusFilter: TaskStatus | 'all'
  priorityFilter: TaskPriority | 'all'
  projectFilter: string
  projects: any[]
  onSearchChange: (query: string) => void
  onStatusChange: (status: TaskStatus | 'all') => void
  onPriorityChange: (priority: TaskPriority | 'all') => void
  onProjectChange: (projectId: string) => void
}

export const TaskFilters = ({ 
  searchQuery, 
  statusFilter, 
  priorityFilter, 
  projectFilter,
  projects,
  onSearchChange, 
  onStatusChange, 
  onPriorityChange,
  onProjectChange
}: TaskFiltersProps) => (
  <Card>
    <CardContent className="p-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            검색
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="작업 검색..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            상태
          </label>
          <select
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value as TaskStatus | 'all')}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="all">모든 상태</option>
            <option value={TaskStatus.TODO}>할 일</option>
            <option value={TaskStatus.IN_PROGRESS}>진행 중</option>
            <option value={TaskStatus.COMPLETED}>완료</option>
            <option value={TaskStatus.CANCELLED}>취소됨</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            우선순위
          </label>
          <select
            value={priorityFilter}
            onChange={(e) => onPriorityChange(e.target.value as TaskPriority | 'all')}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="all">모든 우선순위</option>
            <option value={TaskPriority.URGENT}>긴급</option>
            <option value={TaskPriority.HIGH}>높음</option>
            <option value={TaskPriority.MEDIUM}>보통</option>
            <option value={TaskPriority.LOW}>낮음</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            프로젝트
          </label>
          <select
            value={projectFilter}
            onChange={(e) => onProjectChange(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="all">모든 프로젝트</option>
            {(projects || []).map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </CardContent>
  </Card>
)
