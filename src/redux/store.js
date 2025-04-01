import { configureStore } from "@reduxjs/toolkit";
import modalReducer from "./slices/modalSlice";
import authReducer from "./slices/authSlice";
import { restoreAuth } from "./slices/authSlice";

const persistedUser = localStorage.getItem("user");
const persistedToken = localStorage.getItem("token");

const preloadedState = {
  auth: {
    isLoggedIn: !!persistedToken && !!persistedUser,
    user: persistedUser ? JSON.parse(persistedUser) : null,
    loading: false,
    error: null,
  },
};

const store = configureStore({
  reducer: {
    modal: modalReducer,
    auth: authReducer,
  },
  preloadedState, // Preload state from localStorage
});

// Optionally dispatch restoreAuth explicitly (not strictly necessary with preloadedState)
if (persistedToken && persistedUser) {
  store.dispatch(restoreAuth(JSON.parse(persistedUser)));
}

export default store;