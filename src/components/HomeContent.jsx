import React from "react";
import snowWhite from "../assets/show-white.jpg"; // Đường dẫn tương đối từ file HomeContent.jsx
import lastStop from "../assets/last-stop.jpg";
import quyNhapTrang from "../assets/quy-nhap-trang.jpg";
import mickey17 from "../assets/mickey-17.jpg";

const HomeContent = () => {
  const movies = [
    {
      title: "Nàng Bạch Tuyết",
      image: snowWhite,
      rating: 7.7,
      genre: "Gia đình",
      duration: "120 phút",
    },
    {
      title: "Nhà Ga Ma Chô",
      image: lastStop,
      rating: 7.8,
      genre: "Kinh dị",
      duration: "95 phút",
    },
    {
      title: "Quỷ Nhập Tràng",
      image: quyNhapTrang,
      rating: 8.5,
      genre: "Kinh dị",
      duration: "110 phút",
    },
    {
      title: "Mickey 17",
      image: mickey17,
      rating: 8.8,
      genre: "Viễn tưởng",
      duration: "135 phút",
    },
    {
      title: "Âm Dương Lộ",
      image: "/api/placeholder/300/450",
      rating: 8.0,
      genre: "Kinh dị",
      duration: "105 phút",
    },
    {
      title: "Xin Chào Thế Giới",
      image: "/api/placeholder/300/450",
      rating: 8.0,
      genre: "Hoạt hình",
      duration: "90 phút",
    },
    {
      title: "Công Chúa Bằng Giá",
      image: "/api/placeholder/300/450",
      rating: 8.2,
      genre: "Cổ tích",
      duration: "115 phút",
    },
    {
      title: "Trù Ta Ký",
      image: "/api/placeholder/300/450",
      rating: 8.0,
      genre: "Hài hước",
      duration: "100 phút",
    },
  ];

  return (
    <div className="container mx-auto px-24 py-12">
      {/* Tiêu đề */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 text-center">
          Phim Đang Chiếu
        </h2>
        <p className="text-gray-600 text-center mt-2">
          Khám phá những bộ phim hot nhất hiện nay
        </p>
      </div>

      {/* Grid phim */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {movies.map((movie, index) => (
          <div
            key={index}
            className="group relative rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
          >
            {/* Phần ảnh */}
            <div className="relative">
              <img
                src={movie.image}
                alt={movie.title}
                className="w-full h-[450px] object-cover transition-transform duration-300 group-hover:scale-110"
              />
              {/* Rating */}
              <div className="absolute top-3 right-3 bg-yellow-400 text-black px-2 py-1 rounded-full text-sm font-bold z-10">
                {movie.rating}
              </div>
              {/* Overlay khi hover - chỉ phủ lên ảnh */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 gap-4 z-10">
                <button className="bg-orange-500 text-white px-8 py-2 rounded-md hover:bg-orange-600 transition-colors">
                  Mua Vé
                </button>
                <button className="bg-gray-700 text-white px-10 py-2 rounded-md hover:bg-gray-600 transition-colors">
                  Trailer
                </button>
              </div>
            </div>

            {/* Thông tin phim - không bị overlay che */}
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

      {/* Nút xem thêm */}
      <div className="mt-10 text-center">
        <button className="bg-gray-800 text-white px-6 py-3 rounded-full hover:bg-orange-500 transition-colors duration-300">
          Xem Thêm
        </button>
      </div>
    </div>
  );
};

export default HomeContent;
