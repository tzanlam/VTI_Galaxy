import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchShowTimesByFilter } from "../redux/slices/showTimeSlice";
import { fetchStartTimes } from "../redux/slices/startTimeSlice"; // Thêm import
import { cinemaData } from "../data/cinemaData";

const ShowTime = ({ selectedCity, onCityChange }) => {
  const dispatch = useDispatch();
  const { showTimes, loading, error } = useSelector((state) => state.showTime);
  const {
    startTimes,
    loading: startTimeLoading,
    error: startTimeError,
  } = useSelector((state) => state.startTime);
  const [isCityOpen, setIsCityOpen] = useState(false);
  const [isCinemaOpen, setIsCinemaOpen] = useState(false);
  const [isMovieOpen, setIsMovieOpen] = useState(false);
  const [selectedCinema, setSelectedCinema] = useState("Chọn rạp");
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);

  // Log trạng thái chọn lọc
  console.log("ShowTime state:", {
    selectedCity,
    selectedCinema,
    selectedMovie,
    selectedDay,
    showTimes,
    startTimes,
    loading,
    error,
    startTimeLoading,
    startTimeError,
  });

  // Tải startTimes khi component gắn kết
  useEffect(() => {
    console.log("Dispatching fetchStartTimes");
    dispatch(fetchStartTimes());
  }, [dispatch]);

  // Tự động chọn rạp đầu tiên khi selectedCity thay đổi
  useEffect(() => {
    if (selectedCity && selectedCity !== "Toàn quốc") {
      const cinemas = cinemaData.cinemaLocations[selectedCity] || [];
      if (cinemas.length > 0) {
        console.log("Auto-selecting first cinema:", cinemas[0].name);
        setSelectedCinema(cinemas[0].name);
      } else {
        console.log("No cinemas available for city:", selectedCity);
        setSelectedCinema("Chọn rạp");
      }
    }
  }, [selectedCity]);

  const toggleCityDropdown = () => setIsCityOpen(!isCityOpen);
  const toggleCinemaDropdown = () => setIsCinemaOpen(!isCinemaOpen);
  const toggleMovieDropdown = () => setIsMovieOpen(!isMovieOpen);

  const handleCitySelect = useCallback(
    (city) => {
      console.log("Selected city:", city);
      onCityChange(city);
      setIsCityOpen(false);
      setSelectedMovie(null);
    },
    [onCityChange]
  );

  const handleCinemaSelect = useCallback((cinema) => {
    console.log("Selected cinema:", cinema);
    setSelectedCinema(cinema.name);
    setIsCinemaOpen(false);
    setSelectedMovie(null);
  }, []);

  const handleMovieSelect = useCallback((movie) => {
    console.log("Selected movie:", movie);
    setSelectedMovie(movie);
    setIsMovieOpen(false);
  }, []);

  const getCinemas = useMemo(() => {
    if (selectedCity === "Toàn quốc") {
      return Object.values(cinemaData.cinemaLocations)
        .flat()
        .filter((cinema) => cinema.name);
    }
    return cinemaData.cinemaLocations[selectedCity] || [];
  }, [selectedCity]);

  const movies = useMemo(() => {
    const movieList = showTimes
      .map((st) => ({ id: st.movieId, name: st.movieName }))
      .filter(
        (movie, index, self) =>
          index === self.findIndex((m) => m.id === movie.id)
      );
    console.log("Computed movies:", movieList);
    return movieList;
  }, [showTimes]);

  const getWeekDays = useMemo(() => {
    const weekDays = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const day = new Date(today);
      day.setDate(today.getDate() + i);
      const dayName =
        i === 0
          ? "Hôm nay"
          : [
              "Chủ Nhật",
              "Thứ Hai",
              "Thứ Ba",
              "Thứ Tư",
              "Thứ Năm",
              "Thứ Sáu",
              "Thứ Bảy",
            ][day.getDay()];
      const formattedDate = `${day.getDate()}/${day.getMonth() + 1}`;
      const dateForApi = day.toISOString().split("T")[0];
      weekDays.push({ day: dayName, date: formattedDate, dateForApi });
    }
    console.log("Computed weekDays:", weekDays);
    return weekDays;
  }, []);

  useEffect(() => {
    if (selectedCity && selectedCinema !== "Chọn rạp" && selectedDay) {
      const galaxyId = cinemaData.cinemaLocations[selectedCity]?.find(
        (cinema) => cinema.name === selectedCinema
      )?.id;
      if (galaxyId) {
        console.log("Dispatching fetchShowTimesByFilter with:", {
          galaxyId,
          movieId: selectedMovie?.id,
          date: selectedDay.dateForApi,
        });
        dispatch(
          fetchShowTimesByFilter({
            galaxyId: String(galaxyId),
            movieId: selectedMovie?.id ? String(selectedMovie.id) : null,
            date: selectedDay.dateForApi,
          })
        );
      }
    }
  }, [selectedCity, selectedCinema, selectedDay, selectedMovie, dispatch]);

  const DropdownButton = ({ label, isOpen, onClick }) => (
    <button
      type="button"
      className="inline-flex justify-between w-48 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
      onClick={onClick}
    >
      {label}
      <svg
        className={`w-5 h-5 ml-2 -mr-1 transition-transform duration-200 ${
          isOpen ? "rotate-180" : ""
        }`}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
          clipRule="evenodd"
        />
      </svg>
    </button>
  );

  const DropdownMenu = ({ isOpen, items, onSelect, selectedItem }) =>
    isOpen && (
      <div className="absolute z-10 w-48 mt-2 origin-top-right bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
        <div className="py-1">
          {items.length > 0 ? (
            items.map((item, index) => (
              <button
                key={index}
                onClick={() => onSelect(item)}
                className={`block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-500 hover:text-white transition-colors duration-200 ${
                  selectedItem === (item.name || item)
                    ? "bg-blue-500 text-white"
                    : ""
                }`}
              >
                {item.name || item}
              </button>
            ))
          ) : (
            <div className="px-4 py-2 text-sm text-gray-500">
              Không có dữ liệu
            </div>
          )}
        </div>
      </div>
    );

  const handleDaySelect = useCallback((day) => {
    console.log("Selected day:", day);
    setSelectedDay(day);
  }, []);

  const selectedShowtimes = useMemo(() => {
    if (!selectedDay) return [];
    const filtered = showTimes.filter(
      (st) => st.date === selectedDay.dateForApi
    );
    console.log("Computed selectedShowtimes:", filtered);
    return filtered;
  }, [showTimes, selectedDay]);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Lịch Chiếu Phim</h2>
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="relative inline-block text-left">
          <DropdownButton
            label={selectedCity || "Chọn thành phố"}
            isOpen={isCityOpen}
            onClick={toggleCityDropdown}
          />
          <DropdownMenu
            isOpen={isCityOpen}
            items={cinemaData.cities}
            onSelect={handleCitySelect}
            selectedItem={selectedCity}
          />
        </div>
        <div className="relative inline-block text-left">
          <DropdownButton
            label={selectedCinema}
            isOpen={isCinemaOpen}
            onClick={toggleCinemaDropdown}
          />
          <DropdownMenu
            isOpen={isCinemaOpen}
            items={getCinemas}
            onSelect={handleCinemaSelect}
            selectedItem={selectedCinema}
          />
        </div>
        <div className="relative inline-block text-left">
          <DropdownButton
            label={selectedMovie?.name || "Chọn phim"}
            isOpen={isMovieOpen}
            onClick={toggleMovieDropdown}
          />
          <DropdownMenu
            isOpen={isMovieOpen}
            items={movies}
            onSelect={handleMovieSelect}
            selectedItem={selectedMovie?.name}
          />
        </div>
      </div>
      <div className="flex flex-wrap gap-2 mb-6">
        {getWeekDays.map((day, idx) => (
          <button
            key={idx}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              selectedDay?.date === day.date
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
            onClick={() => handleDaySelect(day)}
          >
            {day.day}
            <br />
            {day.date}
          </button>
        ))}
      </div>
      {loading && <p className="text-gray-500">Đang tải lịch chiếu...</p>}
      {error && (
        <p className="text-red-500">
          Lỗi: {error.message || "Không thể tải lịch chiếu"}
        </p>
      )}
      {startTimeLoading && (
        <p className="text-gray-500">Đang tải thời gian bắt đầu...</p>
      )}
      {startTimeError && (
        <p className="text-red-500">
          Lỗi: {startTimeError.message || "Không thể tải thời gian bắt đầu"}
        </p>
      )}
      {!loading && !error && selectedShowtimes.length > 0
        ? selectedShowtimes.map((showtime, idx) => (
            <div key={idx} className="mb-4 p-4 bg-white rounded-lg shadow">
              <h3 className="text-lg font-bold mb-2">
                {showtime.galaxyName} - {showtime.movieName}
              </h3>
              <p className="text-sm text-gray-700 mb-1">
                Ngày: {selectedDay?.date}
              </p>
              <div className="flex flex-wrap gap-2">
                {showtime.startTimes.length > 0 ? (
                  showtime.startTimes.map((time, timeIdx) => (
                    <button
                      key={timeIdx}
                      className="bg-orange-500 text-white px-4 py-1 rounded-md hover:bg-orange-600 transition-colors"
                      onClick={() =>
                        alert(
                          `Đã đặt vé tại ${showtime.galaxyName} cho ${showtime.movieName} vào ${selectedDay?.day} (${selectedDay?.date}) lúc ${time}`
                        )
                      }
                    >
                      {time}
                    </button>
                  ))
                ) : (
                  <p className="text-gray-500">Chưa có thời gian chiếu.</p>
                )}
              </div>
            </div>
          ))
        : !loading &&
          !error && (
            <p className="text-gray-500">
              Không có lịch chiếu cho lựa chọn này.
            </p>
          )}
    </div>
  );
};

export default ShowTime;
