'use client';

import Link from 'next/link';
import { ChefHat, Github, Mail, Phone } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* 브랜드 */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <ChefHat className="h-8 w-8 text-orange-500" />
              <span className="text-xl font-bold">AI Recipe</span>
            </div>
            <p className="text-gray-400 text-sm">
              RAG + LangChain-based personalized recipe recommendation system
            </p>
            <div className="flex space-x-6">
              <Link 
                href="https://github.com/choeseonghyeon/smart-recipe-chatbot" 
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-gray-400 hover:text-orange-400 transition-colors group"
                title="View Source Code on GitHub"
              >
                <Github className="h-5 w-5 group-hover:scale-110 transition-transform" />
                <span className="text-sm hidden sm:inline">GitHub</span>
              </Link>
              <Link 
                href="mailto:choi.seonghyeon.dev@gmail.com" 
                className="flex items-center space-x-2 text-gray-400 hover:text-orange-400 transition-colors group"
                title="Send Email"
              >
                <Mail className="h-5 w-5 group-hover:scale-110 transition-transform" />
                <span className="text-sm hidden sm:inline">Contact</span>
              </Link>
            </div>
          </div>

          {/* 기능 */}
          <div>
            <h3 className="font-semibold mb-4">Key Features</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/search" className="hover:text-white">Recipe Search</Link></li>
              <li><Link href="/chat" className="hover:text-white">AI Chat</Link></li>
              <li><Link href="/profile" className="hover:text-white">Allergy Profile</Link></li>
              <li><Link href="/favorites" className="hover:text-white">Favorites</Link></li>
            </ul>
          </div>

          {/* 기술 스택 */}
          <div>
            <h3 className="font-semibold mb-4">Tech Stack</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>Next.js 14</li>
              <li>NestJS</li>
              <li>LangChain</li>
              <li>Elasticsearch</li>
              <li>MongoDB</li>
              <li>Redis</li>
            </ul>
          </div>

          {/* 데이터 정보 */}
          <div>
            <h3 className="font-semibold mb-4">Data</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>📊 231,636 recipes</li>
              <li>🧬 15,244 allergen data points</li>
              <li>🏷️ 19 allergy types</li>
              <li>🔄 Real-time updates</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-400">
            © {currentYear} AI Recipe Assistant. Created by Choi Seong Hyeon.
          </p>
          <div className="flex space-x-6 text-sm text-gray-400 mt-4 md:mt-0">
            <Link href="/privacy" className="hover:text-orange-400 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-orange-400 transition-colors">Terms of Service</Link>
            <Link 
              href="mailto:choi.seonghyeon.dev@gmail.com" 
              className="hover:text-orange-400 transition-colors"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
