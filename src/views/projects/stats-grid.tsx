import { Card, CardContent } from '@/components/ui/card'

interface StatsGridProps {
  stats: {
    total: number
    active: number
    totalTasks: number
    completedTasks: number
  }
}

export const StatsGrid = ({ stats }: StatsGridProps) => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
    <Card>
      <CardContent className="p-4 text-center">
        <div className="text-2xl font-bold text-blue-600">
          {stats.total}
        </div>
        <div className="text-sm text-gray-600">총 프로젝트</div>
      </CardContent>
    </Card>
    
    <Card>
      <CardContent className="p-4 text-center">
        <div className="text-2xl font-bold text-green-600">
          {stats.active}
        </div>
        <div className="text-sm text-gray-600">활성 프로젝트</div>
      </CardContent>
    </Card>
    
    <Card>
      <CardContent className="p-4 text-center">
        <div className="text-2xl font-bold text-yellow-600">
          {stats.totalTasks}
        </div>
        <div className="text-sm text-gray-600">총 작업</div>
      </CardContent>
    </Card>
    
    <Card>
      <CardContent className="p-4 text-center">
        <div className="text-2xl font-bold text-purple-600">
          {stats.completedTasks}
        </div>
        <div className="text-sm text-gray-600">완료된 작업</div>
      </CardContent>
    </Card>
  </div>
)
