import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Project } from '@/types'
import { ProjectCard } from './project-card'
import { FolderOpen } from 'lucide-react'

interface ProjectListProps {
  title: string
  projects: Project[]
  onEdit: (project: Project) => void
  onDelete: (projectId: string) => void
  getCompletionRate: (project: Project) => number
  emptyMessage?: string
  onCreateNew?: () => void
}

export const ProjectList = ({ 
  title, 
  projects, 
  onEdit, 
  onDelete, 
  getCompletionRate,
  emptyMessage = "프로젝트가 없습니다.",
  onCreateNew
}: ProjectListProps) => (
  <div>
    <h2 className="text-lg font-semibold text-gray-900 mb-4">
      {title} ({projects.length}개)
    </h2>
    {projects.length === 0 ? (
      <Card>
        <CardContent className="p-12 text-center">
          <FolderOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">{emptyMessage}</p>
          {onCreateNew && (
            <Button onClick={onCreateNew}>
              첫 프로젝트 만들기
            </Button>
          )}
        </CardContent>
      </Card>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project) => (
          <ProjectCard 
            key={project.id} 
            project={project} 
            onEdit={onEdit}
            onDelete={onDelete}
            getCompletionRate={getCompletionRate}
          />
        ))}
      </div>
    )}
  </div>
)
