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
  
  export const validateRegister = (formData, agreeTerms) => {
    const errors = {};
  
    // Kiểm tra họ và tên
    if (!formData.fullName) {
      errors.fullName = "Họ và tên không được để trống.";
    }
  
    // Kiểm tra email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      errors.email = "Email không được để trống.";
    } else if (!emailRegex.test(formData.email)) {
      errors.email = "Email không hợp lệ.";
    }
  
    // Kiểm tra số điện thoại
    const phoneRegex = /^[0-9]{10}$/;
    if (!formData.phone) {
      errors.phone = "Số điện thoại không được để trống.";
    } else if (!phoneRegex.test(formData.phone)) {
      errors.phone = "Số điện thoại phải là 10 chữ số.";
    }
  
    // Kiểm tra giới tính
    if (!formData.gender) {
      errors.gender = "Vui lòng chọn giới tính.";
    }
  
    // Kiểm tra ngày sinh
    if (!formData.dob) {
      errors.dob = "Ngày sinh không được để trống.";
    } else {
      const today = new Date();
      const birthDate = new Date(formData.dob);
      if (birthDate > today) {
        errors.dob = "Ngày sinh không hợp lệ.";
      }
    }
  
    // Kiểm tra mật khẩu
    if (!formData.password) {
      errors.password = "Mật khẩu không được để trống.";
    } else if (formData.password.length < 6) {
      errors.password = "Mật khẩu phải có ít nhất 6 ký tự.";
    }
  
    // Kiểm tra xác nhận mật khẩu
    if (!formData.confirmPassword) {
      errors.confirmPassword = "Vui lòng xác nhận mật khẩu.";
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Mật khẩu không khớp.";
    }
  
    // Kiểm tra điều khoản dịch vụ
    if (!agreeTerms) {
      errors.agreeTerms = "Bạn phải đồng ý với điều khoản dịch vụ.";
    }
  
    return errors;
  };