'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Heart, 
  Star, 
  Clock, 
  Users, 
  ChefHat, 
  BookOpen, 
  Share2, 
  
  Shield,
  CheckCircle,
  Circle,
  Edit3,
  Save,
  X
} from 'lucide-react';
import { useAuthViewModel } from '@/viewmodels/AuthViewModel';
import { useRecipeDetail } from '@/hooks/useRecipeDetail';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { RecipeCard } from '@/components/recipe/RecipeCard';

interface RecipeDetailPageProps {
  params: {
    id: string;
  };
}

export default function RecipeDetailPage({ params }: RecipeDetailPageProps) {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthViewModel();
  const [activeTab, setActiveTab] = useState<'ingredients' | 'steps' | 'notes'>('ingredients');
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [personalNote, setPersonalNote] = useState('');
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const {
    recipe,
    similarRecipes,
    loading,
    error,
    fetchRecipe,
    toggleBookmark,
    addRating,
    updatePersonalNote,
    markAsCooked
  } = useRecipeDetail();

  useEffect(() => {
    if (params.id) {
      fetchRecipe(params.id);
    }
  }, [params.id, fetchRecipe]);

  useEffect(() => {
    if (recipe) {
      setIsBookmarked(recipe.isBookmarked || false);
      setUserRating(recipe.userRating || 0);
      setPersonalNote(recipe.personalNote || '');
    }
  }, [recipe]);

  const handleStepToggle = (stepIndex: number) => {
    const newCompletedSteps = new Set(completedSteps);
    if (newCompletedSteps.has(stepIndex)) {
      newCompletedSteps.delete(stepIndex);
    } else {
      newCompletedSteps.add(stepIndex);
    }
    setCompletedSteps(newCompletedSteps);
  };

  const handleBookmark = async () => {
    if (!recipe) return;
    
    try {
      await toggleBookmark(recipe.id);
      setIsBookmarked(!isBookmarked);
    } catch (error) {
      console.error('북마크 토글 실패:', error);
    }
  };

  const handleRating = async (rating: number) => {
    if (!recipe) return;
    
    try {
      await addRating(recipe.id, rating);
      setUserRating(rating);
    } catch (error) {
      console.error('평점 추가 실패:', error);
    }
  };

  const handleSaveNote = async () => {
    if (!recipe) return;
    
    try {
      await updatePersonalNote(recipe.id, personalNote);
      setIsEditingNote(false);
    } catch (error) {
      console.error('노트 저장 실패:', error);
    }
  };

  const handleMarkAsCooked = async () => {
    if (!recipe) return;
    
    try {
      await markAsCooked(recipe.id);
      // 성공 피드백 표시
    } catch (error) {
      console.error('요리 완료 표시 실패:', error);
    }
  };

  const formatCookingTime = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes}분`;
    } else {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return remainingMinutes > 0 ? `${hours}시간 ${remainingMinutes}분` : `${hours}시간`;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    if (!difficulty) return 'text-yellow-400 bg-yellow-900/30 border-yellow-500/30';
    
    const difficultyLower = difficulty.toLowerCase();
    
    // 한국어 + 영어 매핑
    if (difficultyLower.includes('쉬움') || difficultyLower.includes('초급') || difficultyLower.includes('간단') ||
        difficultyLower === 'easy' || difficultyLower === 'beginner') {
      return 'text-green-400 bg-green-900/30 border-green-500/30';
    }
    if (difficultyLower.includes('어려움') || difficultyLower.includes('고급') || difficultyLower.includes('복잡') ||
        difficultyLower === 'hard' || difficultyLower === 'difficult' || difficultyLower === 'advanced') {
      return 'text-red-400 bg-red-900/30 border-red-500/30';
    }
    if (difficultyLower.includes('보통') || difficultyLower.includes('중급') ||
        difficultyLower === 'medium' || difficultyLower === 'intermediate') {
      return 'text-yellow-400 bg-yellow-900/30 border-yellow-500/30';
    }
    
    return 'text-gray-400 bg-gray-900/30 border-gray-500/30';
  };

  const getDifficultyText = (difficulty: string) => {
    if (!difficulty) return '보통';
    
    const difficultyLower = difficulty.toLowerCase();
    
    // 이미 한국어인 경우 그대로 반환
    if (difficultyLower.includes('쉬움') || difficultyLower.includes('초급') || difficultyLower.includes('간단')) {
      return '쉬움';
    }
    if (difficultyLower.includes('어려움') || difficultyLower.includes('고급') || difficultyLower.includes('복잡')) {
      return '어려움';
    }
    if (difficultyLower.includes('보통') || difficultyLower.includes('중급')) {
      return '보통';
    }
    
    // 영어를 한국어로 변환
    switch (difficultyLower) {
      case 'easy':
      case 'beginner':
        return '쉬움';
      case 'medium':
      case 'intermediate':
        return '보통';
      case 'hard':
      case 'difficult':
      case 'advanced':
        return '어려움';
      default:
        return difficulty; // 원본 그대로 반환 (한글인 경우)
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-900 via-amber-900 to-red-900 text-white flex items-center justify-center p-4">
        <div className="text-center bg-black/30 backdrop-blur-sm rounded-2xl p-8 border border-orange-500/30 max-w-md w-full">
          <ChefHat className="h-16 w-16 text-orange-400 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
            레시피 상세보기
          </h1>
          <p className="text-orange-200 mb-6">레시피를 보려면 로그인이 필요해요!</p>
          <button
            onClick={() => router.push('/')}
            className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200"
          >
            로그인하기
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-950 via-amber-950 to-red-950 text-white flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="text-orange-300 mt-4">레시피를 불러오고 있어요...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-950 via-amber-950 to-red-950 text-white flex items-center justify-center p-4">
        <div className="text-center bg-red-900/30 backdrop-blur-sm rounded-2xl p-8 border border-red-500/30 max-w-md w-full">
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold mb-4 text-red-300">레시피를 불러올 수 없어요</h1>
          <p className="text-red-200 mb-6">{error}</p>
          <div className="flex gap-3">
            <button
              onClick={() => router.push('/recipes')}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-4 py-3 rounded-xl font-medium transition-all duration-200"
            >
              레시피 목록으로
            </button>
            <button
              onClick={() => fetchRecipe(params.id)}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-xl font-medium transition-all duration-200"
            >
              다시 시도
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!recipe) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-950 via-amber-950 to-red-950 text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-gradient-to-r from-orange-900/95 to-amber-900/95 backdrop-blur-sm border-b border-orange-500/30">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/recipes')}
                className="p-2 text-orange-300 hover:text-white hover:bg-orange-700/50 rounded-lg transition-all duration-200"
              >
                <ArrowLeft className="h-6 w-6" />
              </button>
              <div className="flex items-center gap-3">
                <ChefHat className="h-8 w-8 text-orange-400" />
                <div>
                  <h1 className="text-xl font-bold text-white truncate">
                    {recipe.nameKo || recipe.name}
                  </h1>
                  <p className="text-orange-300 text-sm">레시피 상세보기</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={handleBookmark}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  isBookmarked
                    ? 'bg-red-600 text-white hover:bg-red-700'
                    : 'bg-gray-700 text-gray-400 hover:bg-gray-600 hover:text-red-400'
                }`}
              >
                <Heart className={`h-5 w-5 ${isBookmarked ? 'fill-current' : ''}`} />
              </button>
              <button className="p-2 text-orange-300 hover:text-white hover:bg-orange-700/50 rounded-lg transition-all duration-200">
                <Share2 className="h-5 w-5" />
              </button>
              
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Recipe Header */}
            <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm border border-orange-500/20 rounded-2xl p-8">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Recipe Image */}
                <div className="md:w-80 md:h-60 w-full h-64 bg-gradient-to-br from-orange-600/20 to-amber-600/20 rounded-xl flex items-center justify-center border border-orange-500/30">
                  {recipe.image ? (
                    <img
                      src={recipe.image}
                      alt={recipe.nameKo || recipe.name}
                      className="w-full h-full object-cover rounded-xl"
                    />
                  ) : (
                    <div className="text-center">
                      <ChefHat className="h-16 w-16 text-orange-400 mx-auto mb-4" />
                      <span className="text-orange-300">레시피 이미지</span>
                    </div>
                  )}
                </div>

                {/* Recipe Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-3xl font-bold text-white mb-2">
                        {recipe.nameKo || recipe.name}
                      </h2>
                      <p className="text-orange-200 text-lg leading-relaxed">
                        {recipe.descriptionKo || recipe.description}
                      </p>
                    </div>
                  </div>

                  {/* Recipe Stats - 5개 열로 확장 */}
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                    <div className="text-center p-4 bg-amber-900/30 rounded-lg border border-amber-500/30">
                      <Clock className="h-6 w-6 text-amber-400 mx-auto mb-2" />
                      <div className="text-sm text-amber-300">조리시간</div>
                      <div className="text-lg font-bold text-white">
                        {formatCookingTime(recipe.minutes)}
                      </div>
                    </div>
                    <div className="text-center p-4 bg-purple-900/30 rounded-lg border border-purple-500/30">
                      <Users className="h-6 w-6 text-purple-400 mx-auto mb-2" />
                      <div className="text-sm text-purple-300">인분</div>
                      <div className="text-lg font-bold text-white">
                        {recipe.servings || recipe.serves || '2-3인분'}
                      </div>
                    </div>
                    <div className="text-center p-4 bg-green-900/30 rounded-lg border border-green-500/30">
                      <ChefHat className="h-6 w-6 text-green-400 mx-auto mb-2" />
                      <div className="text-sm text-green-300">재료</div>
                      <div className="text-lg font-bold text-white">
                        {recipe.nIngredients}개
                      </div>
                    </div>
                    <div className="text-center p-4 bg-blue-900/30 rounded-lg border border-blue-500/30">
                      <BookOpen className="h-6 w-6 text-blue-400 mx-auto mb-2" />
                      <div className="text-sm text-blue-300">단계</div>
                      <div className="text-lg font-bold text-white">
                        {recipe.nSteps}단계
                      </div>
                    </div>
                    <div className={`text-center p-4 rounded-lg border ${getDifficultyColor(recipe.difficulty)}`}>
                      <ChefHat className="h-6 w-6 mx-auto mb-2" />
                      <div className="text-sm">난이도</div>
                      <div className="text-lg font-bold">
                        {getDifficultyText(recipe.difficulty)}
                      </div>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-6 mb-6">
                    <div className="flex items-center gap-2">
                      <Star className="h-5 w-5 text-yellow-400 fill-current" />
                      <span className="text-lg font-medium text-yellow-300">
                        {(recipe.averageRating || 0).toFixed(1)}
                      </span>
                      <span className="text-sm text-gray-400">전체 평점</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-400">내 평점:</span>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => handleRating(star)}
                            className="transition-colors duration-200"
                          >
                            <Star
                              className={`h-4 w-4 ${
                                star <= userRating
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-500 hover:text-yellow-400'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <button
                      onClick={handleMarkAsCooked}
                      className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      <CheckCircle className="h-5 w-5" />
                      <span>완료했어요!</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm border border-orange-500/20 rounded-2xl">
              <div className="flex border-b border-orange-500/20">
                {[
                  { id: 'ingredients', label: '재료', icon: Users },
                  { id: 'steps', label: '조리법', icon: BookOpen },
                  { id: 'notes', label: '내 노트', icon: Edit3 }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex-1 flex items-center justify-center gap-2 p-4 transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-orange-600 text-white'
                        : 'text-orange-300 hover:text-white hover:bg-orange-700/30'
                    }`}
                  >
                    <tab.icon className="h-5 w-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                ))}
              </div>

              <div className="p-6">
                {activeTab === 'ingredients' && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-white mb-4">재료 ({recipe.nIngredients}개)</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {(recipe.ingredientsKo && recipe.ingredientsKo.length > 0 ? recipe.ingredientsKo : recipe.ingredients).map((ingredient, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg border border-orange-500/20"
                        >
                          <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                          <span className="text-white">
                            {typeof ingredient === 'string' 
                              ? ingredient 
                              : (ingredient as any)?.name 
                              ? `${(ingredient as any).amount || ''}${(ingredient as any).unit || ''} ${(ingredient as any).name}`.trim()
                              : String(ingredient)
                            }
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'steps' && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-white mb-4">조리법 ({recipe.nSteps}단계)</h3>
                    <div className="space-y-4">
                      {(recipe.stepsKo && recipe.stepsKo.length > 0 ? recipe.stepsKo : recipe.steps).map((step, index) => (
                        <div
                          key={index}
                          className={`flex gap-4 p-4 rounded-lg border transition-all duration-200 ${
                            completedSteps.has(index)
                              ? 'bg-green-900/30 border-green-500/30'
                              : 'bg-gray-800/50 border-orange-500/20'
                          }`}
                        >
                          <button
                            onClick={() => handleStepToggle(index)}
                            className="flex-shrink-0 mt-1"
                          >
                            {completedSteps.has(index) ? (
                              <CheckCircle className="h-6 w-6 text-green-400" />
                            ) : (
                              <Circle className="h-6 w-6 text-orange-400 hover:text-green-400" />
                            )}
                          </button>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-sm font-medium text-orange-300">
                                단계 {index + 1}
                              </span>
                            </div>
                            <p className={`leading-relaxed ${
                              completedSteps.has(index) ? 'text-green-200' : 'text-white'
                            }`}>
                              {step}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'notes' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold text-white">내 노트</h3>
                      {isEditingNote ? (
                        <div className="flex gap-2">
                          <button
                            onClick={handleSaveNote}
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all duration-200"
                          >
                            <Save className="h-4 w-4" />
                            <span>저장</span>
                          </button>
                          <button
                            onClick={() => setIsEditingNote(false)}
                            className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-all duration-200"
                          >
                            <X className="h-4 w-4" />
                            <span>취소</span>
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setIsEditingNote(true)}
                          className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-all duration-200"
                        >
                          <Edit3 className="h-4 w-4" />
                          <span>편집</span>
                        </button>
                      )}
                    </div>
                    
                    {isEditingNote ? (
                      <textarea
                        value={personalNote}
                        onChange={(e) => setPersonalNote(e.target.value)}
                        placeholder="이 레시피에 대한 나만의 메모를 남겨보세요..."
                        className="w-full p-4 bg-gray-800/80 border border-orange-500/30 rounded-xl text-white placeholder-orange-300/50 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 resize-none"
                        rows={8}
                      />
                    ) : (
                      <div className="p-4 bg-gray-800/50 rounded-xl border border-orange-500/20 min-h-[200px]">
                        {personalNote ? (
                          <p className="text-white leading-relaxed whitespace-pre-wrap">
                            {personalNote}
                          </p>
                        ) : (
                          <p className="text-orange-300/50 italic">
                            아직 노트가 없어요. 편집 버튼을 클릭해서 메모를 남겨보세요!
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Tags */}
            <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm border border-orange-500/20 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">태그</h3>
              <div className="flex flex-wrap gap-2">
                {(recipe.tagsKo && recipe.tagsKo.length > 0 ? recipe.tagsKo : recipe.tags).map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-orange-900/30 text-orange-300 rounded-full text-sm border border-orange-500/30"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Allergen Info */}
            {recipe.allergenInfo && (
              <div className="bg-gradient-to-br from-red-900/20 to-red-800/20 backdrop-blur-sm border border-red-500/30 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Shield className="h-5 w-5 text-red-400" />
                  <h3 className="text-lg font-bold text-red-300">알레르기 정보</h3>
                </div>
                <div className="space-y-2">
                  {recipe.allergenInfo.contains_allergens && recipe.allergenInfo.contains_allergens.length > 0 ? (
                    recipe.allergenInfo.contains_allergens.map((allergen: string, index: number) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                        <span className="text-red-200">{allergen}</span>
                      </div>
                    ))
                  ) : (
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-green-200">알레르기 유발 성분이 없습니다</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Similar Recipes */}
            {similarRecipes.length > 0 && (
              <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm border border-orange-500/20 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">비슷한 레시피</h3>
                <div className="space-y-4">
                  {similarRecipes.slice(0, 3).map((similarRecipe) => (
                    <div
                      key={similarRecipe.id}
                      onClick={() => router.push(`/recipes/${similarRecipe.id}`)}
                      className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg border border-orange-500/20 hover:border-orange-500/40 cursor-pointer transition-all duration-200"
                    >
                      <div className="w-12 h-12 bg-orange-600/20 rounded-lg flex items-center justify-center">
                        <ChefHat className="h-6 w-6 text-orange-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-white font-medium truncate">
                          {similarRecipe.nameKo || similarRecipe.name}
                        </h4>
                        <div className="flex items-center gap-2 text-sm text-orange-300">
                          <Clock className="h-3 w-3" />
                          <span>{formatCookingTime(similarRecipe.minutes)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}