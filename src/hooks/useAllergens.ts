import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthViewModel } from '@/viewmodels/AuthViewModel';
import toast from 'react-hot-toast';

// 알레르기 타입 목록 조회
export function useAllergenTypes() {
  return useQuery({
    queryKey: ['allergen-types'],
    queryFn: async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/allergen/types`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch allergen types');
      }
      
      const result = await response.json();
      console.log('🎅 Allergen types response:', result); // 디버깅용
      
      // 백엔드에서 반환하는 객체 배열에서 name 필드만 추출
      const allergenNames = result.data?.map((item: any) => item.name) || [];
      console.log('🎅 Allergen names:', allergenNames);
      
      return allergenNames;
    },
    staleTime: 1000 * 60 * 60, // 1시간
  });
}

// 알레르기 목록 조회 (SearchFilters에서 사용)
export function useAllergens() {
  const { data: allergens, isLoading, error } = useAllergenTypes();
  
  return {
    allergens: allergens || [],
    isLoading,
    error,
  };
}

// 사용자 알레르기 프로필 관리 (기존 방식 - 프로필에서 가져오기)
export function useUserAllergyProfile() {
  const { token, user } = useAuthViewModel();
  const queryClient = useQueryClient();

  // 사용자 알레르기 정보 조회
  const { data: profile } = useQuery({
    queryKey: ['user-profile', user?.id],
    queryFn: async () => {
      if (!token) return { allergies: [], severity: {} };
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }
      
      const result = await response.json();
      console.log('👤 User profile data:', result); // 디버깅용
      
      return {
        allergies: result.user?.allergies || [],
        severity: result.user?.allergenProfile?.severity || {}
      };
    },
    enabled: !!token,
  });

  // 알레르기 정보 업데이트
  const updateAllergies = useMutation({
    mutationFn: async (allergies: string[]) => {
      // 토큰 확인 - 여러 소스에서 시도
      let authToken = token;
      if (!authToken && typeof window !== 'undefined') {
        authToken = localStorage.getItem('auth_token');
      }
      
      console.log('🔍 알레르기 업데이트 토큰 확인:', { 
        fromHook: token, 
        fromLocalStorage: authToken,
        user: user?.email 
      });
      
      if (!authToken) {
        throw new Error('로그인이 필요합니다');
      }
      
      console.log('💾 Updating allergies:', allergies); // 디버깅용
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/allergies`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          allergies
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || '알레르기 정보 업데이트에 실패했습니다');
      }

      const result = await response.json();
      console.log('✅ Allergies updated:', result); // 디버깅용
      return result;
    },
    onSuccess: (data) => {
      toast.success('알레르기 정보가 업데이트되었습니다');
      // 프로필 쿼리 무효화하여 최신 데이터 가져오기
      queryClient.invalidateQueries({ queryKey: ['user-profile'] });
      queryClient.invalidateQueries({ queryKey: ['user-allergies'] });
      // AuthViewModel 상태도 업데이트
      queryClient.invalidateQueries({ queryKey: ['auth'] });
    },
    onError: (error: any) => {
      console.error('❌ Allergy update error:', error);
      toast.error(error.message || '업데이트에 실패했습니다');
    },
  });

  return {
    allergies: profile?.allergies || [],
    severity: profile?.severity || {},
    updateAllergies,
  };
}

// 사용자 알레르기 전용 GET API (새로 추가)
export function useUserAllergies() {
  const { token, user } = useAuthViewModel();
  const queryClient = useQueryClient();

  // 사용자 알레르기 전용 조회
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['user-allergies', user?.id],
    queryFn: async () => {
      let authToken = token;
      if (!authToken && typeof window !== 'undefined') {
        authToken = localStorage.getItem('auth_token');
      }
      
      if (!authToken) {
        throw new Error('로그인이 필요합니다');
      }
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/allergies`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('알레르기 정보 조회에 실패했습니다');
      }
      
      const result = await response.json();
      console.log('🎅 User allergies data:', result); // 디버깅용
      
      return result.data?.allergies || [];
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5, // 5분
  });

  // 알레르기 업데이트
  const updateAllergies = useMutation({
    mutationFn: async (allergies: string[]) => {
      let authToken = token;
      if (!authToken && typeof window !== 'undefined') {
        authToken = localStorage.getItem('auth_token');
      }
      
      if (!authToken) {
        throw new Error('로그인이 필요합니다');
      }
      
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
    onSuccess: () => {
      toast.success('알레르기 정보가 업데이트되었습니다');
      // 전용 알레르기 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: ['user-allergies'] });
      // 기존 프로필 쿼리도 무효화
      queryClient.invalidateQueries({ queryKey: ['user-profile'] });
    },
    onError: (error: any) => {
      console.error('❌ Allergy update error:', error);
      toast.error(error.message || '업데이트에 실패했습니다');
    },
  });

  return {
    allergies: data || [],
    isLoading,
    error,
    updateAllergies,
    refetch,
  };
}

// 특정 재료의 알레르기 정보 조회
export function useIngredientAllergens(ingredientName: string) {
  return useQuery({
    queryKey: ['ingredient-allergens', ingredientName],
    queryFn: async () => {
      if (!ingredientName) return null;
      
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/allergen/ingredient/${encodeURIComponent(ingredientName)}`
      );
      const result = await response.json();
      return result.data;
    },
    enabled: !!ingredientName,
    staleTime: 1000 * 60 * 30, // 30분
  });
}

// 레시피 알레르기 체크
export function useRecipeAllergyCheck() {
  const { user } = useAuthViewModel();

  return useMutation({
    mutationFn: async ({ ingredients }: { ingredients: string[] }) => {
      const userAllergies = user?.allergenProfile?.allergies || [];
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/allergen/check`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ingredients,
          userAllergies,
        }),
      });

      const result = await response.json();
      return result.data;
    },
  });
}
