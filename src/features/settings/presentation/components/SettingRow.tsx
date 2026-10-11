import { View, Switch } from 'react-native';
import { AppText } from '@/src/shared/components/AppText';

/** A setting row with optional explanatory copy and a boolean switch. */
export function SettingRow({ title, description, value, onChange }: { title: string; description?: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10 }}>
      <View style={{ flex: 1, gap: 3 }}>
        <AppText variant="heading" style={{ fontSize: 15 }}>{title}</AppText>
        {description && <AppText variant="caption">{description}</AppText>}
      </View>
      <Switch value={value} onValueChange={onChange} />
    </View>
  );
}
