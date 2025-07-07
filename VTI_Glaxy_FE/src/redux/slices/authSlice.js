import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { login } from "../../services/AuthService";

const initialState = {
  isLoggedIn: false,
  loading: false,
  accountId: null,
  error: null,
  position: null
};

export const loginS = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await login(email, password);
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || "Lỗi hệ thống");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.isLoggedIn = false;
      state.token = null;
      state.position = null;
      state.accountId = null;
      localStorage.removeItem("token");
      localStorage.removeItem("accountId");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginS.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginS.fulfilled, (state, action) => {
        state.accountId = action.payload.accountId
        state.isLoggedIn = true;
        localStorage.setItem("token", action.payload.token);
        localStorage.setItem("accountId", action.payload.accountId);
        localStorage.setItem("position", action.payload.authorities?.[0]?.authority)
        state.position = action.payload.authorities?.[0]?.authority;
        state.loading = false;
      })
      .addCase(loginS.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
