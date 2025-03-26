// Header.jsx
import React, { useState } from "react";

const Header = () => {
  const [dropDownOpen, setDropDownOpen] = useState(false);
  const menuItems = [
    { label: "Phim", hasDropdown: true },
    { label: "Góc Điện Ảnh", hasDropdown: true },
    { label: "Sự kiện", hasDropdown: true },
    { label: "Rạp/giá vé", hasDropdown: true },
  ];
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto flex items-center justify-between py-8 px-6">
        {/* Logo */}
        <div className="flex items-center">
          <img
            src="https://via.placeholder.com/150x50?text=Galaxy+Cinema"
            alt="Galaxy Cinema Logo"
            className="h-10"
          />
        </div>

        {/* Menu */}
        <nav className="flex space-x-8">
          <a
            href="#"
            className="text-orange-500 font-semibold hover:text-orange-600"
          >
            Mua Vé
          </a>
          <a href="#" className="text-gray-700 hover:text-orange-500">
            Phim
          </a>
          <a href="#" className="text-gray-700 hover:text-orange-500">
            Góc Điện Ảnh
          </a>
          <a href="#" className="text-gray-700 hover:text-orange-500">
            Sự Kiện
          </a>
          <a href="#" className="text-gray-700 hover:text-orange-500">
            Rạp/Giá Vé
          </a>
        </nav>

        {/* Search and Join Button */}
        <div className="flex items-center space-x-4">
          <button className="text-gray-700 hover:text-orange-500">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              ></path>
            </svg>
          </button>
          <button className="bg-orange-500 text-white px-4 py-2 rounded-full flex items-center space-x-2 hover:bg-orange-600">
            <span>Tham Gia</span>
            <span className="bg-yellow-400 text-orange-500 px-2 py-1 rounded-full text-xs">
              G STAR
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
