import React, { useEffect } from "react";
import { BrowserRouter, RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { Provider, useDispatch, useSelector } from "react-redux";
import store from "./redux/store";
import router from "./routes/RouterConfig";
import LoginModal from "./components/LoginModal";
import RegisterModal from "./components/RegisterModal";
import { restoreAuth } from "./redux/slices/authSlice";

function AppContent() {
  const dispatch = useDispatch();
  const { isLoggedIn } = useSelector((state) => state.auth);

  useEffect(() => {
    const restoreAuthState = () => {
      const persistedUser = localStorage.getItem("user");
      const persistedToken = localStorage.getItem("token");
      if (persistedToken && persistedUser && !isLoggedIn) {
        dispatch(restoreAuth(JSON.parse(persistedUser)));
      }
    };
    restoreAuthState();
  }, [dispatch, isLoggedIn]);

  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer position="top-right" autoClose={3000} />
      <LoginModal />
      <RegisterModal />
    </>
  );
}

function App() {
  return (
    <Provider store={store}>
      {/* <HomeAdmin /> */}
      <AppContent />
    </Provider>
  );
}

export default App;
