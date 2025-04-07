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
    dateInputRef.current?.showPicker();
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

  const inputFields = [
    {
      label: "Họ và tên",
      name: "fullName",
      type: "text",
      placeholder: "Nhập họ và tên",
    },
    {
      label: "Email",
      name: "email",
      type: "email",
      placeholder: "Nhập email của bạn",
    },
    {
      label: "Số điện thoại",
      name: "phone",
      type: "tel",
      placeholder: "Nhập số điện thoại",
    },
    {
      label: "Giới tính",
      name: "gender",
      type: "select",
      options: [
        { value: "", label: "Chọn giới tính" },
        { value: "male", label: "Nam" },
        { value: "female", label: "Nữ" },
        { value: "other", label: "Khác" },
      ],
    },
    {
      label: "Ngày sinh",
      name: "dob",
      type: "date",
      ref: dateInputRef,
      onClick: handleDateFieldClick,
    },
    {
      label: "Mật khẩu",
      name: "password",
      type: showPassword ? "text" : "password",
      placeholder: "Nhập mật khẩu",
      toggleShow: setShowPassword,
    },
    {
      label: "Nhập lại mật khẩu",
      name: "confirmPassword",
      type: showConfirmPassword ? "text" : "password",
      placeholder: "Xác nhận mật khẩu",
      toggleShow: setShowConfirmPassword,
    },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={() => dispatch(closeRegisterModal())}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
          aria-label="Đóng"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
          Đăng Ký
        </h2>
        <form onSubmit={handleSubmit}>
          {inputFields.map((field) => (
            <div key={field.name} className="mb-4">
              <label
                htmlFor={field.name}
                className="block text-gray-700 font-semibold mb-2"
              >
                {field.label}
              </label>
              {field.type === "select" ? (
                <select
                  id={field.name}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  {field.options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="relative">
                  <input
                    type={field.type}
                    id={field.name}
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    ref={field.ref}
                    onClick={field.onClick}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder={field.placeholder}
                  />
                  {field.toggleShow && (
                    <button
                      type="button"
                      onClick={() => field.toggleShow((prev) => !prev)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600"
                    >
                      {field.type === "text" ? (
                        <IoMdEye size={24} />
                      ) : (
                        <IoIosEyeOff size={24} />
                      )}
                    </button>
                  )}
                </div>
              )}
              {errors[field.name] && (
                <p className="text-red-500 text-sm mt-1">
                  {errors[field.name]}
                </p>
              )}
            </div>
          ))}
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
