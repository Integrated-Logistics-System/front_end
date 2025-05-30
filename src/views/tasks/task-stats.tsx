import { Card, CardContent } from '@/components/ui/card'
import { TaskStatus } from '@/types'

interface TaskStatsProps {
  stats: {
    total: number
    completed: number
    inProgress: number
    overdue: number
  }
}

export const TaskStats = ({ stats }: TaskStatsProps) => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
    <Card>
      <CardContent className="p-4 text-center">
        <div className="text-2xl font-bold text-blue-600">
          {stats.total}
        </div>
        <div className="text-sm text-gray-600">총 작업</div>
      </CardContent>
    </Card>
    
    <Card>
      <CardContent className="p-4 text-center">
        <div className="text-2xl font-bold text-green-600">
          {stats.completed}
        </div>
        <div className="text-sm text-gray-600">완료됨</div>
      </CardContent>
    </Card>
    
    <Card>
      <CardContent className="p-4 text-center">
        <div className="text-2xl font-bold text-yellow-600">
          {stats.inProgress}
        </div>
        <div className="text-sm text-gray-600">진행 중</div>
      </CardContent>
    </Card>
    
    <Card>
      <CardContent className="p-4 text-center">
        <div className="text-2xl font-bold text-red-600">
          {stats.overdue}
        </div>
        <div className="text-sm text-gray-600">지연됨</div>
      </CardContent>
    </Card>
  </div>
)
