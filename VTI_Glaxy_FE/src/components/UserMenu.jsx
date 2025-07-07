import { Dropdown, Avatar } from "antd";
import { useDispatch } from "react-redux";
import { logout } from "../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";

const UserMenu = ({ account }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const menuItems = [
    {
      key: "logout",
      label: "Đăng xuất",
      onClick: handleLogout,
    },
  ];

  return (
    <Dropdown menu={{ items: menuItems }} placement="bottomRight">
      <div className="cursor-pointer flex items-center space-x-2">
        <Avatar
          size="large"
          src={account?.avatar || null}
          style={{ backgroundColor: "#f56a00" }}
        >
          {account?.fullName?.charAt(0)?.toUpperCase()}
        </Avatar>
        <span>{account?.fullName || account?.email}</span>
      </div>
    </Dropdown>
  );
};

export default UserMenu;
