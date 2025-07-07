import { RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { Provider } from "react-redux";
import store from "./redux/store";
import router from "./routes/RouterConfig";

function App() {
  return (
    <Provider store={store}>
      <RouterProvider router={router} />
      <ToastContainer position="top-right" autoClose={3000} />
    </Provider>
  );
}

export default App;
