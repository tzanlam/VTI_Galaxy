import { configureStore } from "@reduxjs/toolkit";
import modalReducer from "./slices/modalSlice";
import authReducer from "./slices/authSlice";
import galaxyReducer from "./slices/galaxySlice"
import accountReducer from "./slices/accountSlice"
const persistedUser = localStorage.getItem("user");
const persistedToken = localStorage.getItem("token");

const preloadedState = {
  auth: {
    isLoggedIn: !!(persistedToken && persistedUser),
    user: persistedUser ? JSON.parse(persistedUser) : null,
    loading: false,
    error: null,
  },
};

const store = configureStore({
  reducer: {
    modal: modalReducer,
    auth: authReducer,
    galaxy: galaxyReducer,
    account: accountReducer
  },
  preloadedState,
  // eslint-disable-next-line no-undef
  devTools: process.env.NODE_ENV !== "production", // Bật Redux DevTools trong dev
});

export default store;