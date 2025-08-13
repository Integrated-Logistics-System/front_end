// Stub AuthViewModel to make Header.tsx work
export const useAuthViewModel = () => {
  return {
    user: null,
    isAuthenticated: false,
    logout: () => {}
  };
};