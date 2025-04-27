import { configureStore } from "@reduxjs/toolkit";
import modalReducer from "./slices/modalSlice";
import authReducer from "./slices/authSlice";
import galaxyReducer from "./slices/galaxySlice";
import accountReducer from "./slices/accountSlice";
import movieReducer from "./slices/movieSlice";
import showTimeReducer from "./slices/showTimeSlice";
import startTimeReducer from "./slices/startTimeSlice";

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
    account: accountReducer,
    movie: movieReducer,
    showTime: showTimeReducer,
    startTime: startTimeReducer,
  },
  preloadedState,
  // eslint-disable-next-line no-undef
  devTools: process.env.NODE_ENV !== "production", // Bật Redux DevTools trong dev
});

// Log để xác nhận các reducer được tích hợp
console.log("Store configured with reducers:", Object.keys(store.getState()));

export default store;
