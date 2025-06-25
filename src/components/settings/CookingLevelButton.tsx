// frontend/src/components/settings/CookingLevelButton.tsx
'use client';

import { useState } from 'react';
import { useUserProfile } from '@/hooks/useUserProfile';
import { ChefHat, Star, Flame, Settings } from 'lucide-react';
import { CookingLevelSidebar } from './CookingLevelSidebar';

const LEVEL_ICONS = {
    '초급': ChefHat,
    '중급': Star,
    '고급': Flame,
};

const LEVEL_COLORS = {
    '초급': 'text-green-500',
    '중급': 'text-orange-500',
    '고급': 'text-red-500',
};

export function CookingLevelButton() {
    const [isOpen, setIsOpen] = useState(false);
    const { cookingLevel, isLoading } = useUserProfile();

    const Icon = LEVEL_ICONS[cookingLevel as keyof typeof LEVEL_ICONS] || ChefHat;
    const iconColor = LEVEL_COLORS[cookingLevel as keyof typeof LEVEL_COLORS] || 'text-gray-500';

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center space-x-2 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg hover:shadow-md transition-all duration-200 group"
                disabled={isLoading}
            >
                <div className={iconColor}>
                    <Icon className="h-5 w-5" />
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {isLoading ? '로딩...' : cookingLevel}
        </span>
                <Settings className="h-4 w-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" />
            </button>

            <CookingLevelSidebar
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
            />
        </>
    );
}