import {
    StyleSheet,
    Text,
    View,
} from 'react-native';

import { User } from '@/features/auth/domain/entities/User';

interface ProfileHeaderProps {
  user: User;
}

export const ProfileHeader = ({
  user,
}: ProfileHeaderProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>
          {user.name
            ?.charAt(0)
            .toUpperCase()}
        </Text>
      </View>

      <View style={styles.info}>
        <Text style={styles.name}>
          {user.name}
        </Text>

        <Text style={styles.email}>
          {user.email}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },

  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },

  avatarText: {
    fontSize: 24,
    fontWeight: '600',
  },

  info: {
    flex: 1,
    gap: 4,
  },

  name: {
    fontSize: 20,
    fontWeight: '600',
  },

  email: {
    fontSize: 14,
    color: '#6B7280',
  },
});