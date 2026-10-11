export interface OnboardingRepository { isCompleted(): Promise<boolean>; complete(): Promise<void> }
