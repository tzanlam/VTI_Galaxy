// Footer.jsx
import React from "react";

const Footer = () => {
  // Move links to an array for better maintainability
  const footerLinks = [
    { text: "Về Chúng Tôi", href: "#" },
    { text: "Thỏa Thuận Sử Dụng", href: "#" },
    { text: "Quy Chế Hoạt Động", href: "#" },
    { text: "Blog Điện Ảnh", href: "#" },
    { text: "Chính Sách Bảo Mật", href: "#" },
    { text: "Phim Hay Tháng", href: "#" },
  ];

  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="container mx-auto px-4 text-center">
        <h3 className="text-lg md:text-xl font-bold mb-4 tracking-wide">
          CÔNG TY CỔ PHẦN PHIM THIÊN NGÂN
        </h3>
        <nav className="flex flex-col md:flex-row justify-center gap-4 md:gap-6 mb-4">
          {footerLinks.map((link) => (
            <a
              key={link.text}
              href={link.href}
              className="text-sm hover:underline hover:text-gray-300 transition-colors duration-200"
            >
              {link.text}
            </a>
          ))}
        </nav>
        <p className="text-xs text-gray-400">
          © {new Date().getFullYear()} Galaxy Cinema. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
