import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/slices/authSlice";
import defaultAvatar from "../assets/profile-avatar.jpg"; // Make sure this path is correct

const UserMenu = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    setIsMenuOpen(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="flex items-center space-x-2 focus:outline-none"
      >
        <img
          src={user?.avatar || defaultAvatar}
          alt="User Profile"
          className="h-10 w-10 rounded-full object-cover border-2 border-orange-500"
          onError={(e) => {
            e.target.src = defaultAvatar;
          }}
        />
        <span className="text-gray-700 hidden md:block">
          {user?.fullName || "Thành viên"}
        </span>
        <svg
          className={`w-4 h-4 text-gray-700 transform ${
            isMenuOpen ? "rotate-180" : ""
          } transition-transform`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          ></path>
        </svg>
      </button>

      {isMenuOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
          <a
            href="/profile"
            className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
          >
            Thông tin tài khoản
          </a>
          <a
            href="/tickets"
            className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
          >
            Vé của tôi
          </a>
          {user?.points && (
            <div className="px-4 py-2 border-t border-gray-100">
              <p className="text-sm text-gray-500">G-Star Points</p>
              <p className="font-semibold text-orange-500">{user.points}</p>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 border-t border-gray-100"
          >
            Đăng xuất
          </button>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
