import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAccountById } from "../../../redux/slices/accountSlice";
import { Avatar, Descriptions, Card, Badge, Spin } from "antd";
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  CalendarOutlined,
  IdcardOutlined,
} from "@ant-design/icons";
import { logout } from "../../../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const accountId = localStorage.getItem("accountId");
  const { account, loading } = useSelector((state) => state.account);

  useEffect(() => {
    if (accountId) {
      dispatch(fetchAccountById(accountId));
    }
  }, [dispatch, accountId]);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("accountId");
    navigate("/");
  };

  if (loading || !account) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="flex justify-center mt-10 px-4">
      <Card
        className="shadow-xl w-full max-w-4xl rounded-lg"
        title={
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-amber-700">
              Thông tin cá nhân
            </h2>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-md shadow"
            >
              Đăng xuất
            </button>
          </div>
        }
      >
        <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-6 sm:space-y-0 sm:space-x-6 mb-8">
          <Avatar
            size={96}
            src={account.avatar}
            icon={!account.avatar && <UserOutlined />}
            className="bg-amber-500 text-white"
          >
            {!account.avatar && account?.fullName?.charAt(0)?.toUpperCase()}
          </Avatar>

          <div className="text-center sm:text-left">
            <h3 className="text-2xl font-bold text-gray-800">
              {account.fullName || "Chưa có tên"}
            </h3>
            <p className="text-gray-500">
              <MailOutlined className="mr-2" />
              {account.email}
            </p>
            <div className="mt-2 space-x-2">
              <Badge
                color={account.status === "ACTIVE" ? "green" : "red"}
                text={account.status || "Trạng thái?"}
              />
              <Badge
                color="orange"
                text={account.position || "Chưa rõ chức vụ"}
              />
            </div>
          </div>
        </div>

        <Descriptions
          bordered
          column={1}
          labelStyle={{ fontWeight: "bold", color: "#92400e" }}
        >
          <Descriptions.Item
            label={
              <>
                <IdcardOutlined className="mr-2" />
                Mã tài khoản
              </>
            }
          >
            {account.accountId}
          </Descriptions.Item>

          <Descriptions.Item
            label={
              <>
                <PhoneOutlined className="mr-2" />
                Số điện thoại
              </>
            }
          >
            {account.phone || "Chưa cập nhật"}
          </Descriptions.Item>

          <Descriptions.Item
            label={
              <>
                <CalendarOutlined className="mr-2" />
                Ngày sinh
              </>
            }
          >
            {account.dob || "Chưa cập nhật"}
          </Descriptions.Item>

          <Descriptions.Item label="Giới tính">
            {account.gender || "Chưa cập nhật"}
          </Descriptions.Item>

          <Descriptions.Item label="Ngày tạo">
            {account.createdAt || "Không có"}
          </Descriptions.Item>

          <Descriptions.Item label="Cập nhật lần cuối">
            {account.updatedAt || "Chưa cập nhật"}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
};

export default ProfilePage;
