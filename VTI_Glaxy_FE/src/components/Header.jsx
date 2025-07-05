import { useDispatch, useSelector } from "react-redux";
import { openLoginModal, openRegisterModal } from "../redux/slices/modalSlice";
import UserMenu from "./UserMenu";
import logo3 from "../assets/logo3.png";
import menuItems from "../data/menuItems";

const Header = () => {
  const dispatch = useDispatch();
  const { isLoggedIn } = useSelector((state) => state.auth);

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto flex items-center justify-between py-8 px-6">
        <div className="flex items-center">
          <img src={logo3} alt="Logo" className="h-14 w-auto object-contain" />
        </div>

        <nav className="flex space-x-12">
          {menuItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-lg text-gray-700 hover:text-orange-500"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center space-x-4">
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
              <button
                onClick={() => dispatch(openRegisterModal())}
                className="bg-orange-500 text-white px-4 py-2 rounded-full hover:bg-orange-600 transition-colors"
              >
                Đăng Ký
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
