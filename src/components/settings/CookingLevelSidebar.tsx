// frontend/src/components/settings/CookingLevelSidebar.tsx
'use client';

import { useState, useEffect } from 'react';
import { useUserProfile, COOKING_LEVELS, CookingLevel } from '@/hooks/useUserProfile';
import { X, ChefHat, Star, Flame, Check } from 'lucide-react';

interface CookingLevelSidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

const LEVEL_INFO = {
    '초급': {
        icon: ChefHat,
        color: 'text-green-500',
        bgColor: 'bg-green-50 dark:bg-green-900/20',
        borderColor: 'border-green-200 dark:border-green-700',
        description: '간단한 요리부터 시작하고 싶어요',
        features: ['15분 이내 간단 요리', '기본 재료 사용', '상세한 설명', '초보자 친화적']
    },
    '중급': {
        icon: Star,
        color: 'text-orange-500',
        bgColor: 'bg-orange-50 dark:bg-orange-900/20',
        borderColor: 'border-orange-200 dark:border-orange-700',
        description: '다양한 요리에 도전하고 싶어요',
        features: ['30분 내외 요리', '다양한 기법 활용', '창의적인 레시피', '중간 난이도']
    },
    '고급': {
        icon: Flame,
        color: 'text-red-500',
        bgColor: 'bg-red-50 dark:bg-red-900/20',
        borderColor: 'border-red-200 dark:border-red-700',
        description: '전문적인 요리를 만들고 싶어요',
        features: ['복잡한 요리법', '고급 기법', '전문 재료 활용', '전문가 수준']
    }
};

export function CookingLevelSidebar({ isOpen, onClose }: CookingLevelSidebarProps) {
    const { cookingLevel, updateCookingLevel } = useUserProfile();
    const [selectedLevel, setSelectedLevel] = useState<CookingLevel>(cookingLevel as CookingLevel);
    const [hasChanges, setHasChanges] = useState(false);

    useEffect(() => {
        setSelectedLevel(cookingLevel as CookingLevel);
        setHasChanges(false);
    }, [cookingLevel]);

    useEffect(() => {
        setHasChanges(selectedLevel !== cookingLevel);
    }, [selectedLevel, cookingLevel]);

    const handleLevelSelect = (level: CookingLevel) => {
        setSelectedLevel(level);
    };

    const handleSave = async () => {
        if (!hasChanges) return;

        try {
            await updateCookingLevel.mutateAsync(selectedLevel);
            onClose();
        } catch (error) {
            setSelectedLevel(cookingLevel as CookingLevel);
        }
    };

    const handleCancel = () => {
        setSelectedLevel(cookingLevel as CookingLevel);
        setHasChanges(false);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <>
            {/* 배경 오버레이 */}
            <div
                className="fixed inset-0 bg-black/50 z-40 transition-opacity"
                onClick={onClose}
            />

            {/* 사이드바 */}
            <div className="fixed right-0 top-0 h-full w-96 bg-white dark:bg-gray-900 shadow-xl z-50 transform transition-transform overflow-y-auto">
                {/* 헤더 */}
                <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                            🍳 요리 수준 설정
                        </h2>
                        <button
                            onClick={onClose}
                            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                        현재 수준: <span className="font-medium text-orange-500">{cookingLevel}</span>
                    </p>
                </div>

                {/* 내용 */}
                <div className="p-6">
                    {/* 안내 메시지 */}
                    <div className="mb-6 p-4 bg-orange-50 dark:bg-orange-900/10 rounded-lg">
                        <p className="text-sm text-orange-700 dark:text-orange-300">
                            💡 요리 수준에 따라 레시피의 복잡도와 조리 시간이 조정됩니다
                        </p>
                    </div>

                    {/* 레벨 선택 */}
                    <div className="space-y-4">
                        {COOKING_LEVELS.map((level) => {
                            const info = LEVEL_INFO[level];
                            const Icon = info.icon;
                            const isSelected = selectedLevel === level;
                            const isCurrent = cookingLevel === level;

                            return (
                                <div
                                    key={level}
                                    onClick={() => handleLevelSelect(level)}
                                    className={`
                    relative p-4 rounded-lg border-2 cursor-pointer transition-all duration-200
                    ${isSelected
                                        ? `${info.borderColor} ${info.bgColor} shadow-md`
                                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                                    }
                    hover:shadow-md
                  `}
                                >
                                    {/* 현재 레벨 표시 */}
                                    {isCurrent && (
                                        <div className="absolute top-2 left-2">
                                            <div className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-full font-medium">
                                                현재
                                            </div>
                                        </div>
                                    )}

                                    {/* 선택 표시 */}
                                    {isSelected && (
                                        <div className="absolute top-2 right-2">
                                            <div className={`w-6 h-6 rounded-full ${info.color.replace('text-', 'bg-')} flex items-center justify-center`}>
                                                <Check className="w-4 h-4 text-white" />
                                            </div>
                                        </div>
                                    )}

                                    {/* 아이콘과 레벨명 */}
                                    <div className="flex items-center mb-3">
                                        <div className={`mr-3 ${info.color}`}>
                                            <Icon className="h-6 w-6" />
                                        </div>
                                        <h3 className="font-semibold text-gray-900 dark:text-white">
                                            {level}
                                        </h3>
                                    </div>

                                    {/* 설명 */}
                                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                                        {info.description}
                                    </p>

                                    {/* 특징 */}
                                    <ul className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                                        {info.features.map((feature, index) => (
                                            <li key={index} className="flex items-center">
                                                <span className="w-1 h-1 bg-gray-400 rounded-full mr-2"></span>
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            );
                        })}
                    </div>

                    {/* 레벨별 예시 */}
                    <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                            {selectedLevel} 수준 예시 레시피
                        </h4>
                        <div className="text-sm text-gray-600 dark:text-gray-300">
                            {selectedLevel === '초급' && (
                                <ul className="space-y-1">
                                    <li>• 김치볶음밥</li>
                                    <li>• 계란말이</li>
                                    <li>• 라면 업그레이드</li>
                                </ul>
                            )}
                            {selectedLevel === '중급' && (
                                <ul className="space-y-1">
                                    <li>• 불고기</li>
                                    <li>• 파스타 요리</li>
                                    <li>• 갈비찜</li>
                                </ul>
                            )}
                            {selectedLevel === '고급' && (
                                <ul className="space-y-1">
                                    <li>• 프렌치 오니언 수프</li>
                                    <li>• 웰링턴 스테이크</li>
                                    <li>• 수플레</li>
                                </ul>
                            )}
                        </div>
                    </div>
                </div>

                {/* 하단 버튼 */}
                <div className="sticky bottom-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 px-6 py-4">
                    <div className="flex space-x-3">
                        <button
                            onClick={handleCancel}
                            className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        >
                            취소
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={!hasChanges || updateCookingLevel.isPending}
                            className={`
                flex-1 px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center
                ${hasChanges && !updateCookingLevel.isPending
                                ? 'bg-orange-500 text-white hover:bg-orange-600'
                                : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                            }
              `}
                        >
                            {updateCookingLevel.isPending ? (
                                <>
                                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                                    저장 중...
                                </>
                            ) : (
                                `${hasChanges ? '변경사항 저장' : '저장됨'}`
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}