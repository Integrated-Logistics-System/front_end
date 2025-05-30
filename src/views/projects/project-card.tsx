import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Project } from '@/types'
import { 
  FolderOpen, 
  Edit,
  Trash2,
  Calendar,
  CheckSquare,
  TrendingUp
} from 'lucide-react'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'

interface ProjectCardProps {
  project: Project
  onEdit: (project: Project) => void
  onDelete: (projectId: string) => void
  getCompletionRate: (project: Project) => number
}

export const ProjectCard = ({ project, onEdit, onDelete, getCompletionRate }: ProjectCardProps) => {
  const completionRate = getCompletionRate(project)

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-2">
              <div 
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: project.color || '#3B82F6' }}
              ></div>
              <h3 className="text-lg font-semibold text-gray-900 truncate">
                {project.name}
              </h3>
            </div>
            
            {project.description && (
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {project.description}
              </p>
            )}

            <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
              <div className="flex items-center">
                <CheckSquare className="w-4 h-4 mr-1" />
                {project.taskCount}개 작업
              </div>
              <div className="flex items-center">
                <TrendingUp className="w-4 h-4 mr-1" />
                {project.completedTaskCount}개 완료
              </div>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                {formatDate(project.createdAt)}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-gray-600">진행률</span>
                <span className="text-gray-900 font-medium">
                  {completionRate.toFixed(0)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="h-2 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${completionRate}%`,
                    backgroundColor: project.color || '#3B82F6'
                  }}
                ></div>
              </div>
            </div>

            {project.isArchived && (
              <Badge variant="outline" className="text-gray-500">
                보관됨
              </Badge>
            )}
          </div>

          <div className="flex flex-col space-y-1 ml-4">
            <Button
              size="sm"
              variant="outline"
              asChild
            >
              <Link href={`/projects/${project.id}`}>
                <FolderOpen className="w-4 h-4" />
              </Link>
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onEdit(project)}
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onDelete(project.id)}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
