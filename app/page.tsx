import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Brain, Zap, Target, MessageSquare } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Brain className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              TaskMind AI
            </h1>
          </div>
          <div className="space-x-4">
            <Link href="/login">
              <Button variant="ghost">로그인</Button>
            </Link>
            <Link href="/register">
              <Button>회원가입</Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
            AI가 도와주는 <span className="text-blue-600">스마트 할 일 관리</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            자연어로 할 일을 입력하면 LangGraph 워크플로우가 자동으로 분석하고 
            우선순위를 제안합니다. Qwen 2.5 모델로 0.5초 만에 빠른 응답!
          </p>
          <div className="space-x-4">
            <Link href="/dashboard">
              <Button size="lg" className="text-lg px-8 py-3">
                시작하기
              </Button>
            </Link>
            <Link href="#features">
              <Button variant="outline" size="lg" className="text-lg px-8 py-3">
                기능 보기
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            TaskMind AI의 특별한 기능
          </h3>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            LangGraph와 Qwen 2.5 모델을 활용한 차세대 할 일 관리 시스템
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="text-center">
            <CardHeader>
              <MessageSquare className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <CardTitle>자연어 입력</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                "내일까지 김팀장님께 보고서 제출하기"처럼 자연스럽게 입력하세요
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Zap className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
              <CardTitle>빠른 AI 처리</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Qwen 2.5 모델로 0.5초 만에 할 일을 분석하고 구조화합니다
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Target className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <CardTitle>스마트 우선순위</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                LangGraph 워크플로우가 자동으로 우선순위를 분석하고 제안합니다
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Brain className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <CardTitle>AI 인사이트</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                프로젝트 진행 상황을 분석하고 개선 방안을 제안합니다
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-2xl mx-auto">
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            지금 시작해보세요
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            무료로 TaskMind AI를 체험하고 더 스마트한 할 일 관리를 경험하세요
          </p>
          <Link href="/dashboard">
            <Button size="lg" className="text-lg px-8 py-3">
              무료로 시작하기
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-8 text-center text-gray-600 dark:text-gray-400">
          <p>&copy; 2024 TaskMind AI. LangGraph 기반 지능형 할 일 관리 시스템.</p>
        </div>
      </footer>
    </div>
  )
}
