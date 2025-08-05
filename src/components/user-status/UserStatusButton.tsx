import React, { useState } from 'react';
import { useUserStatus } from '@/hooks/useUserStatus';
import UserStatusModal from './UserStatusModal';

interface UserStatusButtonProps {
  variant?: 'default' | 'compact' | 'icon';
  className?: string;
}

export default function UserStatusButton({ 
  variant = 'default', 
  className = '' 
}: UserStatusButtonProps) {
  const { status, isLoading, hasStatus } = useUserStatus();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // 아이콘만 표시하는 버전
  if (variant === 'icon') {
    return (
      <>
        <button
          onClick={handleClick}
          disabled={isLoading}
          className={`p-2 rounded-lg transition-colors ${
            hasStatus 
              ? 'bg-blue-100 text-blue-600 hover:bg-blue-200' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          } disabled:opacity-50 ${className}`}
          title={hasStatus ? `나의 상태: ${status?.status}` : '나의 상태 설정'}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </button>
        <UserStatusModal isOpen={isModalOpen} onClose={handleCloseModal} />
      </>
    );
  }

  // 컴팩트 버전
  if (variant === 'compact') {
    return (
      <>
        <button
          onClick={handleClick}
          disabled={isLoading}
          className={`inline-flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg transition-colors ${
            hasStatus 
              ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          } disabled:opacity-50 ${className}`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          {hasStatus ? status?.status : '상태 설정'}
        </button>
        <UserStatusModal isOpen={isModalOpen} onClose={handleCloseModal} />
      </>
    );
  }

  // 기본 버전 (카드 스타일)
  return (
    <>
      <div 
        className={`p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer ${className}`}
        onClick={handleClick}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${
              hasStatus ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
            }`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">나의 상태</h3>
              <p className="text-sm text-gray-500">
                {hasStatus ? status?.status : 'AI가 더 개인화된 추천을 할 수 있도록 상태를 설정해보세요'}
              </p>
            </div>
          </div>
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
        
        {hasStatus && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">
                {status?.lastUpdated ? `${new Date(status.lastUpdated).toLocaleDateString()} 업데이트` : ''}
              </span>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                status?.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
              }`}>
                {status?.isActive ? '활성' : '비활성'}
              </span>
            </div>
          </div>
        )}
        
        {isLoading && (
          <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center rounded-lg">
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>
      
      <UserStatusModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </>
  );
}