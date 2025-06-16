import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchShowTimeByMovieDateAndGalaxy } from "../redux/slices/showTimeSlice";
import { fetchStartTimes } from "../redux/slices/startTimeSlice";
import { fetchGalaxies } from "../redux/slices/galaxySlice";
import { useNavigate } from "react-router-dom";

const ShowTime = ({ selectedCity, onCityChange, movieId }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showTimes, loading, error } = useSelector((state) => state.showTime);
  const { loading: startTimeLoading, error: startTimeError } = useSelector(
    (state) => state.startTime
  );
  const {
    galaxies,
    loading: galaxyLoading,
    error: galaxyError,
  } = useSelector((state) => state.galaxy);
  const [isCityOpen, setIsCityOpen] = useState(false);
  const [isCinemaOpen, setIsCinemaOpen] = useState(false);
  const [selectedCinema, setSelectedCinema] = useState("Chọn rạp");
  const [selectedGalaxyId, setSelectedGalaxyId] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);

  useEffect(() => {
    console.log("Dispatching fetchGalaxies and fetchStartTimes");
    dispatch(fetchGalaxies());
    dispatch(fetchStartTimes());
  }, [dispatch]);

  // Kiểm tra showTimes
  useEffect(() => {
    console.log("Current showTimes:", showTimes);
  }, [showTimes]);

  const cities = useMemo(() => {
    const cityList = [
      "Toàn quốc",
      ...new Set(galaxies.map((g) => g.city).filter(Boolean)),
    ];
    console.log("Computed cities:", cityList);
    return cityList;
  }, [galaxies]);

  const getCinemas = useMemo(() => {
    const cinemas =
      selectedCity === "Toàn quốc"
        ? galaxies
        : galaxies.filter((g) => g.city === selectedCity);
    return cinemas.map((g) => ({ id: g.id, name: g.name }));
  }, [selectedCity, galaxies]);

  useEffect(() => {
    if (selectedCity && selectedCity !== "Toàn quốc" && getCinemas.length > 0) {
      console.log("Auto-selecting first cinema:", getCinemas[0].name);
      setSelectedCinema(getCinemas[0].name);
      setSelectedGalaxyId(getCinemas[0].id);
    } else {
      console.log("No cinemas available for city:", selectedCity);
      setSelectedCinema("Chọn rạp");
      setSelectedGalaxyId(null);
    }
  }, [selectedCity, getCinemas]);

  const toggleCityDropdown = () => setIsCityOpen(!isCityOpen);
  const toggleCinemaDropdown = () => setIsCinemaOpen(!isCinemaOpen);

  const handleCitySelect = useCallback(
    (city) => {
      console.log("Selected city:", city);
      onCityChange(city);
      setIsCityOpen(false);
      setSelectedCinema("Chọn rạp");
      setSelectedGalaxyId(null);
    },
    [onCityChange]
  );

  const handleCinemaSelect = useCallback((cinema) => {
    console.log("Selected cinema:", cinema);
    setSelectedCinema(cinema.name);
    setSelectedGalaxyId(cinema.id);
    setIsCinemaOpen(false);
  }, []);

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
    if (
      selectedCity &&
      selectedCinema !== "Chọn rạp" &&
      selectedDay &&
      selectedGalaxyId &&
      movieId
    ) {
      console.log("Dispatching fetchShowTimeByMovieDateAndGalaxy with:", {
        galaxyId: selectedGalaxyId,
        movieId,
        date: selectedDay.dateForApi,
      });
      dispatch(
        fetchShowTimeByMovieDateAndGalaxy({
          galaxyId: String(selectedGalaxyId),
          movieId: String(movieId),
          date: selectedDay.dateForApi,
        })
      );
    }
  }, [
    selectedCity,
    selectedCinema,
    selectedDay,
    selectedGalaxyId,
    movieId,
    dispatch,
  ]);

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
    // Kiểm tra showTimes là mảng
    if (!Array.isArray(showTimes)) {
      console.warn("showTimes is not an array:", showTimes);
      return [];
    }
    const filtered = showTimes.filter(
      (st) => st.date === selectedDay.dateForApi
    );
    console.log("Computed selectedShowtimes:", filtered);
    return filtered;
  }, [showTimes, selectedDay]);

  const handleTimeClick = (showtime, time) => {
    navigate(`/seat-selection/${showtime.id}`, {
      state: {
        showtimeId: showtime.id,
        movieName: showtime.movieName,
        galaxyName: showtime.galaxyName,
        date: selectedDay?.dateForApi,
        time: time,
      },
    });
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Lịch Chiếu Phim</h2>
      {galaxyLoading && (
        <p className="text-gray-500">Đang tải danh sách rạp...</p>
      )}
      {galaxyError && (
        <p className="text-red-500">
          Lỗi: {galaxyError.message || "Không thể tải danh sách rạp"}
        </p>
      )}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="relative inline-block text-left">
          <DropdownButton
            label={selectedCity || "Chọn thành phố"}
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
          Lỗi: {error.message || error || "Không thể tải lịch chiếu"}
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

              <div className="flex flex-wrap gap-2">
                {showtime.startTimes.length > 0 ? (
                  showtime.startTimes.map((time, timeIdx) => (
                    <button
                      key={timeIdx}
                      className="bg-orange-500 text-white px-4 py-1 rounded-md hover:bg-orange-600 transition-colors"
                      onClick={() => handleTimeClick(showtime, time)}
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
