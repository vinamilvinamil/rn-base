import { View } from 'react-native'; import { AppText } from './AppText';
export function EmptyState({ title, description }: { title: string; description: string }) { return <View style={{ padding: 24, alignItems: 'center', gap: 8 }}><AppText variant="heading">{title}</AppText><AppText style={{ textAlign: 'center' }}>{description}</AppText></View>; }
