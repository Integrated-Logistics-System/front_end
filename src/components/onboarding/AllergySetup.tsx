'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, ChefHat, CheckCircle, ArrowRight, SkipForward } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAllergenTypes, useUserAllergyProfile } from '@/hooks/useAllergens';
import toast from 'react-hot-toast';

interface AllergySetupProps {
  onComplete?: () => void;
  onSkip?: () => void;
}

export function AllergySetup({ onComplete, onSkip }: AllergySetupProps) {
  const { data: allergenTypes = [] } = useAllergenTypes();
  const { allergies: currentAllergies, updateAllergies } = useUserAllergyProfile();
  const [selectedAllergies, setSelectedAllergies] = useState<string[]>(currentAllergies);
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: "안전한 요리를 위해",
      subtitle: "알레르기 정보를 설정해주세요",
      description: "설정하신 알레르기 정보를 바탕으로 안전한 레시피만 추천해드립니다."
    },
    {
      title: "알레르기 항목 선택",
      subtitle: "해당하는 알레르기를 모두 선택해주세요",
      description: "선택하신 항목이 포함된 레시피는 자동으로 제외됩니다."
    }
  ];

  const toggleAllergen = (allergen: string) => {
    setSelectedAllergies(prev => 
      prev.includes(allergen)
        ? prev.filter(a => a !== allergen)
        : [...prev, allergen]
    );
  };

  const handleSave = async () => {
    try {
      await updateAllergies.mutateAsync(selectedAllergies);
      toast.success('알레르기 정보가 저장되었습니다!');
      onComplete?.();
    } catch (error) {
      console.error('Failed to save allergies:', error);
    }
  };

  const handleSkip = () => {
    toast('나중에 프로필에서 설정할 수 있습니다', {
      icon: '💡',
    });
    onSkip?.();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-8 text-white text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <Shield className="h-10 w-10" />
            </motion.div>
            <h1 className="text-2xl font-bold mb-2">{steps[step].title}</h1>
            <p className="text-orange-100">{steps[step].subtitle}</p>
          </div>

          {/* Content */}
          <div className="p-8">
            {step === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center space-y-6"
              >
                <div className="flex justify-center">
                  <ChefHat className="h-16 w-16 text-orange-500" />
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                  {steps[step].description}
                </p>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <p className="text-blue-800 dark:text-blue-200 text-sm">
                    💡 언제든지 프로필 페이지에서 수정할 수 있습니다
                  </p>
                </div>
                <div className="flex gap-4 justify-center">
                  <Button
                    variant="outline"
                    onClick={handleSkip}
                    className="px-8"
                  >
                    <SkipForward className="h-4 w-4 mr-2" />
                    나중에 하기
                  </Button>
                  <Button
                    onClick={() => setStep(1)}
                    className="px-8 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
                  >
                    설정하기
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <p className="text-gray-600 dark:text-gray-300 text-center mb-6">
                  {steps[step].description}
                </p>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {allergenTypes.map((allergen: string) => (
                    <motion.button
                      key={allergen}
                      onClick={() => toggleAllergen(allergen)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                        selectedAllergies.includes(allergen)
                          ? 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'
                          : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:border-orange-300 dark:hover:border-orange-600'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{allergen}</span>
                        {selectedAllergies.includes(allergen) && (
                          <CheckCircle className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                    </motion.button>
                  ))}
                </div>

                {selectedAllergies.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg"
                  >
                    <h4 className="font-medium mb-2 text-orange-800 dark:text-orange-200">
                      선택된 알레르기 ({selectedAllergies.length}개)
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedAllergies.map((allergen: string) => (
                        <span
                          key={allergen}
                          className="px-3 py-1 bg-red-500 text-white rounded-full text-sm flex items-center"
                        >
                          {allergen}
                          <button
                            onClick={() => toggleAllergen(allergen)}
                            className="ml-2 text-red-200 hover:text-white"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </motion.div>
                )}

                <div className="flex gap-4 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setStep(0)}
                    className="flex-1"
                  >
                    이전
                  </Button>
                  <Button
                    onClick={handleSave}
                    disabled={updateAllergies.isPending}
                    className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
                  >
                    {updateAllergies.isPending ? '저장 중...' : '완료'}
                  </Button>
                </div>

                <div className="text-center">
                  <button
                    onClick={handleSkip}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-sm underline"
                  >
                    건너뛰기
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}