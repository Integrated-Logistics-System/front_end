import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  CheckSquare, 
  Clock, 
  AlertTriangle, 
  TrendingUp,
  Brain,
  Zap 
} from 'lucide-react'
import TaskInput from '@/components/tasks/TaskInput'
import TaskList from '@/components/tasks/TaskList'

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          대시보드 ✨
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          TaskMind AI와 함께 더 스마트하게 할 일을 관리하세요
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              전체 할 일
            </CardTitle>
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">
              지난 주 대비 +3개
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              완료율
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78%</div>
            <Progress value={78} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              지연된 할 일
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">3</div>
            <p className="text-xs text-muted-foreground">
              즉시 처리 필요
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              오늘 할 일
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
            <p className="text-xs text-muted-foreground">
              평균 처리 시간 2.5시간
            </p>
          </CardContent>
        </Card>
      </div>

      {/* AI 기능 하이라이트 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Brain className="h-5 w-5 text-blue-600" />
              <span>LangGraph 워크플로우</span>
            </CardTitle>
            <CardDescription>
              자연어 입력을 지능적으로 분석하고 구조화합니다
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">평균 처리 시간</span>
                <Badge variant="secondary">0.6초</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">분석 정확도</span>
                <Badge variant="secondary">92%</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">사용 모델</span>
                <Badge variant="outline">Qwen 2.5 0.5B</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200 dark:border-green-800">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="h-5 w-5 text-green-600" />
              <span>AI 추천</span>
            </CardTitle>
            <CardDescription>
              오늘 집중해야 할 작업들을 AI가 추천합니다
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Badge className="bg-red-100 text-red-800">Urgent</Badge>
                <span className="text-sm">고객 문의 응답</span>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className="bg-orange-100 text-orange-800">High</Badge>
                <span className="text-sm">프로젝트 보고서 작성</span>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className="bg-blue-100 text-blue-800">Medium</Badge>
                <span className="text-sm">회의 일정 조율</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 할 일 입력 및 목록 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <TaskInput />
        </div>
        <div>
          <TaskList />
        </div>
      </div>
    </div>
  )
}
