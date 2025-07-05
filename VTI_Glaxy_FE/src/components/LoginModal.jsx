import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { closeLoginModal, openRegisterModal } from "../redux/slices/modalSlice";
import { loginS } from "../redux/slices/authSlice";
import { IoIosEyeOff, IoMdEye } from "react-icons/io";
import { toast } from "react-toastify";

const LoginModal = () => {
  const { isLoginOpen } = useSelector((state) => state.modal);
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true);
    try {
      await dispatch(loginS({
        email: formData.email,
        password: formData.password
      })).unwrap();

      toast.success("Đăng nhập thành công!");
      dispatch(closeLoginModal());
      setFormData({ email: "", password: "" });
    } catch (err) {
      console.error("Đăng nhập lỗi:", err);
      toast.error("Đăng nhập thất bại!");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isLoginOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
        <button
          onClick={() => dispatch(closeLoginModal())}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
          aria-label="Đóng"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
              d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Đăng Nhập</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 font-semibold mb-2">Email</label>
            <input
              type="email" id="email" name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Nhập email"
            />
          </div>

          <div className="mb-6 relative">
            <label htmlFor="password" className="block text-gray-700 font-semibold mb-2">Mật khẩu</label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 pr-12 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Nhập mật khẩu"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-7 transform translate-y-1/2 text-gray-600"
            >
              {showPassword ? <IoMdEye size={24} /> : <IoIosEyeOff size={24} />}
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full ${isLoading ? "bg-gray-400" : "bg-orange-500 hover:bg-orange-600"
              } text-white py-2 rounded-md transition-colors duration-300`}
          >
            {isLoading ? "Đang xử lý..." : "Đăng Nhập"}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-4">
          Chưa có tài khoản?{" "}
          <button onClick={() => dispatch(openRegisterModal())} className="text-orange-500 hover:underline">
            Đăng ký
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginModal;
