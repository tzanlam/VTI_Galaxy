import React from "react";
import { RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { Provider } from "react-redux"; // Thêm Provider từ react-redux
import store from "../store/store.js"; // Đường dẫn đến store
import router from "../routes/RouterConfig";

function App() {
  return (
    <Provider store={store}>
      <RouterProvider router={router} />
      <ToastContainer />
    </Provider>
  );
}

export default App;
