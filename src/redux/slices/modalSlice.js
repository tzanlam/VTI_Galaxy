// redux/slices/modalSlice.js
import { createSlice } from "@reduxjs/toolkit";

const modalSlice = createSlice({
  name: "modal",
  initialState: {
    isLoginOpen: false,
    isRegisterOpen: false,
  },
  reducers: {
    openLoginModal: (state) => {
      state.isLoginOpen = true;
      state.isRegisterOpen = false; // Đóng RegisterModal nếu đang mở
    },
    closeLoginModal: (state) => {
      state.isLoginOpen = false;
    },
    openRegisterModal: (state) => {
      state.isRegisterOpen = true;
      state.isLoginOpen = false; // Đóng LoginModal nếu đang mở
    },
    closeRegisterModal: (state) => {
      state.isRegisterOpen = false;
    },
  },
});

export const {
  openLoginModal,
  closeLoginModal,
  openRegisterModal,
  closeRegisterModal,
} = modalSlice.actions;

export default modalSlice.reducer;