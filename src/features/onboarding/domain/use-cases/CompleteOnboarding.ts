import type { OnboardingRepository } from '../repositories/OnboardingRepository';
export class CompleteOnboarding { constructor(private repo: OnboardingRepository) {} execute() { return this.repo.complete(); } }
