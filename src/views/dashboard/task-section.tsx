import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Task } from '@/types'
import { TaskItem } from './task-item'
import Link from 'next/link'

interface TaskSectionProps {
  title: string
  description: string
  tasks: Task[]
  icon: React.ReactNode
  emptyMessage: string
  linkHref?: string
  titleColor?: string
}

export const TaskSection = ({ 
  title, 
  description, 
  tasks, 
  icon, 
  emptyMessage, 
  linkHref,
  titleColor = 'text-gray-900'
}: TaskSectionProps) => (
  <Card>
    <CardHeader>
      <CardTitle className={`flex items-center ${titleColor}`}>
        {icon}
        {title}
      </CardTitle>
      <CardDescription>
        {description} ({tasks.length}개)
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-3">
        {tasks.length > 0 ? (
          tasks.slice(0, 5).map((task) => (
            <TaskItem key={task.id} task={task} />
          ))
        ) : (
          <p className="text-gray-500 text-center py-4">
            {emptyMessage}
          </p>
        )}
        {tasks.length > 5 && linkHref && (
          <Button variant="outline" size="sm" asChild className="w-full">
            <Link href={linkHref}>
              {tasks.length - 5}개 더 보기
            </Link>
          </Button>
        )}
      </div>
    </CardContent>
  </Card>
)
