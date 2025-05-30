import { BaseApiService } from './base.service';
import { 
  User, 
  LoginDto, 
  CreateUserDto, 
  AuthResponseDto 
} from '@/models';

export interface IAuthService {
  login(credentials: LoginDto): Promise<AuthResponseDto>;
  register(userData: CreateUserDto): Promise<AuthResponseDto>;
  logout(): Promise<void>;
  getCurrentUser(): User | null;
  isAuthenticated(): boolean;
}

export class AuthService extends BaseApiService implements IAuthService {
  private static instance: AuthService;

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async login(credentials: LoginDto): Promise<AuthResponseDto> {
    const response = await this.handleRequest<AuthResponseDto>(
      this.client.post('/api/auth/login', credentials)
    );

    // Store token and user data
    this.setToken(response.access_token);
    this.setUser(response.user);

    return response;
  }

  async register(userData: CreateUserDto): Promise<AuthResponseDto> {
    const response = await this.handleRequest<AuthResponseDto>(
      this.client.post('/api/auth/register', userData)
    );

    // Store token and user data
    this.setToken(response.access_token);
    this.setUser(response.user);

    return response;
  }

  async logout(): Promise<void> {
    this.removeToken();
    this.removeUser();
  }

  getCurrentUser(): User | null {
    if (typeof window === 'undefined') return null;
    
    const userData = localStorage.getItem('user');
    if (!userData) return null;

    try {
      const userJson = JSON.parse(userData);
      return User.fromJson(userJson);
    } catch {
      return null;
    }
  }

  isAuthenticated(): boolean {
    return !!this.getToken() && !!this.getCurrentUser();
  }

  private setUser(user: any): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(user));
    }
  }

  private removeUser(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user');
    }
  }
}

// Export singleton instance
export const authService = AuthService.getInstance();
