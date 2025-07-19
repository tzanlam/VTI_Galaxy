import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import conan from "../assets/conan.jpg";
import wolfoo from "../assets/wolfoo.jpg";
import xitrum from "../assets/xitrum.jpg";
import muaHeKinhHai from "../assets/mua-he-kinh-hai.jpg";
const Banner = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  // Define four slides with titles and background images
  const slides = [
    {
      title: "Thám tử lừng danh Conan",
      description:
        "Theo chân Conan giải mã những vụ án ly kỳ trong bộ phim mới nhất!",
      image: conan,
      ctaLink: "/?tab=now-showing",
      ctaText: "Mua Vé Ngay",
    },
    {
      title: "Phim IMAX hoành tráng",
      description:
        "Đắm chìm trong thế giới điện ảnh với màn hình IMAX siêu lớn.",
      image: wolfoo,
      ctaLink: "/?tab=imax",
      ctaText: "Khám Phá IMAX",
    },
    {
      title: "Phim sắp chiếu hấp dẫn",
      description: "Đừng bỏ lỡ những siêu phẩm sắp ra mắt tại rạp.",
      image: xitrum,
      ctaLink: "/?tab=coming-soon",
      ctaText: "Xem Lịch Chiếu",
    },
    {
      title: "Ưu đãi đặc biệt hôm nay",
      description: "Nhận vé ưu đãi và combo hấp dẫn khi đặt vé ngay!",
      image: muaHeKinhHai,
      ctaLink: "/promotions",
      ctaText: "Nhận Ưu Đãi",
    },
  ];

  // Auto-scroll every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 3000); // 3 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, [slides.length]);

  // Handle arrow navigation
  const goToPreviousSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  // Capitalize the first letter of the title
  const capitalizeTitle = (title) =>
    title ? title.charAt(0).toUpperCase() + title.slice(1) : "";

  return (
    <div className="relative bg-gray-900 h-[500px] sm:h-[600px] overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          {/* Background Image */}
          <img
            src={slide.image}
            alt={`Banner ${index + 1}`}
            className="w-full h-full object-cover opacity-50"
            onError={(e) => {
              e.target.src = "https://placehold.co/1920x600";
              e.target.alt = "Banner không tải được";
            }}
          />

          {/* Overlay Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 sm:px-24">
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              {capitalizeTitle(slide.title)}
            </h1>
            <p className="text-lg sm:text-xl text-gray-300 mb-8 max-w-2xl">
              {slide.description}
            </p>
            <button
              onClick={() => navigate(slide.ctaLink)}
              className="bg-orange-500 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-orange-600 transition-colors"
            >
              {slide.ctaText}
            </button>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={goToPreviousSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-gray-700 text-white p-3 rounded-full hover:bg-orange-500 transition-colors"
      >
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
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
      <button
        onClick={goToNextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gray-700 text-white p-3 rounded-full hover:bg-orange-500 transition-colors"
      >
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
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>

      {/* Navigation Dots */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full ${
              index === currentSlide ? "bg-orange-500" : "bg-gray-400"
            } hover:bg-orange-600 transition-colors`}
          />
        ))}
      </div>
    </div>
  );
};

export default Banner;
