import { User } from "../../domain/entities/User";
import { LoginResponseDto, RefreshResponseDto } from "../dto/AuthDto";

export const mockLoginResponse : LoginResponseDto = {
  access_token: 'mock-access-token' + Date.now(),
  refresh_token: 'mock-refresh-token' + Date.now(),
  user: {
    id: 1,
    email: 'email@gmail.com',
    full_name: 'Mock Test User',
  },
};

export const mockRefreshResponse : RefreshResponseDto = {
  access_token: 'mock-access-token' + Date.now(),
  user: {
    id: 1,
    email: 'email@gmail.com',
    full_name: 'Mock Test User',
  },
};

export const mockUser : User = {
  id: "1",
  email: 'email@gmail.com',
  name: 'Mock Test User',
};