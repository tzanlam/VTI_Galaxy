// components/UserMenu.jsx
import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/slices/authSlice";
import { toast } from "react-toastify";
import avatar from "../assets/profile-avatar.jpg";

const UserMenu = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    // Remove token from localStorage
    localStorage.removeItem("token");

    // Update Redux state
    dispatch(logout());

    // Close dropdown
    setIsDropdownOpen(false);

    // Show success message
    toast.success("Đăng xuất thành công!");
  };

  if (!user) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 transition-colors rounded-full py-1 px-3"
      >
        <div className="relative">
          <img
            src={user.avatar || "/api/placeholder/40/40"}
            alt="Avatar"
            className="w-8 h-8 rounded-full object-cover border-2 border-orange-500"
            onError={(e) => {
              e.target.src = "/api/placeholder/40/40"; // Fallback image if user avatar fails to load
            }}
          />
        </div>
        <div className="flex flex-col items-start">
          <span className="font-medium text-sm">
            {user.fullName || "Người dùng"}
          </span>
          <div className="flex items-center space-x-1">
            <span className="text-xs text-gray-600">{user.points || 0}</span>
            <span className="text-xs text-orange-500 font-semibold">điểm</span>
          </div>
        </div>
        <svg
          className={`w-4 h-4 text-gray-600 transition-transform duration-200 ${
            isDropdownOpen ? "transform rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          ></path>
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
          <a
            href="#account"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-100"
          >
            Tài khoản của tôi
          </a>
          <a
            href="#history"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-100"
          >
            Lịch sử giao dịch
          </a>
          <hr className="my-1" />
          <button
            onClick={handleLogout}
            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-orange-100"
          >
            Đăng xuất
          </button>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
