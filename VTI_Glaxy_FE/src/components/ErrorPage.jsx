// components/ErrorPage.jsx
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const ErrorPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const errorMessage =
    location.state?.message ||
    "Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-5">
      <div className="text-center max-w-md mx-auto">
        <img
          src="https://vticinema.web.app/assets/ErrorPage-Dr8yzO2v.gif"
          alt="Error Animation"
          className="w-full max-w-xs mx-auto mb-8"
        />

        <h1 className="text-4xl font-bold text-gray-800 mb-4">Oops!</h1>
        <p className="text-xl text-gray-600 mb-6">{errorMessage}</p>

        <div className="space-y-4">
          <button
            onClick={() => navigate("/")}
            className="w-full bg-orange-500 text-white py-3 px-6 rounded-md hover:bg-orange-600 transition-colors duration-300 flex items-center justify-center"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            Về Trang Chủ
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
