import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchMovies } from "../redux/slices/movieSlice";
import { fetchGalaxies } from "../redux/slices/galaxySlice";
import { fetchShowTimeByMovieDateAndGalaxy } from "../redux/slices/showTimeSlice";

const QuickBooking = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redux state
  const {
    movies,
    loading: moviesLoading,
    error: moviesError,
  } = useSelector((state) => state.movie);
  const {
    galaxies,
    loading: galaxiesLoading,
    error: galaxiesError,
  } = useSelector((state) => state.galaxy);
  const {
    showTimes,
    loading: showTimesLoading,
    error: showTimesError,
  } = useSelector((state) => state.showTime);

  // Local state
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedCity, setSelectedCity] = useState("Toàn quốc");
  const [selectedCinema, setSelectedCinema] = useState("Chọn rạp");
  const [selectedCinemaId, setSelectedCinemaId] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedShowtime, setSelectedShowtime] = useState(null);
  const [isMovieOpen, setIsMovieOpen] = useState(false);
  const [isCityOpen, setIsCityOpen] = useState(false);
  const [isCinemaOpen, setIsCinemaOpen] = useState(false);
  const [isDayOpen, setIsDayOpen] = useState(false);
  const [isShowtimeOpen, setIsShowtimeOpen] = useState(false);

  // Fetch movies and galaxies on mount
  useEffect(() => {
    dispatch(fetchMovies());
    dispatch(fetchGalaxies());
  }, [dispatch]);

  // Compute cities
  const cities = useMemo(() => {
    return [
      "Toàn quốc",
      ...new Set(galaxies.map((g) => g.city).filter(Boolean)),
    ];
  }, [galaxies]);

  // Compute cinemas based on selected city
  const getCinemas = useMemo(() => {
    return selectedCity === "Toàn quốc"
      ? galaxies.map((g) => ({ id: g.id, name: g.name }))
      : galaxies
          .filter((g) => g.city === selectedCity)
          .map((g) => ({ id: g.id, name: g.name }));
  }, [selectedCity, galaxies]);

  // Compute week days
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
    return weekDays;
  }, []);

  // Compute available showtimes
  const availableShowtimes = useMemo(() => {
    if (!selectedDay || !showTimes || !Array.isArray(showTimes)) return [];
    return showTimes
      .filter((st) => st.date === selectedDay.dateForApi)
      .flatMap((st) =>
        st.startTimes.map((time) => ({
          time,
          showtimeId: st.id,
          movieName: st.movieName,
          galaxyName: st.galaxyName,
        }))
      );
  }, [showTimes, selectedDay]);

  // Auto-select first cinema when city changes
  useEffect(() => {
    if (selectedCity && selectedCity !== "Toàn quốc" && getCinemas.length > 0) {
      setSelectedCinema(getCinemas[0].name);
      setSelectedCinemaId(getCinemas[0].id);
    } else {
      setSelectedCinema("Chọn rạp");
      setSelectedCinemaId(null);
    }
    setSelectedDay(null);
    setSelectedShowtime(null);
  }, [selectedCity, getCinemas]);

  // Fetch showtimes when selections are made
  useEffect(() => {
    if (selectedMovie && selectedCinemaId && selectedDay) {
      dispatch(
        fetchShowTimeByMovieDateAndGalaxy({
          galaxyId: String(selectedCinemaId),
          movieId: String(selectedMovie.id),
          date: selectedDay.dateForApi,
        })
      );
      setSelectedShowtime(null);
    }
  }, [selectedMovie, selectedCinemaId, selectedDay, dispatch]);

  // Dropdown toggle handlers
  const toggleMovieDropdown = () => setIsMovieOpen(!isMovieOpen);
  const toggleCityDropdown = () => setIsCityOpen(!isCityOpen);
  const toggleCinemaDropdown = () => setIsCinemaOpen(!isCinemaOpen);
  const toggleDayDropdown = () => setIsDayOpen(!isDayOpen);
  const toggleShowtimeDropdown = () => setIsShowtimeOpen(!isShowtimeOpen);

  // Selection handlers
  const handleMovieSelect = useCallback((movie) => {
    setSelectedMovie(movie);
    setIsMovieOpen(false);
    setSelectedCinema("Chọn rạp");
    setSelectedCinemaId(null);
    setSelectedDay(null);
    setSelectedShowtime(null);
  }, []);

  const handleCitySelect = useCallback((city) => {
    setSelectedCity(city);
    setIsCityOpen(false);
    setSelectedCinema("Chọn rạp");
    setSelectedCinemaId(null);
    setSelectedDay(null);
    setSelectedShowtime(null);
  }, []);

  const handleCinemaSelect = useCallback((cinema) => {
    setSelectedCinema(cinema.name);
    setSelectedCinemaId(cinema.id);
    setIsCinemaOpen(false);
    setSelectedDay(null);
    setSelectedShowtime(null);
  }, []);

  const handleDaySelect = useCallback((day) => {
    setSelectedDay(day);
    setIsDayOpen(false);
    setSelectedShowtime(null);
  }, []);

  const handleShowtimeSelect = useCallback((showtime) => {
    setSelectedShowtime(showtime);
    setIsShowtimeOpen(false);
  }, []);

  // Handle booking
  const handleBooking = () => {
    if (
      !selectedMovie ||
      !selectedCinemaId ||
      !selectedDay ||
      !selectedShowtime
    ) {
      alert("Vui lòng chọn đầy đủ thông tin để đặt vé!");
      return;
    }
    navigate(`/seat-selection/${selectedShowtime.showtimeId}`, {
      state: {
        showtimeId: selectedShowtime.showtimeId,
        movieName: selectedShowtime.movieName,
        galaxyName: selectedShowtime.galaxyName,
        date: selectedDay.date,
        time: selectedShowtime.time,
        galaxyId: selectedCinemaId,
      },
    });
  };

  // Dropdown button component
  const DropdownButton = ({ label, isOpen, onClick }) => (
    <button
      type="button"
      className="inline-flex justify-between w-48 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500"
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

  // Dropdown menu component
  const DropdownMenu = ({ isOpen, items, onSelect, selectedItem }) =>
    isOpen && (
      <div className="absolute z-10 w-48 mt-2 origin-top-right bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
        <div className="py-1">
          {items.length > 0 ? (
            items.map((item, index) => (
              <button
                key={index}
                onClick={() => onSelect(item)}
                className={`block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-orange-500 hover:text-white transition-colors duration-200 ${
                  selectedItem === item.name || selectedItem === item
                    ? "bg-orange-500 text-white"
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

  return (
    <div className="bg-gray-800 py-6">
      <div className="container mx-auto px-4 sm:px-24">
        <div className="flex flex-wrap gap-4 items-center justify-center">
          {/* Movie Dropdown */}
          <div className="relative inline-block text-left">
            <DropdownButton
              label={selectedMovie ? selectedMovie.name : "Chọn phim"}
              isOpen={isMovieOpen}
              onClick={toggleMovieDropdown}
            />
            <DropdownMenu
              isOpen={isMovieOpen}
              items={movies.filter((m) => m.status === "ACTIVE")}
              onSelect={handleMovieSelect}
              selectedItem={selectedMovie?.name}
            />
          </div>

          {/* City Dropdown */}
          <div className="relative inline-block text-left">
            <DropdownButton
              label={selectedCity}
              isOpen={isCityOpen}
              onClick={toggleCityDropdown}
            />
            <DropdownMenu
              isOpen={isCityOpen}
              items={cities}
              onSelect={handleCitySelect}
              selectedItem={selectedCity}
            />
          </div>

          {/* Cinema Dropdown */}
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

          {/* Day Dropdown */}
          <div className="relative inline-block text-left">
            <DropdownButton
              label={
                selectedDay
                  ? `${selectedDay.day} (${selectedDay.date})`
                  : "Chọn ngày"
              }
              isOpen={isDayOpen}
              onClick={toggleDayDropdown}
            />
            <DropdownMenu
              isOpen={isDayOpen}
              items={getWeekDays}
              onSelect={handleDaySelect}
              selectedItem={selectedDay?.date}
            />
          </div>

          {/* Showtime Dropdown */}
          <div className="relative inline-block text-left">
            <DropdownButton
              label={
                selectedShowtime ? selectedShowtime.time : "Chọn suất chiếu"
              }
              isOpen={isShowtimeOpen}
              onClick={toggleShowtimeDropdown}
            />
            <DropdownMenu
              isOpen={isShowtimeOpen}
              items={availableShowtimes}
              onSelect={handleShowtimeSelect}
              selectedItem={selectedShowtime?.time}
            />
          </div>

          {/* Book Button */}
          <button
            onClick={handleBooking}
            className="bg-orange-500 text-white px-6 py-2 rounded-md hover:bg-orange-600 transition-colors"
            disabled={moviesLoading || galaxiesLoading || showTimesLoading}
          >
            Đặt Vé Nhanh
          </button>
        </div>

        {/* Loading and Error States */}
        {(moviesLoading || galaxiesLoading || showTimesLoading) && (
          <p className="text-white mt-4">Đang tải...</p>
        )}
        {(moviesError || galaxiesError || showTimesError) && (
          <p className="text-red-500 mt-4">
            Lỗi:{" "}
            {moviesError ||
              galaxiesError ||
              showTimesError ||
              "Không thể tải dữ liệu"}
          </p>
        )}
      </div>
    </div>
  );
};

export default QuickBooking;
