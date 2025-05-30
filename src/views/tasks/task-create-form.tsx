import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Brain } from 'lucide-react'

interface TaskCreateFormProps {
  naturalLanguageInput: string
  isCreating: boolean
  isFormValid: boolean
  onInputChange: (value: string) => void
  onCreate: () => Promise<void>
  onCancel: () => void
  onKeyPress: (e: React.KeyboardEvent) => void
}

export const TaskCreateForm = ({ 
  naturalLanguageInput, 
  isCreating, 
  isFormValid,
  onInputChange, 
  onCreate, 
  onCancel,
  onKeyPress
}: TaskCreateFormProps) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center">
        <Brain className="w-5 h-5 mr-2 text-purple-600" />
        AI로 작업 생성하기
      </CardTitle>
      <CardDescription>
        자연어로 작업을 설명하면 AI가 자동으로 구조화된 작업을 생성합니다.
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        <Input
          placeholder="예: 내일까지 프로젝트 보고서 작성하고 팀에게 공유하기"
          value={naturalLanguageInput}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyPress={onKeyPress}
        />
        <div className="flex space-x-2">
          <Button 
            onClick={onCreate}
            disabled={isCreating || !isFormValid}
          >
            {isCreating ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                AI가 생성 중...
              </div>
            ) : (
              '작업 생성'
            )}
          </Button>
          <Button variant="outline" onClick={onCancel}>
            취소
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>
)
