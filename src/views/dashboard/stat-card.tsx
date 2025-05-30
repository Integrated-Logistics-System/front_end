import { Card, CardContent } from '@/components/ui/card'
import { 
  CheckSquare, 
  Clock, 
  AlertCircle, 
  TrendingUp
} from 'lucide-react'

interface StatCardProps {
  title: string
  value: number | string
  icon: string
  color?: string
  bgColor?: string
}

const iconMap = {
  CheckSquare,
  Clock,
  AlertCircle,
  TrendingUp
}

export const StatCard = ({ 
  title, 
  value, 
  icon, 
  color = 'text-blue-600',
  bgColor = 'bg-blue-50' 
}: StatCardProps) => {
  const IconComponent = iconMap[icon as keyof typeof iconMap]
  
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center">
          <div className={`p-3 rounded-lg ${bgColor}`}>
            <IconComponent className={`w-6 h-6 ${color}`} />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
