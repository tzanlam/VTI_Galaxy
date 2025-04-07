import React, { useState, useEffect } from "react";
import { cinemaData } from "../data/cinemaData";

const ShowTime = ({ selectedCity, onCityChange, showtimes }) => {
  const [isCityOpen, setIsCityOpen] = useState(false);
  const [isCinemaOpen, setIsCinemaOpen] = useState(false);
  const [selectedCinema, setSelectedCinema] = useState("Chọn rạp");
  const [selectedDay, setSelectedDay] = useState("Hôm nay");

  const toggleCityDropdown = () => setIsCityOpen(!isCityOpen);
  const toggleCinemaDropdown = () => setIsCinemaOpen(!isCinemaOpen);

  const handleCitySelect = (city) => {
    onCityChange(city);
    setIsCityOpen(false);
    setSelectedCinema("Chọn rạp");
  };

  const handleCinemaSelect = (cinema) => {
    setSelectedCinema(cinema.name);
    setIsCinemaOpen(false);
  };

  const getCinemas = () => {
    if (selectedCity === "Toàn quốc") {
      return Object.values(cinemaData.cinemaLocations)
        .flat()
        .filter((cinema) => cinema.name);
    }
    return cinemaData.cinemaLocations[selectedCity] || [];
  };

  const cinemas = getCinemas();

  useEffect(() => {
    console.log("Selected City:", selectedCity);
    console.log("Cinemas:", cinemas);
    console.log("Showtimes:", showtimes); // Debug prop showtimes
  }, [selectedCity, cinemas, showtimes]);

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
                onClick={() => onSelect(typeof item === "string" ? item : item)}
                className={`block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-500 hover:text-white transition-colors duration-200 ${
                  selectedItem === (typeof item === "string" ? item : item.name)
                    ? "bg-blue-500 text-white"
                    : ""
                }`}
              >
                {typeof item === "string" ? item : item.name}
              </button>
            ))
          ) : (
            <div className="px-4 py-2 text-sm text-gray-500">
              Không có rạp nào
            </div>
          )}
        </div>
      </div>
    );

  const currentDate = new Date(2025, 4, 4); // 4/5/2025 (tháng bắt đầu từ 0)
  const daysOfWeek = [
    "Thứ Hai",
    "Thứ Ba",
    "Thứ Tư",
    "Thứ Năm",
    "Thứ Sáu",
    "Hôm nay",
    "Chủ Nhật",
  ];

  const getWeekDays = () => {
    const weekDays = [];
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay() + 1); // Bắt đầu từ Thứ Hai

    if (!showtimes || !Array.isArray(showtimes)) {
      console.warn("showtimes is undefined or not an array:", showtimes);
      for (let i = 0; i < 7; i++) {
        const day = new Date(startOfWeek);
        day.setDate(startOfWeek.getDate() + i);
        const dayName =
          day.getDate() === currentDate.getDate() ? "Hôm nay" : daysOfWeek[i];
        const formattedDate = `${day.getDate()}/${day.getMonth() + 1}`;
        weekDays.push({
          day: dayName,
          date: formattedDate,
          times: [], // Trả về mảng rỗng nếu không có showtimes
        });
      }
      return weekDays;
    }

    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      const dayName =
        day.getDate() === currentDate.getDate() ? "Hôm nay" : daysOfWeek[i];
      const formattedDate = `${day.getDate()}/${day.getMonth() + 1}`;
      weekDays.push({
        day: dayName,
        date: formattedDate,
        times: showtimes.find((st) => st.day === dayName)?.times || [],
      });
    }
    return weekDays;
  };

  const weekDays = getWeekDays();

  const handleDaySelect = (day) => {
    setSelectedDay(day);
  };

  const selectedShowtime = weekDays.find((st) => st.day === selectedDay);

  return (
    <div>
      <div className="flex gap-4 mb-6">
        <div className="relative inline-block text-left">
          <DropdownButton
            label={selectedCity}
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
            items={cinemas}
            onSelect={handleCinemaSelect}
            selectedItem={selectedCinema}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {weekDays.map((showtime, idx) => (
          <button
            key={idx}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              selectedDay === showtime.day
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
            onClick={() => handleDaySelect(showtime.day)}
          >
            {showtime.day}
            <br />
            {showtime.date}
          </button>
        ))}
      </div>

      {selectedShowtime && (
        <div>
          <h3 className="text-lg font-bold mb-4">
            Lịch chiếu ngày {selectedShowtime.day} ({selectedShowtime.date})
          </h3>
          {cinemas.length > 0 ? (
            cinemas.map((cinema, idx) => (
              <div key={idx} className="mb-4">
                <p className="text-sm font-medium text-gray-700">
                  {cinema.name}
                </p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {selectedShowtime.times.map((time, timeIdx) => (
                    <button
                      key={timeIdx}
                      className="bg-orange-500 text-white px-4 py-1 rounded-md hover:bg-orange-600 transition-colors"
                      onClick={() =>
                        alert(
                          `Đã đặt vé tại ${cinema.name} vào ${selectedShowtime.day} (${selectedShowtime.date}) lúc ${time}`
                        )
                      }
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">Không có rạp nào trong khu vực này.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ShowTime;
