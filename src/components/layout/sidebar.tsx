'use client'

import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuthStore } from '@/stores/auth'
import { Button } from '@/components/ui/button'
import { 
  Home, 
  CheckSquare, 
  FolderOpen, 
  Brain, 
  Settings, 
  LogOut, 
  User 
} from 'lucide-react'

const navigation = [
  { name: '대시보드', href: '/dashboard', icon: Home },
  { name: '작업', href: '/tasks', icon: CheckSquare },
  { name: '프로젝트', href: '/projects', icon: FolderOpen },
  { name: 'AI 어시스턴트', href: '/ai', icon: Brain },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuthStore()

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      {/* Logo */}
      <div className="flex items-center h-16 px-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-900">TaskMind</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* User section */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user?.name || '사용자'}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {user?.email}
            </p>
          </div>
        </div>
        
        <div className="space-y-1">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-gray-600 hover:text-gray-900"
          >
            <Settings className="w-4 h-4 mr-2" />
            설정
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="w-full justify-start text-gray-600 hover:text-gray-900"
          >
            <LogOut className="w-4 h-4 mr-2" />
            로그아웃
          </Button>
        </div>
      </div>
    </div>
  )
}
