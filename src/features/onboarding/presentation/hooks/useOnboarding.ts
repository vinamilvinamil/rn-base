import { useState } from 'react'; import { setOnboardingCompleted } from '../../data/repositories/OnboardingRepositoryImpl';
export function useOnboarding() { const [loading, setLoading] = useState(false); const complete = async () => { setLoading(true); try { await setOnboardingCompleted(); } finally { setLoading(false); } }; return { complete, loading }; }
