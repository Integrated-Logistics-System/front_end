'use client'

import { Button } from '@/components/ui/button'
import { Plus, Calendar, AlertCircle, Clock } from 'lucide-react'
import Link from 'next/link'
import { useDashboardViewModel } from '@/viewmodels/dashboard.viewmodel'
import { 
  StatCard, 
  TaskSection, 
  ProjectsOverview, 
  CompletionRate 
} from '@/views/dashboard'

export default function DashboardPage() {
  const viewModel = useDashboardViewModel()

  if (viewModel.isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">대시보드를 불러오는 중...</p>
        </div>
      </div>
    )
  }

  if (viewModel.error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 mb-4">{viewModel.error}</p>
          <Button onClick={viewModel.refresh}>다시 시도</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">대시보드</h1>
        <div className="space-x-2">
          <Button asChild>
            <Link href="/tasks">
              <Plus className="w-4 h-4 mr-2" />
              새 작업
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {viewModel.statsData.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            color={stat.color}
            bgColor={stat.bgColor}
          />
        ))}
      </div>

      {/* Completion Rate */}
      {viewModel.stats && (
        <CompletionRate completionRate={viewModel.completionRate} />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Tasks */}
        <TaskSection
          title="오늘 할 일"
          description="오늘 마감인 작업들"
          tasks={viewModel.dueTodayTasks}
          icon={<Calendar className="w-5 h-5 mr-2" />}
          emptyMessage="오늘 마감인 작업이 없습니다."
          linkHref="/tasks?filter=due-today"
        />

        {/* Overdue Tasks */}
        <TaskSection
          title="지연된 작업"
          description="마감일이 지난 작업들"
          tasks={viewModel.overdueTasks}
          icon={<AlertCircle className="w-5 h-5 mr-2" />}
          emptyMessage="지연된 작업이 없습니다. 훌륭해요!"
          linkHref="/tasks?filter=overdue"
          titleColor="text-red-600"
        />
      </div>

      {/* Projects Overview */}
      <ProjectsOverview 
        projects={viewModel.projects} 
        getProjectProgress={viewModel.getProjectProgress} 
      />

      {/* Upcoming Tasks */}
      <TaskSection
        title="다가오는 작업"
        description="다음 7일 내 마감 작업들"
        tasks={viewModel.upcomingTasks}
        icon={<Clock className="w-5 h-5 mr-2" />}
        emptyMessage="다가오는 작업이 없습니다."
        linkHref="/tasks?filter=upcoming"
      />
    </div>
  )
}
