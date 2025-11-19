import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type TokensPayload = {
  access_token: string;
  refresh_token: string;
  token_type: string;
};

type AuthState = {
  accessToken: string | null;
  refreshToken: string | null;
  tokenType: string | null;
  loggedIn: boolean;
};

const initialState: AuthState = {
  accessToken: null,
  refreshToken: null,
  tokenType: null,
  loggedIn: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setTokens(state, action: PayloadAction<TokensPayload>) {
      state.accessToken = action.payload.access_token;
      state.refreshToken = action.payload.refresh_token;
      state.tokenType = action.payload.token_type;
      state.loggedIn = true;
    },
    clearAuth(state) {
      state.accessToken = null;
      state.refreshToken = null;
      state.tokenType = null;
      state.loggedIn = false;
    },
  },
});

export const { setTokens, clearAuth } = authSlice.actions;
export default authSlice.reducer;
