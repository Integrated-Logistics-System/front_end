// frontend/src/components/layout/Header.tsx
'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ChefHat, Menu, X, MessageCircle, Shield } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { AllergySettings } from '@/components/ui/AllergySettings';
import { motion, AnimatePresence } from 'framer-motion';
import { CookingLevelSidebar } from "@/components/settings/CookingLevelSidebar";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAllergySidebarOpen, setIsAllergySidebarOpen] = useState(false);
  const [isCookingLevelSidebarOpen, setIsCookingLevelSidebarOpen] = useState(false);

  const menuItems = [
    { href: '/chat', label: 'AI Chat', icon: MessageCircle },
  ];

  const handleCloseMenu = () => {
    setIsMenuOpen(false);
  };

  const handleCookingLevelClick = () => {
    setIsCookingLevelSidebarOpen(true);
  };

  return (
      <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-lg border-b border-gray-200 dark:bg-gray-900/80 dark:border-gray-700">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* 로고 */}
            <Link href="/" className="flex items-center space-x-2">
              <ChefHat className="h-8 w-8 text-orange-600" />
              <span className="text-xl font-bold gradient-text">
              AI Recipe
            </span>
            </Link>

            {/* 데스크톱 네비게이션 */}
            <nav className="hidden md:flex items-center space-x-8">
              {menuItems.map(({ href, label, icon: Icon }) => (
                  <Link
                      key={href}
                      href={href}
                      className="flex items-center space-x-1 text-gray-600 hover:text-orange-600 transition-colors"
                  >
                    <Icon className="h-4 w-4" />
                    <span>{label}</span>
                  </Link>
              ))}
            </nav>

            {/* 우측 액션 */}
            <div className="flex items-center space-x-4">
              <ThemeToggle />

              {/* 알레르기 설정 버튼 */}
              <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsAllergySidebarOpen(true)}
                  className="flex items-center space-x-1 hidden sm:flex"
              >
                <Shield className="h-4 w-4" />
                <span>알레르기</span>
              </Button>

              {/* 쿠킹 레벨 설정 버튼 */}
              <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCookingLevelClick}
                  className="flex items-center space-x-1 hidden sm:flex"
              >
                <ChefHat className="h-4 w-4" />
                <span>요리수준</span>
              </Button>

              {/* 모바일 메뉴 버튼 */}
              <Button
                  variant="ghost"
                  size="sm"
                  className="md:hidden h-9 w-9 p-0"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? (
                    <X className="h-5 w-5" />
                ) : (
                    <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* 모바일 메뉴 */}
        <AnimatePresence>
          {isMenuOpen && (
              <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="md:hidden bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700"
              >
                <div className="container mx-auto px-4 py-4 space-y-3">
                  {menuItems.map(({ href, label, icon: Icon }) => (
                      <Link
                          key={href}
                          href={href}
                          className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                          onClick={handleCloseMenu}
                      >
                        <Icon className="h-5 w-5 text-orange-600" />
                        <span>{label}</span>
                      </Link>
                  ))}

                  {/* 모바일 알레르기 설정 버튼 */}
                  <button
                      onClick={() => {
                        setIsAllergySidebarOpen(true);
                        handleCloseMenu();
                      }}
                      className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <Shield className="h-5 w-5 text-red-600" />
                    <span>알레르기 설정</span>
                  </button>

                  {/* 모바일 쿠킹 레벨 설정 버튼 */}
                  <button
                      onClick={() => {
                        setIsCookingLevelSidebarOpen(true);
                        handleCloseMenu();
                      }}
                      className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <ChefHat className="h-5 w-5 text-orange-600" />
                    <span>요리 수준 설정</span>
                  </button>
                </div>
              </motion.div>
          )}
        </AnimatePresence>

        {/* 알레르기 설정 사이드바 */}
        <AllergySettings
            isOpen={isAllergySidebarOpen}
            onClose={() => setIsAllergySidebarOpen(false)}
        />

        {/* 쿠킹 레벨 설정 사이드바 */}
        <CookingLevelSidebar
            isOpen={isCookingLevelSidebarOpen}
            onClose={() => setIsCookingLevelSidebarOpen(false)}
        />
      </header>
  );
}