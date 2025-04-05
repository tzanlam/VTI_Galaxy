// MovieDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { movies } from "../data/moviesData";
import { IoMdTime } from "react-icons/io";
import { FaRegCalendar } from "react-icons/fa";
import ShowTime from "../components/ShowTime";

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedCity, setSelectedCity] = useState("Toàn quốc");

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

  const handleCityChange = (city) => {
    setSelectedCity(city);
  };

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

            <div className="text-md text-gray-600 mb-4">
              <div className="mb-2 flex items-center gap-6">
                <div className="flex items-center">
                  <IoMdTime className="mr-2" />
                  <span>{movie.duration}</span>
                </div>
                <div className="flex items-center">
                  <FaRegCalendar className="mr-2" />
                  <span>{movie.releaseDate}</span>
                </div>
              </div>
              <div className="mb-2">
                <p>
                  <strong>Quốc gia:</strong> {Wmovie.country}
                </p>
              </div>
              <div className="mb-2">
                <p>
                  <strong>Nhà sản xuất:</strong> {movie.producer}
                </p>
              </div>
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
                  <strong>Đánh giá:</strong> {movie.rating}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-24 py-12">
        <div className="flex items-center mb-4">
          <span className="border-l-4 border-blue-500 mr-2"></span>
          <h1 className="text-base font-bold capitalize inline-block">
            Nội Dung Phim
          </h1>
        </div>
        <p className="text-gray-700 text-base leading-relaxed">
          {movie.description}
        </p>

        <div className="mt-8">
          <div className="flex items-center mb-4 mt-4">
            <span className="border-l-4 border-blue-500 mr-2"></span>
            <h1 className="text-base font-bold capitalize inline-block">
              Lịch chiếu
            </h1>
          </div>
          <ShowTime
            selectedCity={selectedCity}
            onCityChange={handleCityChange}
            showtimes={movie.showtimes}
            releaseDate={movie.releaseDate} // Truyền releaseDate
          />
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
