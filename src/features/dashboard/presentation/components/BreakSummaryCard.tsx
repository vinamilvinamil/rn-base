import { AppCard } from '@/src/shared/components/AppCard'; import { AppText } from '@/src/shared/components/AppText';
export function BreakSummaryCard({ completed, skipped }: { completed: number; skipped: number }) { return <AppCard><AppText variant="heading">Tổng quan hôm nay</AppText><AppText>✅ Hoàn thành: {completed}</AppText><AppText>⏭️ Bỏ qua: {skipped}</AppText></AppCard>; }
