import React from 'react';
import { Layout, Menu, Input, Avatar } from 'antd';
import { Link, Outlet } from 'react-router-dom';
import { SearchOutlined, UserOutlined } from '@ant-design/icons';

const { Header, Sider, Content } = Layout;

const HomeAdmin = () => {
  const menuItems = [
    { key: '1', label: <Link to="/management/galaxy">Galaxy</Link> },
    { key: '2', label: <Link to="/management/room">Phòng chiếu</Link> },
    { key: '3', label: <Link to="/management/movie">Phim</Link> },
    { key: '4', label: <Link to="/management/voucher">Voucher</Link> },
    { key: '5', label: <Link to="/management/employee">Nhân viên</Link> },
    { key: '6', label: <Link to="/management/statistics">Thống kê</Link> },
    { key: '7', label: <Link to="/management/invoice">Hóa đơn điện tử</Link> },
    { key: '8', label: <Link to="/management/report">Báo cáo</Link> },
  ];

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
          defaultSelectedKeys={['1']}
          className="mt-2 bg-transparent text-amber-900 font-medium"
          items={menuItems}
          style={{
            backgroundColor: 'transparent',
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

          {/* User info */}
          <div className="flex items-center space-x-3">
            <Avatar icon={<UserOutlined />} className="bg-amber-400" />
            <span className="font-semibold text-amber-700">Tài khoản của bạn</span>
          </div>
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
