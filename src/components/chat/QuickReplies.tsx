'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { QuickReply, DEFAULT_QUICK_REPLIES } from '@/types/chat.types';
import { ChefHat, Clock, HelpCircle, Lightbulb, Carrot } from 'lucide-react';

interface QuickRepliesProps {
  quickReplies?: QuickReply[];
  onQuickReply: (text: string) => void;
  disabled?: boolean;
  showDefault?: boolean;
  className?: string;
}

const categoryIcons = {
  recipe: ChefHat,
  cooking: Lightbulb,
  general: HelpCircle,
};

const categoryColors = {
  recipe: 'from-orange-500 to-amber-500',
  cooking: 'from-blue-500 to-indigo-500', 
  general: 'from-gray-500 to-gray-600',
};

export function QuickReplies({
  quickReplies,
  onQuickReply,
  disabled = false,
  showDefault = true,
  className,
}: QuickRepliesProps) {
  const replies = quickReplies || (showDefault ? DEFAULT_QUICK_REPLIES : []);

  if (replies.length === 0) {
    return null;
  }

  return (
    <div className={cn("w-full", className)}>
      {/* 제목 */}
      <div className="flex items-center gap-2 mb-3 px-4">
        <div className="w-2 h-2 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full" />
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          빠른 답변
        </span>
      </div>

      {/* 빠른 답변 버튼들 */}
      <div className="flex flex-wrap gap-2 px-4">
        <AnimatePresence>
          {replies.map((reply, index) => {
            const IconComponent = categoryIcons[reply.category];
            const gradientColor = categoryColors[reply.category];

            return (
              <motion.button
                key={reply.id}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -20 }}
                transition={{ 
                  duration: 0.2, 
                  delay: index * 0.05,
                  type: "spring",
                  stiffness: 200,
                  damping: 20 
                }}
                whileHover={{ 
                  scale: 1.02,
                  y: -2,
                  transition: { duration: 0.1 }
                }}
                whileTap={{ 
                  scale: 0.98,
                  transition: { duration: 0.05 }
                }}
                onClick={() => onQuickReply(reply.text)}
                disabled={disabled}
                className={cn(
                  "group relative flex items-center gap-2 px-4 py-2.5 rounded-xl",
                  "bg-white dark:bg-gray-800 shadow-sm hover:shadow-md",
                  "border border-gray-200 dark:border-gray-700",
                  "transition-all duration-200",
                  "text-sm font-medium text-gray-700 dark:text-gray-300",
                  "disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none",
                  "overflow-hidden"
                )}
              >
                {/* 호버 시 그라데이션 배경 */}
                <div 
                  className={cn(
                    "absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-10 transition-opacity duration-200",
                    gradientColor
                  )}
                />

                {/* 아이콘 */}
                <div className={cn(
                  "relative z-10 flex items-center justify-center w-6 h-6 rounded-lg bg-gradient-to-r text-white",
                  gradientColor
                )}>
                  {reply.icon ? (
                    <span className="text-xs">{reply.icon}</span>
                  ) : IconComponent ? (
                    <IconComponent className="w-3.5 h-3.5" />
                  ) : (
                    <ChefHat className="w-3.5 h-3.5" />
                  )}
                </div>

                {/* 텍스트 */}
                <span className="relative z-10 whitespace-nowrap">
                  {reply.text}
                </span>

                {/* 카테고리 표시 (작은 점) */}
                <div 
                  className={cn(
                    "relative z-10 w-1.5 h-1.5 rounded-full bg-gradient-to-r opacity-60",
                    gradientColor
                  )}
                />
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>

      {/* 설명 텍스트 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-3 px-4 text-xs text-gray-500 dark:text-gray-400"
      >
        💡 빠른 답변을 선택하거나 직접 메시지를 입력하세요
      </motion.div>
    </div>
  );
}

// 개별 빠른 답변 버튼 컴포넌트 (재사용 가능)
interface QuickReplyButtonProps {
  reply: QuickReply;
  onClick: (text: string) => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function QuickReplyButton({ 
  reply, 
  onClick, 
  disabled = false,
  size = 'md' 
}: QuickReplyButtonProps) {
  const IconComponent = categoryIcons[reply.category];
  const gradientColor = categoryColors[reply.category];

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2.5 text-sm", 
    lg: "px-6 py-3 text-base",
  };

  return (
    <motion.button
      whileHover={{ 
        scale: 1.02,
        y: -2,
        transition: { duration: 0.1 }
      }}
      whileTap={{ 
        scale: 0.98,
        transition: { duration: 0.05 }
      }}
      onClick={() => onClick(reply.text)}
      disabled={disabled}
      className={cn(
        "group relative flex items-center gap-2 rounded-xl",
        "bg-white dark:bg-gray-800 shadow-sm hover:shadow-md",
        "border border-gray-200 dark:border-gray-700",
        "transition-all duration-200",
        "font-medium text-gray-700 dark:text-gray-300",
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none",
        "overflow-hidden",
        sizes[size]
      )}
    >
      {/* 호버 시 그라데이션 배경 */}
      <div 
        className={cn(
          "absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-10 transition-opacity duration-200",
          gradientColor
        )}
      />

      {/* 아이콘 */}
      <div className={cn(
        "relative z-10 flex items-center justify-center rounded-lg bg-gradient-to-r text-white",
        size === 'sm' ? "w-5 h-5" : size === 'lg' ? "w-7 h-7" : "w-6 h-6",
        gradientColor
      )}>
        {reply.icon ? (
          <span className={size === 'sm' ? "text-xs" : "text-sm"}>{reply.icon}</span>
        ) : IconComponent ? (
          <IconComponent className={size === 'sm' ? "w-3 h-3" : size === 'lg' ? "w-4 h-4" : "w-3.5 h-3.5"} />
        ) : (
          <ChefHat className={size === 'sm' ? "w-3 h-3" : size === 'lg' ? "w-4 h-4" : "w-3.5 h-3.5"} />
        )}
      </div>

      {/* 텍스트 */}
      <span className="relative z-10 whitespace-nowrap">
        {reply.text}
      </span>
    </motion.button>
  );
}