// utils/validation.js
export const validateLogin = (email, password) => {
    const errors = {};
  
    // Kiểm tra email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      errors.email = "Email không được để trống.";
    } else if (!emailRegex.test(email)) {
      errors.email = "Email không hợp lệ.";
    }
  
    // Kiểm tra password
    if (!password) {
      errors.password = "Mật khẩu không được để trống.";
    } else if (password.length < 6) {
      errors.password = "Mật khẩu phải có ít nhất 6 ký tự.";
    }
  
    return errors;
  };