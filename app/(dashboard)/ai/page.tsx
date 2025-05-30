'use client'

import { useEffect, useState } from 'react'
import { apiClient } from '@/lib/api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { 
  Brain, 
  MessageSquare, 
  Wand2, 
  BarChart3, 
  Lightbulb,
  Send,
  Loader2,
  CheckCircle,
  AlertCircle,
  Sparkles
} from 'lucide-react'
import { formatDateTime } from '@/lib/utils'
import toast from 'react-hot-toast'

interface ConversationMessage {
  id: string
  type: 'user' | 'assistant'
  content: string
  timestamp: string
}

interface WorkflowResult {
  input: string
  result?: any
  error?: string
  processingTime: string
  workflow: string
  timestamp: string
}

export default function AIPage() {
  const [capabilities, setCapabilities] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  
  // Chat state
  const [chatInput, setChatInput] = useState('')
  const [conversation, setConversation] = useState<ConversationMessage[]>([])
  const [isChatLoading, setIsChatLoading] = useState(false)
  
  // Workflow states
  const [naturalLanguageInput, setNaturalLanguageInput] = useState('')
  const [questionInput, setQuestionInput] = useState('')
  const [workflowResults, setWorkflowResults] = useState<WorkflowResult[]>([])
  
  // Analysis states
  const [analysisInput, setAnalysisInput] = useState('')

  useEffect(() => {
    loadCapabilities()
  }, [])

  const loadCapabilities = async () => {
    try {
      const caps = await apiClient.getAICapabilities()
      setCapabilities(caps)
    } catch (error) {
      console.error('Failed to load AI capabilities:', error)
    }
  }

  const handleChat = async () => {
    if (!chatInput.trim()) return

    const userMessage: ConversationMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: chatInput,
      timestamp: new Date().toISOString()
    }

    setConversation(prev => [...prev, userMessage])
    setChatInput('')
    setIsChatLoading(true)

    try {
      const response = await apiClient.conversation({
        message: chatInput,
        conversationHistory: conversation,
        context: {}
      })

      const assistantMessage: ConversationMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response.response || response.result || '응답을 받지 못했습니다.',
        timestamp: new Date().toISOString()
      }

      setConversation(prev => [...prev, assistantMessage])
    } catch (error) {
      toast.error('AI 응답을 받는데 실패했습니다.')
      const errorMessage: ConversationMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: '죄송합니다. 현재 응답할 수 없습니다.',
        timestamp: new Date().toISOString()
      }
      setConversation(prev => [...prev, errorMessage])
    } finally {
      setIsChatLoading(false)
    }
  }

  const handleWorkflow = async (workflowType: string, input: string) => {
    if (!input.trim()) return

    setIsLoading(true)
    try {
      let response
      switch (workflowType) {
        case 'natural-language':
          response = await apiClient.advancedTaskCreation({
            input,
            userId: 'current-user' // This should come from auth store
          })
          break
        case 'question':
          response = await apiClient.askQuestion({
            question: input,
            context: ''
          })
          break
        case 'simple-workflow':
          response = await apiClient.testWorkflow({ input })
          break
        default:
          throw new Error('Unknown workflow type')
      }

      setWorkflowResults(prev => [response, ...prev])
      
      // Clear input based on workflow type
      if (workflowType === 'natural-language') setNaturalLanguageInput('')
      if (workflowType === 'question') setQuestionInput('')
      
      toast.success('AI 처리가 완료되었습니다!')
    } catch (error) {
      toast.error('AI 처리에 실패했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  const WorkflowCard = ({ workflow }: { workflow: any }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center text-sm">
          {workflow.type === '🔥 langgraph' && (
            <Sparkles className="w-4 h-4 mr-2 text-orange-500" />
          )}
          <Brain className="w-4 h-4 mr-2 text-purple-600" />
          {workflow.name}
        </CardTitle>
        <CardDescription className="text-xs">
          {workflow.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <Badge 
            variant={workflow.type === '🔥 langgraph' ? 'default' : 'outline'}
            className={workflow.type === '🔥 langgraph' ? 'bg-orange-500' : ''}
          >
            {workflow.type}
          </Badge>
          <span className="text-xs text-gray-500">
            {workflow.endpoint}
          </span>
        </div>
      </CardContent>
    </Card>
  )

  const ResultCard = ({ result }: { result: WorkflowResult }) => (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-sm">
          <span className="flex items-center">
            {result.error ? (
              <AlertCircle className="w-4 h-4 mr-2 text-red-500" />
            ) : (
              <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
            )}
            {result.workflow}
          </span>
          <Badge variant="outline" className="text-xs">
            {result.processingTime}
          </Badge>
        </CardTitle>
        <CardDescription className="text-xs">
          {formatDateTime(result.timestamp)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-1">입력:</h4>
            <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
              {result.input}
            </p>
          </div>
          
          {result.error ? (
            <div>
              <h4 className="text-sm font-medium text-red-700 mb-1">오류:</h4>
              <p className="text-sm text-red-600 bg-red-50 p-2 rounded">
                {result.error}
              </p>
            </div>
          ) : (
            <div>
              <h4 className="text-sm font-medium text-green-700 mb-1">결과:</h4>
              <div className="text-sm text-gray-600 bg-green-50 p-2 rounded">
                <pre className="whitespace-pre-wrap">
                  {typeof result.result === 'string' 
                    ? result.result 
                    : JSON.stringify(result.result, null, 2)
                  }
                </pre>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">AI 어시스턴트</h1>
        <Badge variant="outline" className="text-purple-600 bg-purple-50">
          <Brain className="w-4 h-4 mr-1" />
          AI Powered
        </Badge>
      </div>

      {/* AI Capabilities Overview */}
      {capabilities && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="w-5 h-5 mr-2" />
              AI 기능 현황
            </CardTitle>
            <CardDescription>
              사용 가능한 AI 워크플로우와 기능들
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {capabilities.workflows?.map((workflow: any, index: number) => (
                <WorkflowCard key={index} workflow={workflow} />
              ))}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">지원 기능</h4>
                <div className="space-y-1">
                  {capabilities.features?.map((feature: string, index: number) => (
                    <div key={index} className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="w-3 h-3 mr-2 text-green-500" />
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">AI 모델</h4>
                <div className="space-y-1">
                  <div className="text-sm">
                    <span className="font-medium">기본 모델:</span> {capabilities.models?.default}
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">지원 모델:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {capabilities.models?.supported?.map((model: string, index: number) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {model}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chat Interface */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageSquare className="w-5 h-5 mr-2" />
              AI 대화
            </CardTitle>
            <CardDescription>
              AI와 자연스럽게 대화하며 도움을 받으세요
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Chat Messages */}
            <div className="h-64 overflow-y-auto mb-4 p-3 bg-gray-50 rounded-lg">
              {conversation.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <MessageSquare className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm">AI와 대화를 시작해보세요!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {conversation.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                          message.type === 'user'
                            ? 'bg-blue-500 text-white'
                            : 'bg-white border border-gray-200 text-gray-800'
                        }`}
                      >
                        {message.content}
                      </div>
                    </div>
                  ))}
                  {isChatLoading && (
                    <div className="flex justify-start">
                      <div className="bg-white border border-gray-200 px-3 py-2 rounded-lg">
                        <Loader2 className="w-4 h-4 animate-spin" />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Chat Input */}
            <div className="flex space-x-2">
              <Input
                placeholder="AI에게 질문하거나 도움을 요청하세요..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleChat()}
                disabled={isChatLoading}
              />
              <Button 
                onClick={handleChat} 
                disabled={isChatLoading || !chatInput.trim()}
                size="sm"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Wand2 className="w-5 h-5 mr-2" />
              빠른 AI 작업
            </CardTitle>
            <CardDescription>
              자주 사용하는 AI 기능들을 빠르게 실행하세요
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Natural Language Task Creation */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                자연어 작업 생성
              </label>
              <div className="flex space-x-2">
                <Input
                  placeholder="예: 내일까지 보고서 작성하기"
                  value={naturalLanguageInput}
                  onChange={(e) => setNaturalLanguageInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleWorkflow('natural-language', naturalLanguageInput)}
                />
                <Button 
                  onClick={() => handleWorkflow('natural-language', naturalLanguageInput)}
                  disabled={isLoading || !naturalLanguageInput.trim()}
                  size="sm"
                >
                  <Sparkles className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Question Answering */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                질문하기
              </label>
              <div className="flex space-x-2">
                <Input
                  placeholder="AI에게 질문하세요"
                  value={questionInput}
                  onChange={(e) => setQuestionInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleWorkflow('question', questionInput)}
                />
                <Button 
                  onClick={() => handleWorkflow('question', questionInput)}
                  disabled={isLoading || !questionInput.trim()}
                  size="sm"
                >
                  <Lightbulb className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Analysis Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                작업 패턴 분석
              </label>
              <Textarea
                placeholder="분석할 내용을 입력하세요..."
                value={analysisInput}
                onChange={(e) => setAnalysisInput(e.target.value)}
                rows={3}
              />
              <Button 
                className="mt-2 w-full"
                onClick={() => handleWorkflow('simple-workflow', analysisInput)}
                disabled={isLoading || !analysisInput.trim()}
                size="sm"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                분석 실행
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Workflow Results */}
      {workflowResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              AI 처리 결과
            </CardTitle>
            <CardDescription>
              최근 AI 워크플로우 실행 결과들
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="max-h-96 overflow-y-auto">
              {workflowResults.map((result, index) => (
                <ResultCard key={index} result={result} />
              ))}
            </div>
            {workflowResults.length > 5 && (
              <Button 
                variant="outline" 
                onClick={() => setWorkflowResults([])}
                className="w-full mt-4"
              >
                결과 초기화
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* AI Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Lightbulb className="w-5 h-5 mr-2" />
            AI 활용 팁
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900">자연어 작업 생성</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• "내일까지 보고서 작성하고 팀에게 공유"</li>
                <li>• "이번 주 금요일까지 프로젝트 계획서 완성"</li>
                <li>• "중요도 높음으로 회의 준비하기"</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900">효과적인 질문 방법</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 구체적이고 명확한 질문하기</li>
                <li>• 맥락 정보 포함하기</li>
                <li>• 원하는 답변 형태 명시하기</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Loading State */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg flex items-center space-x-3">
            <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
            <span className="text-gray-900">AI가 처리 중입니다...</span>
          </div>
        </div>
      )}
    </div>
  )
}
