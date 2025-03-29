// components/MovieDetails.jsx
import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { movies } from "../data/moviesData"; // Import dữ liệu từ moviesData.js

const MovieDetails = () => {
  const { id } = useParams(); // Lấy id từ URL
  const navigate = useNavigate();

  // Tìm phim với ID từ tham số URL
  const movie = movies.find((m) => m.id === parseInt(id));

  // Kiểm tra và chuyển hướng nếu không tìm thấy phim
  useEffect(() => {
    if (!movie) {
      navigate("/error", {
        state: {
          message: "Phim bạn đang tìm kiếm không tồn tại hoặc đã bị gỡ bỏ.",
        },
      });
    }
  }, [movie, navigate]);

  // Tránh render trong khi chuyển hướng
  if (!movie) return null;

  return (
    <div>
      {/* Trailer full viewport width với chiều cao thu nhỏ */}
      {movie.trailerUrl && (
        <div className="w-full mb-8">
          <div
            className="relative"
            style={{ paddingBottom: "30%" /* Giảm chiều cao */ }}
          >
            <iframe
              src={movie.trailerUrl}
              title={`Trailer for ${movie.title}`}
              className="absolute top-0 left-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}

      {/* Nội dung chi tiết phim trong container */}
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
    </div>
  );
};

export default MovieDetails;
