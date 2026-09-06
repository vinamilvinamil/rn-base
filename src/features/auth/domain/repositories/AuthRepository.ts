import { User } from '../entities/User';

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthSession {
  accessToken: string;
  user: User;
}

export interface AuthRepository {
  login(input: LoginInput): Promise<AuthSession>;

  refreshSession(): Promise<AuthSession>;

  logout(): Promise<void>;

  getCurrentUser(): Promise<User>;
}