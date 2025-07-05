import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { login } from "../../services/AuthService";

export const loginS = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await login(email, password);
      return response.data;
    } catch (error) {
      console.error("Login error:", error);
      return rejectWithValue(error?.response?.data?.message || "Lỗi hệ thống");
    }
  }
);

const initialState = {
  isLoggedIn: false,
  user: null,
  loading: false,
  error: null,
  position: []
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.isLoggedIn = false;
      state.user = null;
      state.position = [];
      localStorage.removeItem("token");
    },
    clearAuthSlice: (state) => {
      Object.assign(state, initialState);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginS.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginS.fulfilled, (state, action) => {
        const data = action.payload;

        // Kiểm tra data tồn tại trước khi gán
        if (data && typeof data === "object") {
          state.isLoggedIn = true;
          state.user = data;
          state.position = Array.isArray(data.authorities) ? data.authorities : [];
          state.loading = false;
          localStorage.setItem("token", data.token);
        } else {
          // fallback trong trường hợp payload không hợp lệ
          state.isLoggedIn = false;
          state.user = null;
          state.position = [];
          state.loading = false;
          state.error = "Dữ liệu đăng nhập không hợp lệ";
        }
      })
      .addCase(loginS.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
}
});

export const { logout, clearAuthSlice } = authSlice.actions;
export default authSlice.reducer;
