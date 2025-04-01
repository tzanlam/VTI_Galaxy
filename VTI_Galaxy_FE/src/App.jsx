// App.jsx
import React from "react";
import { RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { Provider } from "react-redux";
import store from "./redux/store";
import router from "./routes/RouterConfig";
import LoginModal from "./components/LoginModal";
import RegisterModal from "./components/RegisterModal";

function App() {
  return (
    <Provider store={store}>
      <RouterProvider router={router} />
      <ToastContainer />
      <LoginModal />
      <RegisterModal />
    </Provider>
  );
}

export default App;
