import { Layout, Menu, Input, Avatar, Dropdown } from "antd";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { SearchOutlined, UserOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import {
  clearAccountSlice,
} from "../redux/slices/accountSlice";

const { Header, Sider, Content } = Layout;

const HomeAdmin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // const accountId = localStorage.getItem("accountId");
  // const account = useSelector((state) => state.account);
  const menuItems = [
    { key: "1", label: <Link to="/management/galaxy">Galaxy</Link> },
    { key: "2", label: <Link to="/management/room">Phòng chiếu</Link> },
    { key: "3", label: <Link to="/management/movie">Phim</Link> },
    { key: "4", label: <Link to="/management/voucher">Voucher</Link> },
    { key: "5", label: <Link to="/management/employee">Nhân viên</Link> },
    { key: "6", label: <Link to="/management/other">Dịch vụ khác</Link> },
    { key: "7", label: <Link to="/management/invoice">Hóa đơn điện tử</Link> },
    { key: "8", label: <Link to="/management/report">Báo cáo</Link> },
  ];

  const handleLogout = () => {
    dispatch(clearAccountSlice());
    navigate("/");
  };

  // useEffect(
    // () => (dispatch(fetchAccountById(accountId)), [dispatch, accountId])
  // );

  const userMenu = (
    <Menu
      items={[
        {
          key: "profile",
          label: <Link to="/management/profile">Hồ sơ cá nhân</Link>,
        },
        {
          key: "logout",
          label: <span onClick={handleLogout}>Đăng xuất</span>,
        },
      ]}
    />
  );

  return (
    <Layout className="min-h-screen">
      {/* Sidebar */}
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        className="bg-gradient-to-b from-yellow-200 via-yellow-300 to-yellow-400 shadow-lg"
      >
        <div className="h-16 flex items-center justify-center text-amber-800 font-bold text-xl border-b border-yellow-300">
          Galaxy Cinema
        </div>
        <Menu
          mode="inline"
          defaultSelectedKeys={["1"]}
          className="mt-2 bg-transparent text-amber-900 font-medium"
          items={menuItems}
          style={{
            backgroundColor: "transparent",
          }}
        />
      </Sider>

      {/* Main layout */}
      <Layout>
        {/* Header */}
        <Header className="bg-gradient-to-r from-yellow-100 via-yellow-200 to-yellow-300 shadow-md flex justify-between items-center px-6">
          {/* Search */}
          <div className="flex items-center space-x-4">
            <Input
              placeholder="Tìm mã đặt phòng, tên khách"
              prefix={<SearchOutlined />}
              className="w-80 border-yellow-400 focus:border-amber-500 focus:ring-amber-500 bg-yellow-50 placeholder-amber-500"
            />
          </div>

          {/* User info dropdown */}
          <Dropdown menu={{items: userMenu}} placement="bottomRight" arrow>
            <div className="flex items-center space-x-3 cursor-pointer">
              <Avatar icon={<UserOutlined />} className="bg-amber-400" />
              <span className="font-semibold text-amber-700">
                {/* ${account.fullName} */}
                thông tin tài khoản
              </span>
            </div>
          </Dropdown>
        </Header>

        {/* Content */}
        <Content className="m-4 p-6 bg-gradient-to-br from-yellow-50 via-amber-100 to-yellow-200 rounded-lg shadow-inner min-h-[80vh]">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default HomeAdmin;
