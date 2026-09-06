export type AuthErrorCode =
  | 'INVALID_CREDENTIALS'
  | 'SESSION_EXPIRED'
  | 'AUTH_REQUIRED';

  export class AuthError extends Error {
  constructor(
    public readonly code: AuthErrorCode,
  ) {
    super(code);
    this.name = 'AuthError';
  }
}