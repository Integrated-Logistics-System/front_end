import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface ProjectFormProps {
  formData: {
    name: string
    description: string
    color: string
  }
  isSubmitting: boolean
  editingProject: any
  isFormValid: boolean
  onSubmit: (e: React.FormEvent) => Promise<void>
  onCancel: () => void
  onFormDataChange: (updates: Partial<typeof formData>) => void
}

export const ProjectForm = ({ 
  formData, 
  isSubmitting, 
  editingProject, 
  isFormValid,
  onSubmit, 
  onCancel,
  onFormDataChange
}: ProjectFormProps) => (
  <Card>
    <CardHeader>
      <CardTitle>
        {editingProject ? '프로젝트 수정' : '새 프로젝트 만들기'}
      </CardTitle>
      <CardDescription>
        프로젝트 정보를 입력하여 작업들을 체계적으로 관리하세요.
      </CardDescription>
    </CardHeader>
    <CardContent>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            프로젝트 이름 *
          </label>
          <Input
            placeholder="프로젝트 이름을 입력하세요"
            value={formData.name}
            onChange={(e) => onFormDataChange({ name: e.target.value })}
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            설명
          </label>
          <Input
            placeholder="프로젝트에 대한 설명을 입력하세요"
            value={formData.description}
            onChange={(e) => onFormDataChange({ description: e.target.value })}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            프로젝트 색상
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="color"
              value={formData.color}
              onChange={(e) => onFormDataChange({ color: e.target.value })}
              className="w-10 h-10 rounded border border-gray-300"
            />
            <Input
              value={formData.color}
              onChange={(e) => onFormDataChange({ color: e.target.value })}
              placeholder="#3B82F6"
              className="flex-1"
            />
          </div>
        </div>

        <div className="flex space-x-2">
          <Button 
            type="submit" 
            disabled={isSubmitting || !isFormValid}
          >
            {isSubmitting ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {editingProject ? '수정 중...' : '생성 중...'}
              </div>
            ) : (
              editingProject ? '프로젝트 수정' : '프로젝트 생성'
            )}
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            취소
          </Button>
        </div>
      </form>
    </CardContent>
  </Card>
)
