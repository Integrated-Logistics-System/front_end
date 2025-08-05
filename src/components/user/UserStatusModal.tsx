'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { userStatusService } from '@/services/user-status.service';
import { 
  UserStatus, 
  STATUS_TEMPLATES, 
  CATEGORY_COLORS,
  type StatusSuggestion 
} from '@/types/user-status.types';
import { X, Save, User, Sparkles, Clock, Heart, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface UserStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved?: (userStatus: UserStatus) => void;
}

const CATEGORY_ICONS = {
  level: User,
  preference: Heart,
  time: Clock,
  dietary: Leaf,
};

export function UserStatusModal({ isOpen, onClose, onSaved }: UserStatusModalProps) {
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentStatus, setCurrentStatus] = useState<UserStatus | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  // 문자 수 정보
  const statusInfo = userStatusService.getStatusLengthInfo(status);

  // 현재 상태 로드
  useEffect(() => {
    if (isOpen) {
      loadCurrentStatus();
    }
  }, [isOpen]);

  const loadCurrentStatus = async () => {
    try {
      setIsLoading(true);
      const current = await userStatusService.getCurrentStatus();
      if (current) {
        setCurrentStatus(current);
        setStatus(current.status);
      }
    } catch (error) {
      console.error('상태 로드 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!statusInfo.isValid) {
      setError('올바른 상태를 입력해주세요.');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const sanitizedStatus = userStatusService.sanitizeStatus(status);
      const savedStatus = currentStatus 
        ? await userStatusService.updateStatus(sanitizedStatus)
        : await userStatusService.setStatus(sanitizedStatus);

      // 캐시 업데이트
      userStatusService.setCachedStatus(savedStatus);
      
      onSaved?.(savedStatus);
      onClose();
    } catch (error: any) {
      setError(error.message || '상태 저장에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTemplateSelect = (template: StatusSuggestion) => {
    setStatus(template.value);
    setSelectedTemplate(template.value);
    setError(null);
  };

  const handleInputChange = (value: string) => {
    setStatus(value);
    setSelectedTemplate(null);
    setError(null);
  };

  const handleClose = () => {
    setStatus('');
    setError(null);
    setSelectedTemplate(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* 배경 오버레이 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={handleClose}
        />

        {/* 모달 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-2xl max-h-[90vh] mx-4 bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden"
        >
          {/* 헤더 */}
          <div className="relative p-6 bg-gradient-to-r from-orange-500 to-amber-500">
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">나의 상태 설정</h2>
                  <p className="text-orange-100 text-sm">
                    AI가 더 맞춤형 레시피를 추천할 수 있도록 도와주세요
                  </p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="p-2 rounded-lg hover:bg-white/20 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="p-6 max-h-[calc(90vh-200px)] overflow-y-auto">
            {/* 현재 상태 표시 */}
            {currentStatus && (
              <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300 mb-2">
                  <User className="w-4 h-4" />
                  <span className="font-medium">현재 설정된 상태</span>
                </div>
                <p className="text-blue-600 dark:text-blue-400">"{currentStatus.status}"</p>
                <p className="text-xs text-blue-500 dark:text-blue-400 mt-1">
                  마지막 업데이트: {new Date(currentStatus.lastUpdated).toLocaleDateString('ko-KR')}
                </p>
              </div>
            )}

            {/* 입력 필드 */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                나의 상태 (최대 50자)
              </label>
              <div className="relative">
                <textarea
                  value={status}
                  onChange={(e) => handleInputChange(e.target.value)}
                  placeholder="예: 요리 초보이고 30분 이하 간단한 요리 선호"
                  maxLength={50}
                  rows={3}
                  className={cn(
                    "w-full px-4 py-3 border rounded-xl resize-none transition-colors",
                    "focus:outline-none focus:ring-2",
                    statusInfo.isValid
                      ? "border-gray-300 dark:border-gray-600 focus:ring-orange-500 focus:border-orange-500"
                      : "border-red-300 dark:border-red-600 focus:ring-red-500 focus:border-red-500",
                    "bg-white dark:bg-gray-700 text-gray-900 dark:text-white",
                    "placeholder-gray-500 dark:placeholder-gray-400"
                  )}
                />
                <div className="absolute bottom-3 right-3 text-xs text-gray-500 dark:text-gray-400">
                  {statusInfo.length}/50
                </div>
              </div>

              {/* 입력 상태 표시 */}
              <div className="mt-2 flex items-center justify-between">
                <div className="text-sm">
                  {statusInfo.remaining > 0 ? (
                    <span className="text-gray-600 dark:text-gray-400">
                      {statusInfo.remaining}자 남음
                    </span>
                  ) : statusInfo.length === 50 ? (
                    <span className="text-orange-600 dark:text-orange-400">
                      최대 글자 수에 도달했습니다
                    </span>
                  ) : null}
                </div>
                {statusInfo.isValid && (
                  <span className="text-green-600 dark:text-green-400 text-sm flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    입력 완료
                  </span>
                )}
              </div>
            </div>

            {/* 템플릿 제안 */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                빠른 설정 (클릭해서 선택)
              </h3>
              
              <div className="grid gap-4">
                {Object.entries({
                  level: '요리 수준',
                  time: '시간 선호',
                  preference: '맛 선호',
                  dietary: '식단 제한',
                }).map(([category, categoryName]) => {
                  const templates = STATUS_TEMPLATES.filter(t => t.category === category);
                  const IconComponent = CATEGORY_ICONS[category as keyof typeof CATEGORY_ICONS];
                  
                  return (
                    <div key={category}>
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-xs font-medium mb-2">
                        <IconComponent className="w-3 h-3" />
                        {categoryName}
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        {templates.map((template) => (
                          <motion.button
                            key={template.value}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleTemplateSelect(template)}
                            className={cn(
                              "px-3 py-2 rounded-lg text-sm font-medium transition-all",
                              "border border-gray-200 dark:border-gray-600",
                              selectedTemplate === template.value || status === template.value
                                ? "bg-orange-500 text-white border-orange-500"
                                : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-gray-600"
                            )}
                          >
                            {template.label}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 에러 메시지 */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
              >
                <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
              </motion.div>
            )}

            {/* 도움말 */}
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">
                💡 상태 설정 팁
              </h4>
              <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                <li>• 요리 수준, 시간 선호도, 맛 취향 등을 포함하면 더 정확한 추천을 받을 수 있어요</li>
                <li>• 알레르기나 못 먹는 음식이 있다면 함께 적어주세요</li>
                <li>• 간단하고 명확하게 작성할수록 AI가 더 잘 이해해요</li>
              </ul>
            </div>
          </div>

          {/* 하단 버튼 */}
          <div className="p-6 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
            <div className="flex items-center justify-end gap-3">
              <Button
                variant="ghost"
                onClick={handleClose}
                disabled={isLoading}
              >
                취소
              </Button>
              <Button
                variant="gradient"
                onClick={handleSave}
                disabled={!statusInfo.isValid || isLoading}
                isLoading={isLoading}
                className="flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {currentStatus ? '업데이트' : '저장'}
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}