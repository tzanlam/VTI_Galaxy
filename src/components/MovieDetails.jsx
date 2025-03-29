import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import snowWhite from "../assets/show-white.jpg";
import lastStop from "../assets/last-stop.jpg";
import quyNhapTrang from "../assets/quy-nhap-trang.jpg";
import mickey17 from "../assets/mickey-17.jpg";
import OP from "../assets/one-piece.jpg";

const MovieDetails = () => {
  const { id } = useParams(); // Lấy id từ URL
  const navigate = useNavigate();

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
    {
      id: 3,
      title: "One Piece",
      image: OP,
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
    {
      id: 3,
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
  ];

  const movie = movies.find((m) => m.id === parseInt(id));

  if (!movie) {
    return <div className="text-center py-12">Phim không tồn tại!</div>;
  }

  return (
    <div className="container mx-auto px-24 py-12">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Ảnh phim */}
        <div className="md:w-1/3">
          <img
            src={movie.image}
            alt={movie.title}
            className="w-full h-auto rounded-lg shadow-lg"
          />
        </div>

        {/* Thông tin chi tiết */}
        <div className="md:w-2/3">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            {movie.title}
          </h2>
          <p className="text-gray-600 mb-4">{movie.description}</p>
          <div className="text-sm text-gray-600 mb-4">
            <p>
              <strong>Thể loại:</strong> {movie.genre}
            </p>
            <p>
              <strong>Thời lượng:</strong> {movie.duration}
            </p>
            <p>
              <strong>Đánh giá:</strong> {movie.rating}
            </p>
          </div>

          {/* Lịch chiếu */}
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Lịch chiếu
          </h3>
          {movie.showtimes.map((showtime, idx) => (
            <div key={idx} className="mb-4">
              <p className="text-sm font-medium text-gray-700">
                {showtime.day}
              </p>
              <div className="flex gap-2 mt-1">
                {showtime.times.map((time, timeIdx) => (
                  <button
                    key={timeIdx}
                    className="bg-orange-500 text-white px-4 py-1 rounded-md hover:bg-orange-600 transition-colors"
                    onClick={() =>
                      alert(
                        `Đã đặt vé cho ${movie.title} vào ${showtime.day} lúc ${time}`
                      )
                    }
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* Nút quay lại */}
          <button
            onClick={() => navigate("/")}
            className="mt-6 bg-gray-800 text-white px-6 py-2 rounded-md hover:bg-gray-600 transition-colors"
          >
            Quay Lại
          </button>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
