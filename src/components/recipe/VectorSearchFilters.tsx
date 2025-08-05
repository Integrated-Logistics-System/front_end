import React, { useState, useEffect } from 'react';
import { 
  X, 
  Settings, 
  Sliders,
  Brain,
  Zap,
  Shield,
  Clock,
  ChefHat,
  Heart,
  Leaf,
  Fish,
  Wheat,
  Milk,
  Egg
} from 'lucide-react';
import { VectorSearchFilters as VectorSearchFiltersType } from '@/hooks/useVectorSearch';

interface VectorSearchFiltersProps {
  filters: VectorSearchFiltersType;
  defaultFilters: VectorSearchFiltersType;
  onApply: (filters: VectorSearchFiltersType) => void;
  onClose: () => void;
}

const ALLERGIES = [
  { id: 'nuts', label: '견과류', icon: '🥜' },
  { id: 'dairy', label: '유제품', icon: '🥛' },
  { id: 'eggs', label: '달걀', icon: '🥚' },
  { id: 'shellfish', label: '갑각류', icon: '🦐' },
  { id: 'soy', label: '콩', icon: '🫘' },
  { id: 'wheat', label: '밀', icon: '🌾' },
  { id: 'fish', label: '생선', icon: '🐟' }
];

const PREFERENCES = [
  { id: 'healthy', label: '건강한', icon: '💚' },
  { id: 'quick', label: '빠른 요리', icon: '⚡' },
  { id: 'spicy', label: '매운맛', icon: '🌶️' },
  { id: 'mild', label: '순한맛', icon: '😋' },
  { id: 'korean', label: '한식', icon: '🇰🇷' },
  { id: 'western', label: '양식', icon: '🍝' },
  { id: 'vegetarian', label: '채식', icon: '🥗' },
  { id: 'popular', label: '인기', icon: '⭐' }
];

const DIETARY_RESTRICTIONS = [
  { id: 'vegetarian', label: '채식주의', icon: '🥗' },
  { id: 'vegan', label: '비건', icon: '🌱' },
  { id: 'low-sodium', label: '저염식', icon: '🧂' },
  { id: 'low-carb', label: '저탄수화물', icon: '🥩' },
  { id: 'gluten-free', label: '글루텐 프리', icon: '🌾' },
  { id: 'keto', label: '케토', icon: '🥑' }
];

const DIFFICULTIES = [
  { id: 'easy', label: '초급', color: 'text-green-600 bg-green-50 border-green-200' },
  { id: 'medium', label: '중급', color: 'text-yellow-600 bg-yellow-50 border-yellow-200' },
  { id: 'hard', label: '고급', color: 'text-red-600 bg-red-50 border-red-200' }
];

