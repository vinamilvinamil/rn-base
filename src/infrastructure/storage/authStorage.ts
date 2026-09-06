import * as SecureStore from 'expo-secure-store';
const REFRESH_TOKEN_KEY =
  'auth.refreshToken';

export const secureStorage = {
  async getRefreshToken(): Promise<string | null> {
    // secure storage implementation
    return SecureStore.getItemAsync(
      REFRESH_TOKEN_KEY,
    );
  },

  async saveRefreshToken(
    token: string,
  ): Promise<void> {
    // secure storage implementation
    await SecureStore.setItemAsync(
      REFRESH_TOKEN_KEY,
      token,
    );
  },

  async clearRefreshToken(): Promise<void> {
    // secure storage implementation
    await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
  },
};