import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Menu, Dropdown, Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { logout } from "../redux/slices/authSlice";

const UserMenu = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
  };

  const menu = (
    <Menu
      items={[
        { key: "profile", label: "Trang cá nhân" },
        { key: "logout", label: <span onClick={handleLogout}>Đăng xuất</span> },
      ]}
    />
  );

  return (
    <Dropdown overlay={menu} placement="bottomRight">
      <div className="flex items-center space-x-2 cursor-pointer">
        <Avatar
          icon={<UserOutlined />}
          src={user?.image || null}
          className="bg-amber-400"
        />
        <span className="text-amber-700 font-semibold">
          {user?.identifier || "Tài khoản"}
        </span>
      </div>
    </Dropdown>
  );
};

export default UserMenu;
