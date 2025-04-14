import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import TrailerModal from "./TrailerModal";
import { fetchMovies } from "../redux/slices/movieSlice";

const HomeContent = () => {
  const [selectedTrailer, setSelectedTrailer] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { movies = [], loading, error } = useSelector((state) => state.movie);

  const queryParams = new URLSearchParams(location.search);
  const currentTab = queryParams.get("tab") || "now-showing";

  // Lấy danh sách phim khi component mount
  useEffect(() => {
    dispatch(fetchMovies());
  }, [dispatch]);

  const openTrailer = (trailerUrl) => {
    setSelectedTrailer(trailerUrl);
  };

  const closeTrailer = () => {
    setSelectedTrailer(null);
  };

  const changeTab = (tab) => {
    navigate(`/?tab=${tab}`);
  };

  if (loading) {
    return <div className="text-center py-12">Đang tải...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-500">
        Lỗi: {error.message || "Không thể tải danh sách phim."}
      </div>
    );
  }

  // Chỉ lọc phim sau khi đã kiểm tra loading và error
  let filteredMovies = [];
  if (currentTab === "now-showing") {
    filteredMovies = movies.filter((movie) => movie.status === "ACTIVE");
  } else if (currentTab === "coming-soon") {
    filteredMovies = movies.filter((movie) => movie.status === "INACTIVE");
  } else if (currentTab === "imax") {
    filteredMovies = movies.filter((movie) => movie.format === "imax");
  }

  const tabTitle =
    currentTab === "now-showing"
      ? "Phim Đang Chiếu"
      : currentTab === "coming-soon"
      ? "Phim Sắp Chiếu"
      : "Phim IMAX";

  return (
    <div className="container mx-auto px-24 py-12">
      <div className="mb-8 flex justify-between items-center">
        <div className="flex space-x-6">
          <button
            onClick={() => changeTab("now-showing")}
            className={`text-xl font-semibold ${
              currentTab === "now-showing"
                ? "text-orange-500 border-b-2 border-orange-500"
                : "text-gray-800 hover:text-orange-500"
            } transition-colors`}
          >
            Phim Đang Chiếu
          </button>
          <button
            onClick={() => changeTab("coming-soon")}
            className={`text-xl font-semibold ${
              currentTab === "coming-soon"
                ? "text-orange-500 border-b-2 border-orange-500"
                : "text-gray-800 hover:text-orange-500"
            } transition-colors`}
          >
            Phim Sắp Chiếu
          </button>
          <button
            onClick={() => changeTab("imax")}
            className={`text-xl font-semibold ${
              currentTab === "imax"
                ? "text-orange-500 border-b-2 border-orange-500"
                : "text-gray-800 hover:text-orange-500"
            } transition-colors`}
          >
            Phim IMAX
          </button>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800">{tabTitle}</h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {filteredMovies.map((movie) => (
          <div
            key={movie.id}
            className="group relative rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <div className="relative">
              <img
                src={movie.image || "https://via.placeholder.com/300x450"}
                alt={movie.name}
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
                {movie.name}
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
