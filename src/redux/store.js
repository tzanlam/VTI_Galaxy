// redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import modalReducer from "./slices/modalSlice";
import authReducer from "./slices/authSlice";

const store = configureStore({
  reducer: {
    modal: modalReducer,
    auth: authReducer,
  },
});

export default store;