export const VectorSearchFilters: React.FC<VectorSearchFiltersProps> = ({
  filters,
  defaultFilters,
  onApply,
  onClose
}) => {
  const [localFilters, setLocalFilters] = useState<VectorSearchFiltersType>(filters);
  const [activeTab, setActiveTab] = useState<'search' | 'personal' | 'advanced'>('search');

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleApply = () => {
    onApply(localFilters);
    onClose();
  };

  const handleReset = () => {
    setLocalFilters(defaultFilters);
  };

  const updateFilter = <K extends keyof VectorSearchFiltersType>(
    key: K,
    value: VectorSearchFiltersType[K]
  ) => {
    setLocalFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const toggleArrayItem = (key: 'allergies' | 'preferences' | 'dietaryRestrictions', item: string) => {
    const currentArray = localFilters[key] || [];
    const newArray = currentArray.includes(item)
      ? currentArray.filter(i => i !== item)
      : [...currentArray, item];
    
    updateFilter(key, newArray);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <Settings className="h-6 w-6 mr-2 text-blue-600" />
            벡터 검색 설정
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* 탭 네비게이션 */}
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('search')}
            className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'search'
                ? 'text-blue-600 border-blue-600'
                : 'text-gray-500 border-transparent hover:text-gray-700'
            }`}
          >
            <Brain className="h-4 w-4 inline mr-1" />
            검색 알고리즘
          </button>
          <button
            onClick={() => setActiveTab('personal')}
            className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'personal'
                ? 'text-blue-600 border-blue-600'
                : 'text-gray-500 border-transparent hover:text-gray-700'
            }`}
          >
            <Heart className="h-4 w-4 inline mr-1" />
            개인화
          </button>
          <button
            onClick={() => setActiveTab('advanced')}
            className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'advanced'
                ? 'text-blue-600 border-blue-600'
                : 'text-gray-500 border-transparent hover:text-gray-700'
            }`}
          >
            <Sliders className="h-4 w-4 inline mr-1" />
            고급 설정
          </button>
        </div>

        {/* 콘텐츠 */}
        <div className="p-6 max-h-96 overflow-y-auto">
          {/* 검색 알고리즘 탭 */}
          {activeTab === 'search' && (
            <div className="space-y-6">
              {/* 하이브리드 검색 설정 */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium text-gray-900">
                    하이브리드 검색 사용
                  </label>
                  <button
                    onClick={() => updateFilter('useHybridSearch', !localFilters.useHybridSearch)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      localFilters.useHybridSearch ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        localFilters.useHybridSearch ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
                <p className="text-xs text-gray-500">
                  AI 벡터 검색과 전통적인 텍스트 검색을 결합하여 더 정확한 결과를 제공합니다
                </p>
              </div>

              {/* 가중치 설정 */}
              {localFilters.useHybridSearch && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      <Brain className="h-4 w-4 inline mr-1" />
                      벡터 검색 가중치: {Math.round((localFilters.vectorWeight || 0.7) * 100)}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={localFilters.vectorWeight || 0.7}
                      onChange={(e) => updateFilter('vectorWeight', parseFloat(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      <Zap className="h-4 w-4 inline mr-1" />
                      텍스트 검색 가중치: {Math.round((localFilters.textWeight || 0.3) * 100)}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={localFilters.textWeight || 0.3}
                      onChange={(e) => updateFilter('textWeight', parseFloat(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                  </div>
                </div>
              )}

              {/* 최소 점수 설정 */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  최소 유사도 점수: {Math.round((localFilters.minScore || 0.2) * 100)}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={localFilters.minScore || 0.2}
                  onChange={(e) => updateFilter('minScore', parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <p className="text-xs text-gray-500 mt-1">
                  낮은 품질의 검색 결과를 필터링합니다 (높을수록 엄격함)
                </p>
              </div>
            </div>
          )}

          {/* 개인화 탭 */}
          {activeTab === 'personal' && (
            <div className="space-y-6">
              {/* 알레르기 */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                  <Shield className="h-4 w-4 mr-1 text-red-500" />
                  알레르기 (피할 재료)
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {ALLERGIES.map((allergy) => (
                    <button
                      key={allergy.id}
                      onClick={() => toggleArrayItem('allergies', allergy.id)}
                      className={`flex items-center p-3 rounded-lg border text-sm transition-colors ${
                        localFilters.allergies?.includes(allergy.id)
                          ? 'bg-red-50 border-red-200 text-red-700'
                          : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <span className="mr-2">{allergy.icon}</span>
                      {allergy.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 선호도 */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                  <Heart className="h-4 w-4 mr-1 text-pink-500" />
                  요리 선호도
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {PREFERENCES.map((pref) => (
                    <button
                      key={pref.id}
                      onClick={() => toggleArrayItem('preferences', pref.id)}
                      className={`flex items-center p-3 rounded-lg border text-sm transition-colors ${
                        localFilters.preferences?.includes(pref.id)
                          ? 'bg-blue-50 border-blue-200 text-blue-700'
                          : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <span className="mr-2">{pref.icon}</span>
                      {pref.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 고급 설정 탭 */}
          {activeTab === 'advanced' && (
            <div className="space-y-6">
              {/* 난이도 */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                  <ChefHat className="h-4 w-4 mr-1" />
                  요리 난이도
                </h3>
                <div className="flex gap-2">
                  {DIFFICULTIES.map((diff) => (
                    <button
                      key={diff.id}
                      onClick={() => updateFilter('difficulty', 
                        localFilters.difficulty === diff.id ? undefined : diff.id as any
                      )}
                      className={`flex-1 p-3 rounded-lg border text-sm font-medium transition-colors ${
                        localFilters.difficulty === diff.id
                          ? diff.color
                          : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {diff.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 최대 조리 시간 */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  최대 조리 시간: {localFilters.maxCookTime || '제한 없음'}
                  {localFilters.maxCookTime && '분'}
                </h3>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="10"
                    max="180"
                    step="10"
                    value={localFilters.maxCookTime || 60}
                    onChange={(e) => updateFilter('maxCookTime', parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>10분</span>
                    <span>1시간</span>
                    <span>3시간</span>
                  </div>
                  <button
                    onClick={() => updateFilter('maxCookTime', undefined)}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    시간 제한 해제
                  </button>
                </div>
              </div>

              {/* 식단 제한 */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                  <Leaf className="h-4 w-4 mr-1 text-green-500" />
                  식단 제한사항
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {DIETARY_RESTRICTIONS.map((restriction) => (
                    <button
                      key={restriction.id}
                      onClick={() => toggleArrayItem('dietaryRestrictions', restriction.id)}
                      className={`flex items-center p-3 rounded-lg border text-sm transition-colors ${
                        localFilters.dietaryRestrictions?.includes(restriction.id)
                          ? 'bg-green-50 border-green-200 text-green-700'
                          : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <span className="mr-2">{restriction.icon}</span>
                      {restriction.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 하단 버튼 */}
        <div className="flex items-center justify-between p-6 border-t bg-gray-50">
          <button
            onClick={handleReset}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
          >
            초기화
          </button>
          
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              취소
            </button>
            <button
              onClick={handleApply}
              className="px-6 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              적용하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};