import React, { useState, useEffect } from 'react';
import { useUserStatus } from '@/hooks/useUserStatus';
import { STATUS_TEMPLATES, CATEGORY_COLORS, StatusSuggestion } from '@/types/user-status.types';

interface UserStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function UserStatusModal({ isOpen, onClose }: UserStatusModalProps) {
  const { 
    status, 
    isLoading, 
    error, 
    lastSaved, 
    setStatus, 
    deleteStatus,
    validateStatus,
    sanitizeStatus,
    getStatusLengthInfo 
  } = useUserStatus();

  const [inputValue, setInputValue] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // 모달이 열릴 때 현재 상태로 초기화
  useEffect(() => {
    if (isOpen && status) {
      setInputValue(status.status);
    } else if (isOpen) {
      setInputValue('');
    }
  }, [isOpen, status]);

  // 실시간 검증
  useEffect(() => {
    if (inputValue.trim()) {
      const debounceTimer = setTimeout(async () => {
        try {
          const validation = await validateStatus(inputValue);
          setValidationError(validation.isValid ? null : validation.error || null);
        } catch (error) {
          setValidationError('검증 중 오류가 발생했습니다.');
        }
      }, 300);

      return () => clearTimeout(debounceTimer);
    } else {
      setValidationError(null);
    }
  }, [inputValue, validateStatus]);

  const handleSave = async () => {
    if (!inputValue.trim()) {
      setValidationError('상태를 입력해주세요.');
      return;
    }

    try {
      await setStatus(inputValue);
      onClose();
    } catch (error) {
      // 에러는 useUserStatus hook에서 toast로 처리됨
    }
  };

  const handleDelete = async () => {
    if (confirm('정말로 나의 상태를 삭제하시겠습니까?')) {
      try {
        await deleteStatus();
        setInputValue('');
        onClose();
      } catch (error) {
        // 에러는 useUserStatus hook에서 toast로 처리됨
      }
    }
  };

  const handleTemplateClick = (template: StatusSuggestion) => {
    setInputValue(template.value);
  };

  const getFilteredTemplates = () => {
    if (selectedCategory === 'all') {
      return STATUS_TEMPLATES;
    }
    return STATUS_TEMPLATES.filter(template => template.category === selectedCategory);
  };

  const lengthInfo = getStatusLengthInfo(inputValue);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">나의 상태 설정</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 본문 */}
        <div className="p-6 space-y-6">
          {/* 설명 */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-medium text-blue-900 mb-2">💡 나의 상태란?</h3>
            <p className="text-sm text-blue-700">
              AI가 더 개인화된 레시피를 추천할 수 있도록 현재 상황이나 선호도를 자유롭게 입력해주세요. 
              예: "요리 초보", "매운맛 못먹어요", "30분 이하 빠른 요리 선호" 등
            </p>
          </div>

          {/* 입력 영역 */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              나의 상태 (최대 50자)
            </label>
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(sanitizeStatus(e.target.value))}
              placeholder="현재 상황이나 요리 선호도를 자유롭게 입력해주세요..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={3}
              maxLength={50}
              disabled={isLoading}
            />
            
            {/* 글자 수 표시 */}
            <div className="flex justify-between items-center text-sm">
              <span className={`${lengthInfo.isValid ? 'text-gray-500' : 'text-red-500'}`}>
                {lengthInfo.length}/50자
                {lengthInfo.remaining > 0 && ` (${lengthInfo.remaining}자 남음)`}
              </span>
              {lastSaved && (
                <span className="text-gray-400">
                  마지막 저장: {lastSaved.toLocaleString()}
                </span>
              )}
            </div>

            {/* 에러 메시지 */}
            {(validationError || error) && (
              <p className="text-sm text-red-600">
                {validationError || error}
              </p>
            )}
          </div>

          {/* 템플릿 섹션 */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">빠른 입력 템플릿</h3>
            
            {/* 카테고리 필터 */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-gray-200 text-gray-800 font-medium'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                전체
              </button>
              <button
                onClick={() => setSelectedCategory('level')}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  selectedCategory === 'level'
                    ? 'bg-blue-200 text-blue-800 font-medium'
                    : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                }`}
              >
                요리 수준
              </button>
              <button
                onClick={() => setSelectedCategory('time')}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  selectedCategory === 'time'
                    ? 'bg-orange-200 text-orange-800 font-medium'
                    : 'bg-orange-100 text-orange-600 hover:bg-orange-200'
                }`}
              >
                시간
              </button>
              <button
                onClick={() => setSelectedCategory('preference')}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  selectedCategory === 'preference'
                    ? 'bg-green-200 text-green-800 font-medium'
                    : 'bg-green-100 text-green-600 hover:bg-green-200'
                }`}
              >
                맛 선호
              </button>
              <button
                onClick={() => setSelectedCategory('dietary')}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  selectedCategory === 'dietary'
                    ? 'bg-purple-200 text-purple-800 font-medium'
                    : 'bg-purple-100 text-purple-600 hover:bg-purple-200'
                }`}
              >
                식이 제한
              </button>
            </div>

            {/* 템플릿 버튼들 */}
            <div className="grid grid-cols-2 gap-2">
              {getFilteredTemplates().map((template, index) => (
                <button
                  key={index}
                  onClick={() => handleTemplateClick(template)}
                  className={`p-2 text-left text-sm rounded-lg border transition-colors hover:bg-gray-50 ${CATEGORY_COLORS[template.category]}`}
                  disabled={isLoading}
                >
                  {template.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 푸터 */}
        <div className="flex items-center justify-between p-6 border-t bg-gray-50">
          <div>
            {status && (
              <button
                onClick={handleDelete}
                disabled={isLoading}
                className="px-4 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
              >
                상태 삭제
              </button>
            )}
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
            >
              취소
            </button>
            <button
              onClick={handleSave}
              disabled={isLoading || !lengthInfo.isValid || !!validationError}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? '저장 중...' : '저장'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}