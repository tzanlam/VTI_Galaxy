import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Avatar, Button, Input, Select, DatePicker } from "antd";
import { updateAccount, fetchAccountById } from "../redux/slices/accountSlice";
import { toast } from "react-toastify";
import moment from "moment";

const { Option } = Select;
const { Password } = Input;

const UserProfile = () => {
  const dispatch = useDispatch();
  const account = useSelector((state) => state.account.account);
  const loading = useSelector((state) => state.account.loading);
  const error = useSelector((state) => state.account.err);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    gender: "",
    dob: null,
    password: "",
  });

  // Lấy accountId từ localStorage
  const accountId = localStorage.getItem("accountId");

  // Tải thông tin người dùng khi component mount
  useEffect(() => {
    if (accountId && !account && !loading) {
      dispatch(fetchAccountById(accountId))
        .unwrap()
        .catch((err) => {
          toast.error(err || "Không thể tải thông tin người dùng!");
          console.error("Lỗi tải thông tin:", err);
        });
    }
    if (account) {
      setFormData({
        fullName: account.fullName || "",
        email: account.email || "",
        phone: account.phone || "",
        gender: account.gender || "",
        dob: account.dob ? moment(account.dob) : null,
        password: account.password || "",
      });
    }
  }, [account, accountId, dispatch, loading]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (isEditing) {
      // Reset form data khi hủy chỉnh sửa
      setFormData({
        fullName: account?.fullName || "",
        email: account?.email || "",
        phone: account?.phone || "",
        gender: account?.gender || "",
        dob: account?.dob ? moment(account.dob) : null,
        password: account?.password || "",
      });
    }
  };

  const handleInputChange = (e, field) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handleGenderChange = (value) => {
    setFormData({ ...formData, gender: value });
  };

  const handleDateChange = (date) => {
    setFormData({ ...formData, dob: date });
  };

  const handleSubmit = async () => {
    if (!accountId) {
      toast.error("Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại!");
      return;
    }
    try {
      await dispatch(
        updateAccount({
          accountId,
          accountRequest: {
            ...formData,
            dob: formData.dob ? formData.dob.format("YYYY-MM-DD") : "",
          },
        })
      ).unwrap();
      toast.success("Cập nhật thông tin thành công!");
      setIsEditing(false);
    } catch (err) {
      toast.error(err || "Cập nhật thông tin thất bại!");
      console.error("Lỗi cập nhật:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[350px]">
        <p>Đang tải thông tin...</p>
      </div>
    );
  }

  if (error || !accountId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[350px]">
        <p>
          Phiên đăng nhập đã hết hạn hoặc không hợp lệ. Vui lòng đăng nhập lại.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col px-4 py-4 items-center min-h-[350px]">
      <h2 className="text-2xl font-bold mb-6">Thông tin cá nhân</h2>
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-2xl">
        <div className="flex justify-center mb-4">
          <Avatar
            size={50}
            src={account?.avatar || null}
            style={{ backgroundColor: "#f56a00" }}
          >
            {account?.fullName?.charAt(0)?.toUpperCase()}
          </Avatar>
        </div>
        {isEditing ? (
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col space-y-4">
              <div>
                <span className="font-bold">Họ tên:</span>
                <Input
                  value={formData.fullName}
                  onChange={(e) => handleInputChange(e, "fullName")}
                  className="mt-1"
                />
              </div>
              <div>
                <span className="font-bold">Email:</span>
                <Input
                  value={formData.email}
                  onChange={(e) => handleInputChange(e, "email")}
                  className="mt-1"
                  type="email"
                />
              </div>
              <div>
                <span className="font-bold">Số điện thoại:</span>
                <Input
                  value={formData.phone}
                  onChange={(e) => handleInputChange(e, "phone")}
                  className="mt-1"
                  type="tel"
                />
              </div>
            </div>
            <div className="flex flex-col space-y-4">
              <div>
                <span className="font-bold">Giới tính:</span>
                <Select
                  value={formData.gender}
                  onChange={handleGenderChange}
                  className="w-full mt-1"
                >
                  <Option value="male">Nam</Option>
                  <Option value="female">Nữ</Option>
                  <Option value="other">Khác</Option>
                </Select>
              </div>
              <div>
                <span className="font-bold">Ngày sinh:</span>
                <DatePicker
                  value={formData.dob}
                  onChange={handleDateChange}
                  className="w-full mt-1"
                  format="YYYY-MM-DD"
                />
              </div>
              <div>
                <span className="font-bold">Mật khẩu:</span>
                <Password
                  value={formData.password}
                  onChange={(e) => handleInputChange(e, "password")}
                  className="mt-1"
                />
              </div>
            </div>
            <div className="col-span-2 flex justify-end space-x-2 mt-4">
              <Button
                className="bg-gray-500 text-white rounded-full hover:opacity-80 transition-opacity duration-300"
                onClick={handleEditToggle}
              >
                Hủy
              </Button>
              <Button
                className="bg-orange-500 text-white rounded-full hover:opacity-80 transition-opacity duration-300"
                onClick={handleSubmit}
              >
                Lưu
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col space-y-4">
              <div>
                <span className="font-bold">Họ tên:</span>
                <Input
                  value={account?.fullName || "Chưa cập nhật"}
                  disabled
                  className="mt-1"
                />
              </div>
              <div>
                <span className="font-bold">Email:</span>
                <Input
                  value={account?.email || "Chưa cập nhật"}
                  disabled
                  className="mt-1"
                  type="email"
                />
              </div>
              <div>
                <span className="font-bold">Số điện thoại:</span>
                <Input
                  value={account?.phone || "Chưa cập nhật"}
                  disabled
                  className="mt-1"
                  type="tel"
                />
              </div>
            </div>
            <div className="flex flex-col space-y-4">
              <div>
                <span className="font-bold">Giới tính:</span>
                <Select
                  value={account?.gender || "Chưa cập nhật"}
                  disabled
                  className="w-full mt-1"
                >
                  <Option value="male">Nam</Option>
                  <Option value="female">Nữ</Option>
                  <Option value="other">Khác</Option>
                </Select>
              </div>
              <div>
                <span className="font-bold">Ngày sinh:</span>
                <DatePicker
                  value={account?.dob ? moment(account.dob) : null}
                  disabled
                  className="w-full mt-1"
                  format="YYYY-MM-DD"
                />
              </div>
              <div>
                <span className="font-bold">Mật khẩu:</span>
                <Password
                  value={account?.password || "Chưa cập nhật"}
                  disabled
                  className="mt-1"
                />
              </div>
            </div>
            <div className="col-span-2 flex justify-end mt-4">
              <Button
                className="bg-orange-500 text-white rounded-full hover:opacity-80 transition-opacity duration-300"
                onClick={handleEditToggle}
              >
                Chỉnh sửa
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
