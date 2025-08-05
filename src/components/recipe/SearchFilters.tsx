import React, { useState, useEffect } from 'react';
import { X, Filter, Clock, ChefHat, Shield, Tag, SortAsc } from 'lucide-react';
import { useAllergens } from '@/hooks/useAllergens';

interface SearchFiltersProps {
  isOpen: boolean;
  onClose: () => void;
  filters: {
    difficulty?: string;
    maxTime?: number;
    ingredients?: string[];
    allergies?: string[];
    preferences?: string[];
    tags?: string[];
    sortBy?: 'relevance' | 'rating' | 'time' | 'difficulty';
    sortOrder?: 'asc' | 'desc';
  };
  onFiltersChange: (filters: any) => void;
}

export const SearchFilters: React.FC<SearchFiltersProps> = ({
  isOpen,
  onClose,
  filters,
  onFiltersChange
}) => {
  const { allergens } = useAllergens();
  const [localFilters, setLocalFilters] = useState(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
  };

  const handleApplyFilters = () => {
    onFiltersChange(localFilters);
    onClose();
  };

  const handleClearFilters = () => {
    const clearedFilters = {};
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const handleDifficultyChange = (difficulty: string) => {
    handleFilterChange('difficulty', difficulty);
  };

  const handleAllergenToggle = (allergen: string) => {
    const current = localFilters.allergies || [];
    const newAllergens = current.includes(allergen)
      ? current.filter(a => a !== allergen)
      : [...current, allergen];
    handleFilterChange('allergies', newAllergens);
  };

  const timeOptions = [
    { value: 15, label: '15분 이하' },
    { value: 30, label: '30분 이하' },
    { value: 60, label: '1시간 이하' },
    { value: 120, label: '2시간 이하' },
  ];

  const commonTags = [
    '한식', '양식', '중식', '일식', '건강식', '다이어트', '간편식', '홈파티',
    '아침식사', '점심식사', '저녁식사', '간식', '디저트', '국물요리', '볶음요리',
    '구이', '튀김', '찜', '샐러드', '파스타', '밥요리', '면요리'
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-gray-800/95 to-gray-900/95 backdrop-blur-sm border border-orange-500/30 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-orange-900/80 to-amber-900/80 backdrop-blur-sm border-b border-orange-500/30 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Filter className="h-6 w-6 text-orange-400" />
              <h2 className="text-xl font-bold text-white">레시피 필터</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-orange-300 hover:text-white hover:bg-orange-700/50 rounded-lg transition-all duration-200"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Difficulty Filter */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <ChefHat className="h-5 w-5 text-orange-400" />
              <h3 className="text-lg font-semibold text-white">난이도</h3>
            </div>
            <div className="flex gap-3">
              {[
                { value: 'easy', label: '초급', color: 'green' },
                { value: 'medium', label: '중급', color: 'yellow' },
                { value: 'hard', label: '고급', color: 'red' }
              ].map((diff) => (
                <button
                  key={diff.value}
                  onClick={() => handleDifficultyChange(diff.value)}
                  className={`px-4 py-2 rounded-lg border transition-all duration-200 ${
                    localFilters.difficulty === diff.value
                      ? `bg-${diff.color}-600 text-white border-${diff.color}-500`
                      : `bg-${diff.color}-900/30 text-${diff.color}-300 border-${diff.color}-500/30 hover:bg-${diff.color}-800/40`
                  }`}
                >
                  {diff.label}
                </button>
              ))}
            </div>
          </div>

          {/* Time Filter */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Clock className="h-5 w-5 text-orange-400" />
              <h3 className="text-lg font-semibold text-white">조리 시간</h3>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {timeOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleFilterChange('maxTime', option.value)}
                  className={`p-3 rounded-lg border transition-all duration-200 text-sm ${
                    localFilters.maxTime === option.value
                      ? 'bg-amber-600 text-white border-amber-500'
                      : 'bg-amber-900/30 text-amber-300 border-amber-500/30 hover:bg-amber-800/40'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Allergen Filter */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Shield className="h-5 w-5 text-orange-400" />
              <h3 className="text-lg font-semibold text-white">알레르기 제외</h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {allergens.map((allergen) => (
                <button
                  key={allergen}
                  onClick={() => handleAllergenToggle(allergen)}
                  className={`p-2 rounded-lg border transition-all duration-200 text-sm ${
                    localFilters.allergies?.includes(allergen)
                      ? 'bg-red-600 text-white border-red-500'
                      : 'bg-red-900/30 text-red-300 border-red-500/30 hover:bg-red-800/40'
                  }`}
                >
                  {allergen}
                </button>
              ))}
            </div>
          </div>

          {/* Tags Filter */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Tag className="h-5 w-5 text-orange-400" />
              <h3 className="text-lg font-semibold text-white">요리 종류</h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {commonTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => {
                    const current = localFilters.tags || [];
                    const newTags = current.includes(tag)
                      ? current.filter(t => t !== tag)
                      : [...current, tag];
                    handleFilterChange('tags', newTags);
                  }}
                  className={`p-2 rounded-lg border transition-all duration-200 text-sm ${
                    localFilters.tags?.includes(tag)
                      ? 'bg-blue-600 text-white border-blue-500'
                      : 'bg-blue-900/30 text-blue-300 border-blue-500/30 hover:bg-blue-800/40'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Sort Filter */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <SortAsc className="h-5 w-5 text-orange-400" />
              <h3 className="text-lg font-semibold text-white">정렬 기준</h3>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[
                { value: 'relevance', label: '관련도순' },
                { value: 'rating', label: '평점순' },
                { value: 'time', label: '시간순' },
                { value: 'difficulty', label: '난이도순' }
              ].map((sort) => (
                <button
                  key={sort.value}
                  onClick={() => handleFilterChange('sortBy', sort.value)}
                  className={`p-3 rounded-lg border transition-all duration-200 text-sm ${
                    localFilters.sortBy === sort.value
                      ? 'bg-orange-600 text-white border-orange-500'
                      : 'bg-orange-900/30 text-orange-300 border-orange-500/30 hover:bg-orange-800/40'
                  }`}
                >
                  {sort.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gradient-to-r from-orange-900/80 to-amber-900/80 backdrop-blur-sm border-t border-orange-500/30 p-6">
          <div className="flex gap-3">
            <button
              onClick={handleClearFilters}
              className="flex-1 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-all duration-200 font-medium"
            >
              필터 초기화
            </button>
            <button
              onClick={handleApplyFilters}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white rounded-lg transition-all duration-200 font-medium"
            >
              필터 적용
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};