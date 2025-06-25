'use client';

import { useOnboarding } from '@/hooks/useOnboarding';
import { AllergySetup } from './onboarding/AllergySetup';
import { useAuthViewModel } from '@/viewmodels/AuthViewModel';

export function OnboardingManager() {
    const { isAuthenticated } = useAuthViewModel();
    const { showOnboarding, completeOnboarding, skipOnboarding } = useOnboarding();

    if (!isAuthenticated || !showOnboarding) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50">
            <AllergySetup
                onComplete={completeOnboarding}
                onSkip={skipOnboarding}
            />
        </div>
    );
}