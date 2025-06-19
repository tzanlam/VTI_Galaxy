import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import axiosClient from "../services/axiosClient";
import {
  fetchSeats,
  selectSeat,
  resetSelectedSeats,
} from "../redux/slices/seatSlice";

const SeatSelection = () => {
  const { showtimeId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Lấy thông tin từ state của route
  const { movieName, galaxyName, date, time } = location.state || {};

  // Lấy state từ Redux
  const { seats, selectedSeats, loading, error } = useSelector(
    (state) => state.seat
  );
  const { isLoggedIn } = useSelector((state) => state.auth);

  // State cho thông tin phim và rạp
  const [movieInfo, setMovieInfo] = useState({
    movieName: movieName || "Không có thông tin",
    galaxyName: galaxyName || "Không có thông tin",
    date: date || "Không có thông tin",
    time: time || "Không có thông tin",
  });

  useEffect(() => {
    // Kiểm tra đăng nhập
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!token) {
      toast.error("Vui lòng đăng nhập để đặt vé");
      navigate("/");
      return;
    }

    // Reset selected seats khi component mount
    dispatch(resetSelectedSeats());

    // Fetch seats từ API
    if (showtimeId) {
      console.log("Fetching seats for showtime ID:", showtimeId);
      dispatch(fetchSeats(showtimeId));
    } else {
      console.error("Missing showtimeId parameter");
    }

    // Cleanup khi unmount
    return () => {
      dispatch(resetSelectedSeats());
    };
  }, [showtimeId, dispatch, navigate]);

  const handleSeatClick = (seat) => {
    // Chỉ cho phép chọn ghế có trạng thái OPEN
    if (seat.status !== "OPEN") return;
    dispatch(selectSeat(seat));
  };

  const handleBooking = async () => {
    if (selectedSeats.length === 0) {
      toast.warning("Vui lòng chọn ít nhất một ghế");
      return;
    }

    try {
      // Gọi API để cập nhật trạng thái ghế
      const seatIds = selectedSeats.map((seat) => seat.id);
      const response = await axiosClient.post("/api/booking/create", {
        showTimeId: showtimeId,
        seatIds: seatIds,
        totalPrice: calculateTotal(),
      });

      if (response.data) {
        toast.success("Đặt vé thành công!");
        // Chuyển về trang chủ sau khi đặt vé thành công
        navigate("/");
      }
    } catch (error) {
      console.error("Lỗi khi đặt vé:", error);
      toast.error(error.response?.data?.message || "Đã xảy ra lỗi khi đặt vé");
    }
  };

  const getSeatStatus = (seat) => {
    if (seat.status !== "OPEN") return "bg-gray-500 cursor-not-allowed";
    if (selectedSeats.some((s) => s.id === seat.id)) return "bg-green-500";

    // Phân loại ghế dựa vào seatNameType
    const seatType = seat.seatNameType.includes("VIP") ? "VIP" : "STANDARD";
    return seatType === "VIP"
      ? "bg-yellow-500 hover:bg-yellow-600"
      : "bg-blue-500 hover:bg-blue-600";
  };

  // Tính tổng tiền dựa trên giá ghế từ backend
  const calculateTotal = () => {
    return selectedSeats.reduce((total, seat) => {
      return total + seat.seatPrice;
    }, 0);
  };

  // Format số tiền
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

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
          <p>Đã xảy ra lỗi: {error}</p>
          <button
            className="mt-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
            onClick={() => dispatch(fetchSeats(showtimeId))}
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  // Nhóm ghế theo hàng (lấy ký tự đầu tiên của seatNameType)
  const seatsByRow = seats.reduce((acc, seat) => {
    const row = seat.seatNameType.charAt(0);
    if (!acc[row]) acc[row] = [];
    acc[row].push(seat);
    return acc;
  }, {});

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">{movieInfo.movieName}</h1>
        <p className="text-lg">
          {movieInfo.galaxyName} | {movieInfo.date} | {movieInfo.time}
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Phần bên trái - Sơ đồ ghế */}
        <div className="md:w-2/3">
          <div className="w-full bg-gray-800 h-12 rounded-lg mb-6 flex items-center justify-center">
            <p className="text-white text-lg">Màn hình</p>
          </div>

          {/* Hiển thị ghế theo từng hàng */}
          <div className="mb-8">
            {Object.keys(seatsByRow)
              .sort()
              .map((row) => (
                <div key={row} className="flex justify-center mb-2">
                  <div className="w-8 flex items-center justify-center font-bold text-gray-600">
                    {row}
                  </div>
                  <div className="flex gap-1">
                    {seatsByRow[row]
                      .sort((a, b) => {
                        // Lấy số từ seatNameType (ví dụ: A1 -> 1, B10 -> 10)
                        const numA = parseInt(a.seatNameType.substring(1));
                        const numB = parseInt(b.seatNameType.substring(1));
                        return numA - numB;
                      })
                      .map((seat) => (
                        <button
                          key={seat.id}
                          className={`w-8 h-8 rounded-md text-white text-xs flex items-center justify-center ${getSeatStatus(
                            seat
                          )}`}
                          onClick={() => handleSeatClick(seat)}
                          disabled={seat.status !== "OPEN"}
                        >
                          {seat.seatNameType.substring(1)}
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
              <div className="w-4 h-4 bg-green-500 rounded-sm mr-2"></div>
              <span className="text-sm">Đã chọn</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-gray-500 rounded-sm mr-2"></div>
              <span className="text-sm">Không khả dụng</span>
            </div>
          </div>
        </div>

        {/* Phần bên phải - Thông tin đặt vé */}
        <div className="md:w-1/3 bg-white p-6 rounded-lg shadow-md">
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
                {selectedSeats.map((seat) => (
                  <span
                    key={seat.id}
                    className="px-2 py-1 bg-green-100 border border-green-500 rounded-md"
                  >
                    {seat.seatNameType}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 mb-4">Chưa chọn ghế nào</p>
            )}

            {selectedSeats.length > 0 && (
              <div className="space-y-2 border-t pt-4">
                {/* Hiển thị chi tiết từng loại ghế đã chọn */}
                {selectedSeats.map((seat) => (
                  <div key={seat.id} className="flex justify-between">
                    <span>{seat.seatNameType}:</span>
                    <span>{formatCurrency(seat.seatPrice)}</span>
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
            }`}
            onClick={handleBooking}
            disabled={selectedSeats.length === 0}
          >
            Đặt vé
          </button>
        </div>
      </div>
    </div>
  );
};

export default SeatSelection;
