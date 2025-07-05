import { RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import store from "./redux/store";
import router from "./routes/RouterConfig";
import LoginModal from "./components/LoginModal";
import RegisterModal from "./components/RegisterModal";
import { Provider } from "react-redux";

function AppContent() {
  // Nếu bạn chỉ cần token cho guard (route), có thể xử lý ở slice khác hoặc bỏ qua useEffect này
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
      <AppContent />
    </Provider>
  );
}

export default App;
