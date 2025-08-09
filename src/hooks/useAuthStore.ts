
import { useRecoilValue } from 'recoil';
import { userTokenSelector, isAuthenticatedSelector, userProfileSelector } from '@/store/authStore';

export const useAuthStore = () => {
  const accessToken = useRecoilValue(userTokenSelector);
  const isAuthenticated = useRecoilValue(isAuthenticatedSelector);
  const user = useRecoilValue(userProfileSelector);

  return { accessToken, isAuthenticated, user };
};
