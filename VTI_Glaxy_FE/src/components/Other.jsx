import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import axiosClient from "../services/axiosClient";
import {
  fetchOtherByGalaxyId,
  fetchOthers,
  clearOtherState,
} from "../redux/slices/otherSlice";

const Other = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { showtimeId, selectedSeats, movieInfo, totalSeatPrice } = state || {};
  const { others, loading, error } = useSelector((state) => state.other);

  const [selectedCombos, setSelectedCombos] = useState({});

  const safeMovieInfo = {
    movieName: movieInfo?.movieName || "Không có thông tin",
    galaxyName: movieInfo?.galaxyName || "Không có thông tin",
    date: movieInfo?.date || "Không có thông tin",
    time: movieInfo?.time || "Không có thông tin",
    galaxyId: localStorage.getItem("selectedGalaxyId") || null, // Retrieve galaxyId from localStorage
  };

  useEffect(() => {
    console.log("State Received:", state);
    console.log("MovieInfo:", movieInfo);
    console.log("SafeMovieInfo:", safeMovieInfo);

    if (!state || !showtimeId || !selectedSeats || !movieInfo) {
      toast.error("Vui lòng chọn suất chiếu và ghế trước khi chọn combo");
      navigate("/select-showtime");
      return;
    }

    if (safeMovieInfo.galaxyId == null) {
      toast.warn("Không tìm thấy galaxyId, tải tất cả combo");
      dispatch(fetchOthers());
    } else {
      dispatch(fetchOtherByGalaxyId(safeMovieInfo.galaxyId));
    }

    return () => {
      dispatch(clearOtherState());
    };
  }, [
    showtimeId,
    selectedSeats,
    movieInfo,
    navigate,
    dispatch,
    safeMovieInfo.galaxyId,
  ]);

  useEffect(() => {
    if (others.length > 0 && Object.keys(selectedCombos).length === 0) {
      const initialCombos = others.reduce((acc, combo) => {
        acc[combo.id] = 0;
        return acc;
      }, {});
      setSelectedCombos(initialCombos);
    }
  }, [others]);

  const handleQuantityChange = (comboId, delta) => {
    setSelectedCombos((prev) => {
      const newQuantity = Math.max(0, (prev[comboId] || 0) + delta);
      return { ...prev, [comboId]: newQuantity };
    });
  };

  const calculateComboTotal = () => {
    return others.reduce((total, combo) => {
      const quantity = selectedCombos[combo.id] || 0;
      return total + quantity * (combo.price || 0);
    }, 0);
  };

  const calculateGrandTotal = () => {
    return (totalSeatPrice || 0) + calculateComboTotal();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const handleConfirmBooking = async () => {
    console.log("handleConfirmBooking - Input data:", {
      selectedSeats,
      safeMovieInfo,
      showtimeId,
      totalSeatPrice,
      selectedCombos,
    });

    if (!selectedSeats || selectedSeats.length === 0) {
      toast.error("Vui lòng chọn ít nhất một ghế");
      navigate("/select-showtime");
      return;
    }

    if (safeMovieInfo.galaxyId == null) {
      toast.error("Thiếu thông tin galaxyId, vui lòng thử lại");
      navigate("/select-showtime");
      return;
    }

    // Kiểm tra trạng thái ghế trước khi đặt
    try {
      for (const seatRoom of selectedSeats) {
        if (!seatRoom.id) {
          toast.error(`Ghế ${seatRoom.seat?.name || "N/A"} thiếu ID`);
          return;
        }
        console.log("Checking seatRoom status:", { seatRoomId: seatRoom.id });
        const response = await axiosClient.get(
          `/getSeatRoomById?seatRoomId=${seatRoom.id}`
        );
        if (response.data.status === "BOOKED") {
          toast.error(`Ghế ${seatRoom.seat?.name || "N/A"} đã được đặt`);
          return;
        }
      }

      // Cập nhật trạng thái ghế
      for (const seatRoom of selectedSeats) {
        console.log("Updating seatRoom:", {
          seatRoomId: seatRoom.id,
          status: "BOOKED",
        });
        await axiosClient.put(
          `/putSeatRoomStatus?seatRoomId=${seatRoom.id}&status=BOOKED`
        );
      }

      // Chuẩn bị comboItems
      const comboItems = Object.entries(selectedCombos)
        .filter(([_, quantity]) => quantity > 0)
        .map(([comboId, quantity]) => ({
          comboId: parseInt(comboId),
          quantity,
          name:
            others.find((combo) => combo.id === parseInt(comboId))?.name ||
            "Unknown",
        }));

      console.log("Navigating to /payment with state:", {
        showtimeId,
        selectedSeats,
        movieInfo: safeMovieInfo,
        totalSeatPrice,
        comboItems,
        totalComboPrice: calculateComboTotal(),
      });

      navigate("/payment", {
        state: {
          showtimeId,
          selectedSeats,
          movieInfo: safeMovieInfo,
          totalSeatPrice,
          comboItems,
          totalComboPrice: calculateComboTotal(),
        },
      });
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái ghế:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      toast.error(error.response?.data?.message || "Đã xảy ra lỗi khi đặt vé");
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>Đã xảy ra lỗi khi tải combo: {error.message || error}</p>
          <button
            className="mt-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
            onClick={() =>
              safeMovieInfo.galaxyId == null
                ? dispatch(fetchOthers())
                : dispatch(fetchOtherByGalaxyId(safeMovieInfo.galaxyId))
            }
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  if (!selectedSeats || !movieInfo) {
    return <div className="container mx-auto px-4 py-8">Đang tải...</div>;
  }

  console.log("State Received:", state);
  console.log("MovieInfo:", movieInfo);
  console.log("SafeMovieInfo:", safeMovieInfo);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">{safeMovieInfo.movieName}</h1>
        <p className="text-lg">
          {safeMovieInfo.galaxyName} | {safeMovieInfo.date} |{" "}
          {safeMovieInfo.time}
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="md:w-2/3">
          <h2 className="text-xl font-bold mb-4">Chọn combo</h2>
          {others.length > 0 ? (
            <div className="space-y-4">
              {others.map((combo) => (
                <div
                  key={combo.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div>
                    <h3 className="font-medium">{combo.name}</h3>
                    <p className="text-sm text-gray-600">{combo.description}</p>
                    <p className="text-sm font-bold">
                      {formatCurrency(combo.price)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center"
                      onClick={() => handleQuantityChange(combo.id, -1)}
                    >
                      -
                    </button>
                    <span className="w-8 text-center">
                      {selectedCombos[combo.id] || 0}
                    </span>
                    <button
                      className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center"
                      onClick={() => handleQuantityChange(combo.id, 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">Không có combo nào tại rạp này</p>
          )}
        </div>

        <div className="md:w-1/3 bg-white p-6 rounded-lg shadow-md md:sticky md:top-4 max-w-sm mx-auto md:mx-0">
          <div className="border-b pb-4 mb-4">
            <h2 className="text-xl font-bold mb-4">Thông tin đặt vé</h2>
            <div className="space-y-2">
              <p>
                <span className="font-medium">Phim:</span>{" "}
                {safeMovieInfo.movieName}
              </p>
              <p>
                <span className="font-medium">Rạp:</span>{" "}
                {safeMovieInfo.galaxyName}
              </p>
              <p>
                <span className="font-medium">Ngày chiếu:</span>{" "}
                {safeMovieInfo.date}
              </p>
              <p>
                <span className="font-medium">Giờ chiếu:</span>{" "}
                {safeMovieInfo.time}
              </p>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-bold mb-4">Ghế đã chọn</h2>
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
            <div className="space-y-2 border-t pt-4">
              {selectedSeats.map((seatRoom) => (
                <div key={seatRoom.id} className="flex justify-between">
                  <span>{seatRoom.seat?.name || "N/A"}:</span>
                  <span>{formatCurrency(seatRoom.seat?.price || 0)}</span>
                </div>
              ))}
              <div className="flex justify-between font-bold border-t pt-2 mt-2">
                <span>Tổng tiền vé:</span>
                <span>{formatCurrency(totalSeatPrice)}</span>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-bold mb-4">Combo đã chọn</h2>
            {Object.entries(selectedCombos).some(([_, qty]) => qty > 0) ? (
              <div className="space-y-2 border-t pt-4">
                {others
                  .filter((combo) => selectedCombos[combo.id] > 0)
                  .map((combo) => (
                    <div key={combo.id} className="flex justify-between">
                      <span>
                        {combo.name} x {selectedCombos[combo.id]}
                      </span>
                      <span>
                        {formatCurrency(combo.price * selectedCombos[combo.id])}
                      </span>
                    </div>
                  ))}
                <div className="flex justify-between font-bold border-t pt-2 mt-2">
                  <span>Tổng tiền combo:</span>
                  <span>{formatCurrency(calculateComboTotal())}</span>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 mb-4">Chưa chọn combo nào</p>
            )}
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between font-bold text-lg">
              <span>Tổng cộng:</span>
              <span>{formatCurrency(calculateGrandTotal())}</span>
            </div>
          </div>

          <button
            className="w-full py-3 mt-6 rounded-lg text-white font-bold bg-blue-600 hover:bg-blue-700 md:static fixed bottom-0 left-0 right-0 md:mx-0 mx-4 mb-4 md:mb-0 z-10 md:z-auto"
            onClick={handleConfirmBooking}
          >
            Tiếp tục thanh toán
          </button>
        </div>
      </div>
    </div>
  );
};

export default Other;
