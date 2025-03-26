import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css"; // Đảm bảo dòng này có mặt
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
