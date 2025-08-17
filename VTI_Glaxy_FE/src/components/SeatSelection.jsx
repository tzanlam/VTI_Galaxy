import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { fetchSeatRoomByRoomId } from "../redux/slices/seatRoomSlice";
import { fetchRoomByShowTime } from "../redux/slices/roomSlice";
import { fetchSeatBooked } from "../redux/slices/seatBookedSlice";

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

  const [selectedSeats, setSelectedSeats] = useState([]);

  // 1. Lấy room theo movieId + galaxyId + time + date
  useEffect(() => {
    console.log("Params:", { galaxyId, movieId, time, date });
    if (!movieId || !galaxyId || !time || !date) {
      console.error("Thiếu tham số URL:", { galaxyId, movieId, time, date });
      navigate("/chon-suat-chieu");
      return;
    }
    dispatch(fetchRoomByShowTime({ movieId, galaxyId, time, date }));
  }, [dispatch, galaxyId, movieId, time, date, navigate]);

  // 2. Khi có room.id => Lấy danh sách ghế và ghế đã đặt
  useEffect(() => {
    if (room?.id) {
      console.log("Room:", room);
      dispatch(fetchSeatRoomByRoomId(room.id));
      dispatch(fetchSeatBooked({ roomId: room.id, time, date }));
    }
  }, [dispatch, room, time, date]);

  // 3. Lấy danh sách ID ghế đã đặt
  const bookedSeatIds = useMemo(
    () =>
      Array.isArray(seatBooked)
        ? seatBooked.map((sb) => String(sb.seatRoom.id))
        : [],
    [seatBooked]
  );

  // 4. Xác định trạng thái ghế
  const getSeatStatus = (seat) => {
    const seatIdStr = String(seat.id);
    if (bookedSeatIds.includes(seatIdStr)) return "booked";
    if (selectedSeats.includes(seatIdStr)) return "selected";
    return "available";
  };

  // 5. Click chọn ghế
  const handleSeatClick = (seat) => {
    const seatIdStr = String(seat.id);
    if (getSeatStatus(seat) === "booked") return;
    setSelectedSeats((prev) =>
      prev.includes(seatIdStr)
        ? prev.filter((id) => id !== seatIdStr)
        : [...prev, seatIdStr]
    );
  };

  // Loading & error handling
  if (roomLoading || seatLoading || bookedLoading)
    return <p className="text-center mt-4">Đang tải dữ liệu...</p>;
  if (roomError)
    return <p className="text-center mt-4 text-red-500">{roomError}</p>;
  if (seatError)
    return <p className="text-center mt-4 text-red-500">{seatError}</p>;
  if (bookedError)
    return <p className="text-center mt-4 text-red-500">{bookedError}</p>;

  if (!Array.isArray(seatRooms) || seatRooms.length === 0) {
    return <p className="text-center mt-4">Không có ghế nào</p>;
  }

  return (
    <div className="p-6 flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-4">Chọn ghế</h2>

      {/* Màn hình */}
      <div className="bg-gray-800 text-white py-2 px-6 rounded-t-lg mb-6">
        Màn hình
      </div>

      {/* Ghế */}
      <div className="grid gap-3 grid-cols-8">
        {seatRooms.map((seat) => {
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
              {seat.name}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-6 flex gap-6">
        <Legend color="bg-gray-300" label="Trống" />
        <Legend color="bg-green-500" label="Đang chọn" />
        <Legend color="bg-red-500" label="Đã đặt" />
      </div>
    </div>
  );
};

// Component nhỏ hiển thị chú thích
const Legend = ({ color, label }) => (
  <div className="flex items-center gap-2">
    <div className={`w-6 h-6 ${color} rounded`}></div>
    <span>{label}</span>
  </div>
);

export default SeatSelection;
