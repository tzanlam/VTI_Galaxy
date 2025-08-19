import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { fetchSeatRoomByRoomId } from "../redux/slices/seatRoomSlice";
import { fetchRoomByShowTime } from "../redux/slices/roomSlice";
import { fetchSeatBooked } from "../redux/slices/seatBookedSlice";
import { fetchMovieById } from "../redux/slices/movieSlice";
import { fetchShowTimeByMovieDateAndGalaxy } from "../redux/slices/showTimeSlice";
import { IoMdTime } from "react-icons/io";
import { FaRegCalendar } from "react-icons/fa";
import { toast } from "react-toastify";

const SeatSelection = () => {
  const { galaxyId, movieId, time, date } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    seatRooms,
    loading: seatLoading,
    error: seatError,
  } = useSelector((state) => state.seatRoom);
  const {
    room,
    loading: roomLoading,
    error: roomError,
  } = useSelector((state) => state.room);
  const {
    seatBooked,
    loading: bookedLoading,
    error: bookedError,
  } = useSelector((state) => state.seatBooked);
  const {
    movie,
    loading: movieLoading,
    error: movieError,
  } = useSelector((state) => state.movie);
  const {
    showTimes,
    loading: showTimeLoading,
    error: showTimeError,
  } = useSelector((state) => state.showTime);

  const [selectedSeats, setSelectedSeats] = useState([]);

  // Lấy dữ liệu phim
  useEffect(() => {
    if (movieId) {
      dispatch(fetchMovieById(movieId));
    }
  }, [dispatch, movieId]);

  // Lấy dữ liệu phòng
  useEffect(() => {
    console.log("Tham số:", { galaxyId, movieId, time, date });
    if (!movieId || !galaxyId || !time || !date) {
      console.error("Thiếu tham số URL:", { galaxyId, movieId, time, date });
      navigate("/chon-suat-chieu");
      return;
    }
    dispatch(fetchRoomByShowTime({ movieId, galaxyId, time, date }));
  }, [dispatch, galaxyId, movieId, time, date, navigate]);

  // Lấy lịch chiếu
  useEffect(() => {
    if (movieId && galaxyId && date) {
      dispatch(fetchShowTimeByMovieDateAndGalaxy({ galaxyId, movieId, date }));
      console.log("Đang lấy lịch chiếu cho:", { galaxyId, movieId, date });
    }
  }, [dispatch, galaxyId, movieId, date]);

  // Lấy ghế và ghế đã đặt
  useEffect(() => {
    if (room?.id) {
      console.log("Phòng:", room);
      dispatch(fetchSeatRoomByRoomId(room.id));
      dispatch(fetchSeatBooked({ roomId: room.id, time, date }));
    }
  }, [dispatch, room, time, date]);

  // Ghi log showTimes để debug
  useEffect(() => {
    console.log("showTimes:", showTimes);
  }, [showTimes]);

  // Memoize ID ghế đã đặt
  const bookedSeatIds = useMemo(
    () =>
      Array.isArray(seatBooked)
        ? seatBooked.map((sb) => String(sb.seatRoom.id))
        : [],
    [seatBooked]
  );

  // Nhóm ghế theo hàng
  const seatsByRow = useMemo(() => {
    if (!Array.isArray(seatRooms)) return {};

    return seatRooms.reduce((acc, seat) => {
      const row = seat.name.charAt(0);
      if (!acc[row]) acc[row] = [];
      acc[row].push(seat);
      return acc;
    }, {});
  }, [seatRooms]);

  // Hàm chuẩn hóa thời gian
  const normalizeTime = (t) => {
    if (!t || typeof t !== "string") {
      console.warn("normalizeTime nhận đầu vào không hợp lệ:", t);
      return "";
    }
    return t.split(":").slice(0, 2).join(":");
  };

  // Tìm showtimeId
  const showtime = useMemo(() => {
    if (!showTimes || !Array.isArray(showTimes) || !time || !room?.id) {
      console.log("Thiếu dữ liệu cho suất chiếu:", {
        showTimes,
        time,
        roomId: room?.id,
      });
      return null;
    }

    const result = showTimes.find((st) => {
      if (!st.startTimes || !Array.isArray(st.startTimes)) return false;
      const normalizedTime = normalizeTime(time);
      const matchesTime = st.startTimes.some(
        (startTime) => normalizeTime(startTime) === normalizedTime
      );
      const matchesRoom = st.roomId === room.id;
      console.log("Kiểm tra suất chiếu:", {
        startTimes: st.startTimes,
        normalizedStartTimes: st.startTimes.map(normalizeTime),
        time,
        normalizedTime,
        matchesTime,
        matchesRoom,
        roomId: st.roomId,
      });
      return matchesTime && matchesRoom;
    });
    console.log("Suất chiếu đã chọn:", result);
    return result;
  }, [showTimes, time, room]);
  const showtimeId = showtime?.id;

  // Xác định trạng thái ghế
  const getSeatStatus = (seat) => {
    const seatIdStr = String(seat.id);
    if (bookedSeatIds.includes(seatIdStr)) return "booked";
    if (selectedSeats.includes(seatIdStr)) return "selected";
    return "available";
  };

  // Xử lý khi click vào ghế
  const handleSeatClick = (seat) => {
    const seatIdStr = String(seat.id);
    if (getSeatStatus(seat) === "booked") return;
    setSelectedSeats((prev) =>
      prev.includes(seatIdStr)
        ? prev.filter((id) => id !== seatIdStr)
        : [...prev, seatIdStr]
    );
  };

  // Xử lý nút tiếp tục
  const handleContinue = () => {
    if (selectedSeats.length === 0) {
      toast.error("Vui lòng chọn ít nhất một ghế");
      return;
    }
    if (!showtimeId) {
      toast.error(
        "Không tìm thấy suất chiếu. Vui lòng kiểm tra lại ngày, giờ hoặc rạp."
      );
      console.log("Thiếu showtimeId. Dữ liệu hiện tại:", {
        showTimes,
        time,
        roomId: room?.id,
      });
      return;
    }

    const fullSelectedSeats = selectedSeats
      .map((id) => {
        const seat = seatRooms.find((s) => String(s.id) === id);
        if (seat) {
          return {
            id: seat.id,
            name: seat.name,
            price: seat.seat?.price || 100000,
          };
        }
        return null;
      })
      .filter(Boolean);

    const totalSeatPrice = fullSelectedSeats.reduce(
      (sum, s) => sum + s.price,
      0
    );

    const movieInfo = {
      movieName: movie?.name || "Chưa có tiêu đề",
      galaxyName: room?.galaxy?.name || "Chưa có thông tin",
      date,
      time,
      galaxyId,
    };

    navigate("/other", {
      state: {
        showtimeId,
        selectedSeats: fullSelectedSeats,
        movieInfo,
        totalSeatPrice,
      },
    });
  };

  // Xử lý trạng thái tải và lỗi
  if (roomLoading || seatLoading || bookedLoading || showTimeLoading)
    return <p className="text-center mt-4">Đang tải dữ liệu...</p>;
  if (roomError)
    return <p className="text-center mt-4 text-red-500">{roomError}</p>;
  if (seatError)
    return <p className="text-center mt-4 text-red-500">{seatError}</p>;
  if (bookedError)
    return <p className="text-center mt-4 text-red-500">{bookedError}</p>;
  if (showTimeError)
    return <p className="text-center mt-4 text-red-500">{showTimeError}</p>;

  if (!Array.isArray(seatRooms) || seatRooms.length === 0) {
    return <p className="text-center mt-4">Không có ghế nào</p>;
  }

  return (
    <div className="p-6 flex flex-col lg:flex-row gap-8 container mx-auto">
      {/* Phần chọn ghế */}
      <div className="lg:w-2/3 flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-4">Chọn ghế</h2>

        {/* Màn hình */}
        <div className="bg-gray-800 text-white py-2 px-6 rounded-t-lg mb-6">
          Màn hình
        </div>

        {/* Ghế theo hàng */}
        <div className="flex flex-col gap-4 w-full max-w-2xl">
          {Object.keys(seatsByRow)
            .sort()
            .map((row) => (
              <div key={row} className="flex items-center gap-3">
                <span className="w-8 font-semibold">{row}</span>
                <div className="grid gap-3 grid-cols-8">
                  {seatsByRow[row]
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map((seat) => {
                      const status = getSeatStatus(seat);
                      let seatClasses = "";
                      if (status === "booked")
                        seatClasses = "bg-red-500 cursor-not-allowed";
                      else if (status === "selected")
                        seatClasses = "bg-green-500 hover:bg-green-600";
                      else seatClasses = "bg-gray-300 hover:bg-gray-400";

                      return (
                        <button
                          key={seat.id}
                          onClick={() => handleSeatClick(seat)}
                          disabled={status === "booked"}
                          className={`w-10 h-10 rounded-md text-sm font-semibold transition-colors duration-200 ${seatClasses}`}
                        >
                          {seat.name.slice(1)}
                        </button>
                      );
                    })}
                </div>
              </div>
            ))}
        </div>

        {/* Chú thích */}
        <div className="mt-6 flex gap-6">
          <Legend color="bg-gray-300" label="Trống" />
          <Legend color="bg-green-500" label="Đang chọn" />
          <Legend color="bg-red-500" label="Đã đặt" />
        </div>
      </div>

      {/* Phần thông tin phim */}
      {movie && !movieLoading && !movieError && (
        <div className="lg:w-1/3 bg-gray-100 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Thông tin phim
          </h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <img
              src={movie.imageURL || "https://placehold.co/150x225"}
              alt={movie.name || "Phim"}
              className="w-32 sm:w-40 h-auto rounded-lg shadow-md"
              onError={(e) => {
                e.target.src = "https://picsum.photos/150/225";
                e.target.alt = "Hình ảnh không tải được";
              }}
            />
            <div className="flex-1 text-md text-gray-600">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {movie.name || "Chưa có tiêu đề"}
              </h3>
              {movie.duration && (
                <div className="flex items-center mb-2">
                  <IoMdTime className="mr-2" />
                  <span>{movie.duration}</span>
                </div>
              )}
              {movie.releaseDate && (
                <div className="flex items-center mb-2">
                  <FaRegCalendar className="mr-2" />
                  <span>{movie.releaseDate}</span>
                </div>
              )}
              {movie.country && (
                <div className="mb-2">
                  <p>
                    <strong>Quốc gia:</strong> {movie.country}
                  </p>
                </div>
              )}
              {movie.producer && (
                <div className="mb-2">
                  <p>
                    <strong>Nhà sản xuất:</strong> {movie.producer}
                  </p>
                </div>
              )}
              {movie.genre && (
                <div className="mb-2">
                  <p>
                    <strong>Thể loại:</strong> {movie.genre}
                  </p>
                </div>
              )}
              {movie.director && (
                <div className="mb-2">
                  <p>
                    <strong>Đạo diễn:</strong> {movie.director}
                  </p>
                </div>
              )}
              {movie.actor && (
                <div className="mb-2">
                  <p>
                    <strong>Diễn viên:</strong> {movie.actor}
                  </p>
                </div>
              )}
              {movie.rating && (
                <div className="mb-2">
                  <p>
                    <strong>Đánh giá:</strong> {movie.rating}
                  </p>
                </div>
              )}
              {/* Thông tin bổ sung */}
              <div className="mt-4 border-t pt-4">
                <p>
                  <strong>Rạp:</strong>{" "}
                  {room?.galaxy?.name || "Chưa có thông tin"}
                </p>
                <p>
                  <strong>Suất chiếu:</strong> {time}
                </p>
                <p>
                  <strong>Ngày:</strong> {date}
                </p>
              </div>
              {/* Ghế đã chọn và giá */}
              <div className="mt-4 border-t pt-4">
                <h4 className="font-bold mb-2">Ghế đang chọn:</h4>
                {selectedSeats.length === 0 ? (
                  <p>Chưa chọn ghế nào</p>
                ) : (
                  <>
                    {selectedSeats.map((id) => {
                      const seat = seatRooms.find((s) => String(s.id) === id);
                      return seat ? (
                        <p key={id}>
                          {seat.name} - Giá:{" "}
                          {seat.seat?.price?.toLocaleString() || "100,000"} VND
                        </p>
                      ) : null;
                    })}
                    <p className="mt-2 font-bold">
                      Tổng tiền:{" "}
                      {selectedSeats
                        .reduce((total, id) => {
                          const seat = seatRooms.find(
                            (s) => String(s.id) === id
                          );
                          return (
                            total + (seat ? seat.seat?.price || 100000 : 0)
                          );
                        }, 0)
                        .toLocaleString()}{" "}
                      VND
                    </p>
                  </>
                )}
              </div>
              {/* Nút Tiếp tục */}
              <button
                className="mt-4 w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
                onClick={handleContinue}
                disabled={selectedSeats.length === 0 || !showtimeId}
              >
                Tiếp tục
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Thành phần Chú thích
const Legend = ({ color, label }) => (
  <div className="flex items-center gap-2">
    <div className={`w-6 h-6 ${color} rounded`}></div>
    <span>{label}</span>
  </div>
);

export default SeatSelection;
