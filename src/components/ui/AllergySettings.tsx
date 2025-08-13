'use client';

import { useState } from 'react';
import { useRecoilState } from 'recoil';
import { X, Plus, Shield, Check, AlertTriangle } from 'lucide-react';
import { userAllergiesState } from '@/store/chatStore';
import toast from 'react-hot-toast';

interface AllergySettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

const COMMON_ALLERGIES = [
  '견과류', '우유', '계란', '콩', '밀', '생선', '갑각류', '조개류',
  '토마토', '딸기', '복숭아', '키위', '바나나', '망고', '아보카도',
  '땅콩', '호두', '아몬드', '캐슈넛', '피스타치오', '마카다미아',
  '새우', '게', '랍스터', '굴', '전복', '오징어', '문어',
  '치즈', '버터', '요구르트', '아이스크림', '참깨', '향신료'
];

export function AllergySettings({ isOpen, onClose }: AllergySettingsProps) {
  const [userAllergies, setUserAllergies] = useRecoilState(userAllergiesState);
  const [customAllergy, setCustomAllergy] = useState('');

  const handleAddAllergy = (allergy: string) => {
    if (allergy && !userAllergies.includes(allergy)) {
      setUserAllergies([...userAllergies, allergy]);
      toast.success(`${allergy} 알레르기가 추가되었습니다`);
    }
  };

  const handleRemoveAllergy = (allergy: string) => {
    setUserAllergies(userAllergies.filter(a => a !== allergy));
    toast.success(`${allergy} 알레르기가 제거되었습니다`);
  };

  const handleAddCustomAllergy = () => {
    if (customAllergy.trim()) {
      handleAddAllergy(customAllergy.trim());
      setCustomAllergy('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddCustomAllergy();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-orange-500/30 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-orange-500/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="h-6 w-6 text-red-400" />
              <h2 className="text-xl font-bold text-white">알레르기 설정</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-orange-300 hover:text-white hover:bg-orange-700/50 rounded-lg transition-all duration-200"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <p className="text-orange-200 mt-2">
            알레르기 정보를 설정하면 AI 셰프가 안전한 레시피를 추천해드립니다.
          </p>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Current Allergies */}
          {userAllergies.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="h-5 w-5 text-red-400" />
                <h3 className="text-lg font-semibold text-white">현재 알레르기 ({userAllergies.length}개)</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {userAllergies.map((allergy, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 bg-red-900/40 text-red-200 px-3 py-2 rounded-full border border-red-500/30"
                  >
                    <span>{allergy}</span>
                    <button
                      onClick={() => handleRemoveAllergy(allergy)}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Custom Allergy Input */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Plus className="h-5 w-5 text-green-400" />
              직접 추가하기
            </h3>
            <div className="flex gap-3">
              <input
                type="text"
                value={customAllergy}
                onChange={(e) => setCustomAllergy(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="알레르기 이름을 입력하세요 (예: 마늘)"
                className="flex-1 px-4 py-3 bg-gray-700/80 border border-orange-500/30 rounded-lg text-white placeholder-orange-300/50 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20"
              />
              <button
                onClick={handleAddCustomAllergy}
                disabled={!customAllergy.trim()}
                className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-all duration-200 flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                <span>추가</span>
              </button>
            </div>
          </div>

          {/* Common Allergies */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-400" />
              일반적인 알레르기
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {COMMON_ALLERGIES.map((allergy) => {
                const isSelected = userAllergies.includes(allergy);
                return (
                  <button
                    key={allergy}
                    onClick={() => isSelected ? handleRemoveAllergy(allergy) : handleAddAllergy(allergy)}
                    className={`p-3 rounded-lg border transition-all duration-200 text-sm font-medium flex items-center gap-2 ${
                      isSelected
                        ? 'bg-red-900/40 text-red-200 border-red-500/30 hover:bg-red-800/40'
                        : 'bg-gray-700/50 text-gray-200 border-gray-600/30 hover:bg-gray-600/50 hover:border-orange-500/30'
                    }`}
                  >
                    {isSelected ? (
                      <Check className="h-4 w-4 text-red-400" />
                    ) : (
                      <Plus className="h-4 w-4 text-gray-400" />
                    )}
                    <span>{allergy}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-orange-500/30 bg-gradient-to-r from-gray-900/50 to-gray-800/50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-orange-200">
              💡 설정된 알레르기는 로컬 스토리지에 자동 저장됩니다
            </div>
            <button
              onClick={onClose}
              className="px-6 py-3 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white rounded-lg transition-all duration-200 flex items-center gap-2"
            >
              <Check className="h-4 w-4" />
              <span>완료</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}