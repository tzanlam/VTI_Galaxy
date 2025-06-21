import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import axiosClient from "../services/axiosClient";
import {
  fetchSeatRoomsByShowtimeId,
  selectSeatRoom,
  unselectSeatRoom,
  clearSeatRoomState,
  updateSeatRoomStatus,
} from "../redux/slices/seatRoomSlice";

const SeatSelection = () => {
  const { showtimeId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { movieName, galaxyName, date, time } = location.state || {};
  const { seatRooms, loading, error } = useSelector((state) => state.seatRoom);

  const [movieInfo, setMovieInfo] = useState({
    movieName: movieName || "Không có thông tin",
    galaxyName: galaxyName || "Không có thông tin",
    date: date || "Không có thông tin",
    time: time || "Không có thông tin",
  });

  const [selectedSeats, setSelectedSeats] = useState([]);

  useEffect(() => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!token) {
      toast.error("Vui lòng đăng nhập để đặt vé");
      navigate("/");
      return;
    }

    dispatch(clearSeatRoomState());

    if (showtimeId) {
      console.log("Fetching seat rooms for showtime ID:", showtimeId);
      dispatch(fetchSeatRoomsByShowtimeId(showtimeId));
    } else {
      console.error("Missing showtimeId parameter");
    }

    return () => {
      dispatch(clearSeatRoomState());
    };
  }, [showtimeId, dispatch, navigate]);

  const handleSeatClick = (seatRoom) => {
    if (!seatRoom.seat || seatRoom.status === "BOOKED") return;

    const isSelected = selectedSeats.some((s) => s.id === seatRoom.id);
    if (isSelected) {
      setSelectedSeats(selectedSeats.filter((s) => s.id !== seatRoom.id));
      dispatch(unselectSeatRoom(seatRoom.id));
      dispatch(
        updateSeatRoomStatus({ seatRoomId: seatRoom.id, status: "AVAILABLE" })
      );
    } else {
      setSelectedSeats([...selectedSeats, seatRoom]);
      dispatch(selectSeatRoom(seatRoom.id));
      dispatch(
        updateSeatRoomStatus({ seatRoomId: seatRoom.id, status: "SELECTED" })
      );
    }
  };

  const handleBooking = () => {
    if (selectedSeats.length === 0) {
      toast.warning("Vui lòng chọn ít nhất một ghế");
      return;
    }

    // Chuyển hướng đến trang chọn combo
    navigate("/other", {
      state: {
        showtimeId,
        selectedSeats,
        movieInfo,
        totalSeatPrice: calculateTotal(),
      },
    });
  };

  const seatStyles = {
    BOOKED: "bg-gray-500 cursor-not-allowed",
    SELECTED: "bg-green-500",
    VIP: "bg-yellow-500 hover:bg-yellow-600",
    DOUBLE: "bg-purple-500 hover:bg-purple-600",
    STANDARD: "bg-blue-500 hover:bg-blue-600",
  };

  const getSeatStatus = (seatRoom) => {
    if (!seatRoom.seat || seatRoom.status === "BOOKED")
      return seatStyles.BOOKED;
    if (seatRoom.status === "SELECTED") return seatStyles.SELECTED;
    return seatStyles[seatRoom.seat.type] || seatStyles.STANDARD;
  };

  const calculateTotal = () => {
    return selectedSeats.reduce((total, seatRoom) => {
      return total + (seatRoom.seat?.price || 0);
    }, 0);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const baseSeatClass =
    "h-6 rounded text-white text-[10px] flex items-center justify-center";

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>Đã xảy ra lỗi: {error.message || error}</p>
          <button
            className="mt-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
            onClick={() => dispatch(fetchSeatRoomsByShowtimeId(showtimeId))}
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  const seatsByRow = (Array.isArray(seatRooms) ? seatRooms : []).reduce(
    (acc, seatRoom) => {
      if (seatRoom.seat && seatRoom.seat.name) {
        const row = seatRoom.seat.name.charAt(0);
        if (!acc[row]) acc[row] = [];
        acc[row].push(seatRoom);
      }
      return acc;
    },
    {}
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">{movieInfo.movieName}</h1>
        <p className="text-lg">
          {movieInfo.galaxyName} | {movieInfo.date} | {movieInfo.time}
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="md:w-2/3 overflow-x-auto max-w-[800px] min-w-[300px]">
          <div className="w-full bg-gray-800 h-12 rounded-lg mb-6 flex items-center justify-center">
            <p className="text-white text-lg">Màn hình</p>
          </div>

          <div className="mb-8">
            {Object.keys(seatsByRow)
              .sort()
              .map((row) => (
                <div key={row} className="flex justify-start mb-2 min-w-max">
                  <div className="w-8 flex items-center justify-center font-bold text-gray-600 text-sm">
                    {row}
                  </div>
                  <div className="flex gap-0.5">
                    {seatsByRow[row]
                      .sort((a, b) => {
                        const numA = parseInt(a.seat.name.substring(1));
                        const numB = parseInt(b.seat.name.substring(1));
                        return numA - numB;
                      })
                      .map((seatRoom) => (
                        <button
                          key={seatRoom.id}
                          className={`${baseSeatClass} ${
                            seatRoom.seat.type === "DOUBLE" ? "w-16" : "w-8"
                          } ${getSeatStatus(seatRoom)}`}
                          onClick={() => handleSeatClick(seatRoom)}
                          disabled={
                            !seatRoom.seat || seatRoom.status === "BOOKED"
                          }
                        >
                          {seatRoom.seat?.name.substring(1) || "N/A"}
                        </button>
                      ))}
                  </div>
                </div>
              ))}
          </div>

          <div className="flex flex-wrap justify-center gap-4 mb-6">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-blue-500 rounded-sm mr-2"></div>
              <span className="text-sm">Ghế thường</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-yellow-500 rounded-sm mr-2"></div>
              <span className="text-sm">Ghế VIP</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-purple-500 rounded-sm mr-2"></div>
              <span className="text-sm">Ghế đôi</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-green-500 rounded-sm mr-2"></div>
              <span className="text-sm">Đã chọn</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-gray-500 rounded-sm mr-2"></div>
              <span className="text-sm">Đã bán</span>
            </div>
          </div>
        </div>

        <div className="md:w-1/3 bg-white p-6 rounded-lg shadow-md md:sticky md:top-4 max-w-sm mx-auto md:mx-0">
          <div className="border-b pb-4 mb-4">
            <h2 className="text-xl font-bold mb-4">Thông tin đặt vé</h2>
            <div className="space-y-2">
              <p>
                <span className="font-medium">Phim:</span> {movieInfo.movieName}
              </p>
              <p>
                <span className="font-medium">Rạp:</span> {movieInfo.galaxyName}
              </p>
              <p>
                <span className="font-medium">Ngày chiếu:</span>{" "}
                {movieInfo.date}
              </p>
              <p>
                <span className="font-medium">Giờ chiếu:</span> {movieInfo.time}
              </p>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-bold mb-4">Ghế đã chọn</h2>
            {selectedSeats.length > 0 ? (
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedSeats.map((seatRoom) => (
                  <span
                    key={seatRoom.id}
                    className="px-2 py-1 bg-green-100 border border-green-500 rounded-md text-xs"
                  >
                    {seatRoom.seat?.name || "N/A"}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 mb-4">Chưa chọn ghế nào</p>
            )}

            {selectedSeats.length > 0 && (
              <div className="space-y-2 border-t pt-4">
                {selectedSeats.map((seatRoom) => (
                  <div key={seatRoom.id} className="flex justify-between">
                    <span>{seatRoom.seat?.name || "N/A"}:</span>
                    <span>{formatCurrency(seatRoom.seat?.price || 0)}</span>
                  </div>
                ))}
                <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2">
                  <span>Tổng tiền:</span>
                  <span>{formatCurrency(calculateTotal())}</span>
                </div>
              </div>
            )}
          </div>

          <button
            className={`w-full py-3 rounded-lg text-white font-bold ${
              selectedSeats.length > 0
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-gray-400 cursor-not-allowed"
            } md:static fixed bottom-0 left-0 right-0 md:mx-0 mx-4 mb-4 md:mb-0 z-10 md:z-auto`}
            onClick={handleBooking}
            disabled={selectedSeats.length === 0}
          >
            Tiếp tục
          </button>
        </div>
      </div>
    </div>
  );
};

export default SeatSelection;
