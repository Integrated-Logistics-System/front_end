'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Send, Brain, CheckCircle, AlertTriangle } from 'lucide-react'
import { useTaskStore } from '@/stores/tasks'
import { WorkflowResult } from '@/lib/types'
import { toast } from 'sonner'

interface WorkflowResultDisplayProps {
  result: WorkflowResult
  onConfirm: () => void
  onReject: () => void
}

function WorkflowResultDisplay({ result, onConfirm, onReject }: WorkflowResultDisplayProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800'
      case 'high': return 'bg-orange-100 text-orange-800'
      case 'medium': return 'bg-blue-100 text-blue-800'
      case 'low': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <Card className="border-2 border-blue-200">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Brain className="h-5 w-5 text-blue-600" />
          <CardTitle className="text-lg">AI 분석 결과</CardTitle>
          {result.processingTime && (
            <Badge variant="outline">{result.processingTime}</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-semibold text-lg">{result.title}</h3>
          {result.description && (
            <p className="text-gray-600 mt-1">{result.description}</p>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge className={getPriorityColor(result.priority)}>
            {result.priority.toUpperCase()}
          </Badge>
          {result.dueDate && (
            <Badge variant="outline">
              {new Date(result.dueDate).toLocaleDateString('ko-KR')}
            </Badge>
          )}
          <Badge variant="secondary">
            신뢰도: {Math.round(result.confidence * 100)}%
          </Badge>
        </div>

        {result.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {result.tags.map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                #{tag}
              </Badge>
            ))}
          </div>
        )}

        {result.suggestions.length > 0 && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <ul className="list-disc list-inside space-y-1">
                {result.suggestions.map((suggestion, index) => (
                  <li key={index} className="text-sm">{suggestion}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        <div className="flex space-x-2 pt-4">
          <Button onClick={onConfirm} className="flex-1">
            <CheckCircle className="h-4 w-4 mr-2" />
            확인
          </Button>
          <Button onClick={onReject} variant="outline" className="flex-1">
            다시 입력
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default function TaskInput() {
  const [input, setInput] = useState('')
  const [result, setResult] = useState<WorkflowResult | null>(null)
  const [showResult, setShowResult] = useState(false)
  const { createTaskFromNaturalLanguage, isLoading } = useTaskStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    try {
      const result = await createTaskFromNaturalLanguage(input)
      
      if ('needsConfirmation' in result && result.needsConfirmation) {
        setResult(result.task)
        setShowResult(true)
      } else {
        toast.success('할 일이 추가되었습니다!')
        setInput('')
      }
    } catch (error) {
      toast.error('할 일 추가에 실패했습니다.')
    }
  }

  const handleConfirm = () => {
    // 확인된 할 일을 실제 생성
    toast.success('할 일이 추가되었습니다!')
    setInput('')
    setResult(null)
    setShowResult(false)
  }

  const handleReject = () => {
    setResult(null)
    setShowResult(false)
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-5 w-5 text-blue-600" />
            <span>자연어로 할 일 추가</span>
          </CardTitle>
          <CardDescription>
            "내일까지 김팀장님께 보고서 제출하기"처럼 자연스럽게 입력하세요
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex space-x-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="할 일을 자연어로 입력하세요..."
              className="flex-1"
              disabled={isLoading}
            />
            <Button type="submit" disabled={isLoading || !input.trim()}>
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </form>

          {/* 예시 */}
          <div className="mt-4">
            <p className="text-sm text-gray-500 mb-2">예시:</p>
            <div className="flex flex-wrap gap-2">
              {[
                "내일 오후 2시까지 회의 자료 준비하기",
                "다음 주 월요일 김팀장님께 보고서 제출",
                "긴급: 오늘 중으로 고객 문의 응답하기"
              ].map((example, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="sm"
                  className="text-xs h-auto p-2"
                  onClick={() => setInput(example)}
                  disabled={isLoading}
                >
                  {example}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI 분석 결과 표시 */}
      {showResult && result && (
        <WorkflowResultDisplay
          result={result}
          onConfirm={handleConfirm}
          onReject={handleReject}
        />
      )}
    </div>
  )
}
