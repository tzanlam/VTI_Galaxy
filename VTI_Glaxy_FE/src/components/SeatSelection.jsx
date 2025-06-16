import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
// Import các action cần thiết (cần tạo thêm)
// import { fetchSeats, selectSeat } from "../redux/slices/seatSlice";

const SeatSelection = () => {
  const { showtimeId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Lấy thông tin từ state của route
  const { movieName, galaxyName, date, time } = location.state || {};

  // State cho ghế đã chọn
  const [selectedSeats, setSelectedSeats] = useState([]);

  // Giả lập dữ liệu ghế (sau này sẽ lấy từ API)
  const [seats, setSeats] = useState([]);

  useEffect(() => {
    // Giả lập dữ liệu ghế (thay bằng API call sau)
    const generateSeats = () => {
      const rows = ["A", "B", "C", "D", "E", "F", "G", "H"];
      const seatsPerRow = 10;
      const seatData = [];

      rows.forEach((row) => {
        for (let i = 1; i <= seatsPerRow; i++) {
          seatData.push({
            id: `${row}${i}`,
            row: row,
            number: i,
            type: Math.random() > 0.8 ? "VIP" : "STANDARD",
            status: Math.random() > 0.7 ? "AVAILABLE" : "BOOKED",
          });
        }
      });

      setSeats(seatData);
    };

    generateSeats();

    // Sau này sẽ gọi API thực tế
    // if (showtimeId) {
    //   dispatch(fetchSeats(showtimeId));
    // }
  }, [showtimeId, dispatch]);

  const handleSeatClick = (seat) => {
    if (seat.status === "BOOKED") return;

    setSelectedSeats((prev) => {
      const isSelected = prev.some((s) => s.id === seat.id);
      if (isSelected) {
        return prev.filter((s) => s.id !== seat.id);
      } else {
        return [...prev, seat];
      }
    });
  };

  const handleBooking = () => {
    if (selectedSeats.length === 0) {
      alert("Vui lòng chọn ít nhất một ghế");
      return;
    }

    // Chuyển đến trang thanh toán
    navigate("/payment", {
      state: {
        showtimeId,
        movieName,
        galaxyName,
        date,
        time,
        selectedSeats,
      },
    });
  };

  const getSeatStatus = (seat) => {
    if (seat.status === "BOOKED") return "bg-gray-500 cursor-not-allowed";
    if (selectedSeats.some((s) => s.id === seat.id)) return "bg-green-500";
    return seat.type === "VIP"
      ? "bg-yellow-500 hover:bg-yellow-600"
      : "bg-blue-500 hover:bg-blue-600";
  };

  // Thêm hàm tính tổng tiền dựa trên loại ghế
  const calculateTotal = () => {
    return selectedSeats.reduce((total, seat) => {
      // Giá ghế dựa trên loại
      const price = seat.type === "VIP" ? 120000 : 90000;
      return total + price;
    }, 0);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">{movieName}</h1>
        <p className="text-lg">
          {galaxyName} | {date} | {time}
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Phần bên trái - Sơ đồ ghế */}
        <div className="md:w-2/3">
          <div className="w-full bg-gray-800 h-12 rounded-lg mb-6 flex items-center justify-center">
            <p className="text-white text-lg">Màn hình</p>
          </div>

          {/* Hiển thị ghế theo từng hàng để dễ nhìn hơn */}
          <div className="mb-8">
            {["A", "B", "C", "D", "E", "F", "G", "H"].map((row) => (
              <div key={row} className="flex justify-center mb-2">
                <div className="w-8 flex items-center justify-center font-bold text-gray-600">
                  {row}
                </div>
                <div className="flex gap-1">
                  {seats
                    .filter((seat) => seat.row === row)
                    .map((seat) => (
                      <button
                        key={seat.id}
                        className={`w-8 h-8 rounded-md text-white text-xs flex items-center justify-center ${getSeatStatus(
                          seat
                        )}`}
                        onClick={() => handleSeatClick(seat)}
                        disabled={seat.status === "BOOKED"}
                      >
                        {seat.number}
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
              <span className="text-sm">Đã đặt</span>
            </div>
          </div>
        </div>

        {/* Phần bên phải - Thông tin đặt vé */}
        <div className="md:w-1/3 bg-white p-6 rounded-lg shadow-md">
          <div className="border-b pb-4 mb-4">
            <h2 className="text-xl font-bold mb-4">Thông tin đặt vé</h2>
            <div className="space-y-2">
              <p>
                <span className="font-medium">Phim:</span> {movieName}
              </p>
              <p>
                <span className="font-medium">Rạp:</span> {galaxyName}
              </p>
              <p>
                <span className="font-medium">Ngày chiếu:</span> {date}
              </p>
              <p>
                <span className="font-medium">Giờ chiếu:</span> {time}
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
                    {seat.id}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 mb-4">Chưa chọn ghế nào</p>
            )}

            {selectedSeats.length > 0 && (
              <div className="space-y-2 border-t pt-4">
                <div className="flex justify-between">
                  <span>
                    Ghế thường (
                    {selectedSeats.filter((s) => s.type === "STANDARD").length}
                    x):
                  </span>
                  <span>
                    {(
                      selectedSeats.filter((s) => s.type === "STANDARD")
                        .length * 90000
                    ).toLocaleString()}{" "}
                    VNĐ
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>
                    Ghế VIP (
                    {selectedSeats.filter((s) => s.type === "VIP").length}x):
                  </span>
                  <span>
                    {(
                      selectedSeats.filter((s) => s.type === "VIP").length *
                      120000
                    ).toLocaleString()}{" "}
                    VNĐ
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-bold">Tổng tiền:</span>
              <span className="text-xl font-bold text-orange-500">
                {calculateTotal().toLocaleString()} VNĐ
              </span>
            </div>
            <button
              className="w-full py-3 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors font-medium"
              onClick={handleBooking}
              disabled={selectedSeats.length === 0}
            >
              Tiếp tục thanh toán
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatSelection;
