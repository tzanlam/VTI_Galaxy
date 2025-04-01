// components/RegisterModal.jsx
import React, { useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { closeRegisterModal, openLoginModal } from "../redux/slices/modalSlice";
import { validateRegister } from "../utils/Validation";
import { IoIosEyeOff, IoMdEye } from "react-icons/io";

const RegisterModal = () => {
  const { isRegisterOpen } = useSelector((state) => state.modal);
  const dispatch = useDispatch();
  const dateInputRef = useRef(null);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    gender: "",
    dob: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleDateFieldClick = () => {
    // Programmatically focus and open the date picker when the entire field is clicked
    if (dateInputRef.current) {
      dateInputRef.current.showPicker();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateRegister(formData, agreeTerms);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    console.log("Đăng ký với:", formData);
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      gender: "",
      dob: "",
      password: "",
      confirmPassword: "",
    });
    setErrors({});
    setAgreeTerms(false);
    dispatch(closeRegisterModal());
  };

  if (!isRegisterOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={() => dispatch(closeRegisterModal())}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </button>
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
          Đăng Ký
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="fullName"
              className="block text-gray-700 font-semibold mb-2"
            >
              Họ và tên
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Nhập họ và tên"
            />
            {errors.fullName && (
              <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
            )}
          </div>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-gray-700 font-semibold mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Nhập email của bạn"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>
          <div className="mb-4">
            <label
              htmlFor="phone"
              className="block text-gray-700 font-semibold mb-2"
            >
              Số điện thoại
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Nhập số điện thoại"
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
            )}
          </div>
          <div className="mb-4">
            <label
              htmlFor="gender"
              className="block text-gray-700 font-semibold mb-2"
            >
              Giới tính
            </label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">Chọn giới tính</option>
              <option value="male">Nam</option>
              <option value="female">Nữ</option>
              <option value="other">Khác</option>
            </select>
            {errors.gender && (
              <p className="text-red-500 text-sm mt-1">{errors.gender}</p>
            )}
          </div>
          <div className="mb-4">
            <label
              htmlFor="dob"
              className="block text-gray-700 font-semibold mb-2"
            >
              Ngày sinh
            </label>
            <div
              className="relative cursor-pointer"
              onClick={handleDateFieldClick}
            >
              <input
                type="date"
                id="dob"
                name="dob"
                ref={dateInputRef}
                value={formData.dob}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer"
              />
              <div className="absolute inset-0" />
            </div>
            {errors.dob && (
              <p className="text-red-500 text-sm mt-1">{errors.dob}</p>
            )}
          </div>
          <div className="mb-4 relative">
            <label
              htmlFor="password"
              className="block text-gray-700 font-semibold mb-2"
            >
              Mật khẩu
            </label>
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
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-7 transform translate-y-1/2 text-gray-600 flex items-center justify-center"
            >
              {showPassword ? (
                <IoMdEye className="w-6 h-6" />
              ) : (
                <IoIosEyeOff className="w-6 h-6" />
              )}
            </button>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>
          <div className="mb-4 relative">
            <label
              htmlFor="confirmPassword"
              className="block text-gray-700 font-semibold mb-2"
            >
              Nhập lại mật khẩu
            </label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-2 pr-12 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Xác nhận mật khẩu"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-7 transform translate-y-1/2 text-gray-600 flex items-center justify-center"
            >
              {showConfirmPassword ? (
                <IoMdEye className="w-6 h-6" />
              ) : (
                <IoIosEyeOff className="w-6 h-6" />
              )}
            </button>
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>
          <div className="mb-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="mr-2"
              />
              <span className="text-gray-700">
                Tôi đồng ý với{" "}
                <a href="#" className="text-orange-500 hover:underline">
                  điều khoản dịch vụ
                </a>
              </span>
            </label>
            {errors.agreeTerms && (
              <p className="text-red-500 text-sm mt-1">{errors.agreeTerms}</p>
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600 transition-colors duration-300"
          >
            Đăng Ký
          </button>
        </form>
        <p className="text-center text-gray-600 mt-4">
          Đã có tài khoản?{" "}
          <button
            onClick={() => dispatch(openLoginModal())}
            className="text-orange-500 hover:underline"
          >
            Đăng nhập
          </button>
        </p>
      </div>
    </div>
  );
};

export default RegisterModal;
