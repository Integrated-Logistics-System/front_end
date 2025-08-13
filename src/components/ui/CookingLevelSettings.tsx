'use client';

import { useState } from 'react';
import { useRecoilState } from 'recoil';
import { X, ChefHat, Check, Star } from 'lucide-react';
import { cookingLevelState } from '@/store/chatStore';
import toast from 'react-hot-toast';

interface CookingLevelSettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

const COOKING_LEVELS = [
  {
    level: '초급',
    description: '기본적인 요리만 할 줄 아는 수준',
    icon: '🥄',
    color: 'text-green-400',
    bgColor: 'bg-green-900/40',
    borderColor: 'border-green-500/30'
  },
  {
    level: '중급',
    description: '다양한 요리를 어느 정도 할 줄 아는 수준',
    icon: '🍳',
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-900/40',
    borderColor: 'border-yellow-500/30'
  },
  {
    level: '고급',
    description: '복잡한 요리도 능숙하게 할 수 있는 수준',
    icon: '👨‍🍳',
    color: 'text-orange-400',
    bgColor: 'bg-orange-900/40',
    borderColor: 'border-orange-500/30'
  },
  {
    level: '전문가',
    description: '프로 수준의 요리 실력을 가진 수준',
    icon: '⭐',
    color: 'text-purple-400',
    bgColor: 'bg-purple-900/40',
    borderColor: 'border-purple-500/30'
  }
];

export function CookingLevelSettings({ isOpen, onClose }: CookingLevelSettingsProps) {
  const [cookingLevel, setCookingLevel] = useRecoilState(cookingLevelState);
  const [selectedLevel, setSelectedLevel] = useState(cookingLevel);

  const handleSave = () => {
    setCookingLevel(selectedLevel);
    toast.success(`요리 레벨이 '${selectedLevel}'으로 설정되었습니다`);
    onClose();
  };

  const handleCancel = () => {
    setSelectedLevel(cookingLevel);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-orange-500/30 shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-orange-500/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ChefHat className="h-6 w-6 text-orange-400" />
              <h2 className="text-xl font-bold text-white">요리 레벨 설정</h2>
            </div>
            <button
              onClick={handleCancel}
              className="p-2 text-orange-300 hover:text-white hover:bg-orange-700/50 rounded-lg transition-all duration-200"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <p className="text-orange-200 mt-2">
            요리 레벨을 설정하면 AI 셰프가 적절한 난이도의 레시피를 추천해드립니다.
          </p>
        </div>

        <div className="p-6">
          {/* Current Level */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Star className="h-5 w-5 text-orange-400" />
              <h3 className="text-lg font-semibold text-white">현재 레벨: {cookingLevel}</h3>
            </div>
          </div>

          {/* Level Options */}
          <div className="space-y-3 mb-8">
            <h3 className="text-lg font-semibold text-white mb-4">레벨 선택</h3>
            {COOKING_LEVELS.map((option) => {
              const isSelected = selectedLevel === option.level;
              return (
                <button
                  key={option.level}
                  onClick={() => setSelectedLevel(option.level)}
                  className={`w-full p-4 rounded-xl border transition-all duration-200 text-left ${
                    isSelected
                      ? `${option.bgColor} ${option.borderColor} ${option.color}`
                      : 'bg-gray-700/50 text-gray-200 border-gray-600/30 hover:bg-gray-600/50 hover:border-orange-500/30'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="text-2xl">{option.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-lg">{option.level}</span>
                        {isSelected && <Check className="h-4 w-4" />}
                      </div>
                      <p className="text-sm opacity-80">{option.description}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Level Comparison */}
          <div className="bg-gradient-to-br from-orange-800/40 to-amber-800/40 rounded-xl p-4 border border-orange-500/30 mb-6">
            <div className="flex items-center gap-2 mb-3">
              <ChefHat className="h-5 w-5 text-orange-400" />
              <h3 className="text-sm font-medium text-orange-300">레벨별 추천 요리</h3>
            </div>
            <div className="text-xs text-orange-200 space-y-1">
              <p>• <strong>초급</strong>: 간단한 볶음밥, 라면, 샐러드</p>
              <p>• <strong>중급</strong>: 파스타, 찌개, 구이 요리</p>
              <p>• <strong>고급</strong>: 스테이크, 리조또, 복잡한 양념 요리</p>
              <p>• <strong>전문가</strong>: 파인다이닝, 창작 요리, 고급 기법</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-orange-500/30 bg-gradient-to-r from-gray-900/50 to-gray-800/50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-orange-200">
              💡 레벨 설정은 로컬 스토리지에 자동 저장됩니다
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-lg transition-all duration-200"
              >
                취소
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-3 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white rounded-lg transition-all duration-200 flex items-center gap-2"
              >
                <Check className="h-4 w-4" />
                <span>저장</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}