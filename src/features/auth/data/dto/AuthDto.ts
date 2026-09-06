export interface LoginRequestDto {
  email: string;
  password: string;
}

export interface LoginResponseDto {
  access_token: string;
  refresh_token: string;

  user: {
    id: number;
    email: string;
    full_name: string;
  };
}

export interface RefreshResponseDto {
  access_token: string;

  user: {
    id: number;
    email: string;
    full_name: string;
  };
}