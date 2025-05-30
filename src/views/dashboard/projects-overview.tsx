import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import Link from 'next/link'

interface ProjectCardProps {
  project: any
  getProjectProgress: (project: any) => number
}

export const ProjectCard = ({ project, getProjectProgress }: ProjectCardProps) => {
  const progress = getProjectProgress(project)
  
  return (
    <div 
      key={project.id}
      className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
    >
      <h4 className="font-medium text-gray-900 mb-2">
        {project.name}
      </h4>
      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>작업: {project.taskCount}개</span>
        <span>완료: {project.completedTaskCount}개</span>
      </div>
      <div className="mt-2">
        <div className="w-full bg-gray-200 rounded-full h-1">
          <div 
            className="bg-blue-600 h-1 rounded-full"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    </div>
  )
}

interface ProjectsOverviewProps {
  projects: any[]
  getProjectProgress: (project: any) => number
}

export const ProjectsOverview = ({ projects, getProjectProgress }: ProjectsOverviewProps) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center">
        프로젝트 현황
      </CardTitle>
      <CardDescription>
        활성 프로젝트 ({projects.length}개)
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.slice(0, 6).map((project) => (
          <ProjectCard 
            key={project.id} 
            project={project} 
            getProjectProgress={getProjectProgress} 
          />
        ))}
        {projects.length === 0 && (
          <div className="col-span-full text-center py-8">
            <p className="text-gray-500 mb-4">프로젝트가 없습니다.</p>
            <Button asChild>
              <Link href="/projects">
                <Plus className="w-4 h-4 mr-2" />
                첫 프로젝트 만들기
              </Link>
            </Button>
          </div>
        )}
      </div>
      {projects.length > 6 && (
        <div className="mt-4 text-center">
          <Button variant="outline" asChild>
            <Link href="/projects">모든 프로젝트 보기</Link>
          </Button>
        </div>
      )}
    </CardContent>
  </Card>
)
