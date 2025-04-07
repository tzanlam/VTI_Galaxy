import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { openLoginModal } from "../redux/slices/modalSlice";
import UserMenu from "./UserMenu";
import logo3 from "../assets/logo3.png";
import menuItems from "../data/menuItems";

// Component cho một mục menu đơn lẻ với submenu
const MenuItem = ({ item }) => {
  return (
    <div className="relative group">
      <a
        href={item.href}
        className={`${
          item.active
            ? "text-orange-500 font-semibold hover:text-orange-600"
            : "text-gray-700 hover:text-orange-500"
        } block py-2 text-lg`}
      >
        {item.label}
      </a>

      {item.submenu && (
        <div className="absolute left-1/2 transform -translate-x-1/2 top-full w-48 bg-white shadow-lg rounded-md z-10 hidden group-hover:block">
          {item.submenu.map((subItem) => (
            <a
              key={subItem.label}
              href={subItem.href}
              className="block px-4 py-2 text-gray-700 hover:bg-orange-100 hover:text-orange-500 text-center"
            >
              {subItem.label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

// Component Search Icon
const SearchIcon = () => (
  <button className="text-gray-700 hover:text-orange-500" aria-label="Tìm kiếm">
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
);

// Component chính Header
const Header = () => {
  const dispatch = useDispatch();
  const { isLoggedIn } = useSelector((state) => state.auth);

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto flex items-center justify-between py-8 px-6">
        {/* Logo */}
        <div className="flex items-center">
          <img
            src={logo3}
            alt="Galaxy Cinema Logo"
            className="h-14 w-auto object-contain"
            onError={(e) => (e.target.src = "/path/to/fallback-image.jpg")}
            loading="lazy"
          />
        </div>

        {/* Navigation */}
        <nav className="flex space-x-12">
          {menuItems.map((item) => (
            <MenuItem key={item.label} item={item} />
          ))}
        </nav>

        {/* User Actions */}
        <div className="flex items-center space-x-4">
          <SearchIcon />

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
              <button className="bg-orange-500 text-white px-4 py-2 rounded-full flex flex-col items-center hover:bg-orange-600 transition-colors">
                <span className="text-lg">
                  Tham Gia
                  <span className="bg-yellow-400 text-orange-500 px-2 py-1 rounded-full text-xs block">
                    G STAR
                  </span>
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
