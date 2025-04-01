import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { openLoginModal } from "../redux/slices/modalSlice";
import UserMenu from "./UserMenu";
import logo3 from "../assets/logo3.png";

const Header = () => {
  const dispatch = useDispatch();
  const { isLoggedIn } = useSelector((state) => state.auth);

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto flex items-center justify-between py-8 px-6">
        <div className="flex items-center">
          <img
            src={logo3}
            alt="Galaxy Cinema Logo"
            className="h-14 w-auto object-contain"
            onError={(e) => (e.target.src = "/path/to/fallback-image.jpg")}
            loading="lazy" // Tối ưu tải ảnh
          />
        </div>

        <nav className="flex space-x-8">
          {[
            { label: "Mua Vé", href: "#", active: true },
            { label: "Phim", href: "#" },
            { label: "Góc Điện Ảnh", href: "#" },
            { label: "Sự Kiện", href: "#" },
            { label: "Rạp/Giá Vé", href: "#" },
          ].map((item) => (
            <a
              key={item.label}
              href={item.href}
              className={`${
                item.active
                  ? "text-orange-500 font-semibold hover:text-orange-600"
                  : "text-gray-700 hover:text-orange-500"
              }`}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center space-x-4">
          <button
            className="text-gray-700 hover:text-orange-500"
            aria-label="Tìm kiếm"
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
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>

          {isLoggedIn ? (
            <UserMenu />
          ) : (
            <>
              <button
                onClick={() => dispatch(openLoginModal())}
                className="bg-gray-700 text-white px-4 py-2 rounded-full hover:bg-gray-800 transition-colors"
              >
                Đăng Nhập
              </button>
              <button className="bg-orange-500 text-white px-4 py-2 rounded-full flex items-center space-x-2 hover:bg-orange-600 transition-colors">
                <span>Tham Gia</span>
                <span className="bg-yellow-400 text-orange-500 px-2 py-1 rounded-full text-xs">
                  G STAR
                </span>
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
