// Layout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header"; // Điều chỉnh đường dẫn nếu cần
import Footer from "../components/Footer"; // Điều chỉnh đường dẫn nếu cần

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header cố định */}
      <Header />

      {/* Nội dung chính với padding */}
      <main className="flex-grow  pb-20">
        <Outlet />{" "}
        {/* Các trang như HomePage, MovieDetails sẽ được render ở đây */}
      </main>

      {/* Footer cố định */}
      <Footer />
    </div>
  );
};

export default Layout;
