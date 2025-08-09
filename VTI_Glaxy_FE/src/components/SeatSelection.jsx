import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { fetchSeatRoomByTime } from "../redux/slices/seatRoomSlice";

const SeatSelection = () => {
  const { galaxyId, movieId, time } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { seatRooms, loading, error } = useSelector((state) => state.seatRoom);
  const [selectedSeats, setSelectedSeats] = useState([]);

  useEffect(() => {
    if (!galaxyId || !time) {
      navigate("/chon-suat-chieu");
      return;
    }
    dispatch(fetchSeatRoomByTime({ time, galaxyId, movieId }));
  }, [dispatch, galaxyId, time, movieId, navigate]);

  const handleSeatClick = (seat) => {
    if (seat.booked) return; // Không cho chọn ghế đã đặt
    setSelectedSeats((prev) =>
      prev.includes(seat.id)
        ? prev.filter((s) => s !== seat.id)
        : [...prev, seat.id]
    );
  };

  if (loading) return <p className="text-center mt-4">Đang tải ghế...</p>;
  if (error) return <p className="text-center mt-4 text-red-500">{error}</p>;
  if (!Array.isArray(seatRooms)) {
    console.error("seatRooms is not an array:", seatRooms);
    return <p className="text-center mt-4 text-red-500">Dữ liệu ghế không hợp lệ</p>;
  }

  return (
    <div className="p-6 flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-4">Chọn ghế</h2>
      <div className="bg-gray-800 text-white py-2 px-6 rounded-t-lg mb-6">
        Màn hình
      </div>
      <div className="grid gap-3">
        {seatRooms.map((seat) => {
          const isSelected = selectedSeats.includes(seat.id);
          const seatClasses = seat.booked
            ? "bg-red-500 cursor-not-allowed"
            : isSelected
            ? "bg-green-500 hover:bg-green-600"
            : "bg-gray-300 hover:bg-gray-400";
          return (
            <button
              key={seat.id}
              onClick={() => handleSeatClick(seat)}
              disabled={seat.booked}
              className={`w-10 h-10 rounded-md text-sm font-semibold transition-colors duration-200 ${seatClasses}`}
            >
              {seat.label}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-6 flex gap-6">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-gray-300 rounded"></div>
          <span>Trống</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-green-500 rounded"></div>
          <span>Đang chọn</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-red-500 rounded"></div>
          <span>Đã đặt</span>
        </div>
      </div>
    </div>
  );
};

export default SeatSelection;