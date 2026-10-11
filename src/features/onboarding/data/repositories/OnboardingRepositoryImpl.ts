import { KeyValueStorage } from '@/src/infrastructure/storage/KeyValueStorage'; import { STORAGE_KEYS } from '@/src/shared/constants/storage-keys';
export async function getOnboardingCompleted() { return (await KeyValueStorage.get(STORAGE_KEYS.onboardingCompleted)) === 'true'; }
export async function setOnboardingCompleted() { await KeyValueStorage.set(STORAGE_KEYS.onboardingCompleted, 'true'); }
