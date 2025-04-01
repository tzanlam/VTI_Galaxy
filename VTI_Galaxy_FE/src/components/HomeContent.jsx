import React, { useState } from "react";
import { Link } from "react-router-dom";
import TrailerModal from "./TrailerModal";
import { movies } from "../data/moviesData"; // Import dữ liệu

const HomeContent = () => {
  const [selectedTrailer, setSelectedTrailer] = useState(null);

  const openTrailer = (trailerUrl) => {
    setSelectedTrailer(trailerUrl);
  };

  const closeTrailer = () => {
    setSelectedTrailer(null);
  };

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
                <button
                  onClick={() => openTrailer(movie.trailerUrl)}
                  className="bg-gray-700 text-white px-10 py-2 rounded-md hover:bg-gray-600 transition-colors"
                >
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

      <TrailerModal trailerUrl={selectedTrailer} onClose={closeTrailer} />
    </div>
  );
};

export default HomeContent;
