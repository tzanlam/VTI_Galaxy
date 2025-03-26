import React from "react";
import { Link } from "react-router-dom";
import snowWhite from "../assets/show-white.jpg";
import lastStop from "../assets/last-stop.jpg";
import quyNhapTrang from "../assets/quy-nhap-trang.jpg";
import mickey17 from "../assets/mickey-17.jpg";

const HomeContent = () => {
  const movies = [
    {
      id: 1,
      title: "Nàng Bạch Tuyết",
      image: snowWhite,
      rating: 7.7,
      genre: "Gia đình",
      duration: "120 phút",
      description: "Một câu chuyện cổ tích về nàng công chúa và bảy chú lùn.",
      showtimes: [
        { day: "Thứ Hai", times: ["10:00", "14:00", "18:00"] },
        { day: "Thứ Ba", times: ["11:00", "15:00", "19:00"] },
      ],
    },
    {
      id: 2,
      title: "Nhà Ga Ma Chô",
      image: lastStop,
      rating: 7.8,
      genre: "Kinh dị",
      duration: "95 phút",
      description: "Một hành trình kinh dị tại nhà ga bị bỏ hoang.",
      showtimes: [
        { day: "Thứ Tư", times: ["13:00", "17:00", "21:00"] },
        { day: "Thứ Năm", times: ["12:00", "16:00", "20:00"] },
      ],
    },
    // Thêm các phim khác nếu cần...
  ];

  return (
    <div className="container mx-auto px-24 py-12">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 text-center">
          Phim Đang Chiếu
        </h2>
        <p className="text-gray-600 text-center mt-2">
          Khám phá những bộ phim hot nhất hiện nay
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {movies.map((movie) => (
          <div
            key={movie.id}
            className="group relative rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <div className="relative">
              <img
                src={movie.image}
                alt={movie.title}
                className="w-full h-[450px] object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute top-3 right-3 bg-yellow-400 text-black px-2 py-1 rounded-full text-sm font-bold z-10">
                {movie.rating}
              </div>
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 gap-4 z-10">
                <Link
                  to={`/movie/${movie.id}`}
                  className="bg-orange-500 text-white px-8 py-2 rounded-md hover:bg-orange-600 transition-colors"
                >
                  Mua Vé
                </Link>
                <button className="bg-gray-700 text-white px-10 py-2 rounded-md hover:bg-gray-600 transition-colors">
                  Trailer
                </button>
              </div>
            </div>
            <div className="p-4 bg-white relative z-0">
              <h3 className="text-lg font-semibold text-gray-800 truncate group-hover:text-orange-500 transition-colors">
                {movie.title}
              </h3>
              <div className="text-sm text-gray-600 mt-1 flex justify-between">
                <span>{movie.genre}</span>
                <span>{movie.duration}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 text-center">
        <button className="bg-gray-800 text-white px-6 py-3 rounded-full hover:bg-orange-500 transition-colors duration-300">
          Xem Thêm
        </button>
      </div>
    </div>
  );
};

export default HomeContent;
