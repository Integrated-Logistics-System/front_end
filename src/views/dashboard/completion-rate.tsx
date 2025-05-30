import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface CompletionRateProps {
  completionRate: number
}

export const CompletionRate = ({ completionRate }: CompletionRateProps) => (
  <Card>
    <CardHeader>
      <CardTitle>완료율</CardTitle>
      <CardDescription>현재 작업 진행 상황</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="flex items-center">
        <div className="flex-1">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${completionRate}%` }}
            ></div>
          </div>
        </div>
        <span className="ml-4 text-sm font-medium text-gray-900">
          {completionRate.toFixed(1)}%
        </span>
      </div>
    </CardContent>
  </Card>
)
