export type AppErrorCode =
  | 'NETWORK_ERROR'
  | 'UNKNOWN';

export class AppError extends Error {
  constructor(
    public readonly code: AppErrorCode,
  ) {
    super(code);
    this.name = 'AppError';
  }
}