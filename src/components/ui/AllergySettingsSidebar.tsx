'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield, Save, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAllergenTypes, useUserAllergyProfile } from '@/hooks/useAllergens';
import toast from 'react-hot-toast';

interface AllergySettingsSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AllergySettingsSidebar({ isOpen, onClose }: AllergySettingsSidebarProps) {
  const { data: allergenTypes = [] } = useAllergenTypes();
  const { allergies: userAllergies, updateAllergies } = useUserAllergyProfile();
  const [selectedAllergies, setSelectedAllergies] = useState<string[]>([]);
  const [hasChanges, setHasChanges] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // 사용자 알레르기 데이터가 로드될 때 한 번만 초기화
  useEffect(() => {
    if (userAllergies && userAllergies.length >= 0 && !isInitialized) {
      setSelectedAllergies([...userAllergies]);
      setHasChanges(false);
      setIsInitialized(true);
    }
  }, [userAllergies, isInitialized]);

  // 사이드바가 열릴 때마다 최신 데이터로 리셋
  useEffect(() => {
    if (isOpen && userAllergies) {
      setSelectedAllergies([...userAllergies]);
      setHasChanges(false);
    }
  }, [isOpen]);

  const toggleAllergen = (allergen: string) => {
    const newAllergies = selectedAllergies.includes(allergen)
      ? selectedAllergies.filter(a => a !== allergen)
      : [...selectedAllergies, allergen];
    
    setSelectedAllergies(newAllergies);
    setHasChanges(JSON.stringify(newAllergies.sort()) !== JSON.stringify(userAllergies.sort()));
  };

  const handleSave = async () => {
    try {
      await updateAllergies.mutateAsync(selectedAllergies);
      setHasChanges(false);
      setIsInitialized(false); // 저장 후 다시 초기화 가능하도록
      toast.success('알레르기 설정이 저장되었습니다!');
    } catch (error) {
      toast.error('저장에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const handleReset = () => {
    setSelectedAllergies(userAllergies);
    setHasChanges(false);
    toast.success('변경사항이 취소되었습니다.');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 오버레이 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />
          
          {/* 사이드바 */}
          <motion.div
            initial={{ x: 400 }}
            animate={{ x: 0 }}
            exit={{ x: 400 }}
            transition={{ type: 'spring', damping: 20, stiffness: 100 }}
            className="fixed right-0 top-0 h-full w-96 bg-white dark:bg-gray-800 shadow-2xl z-50 flex flex-col"
          >
            {/* 헤더 */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                  <Shield className="h-5 w-5 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                    알레르기 설정
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    안전한 레시피를 위한 설정
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* 안내 메시지 */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-start gap-3">
                  <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                  <div className="text-sm">
                    <p className="text-blue-800 dark:text-blue-200 font-medium mb-1">
                      개인화된 레시피 추천
                    </p>
                    <p className="text-blue-700 dark:text-blue-300">
                      선택하신 알레르기 항목은 레시피 검색과 AI 추천에서 자동으로 필터링됩니다.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 알레르기 목록 */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    알레르기 항목
                  </h3>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {selectedAllergies.length}개 선택
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-2">
                  {allergenTypes.map((allergen: string) => {
                    const isSelected = selectedAllergies.includes(allergen);
                    return (
                      <motion.button
                        key={allergen}
                        onClick={() => toggleAllergen(allergen)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                          isSelected
                            ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                            : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 hover:border-red-300 dark:hover:border-red-600'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className={`font-medium ${
                            isSelected 
                              ? 'text-red-700 dark:text-red-300' 
                              : 'text-gray-700 dark:text-gray-300'
                          }`}>
                            {allergen}
                          </span>
                          {isSelected && (
                            <CheckCircle className="h-5 w-5 text-red-500" />
                          )}
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* 선택된 알레르기 요약 */}
              {selectedAllergies.length > 0 && (
                <div className="mt-6 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-orange-600 dark:text-orange-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-orange-800 dark:text-orange-200 mb-2">
                        현재 설정된 알레르기 ({selectedAllergies.length}개)
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {selectedAllergies.map((allergen) => (
                          <span
                            key={allergen}
                            className="px-3 py-1 bg-red-500 text-white rounded-full text-sm flex items-center gap-2"
                          >
                            {allergen}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleAllergen(allergen);
                              }}
                              className="text-red-200 hover:text-white"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 하단 액션 버튼 */}
            <div className="p-6 border-t border-gray-200 dark:border-gray-700">
              {hasChanges && (
                <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <p className="text-sm text-yellow-800 dark:text-yellow-200 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    저장되지 않은 변경사항이 있습니다.
                  </p>
                </div>
              )}

              <div className="flex gap-3">
                {hasChanges && (
                  <Button
                    variant="outline"
                    onClick={handleReset}
                    className="flex-1"
                  >
                    취소
                  </Button>
                )}
                <Button
                  onClick={handleSave}
                  disabled={updateAllergies.isPending || !hasChanges}
                  className={`${hasChanges ? 'flex-1' : 'w-full'} bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600`}
                >
                  {updateAllergies.isPending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      저장 중...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      {hasChanges ? '변경사항 저장' : '저장 완료'}
                    </>
                  )}
                </Button>
              </div>

              <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 text-center">
                알레르기 설정은 모든 레시피 검색과 AI 추천에 즉시 적용됩니다.
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}