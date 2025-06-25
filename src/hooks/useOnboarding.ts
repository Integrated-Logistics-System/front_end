import { useState, useEffect } from 'react';
import { useAuthViewModel } from '@/viewmodels/AuthViewModel';

export function useOnboarding() {
  const { user, isAuthenticated } = useAuthViewModel();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState<'allergy' | 'complete'>('allergy');

  useEffect(() => {
    if (isAuthenticated && user) {
      // 새로 가입한 사용자인지 확인 (알레르기 설정이 안되어 있으면 온보딩 표시)
      const hasCompletedOnboarding = localStorage.getItem('onboarding_completed') === 'true';
      
      if (!hasCompletedOnboarding) {
        setShowOnboarding(true);
        setOnboardingStep('allergy');
      }
    }
  }, [isAuthenticated, user]);

  const completeOnboarding = () => {
    setShowOnboarding(false);
    localStorage.setItem('onboarding_completed', 'true');
  };

  const skipOnboarding = () => {
    setShowOnboarding(false);
    localStorage.setItem('onboarding_completed', 'true');
  };

  const nextStep = () => {
    if (onboardingStep === 'allergy') {
      setOnboardingStep('complete');
    }
  };

  const resetOnboarding = () => {
    localStorage.removeItem('onboarding_completed');
    setShowOnboarding(true);
    setOnboardingStep('allergy');
  };

  return {
    showOnboarding,
    onboardingStep,
    completeOnboarding,
    skipOnboarding,
    nextStep,
    resetOnboarding,
  };
}