import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { movies } from "../data/moviesData";

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const movie = movies.find((m) => m.id === parseInt(id));

  useEffect(() => {
    if (!movie) {
      navigate("/error", {
        state: {
          message: "Phim bạn đang tìm kiếm không tồn tại hoặc đã bị gỡ bỏ.",
        },
      });
    }
  }, [movie, navigate]);

  if (!movie) return null;

  return (
    <div>
      {movie.trailerUrl && (
        <div className="w-full mb-8">
          <div className="relative" style={{ paddingBottom: "30%" }}>
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

      <div className="container mx-auto px-24 py-12">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/4">
            <img
              src={movie.image}
              alt={movie.title}
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </div>

          <div className="md:w-2/3">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              {movie.title}
            </h2>
            <p className="text-gray-600 mb-4">{movie.description}</p>
            <div className="text-sm text-gray-600 mb-4">
              <div className="mb-2">
                <p>
                  <strong>Thể loại:</strong>{" "}
                  <button
                    className="bg-blue-500 text-white px-2 py-1 rounded-md hover:bg-blue-600 transition-colors ml-2"
                    onClick={() => alert(`Thể loại: ${movie.genre}`)}
                  >
                    {movie.genre}
                  </button>
                </p>
              </div>
              <div className="mb-2">
                <p>
                  <strong>Đạo diễn:</strong>{" "}
                  <button
                    className="bg-green-500 text-white px-2 py-1 rounded-md hover:bg-green-600 transition-colors ml-2"
                    onClick={() =>
                      alert(
                        `Đạo diễn: ${movie.director || "Chưa có thông tin"}`
                      )
                    }
                  >
                    {movie.director || "Chưa có thông tin"}
                  </button>
                </p>
              </div>
              <div className="mb-2">
                <p>
                  <strong>Diễn viên:</strong>{" "}
                  {movie.actors && movie.actors.length > 0 ? (
                    movie.actors.map((actor, idx) => (
                      <button
                        key={idx}
                        className="bg-purple-500 text-white px-2 py-1 rounded-md hover:bg-purple-600 transition-colors ml-2 mr-2"
                        onClick={() => alert(`Diễn viên: ${actor}`)}
                      >
                        {actor}
                      </button>
                    ))
                  ) : (
                    <span>Chưa có thông tin</span>
                  )}
                </p>
              </div>
              <div className="mb-2">
                <p>
                  <strong>Thời lượng:</strong> {movie.duration}
                </p>
              </div>
              <div className="mb-2">
                <p>
                  <strong>Đánh giá:</strong> {movie.rating}
                </p>
              </div>
            </div>

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
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
