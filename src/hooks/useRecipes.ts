import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthViewModel } from '@/viewmodels/AuthViewModel';
import toast from 'react-hot-toast';

// 즐겨찾기 레시피 관리
export function useFavoriteRecipes() {
  const { token, user } = useAuthViewModel();
  const queryClient = useQueryClient();

  // 즐겨찾기 목록 조회
  const { data: favorites = [] } = useQuery({
    queryKey: ['favorite-recipes', user?.id],
    queryFn: async () => {
      if (!token) return [];
      
      // 로컬 스토리지에서 즐겨찾기 조회 (임시)
      const stored = localStorage.getItem(`favorites_${user?.id}`);
      return stored ? JSON.parse(stored) : [];
    },
    enabled: !!token && !!user,
  });

  // 즐겨찾기 추가
  const addToFavorites = useMutation({
    mutationFn: async (recipe: any) => {
      if (!token) throw new Error('로그인이 필요합니다');
      
      const newFavorites = [...favorites, recipe];
      localStorage.setItem(`favorites_${user?.id}`, JSON.stringify(newFavorites));
      return newFavorites;
    },
    onSuccess: () => {
      toast.success('즐겨찾기에 추가되었습니다');
      queryClient.invalidateQueries({ queryKey: ['favorite-recipes'] });
    },
    onError: (error: any) => {
      toast.error(error.message || '즐겨찾기 추가에 실패했습니다');
    },
  });

  // 즐겨찾기 제거
  const removeFromFavorites = useMutation({
    mutationFn: async (recipeId: string) => {
      if (!token) throw new Error('로그인이 필요합니다');
      
      const newFavorites = favorites.filter((recipe: any) => recipe.id !== recipeId);
      localStorage.setItem(`favorites_${user?.id}`, JSON.stringify(newFavorites));
      return newFavorites;
    },
    onSuccess: () => {
      toast.success('즐겨찾기에서 제거되었습니다');
      queryClient.invalidateQueries({ queryKey: ['favorite-recipes'] });
    },
    onError: (error: any) => {
      toast.error(error.message || '즐겨찾기 제거에 실패했습니다');
    },
  });

  return {
    favorites,
    addToFavorites,
    removeFromFavorites,
  };
}

// 레시피 검색 훅
export function useRecipeSearch() {
  const { token, isAuthenticated } = useAuthViewModel();

  const search = useMutation({
    mutationFn: async (params: {
      query: string;
      page?: number;
      limit?: number;
      skill_level?: 'beginner' | 'intermediate' | 'advanced';
    }) => {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/rag/enhanced-search`;
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (isAuthenticated && token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          query: params.query,
          page: params.page || 1,
          limit: params.limit || 10,
          skill_level: params.skill_level || 'intermediate',
        }),
      });

      if (!response.ok) {
        throw new Error('검색에 실패했습니다');
      }

      return response.json();
    },
  });

  return {
    search,
    isAuthenticated,
  };
}
