import {
    createSlice,
    PayloadAction,
} from '@reduxjs/toolkit';

import { User } from '@/features/auth/domain/entities/User';

interface AuthState {
  status:
    | 'unknown'
    | 'authenticated'
    | 'unauthenticated';

  accessToken: string | null;

  user: User | null;
}

const initialState: AuthState = {
  status: 'unknown',
  accessToken: null,
  user: null,
};

const authSlice = createSlice({
  name: 'auth',

  initialState,

  reducers: {
    setAuthenticated(
      state,
      action: PayloadAction<{
        accessToken: string;
        user: User;
      }>,
    ) {
      state.status = 'authenticated';
      state.accessToken =
        action.payload.accessToken;
      state.user = action.payload.user;
    },

    setUnauthenticated(state) {
      state.status =
        'unauthenticated';

      state.accessToken = null;
      state.user = null;
    },

    setAccessToken(
      state,
      action: PayloadAction<string>,
    ) {
      state.accessToken =
        action.payload;
    },
  },
});

export const {
  setAuthenticated,
  setUnauthenticated,
  setAccessToken,
} = authSlice.actions;

export default authSlice.reducer;