// frontend/src/hooks/useUserProfile.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthViewModel } from '@/viewmodels/AuthViewModel';
import toast from 'react-hot-toast';

// 쿠킹 레벨 옵션
export const COOKING_LEVELS = ['초급', '중급', '고급'] as const;
export type CookingLevel = typeof COOKING_LEVELS[number];

// 사용자 프로필 전체 관리
export function useUserProfile() {
    const { token, user, setAuth } = useAuthViewModel();
    const queryClient = useQueryClient();

    // 알레르기 정보 조회
    const {
        data: allergies = [],
        isLoading: allergiesLoading
    } = useQuery({
        queryKey: ['user-allergies', user?.id],
        queryFn: async () => {
            let authToken = token;
            if (!authToken && typeof window !== 'undefined') {
                authToken = localStorage.getItem('auth_token');
            }

            if (!authToken) return [];

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/allergies`, {
                headers: { 'Authorization': `Bearer ${authToken}` },
            });

            if (!response.ok) return [];

            const result = await response.json();
            return result.data?.allergies || [];
        },
        enabled: !!user?.id,
        staleTime: 1000 * 60 * 5,
    });

    // 프로필 정보 조회 (쿠킹 레벨, 선호도 포함)
    const {
        data: profile,
        isLoading: profileLoading
    } = useQuery({
        queryKey: ['user-profile', user?.id],
        queryFn: async () => {
            let authToken = token;
            if (!authToken && typeof window !== 'undefined') {
                authToken = localStorage.getItem('auth_token');
            }

            if (!authToken) return null;

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/profile`, {
                headers: { 'Authorization': `Bearer ${authToken}` },
            });

            if (!response.ok) return null;

            const result = await response.json();
            console.log('👤 User profile loaded:', result.user);
            return result.user;
        },
        enabled: !!user?.id,
        staleTime: 1000 * 60 * 5,
    });

    // 알레르기 업데이트
    const updateAllergies = useMutation({
        mutationFn: async (allergies: string[]) => {
            let authToken = token;
            if (!authToken && typeof window !== 'undefined') {
                authToken = localStorage.getItem('auth_token');
            }

            if (!authToken) throw new Error('로그인이 필요합니다');

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/allergies`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`,
                },
                body: JSON.stringify({ allergies }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || '알레르기 업데이트에 실패했습니다');
            }

            return response.json();
        },
        onSuccess: (data) => {
            // 캐시 업데이트
            if (data.user?.allergies) {
                queryClient.setQueryData(['user-allergies', user?.id], data.user.allergies);

                // AuthState도 업데이트
                setAuth(prev => ({
                    ...prev,
                    user: prev.user ? { ...prev.user, allergies: data.user.allergies } : null
                }));
            }

            toast.success('알레르기 정보가 업데이트되었습니다');
        },
        onError: (error: any) => {
            console.error('❌ Allergy update error:', error);
            toast.error(error.message || '업데이트에 실패했습니다');
        },
    });

    // 쿠킹 레벨 업데이트
    const updateCookingLevel = useMutation({
        mutationFn: async (cookingLevel: CookingLevel) => {
            let authToken = token;
            if (!authToken && typeof window !== 'undefined') {
                authToken = localStorage.getItem('auth_token');
            }

            if (!authToken) throw new Error('로그인이 필요합니다');

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/cooking-preferences`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`,
                },
                body: JSON.stringify({ cookingLevel }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || '쿠킹 레벨 업데이트에 실패했습니다');
            }

            return response.json();
        },
        onSuccess: (data) => {
            // 캐시 업데이트
            if (data.user) {
                queryClient.setQueryData(['user-profile', user?.id], data.user);

                // AuthState도 업데이트
                setAuth(prev => ({
                    ...prev,
                    user: prev.user ? {
                        ...prev.user,
                        cookingLevel: data.user.cookingLevel,
                        preferences: data.user.preferences || prev.user.preferences
                    } : null
                }));
            }

            toast.success('쿠킹 레벨이 업데이트되었습니다');
        },
        onError: (error: any) => {
            console.error('❌ Cooking level update error:', error);
            toast.error(error.message || '업데이트에 실패했습니다');
        },
    });

    // 선호도 업데이트
    const updatePreferences = useMutation({
        mutationFn: async (preferences: string[]) => {
            let authToken = token;
            if (!authToken && typeof window !== 'undefined') {
                authToken = localStorage.getItem('auth_token');
            }

            if (!authToken) throw new Error('로그인이 필요합니다');

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/cooking-preferences`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`,
                },
                body: JSON.stringify({ preferences }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || '선호도 업데이트에 실패했습니다');
            }

            return response.json();
        },
        onSuccess: (data) => {
            if (data.user) {
                queryClient.setQueryData(['user-profile', user?.id], data.user);

                setAuth(prev => ({
                    ...prev,
                    user: prev.user ? {
                        ...prev.user,
                        preferences: data.user.preferences,
                        cookingLevel: data.user.cookingLevel || prev.user.cookingLevel
                    } : null
                }));
            }

            toast.success('선호도가 업데이트되었습니다');
        },
        onError: (error: any) => {
            console.error('❌ Preferences update error:', error);
            toast.error(error.message || '업데이트에 실패했습니다');
        },
    });

    return {
        // 데이터
        allergies,
        cookingLevel: profile?.cookingLevel || user?.cookingLevel || '초급',
        preferences: profile?.preferences || user?.preferences || [],

        // 로딩 상태
        isLoading: allergiesLoading || profileLoading,

        // 액션
        updateAllergies,
        updateCookingLevel,
        updatePreferences,
    };
}