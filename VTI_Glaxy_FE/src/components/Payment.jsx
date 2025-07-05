import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import axiosClient from "../services/axiosClient";
import { fetchVoucher, resetVoucher } from "../redux/slices/voucherSlice";

const Payment = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    showtimeId,
    selectedSeats,
    movieInfo,
    totalSeatPrice,
    comboItems,
    totalComboPrice,
  } = state || {};
  const safeMovieInfo = movieInfo || {};
  const totalPrice = (totalSeatPrice || 0) + (totalComboPrice || 0);

  const [voucherCode, setVoucherCode] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("CREDIT_CARD");
  const [finalPrice, setFinalPrice] = useState(totalPrice);

  const { voucher, loading, error } = useSelector((state) => state.voucher);
  const { isLoggedIn } = useSelector((state) => state.auth);

  useEffect(() => {
    // Kiểm tra trạng thái đăng nhập
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!isLoggedIn || !token) {
      toast.error("Vui lòng đăng nhập để thực hiện thanh toán");
      navigate("/");
      return;
    }

    console.log("Payment.jsx - Received state:", {
      showtimeId,
      selectedSeats,
      movieInfo,
      totalSeatPrice,
      comboItems,
      totalComboPrice,
    });

    if (
      !safeMovieInfo.galaxyId ||
      !selectedSeats ||
      selectedSeats.length === 0
    ) {
      toast.warn("Thiếu thông tin đặt vé, vui lòng thử lại");
      navigate("/seat-selection");
      return;
    }

    // Đặt trạng thái ghế thành SELECTED khi vào trang thanh toán
    const setSeatsToSelected = async () => {
      try {
        for (const seatRoom of selectedSeats) {
          if (!seatRoom.id) {
            toast.error(`Ghế ${seatRoom.name || "N/A"} thiếu ID`);
            navigate("/seat-selection");
            return;
          }
          console.log("Updating seatRoom to SELECTED:", {
            seatRoomId: seatRoom.id,
          });
          await axiosClient.put(
            `/putSeatRoomStatus?seatRoomId=${seatRoom.id}&status=SELECTED`
          );
        }
      } catch (err) {
        console.error("Error setting seats to SELECTED:", err);
        toast.error("Lỗi khi tạm giữ ghế, vui lòng thử lại");
        navigate("/seat-selection");
      }
    };

    setSeatsToSelected();

    // Rollback trạng thái ghế khi component unmount (quay lại)
    return () => {
      const rollbackSeats = async () => {
        try {
          for (const seatRoom of selectedSeats) {
            if (seatRoom.id) {
              console.log("Rolling back seatRoom to AVAILABLE:", {
                seatRoomId: seatRoom.id,
              });
              await axiosClient.put(
                `/putSeatRoomStatus?seatRoomId=${seatRoom.id}&status=AVAILABLE`
              );
            }
          }
        } catch (err) {
          console.error("Rollback error:", err);
          toast.error("Lỗi khi đặt lại trạng thái ghế");
        }
      };
      rollbackSeats();
    };
  }, [safeMovieInfo, selectedSeats, navigate, isLoggedIn]);

  useEffect(() => {
    if (voucher) {
      const discount = voucher.discountAmount || 0;
      setFinalPrice(totalPrice - discount);
      toast.success(
        `Áp dụng mã ${voucherCode} thành công! Giảm ${discount} VNĐ`
      );
    }
    if (error) {
      toast.error(error);
      dispatch(resetVoucher());
    }
  }, [voucher, error, totalPrice, voucherCode, dispatch]);

  const handleApplyVoucher = async () => {
    console.log("Applying voucher:", { voucherCode, totalPrice });
    if (!voucherCode) {
      toast.error("Vui lòng nhập mã khuyến mãi");
      return;
    }
    try {
      dispatch(fetchVoucher({ code: voucherCode, totalPrice }));
    } catch (err) {
      console.error("Voucher error:", err);
      toast.error("Mã khuyến mãi không hợp lệ");
    }
  };

  const handleConfirmPayment = async () => {
    // Kiểm tra trạng thái đăng nhập trước khi thanh toán
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!isLoggedIn || !token) {
      toast.error("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại");
      navigate("/");
      return;
    }

    if (!paymentMethod) {
      toast.error("Vui lòng chọn phương thức thanh toán");
      return;
    }

    try {
      // Kiểm tra trạng thái ghế trước khi thanh toán
      for (const seatRoom of selectedSeats) {
        console.log("Checking seatRoom status:", { seatRoomId: seatRoom.id });
        const response = await axiosClient.get(
          `/getSeatRoomById?seatRoomId=${seatRoom.id}`
        );
        if (response.data.status === "BOOKED") {
          toast.error(`Ghế ${seatRoom.name || "N/A"} đã được đặt`);
          navigate("/seat-selection");
          return;
        }
      }

      const seatRoomIds = selectedSeats.map((seat) => seat.id);

      // Lấy thông tin user từ localStorage
      const userInfo = JSON.parse(localStorage.getItem("user") || "{}");

      console.log("User info from localStorage:", userInfo);
      console.log("Raw userInfo.id:", userInfo.id, "type:", typeof userInfo.id);

      // Validation dữ liệu trước khi gửi request
      const accountId = parseInt(userInfo.id);
      console.log("Parsed accountId:", accountId, "isNaN:", isNaN(accountId));

      if (!userInfo.id || isNaN(accountId)) {
        console.error("Missing or invalid user ID:", userInfo);
        toast.error(
          "Không tìm thấy thông tin tài khoản hợp lệ, vui lòng đăng nhập lại"
        );
        navigate("/");
        return;
      }

      if (!showtimeId || isNaN(parseInt(showtimeId))) {
        console.error("Missing or invalid showtime ID:", showtimeId);
        toast.error("Thiếu thông tin suất chiếu, vui lòng chọn lại");
        navigate("/seat-selection");
        return;
      }

      // Chuyển đổi các ID thành string array như backend mong đợi
      const seatRoomIdsAsString = seatRoomIds.map((id) => String(id));
      const galaxyIdAsInt = parseInt(safeMovieInfo.galaxyId);
      const showtimeIdAsInt = parseInt(showtimeId);

      const bookingRequest = {
        accountId: accountId,
        galaxyId: galaxyIdAsInt,
        showtimeId: showtimeIdAsInt,
        seatRoomIds: seatRoomIdsAsString,
        otherIds: [],
        voucherId: voucherCode ? parseInt(voucherCode) : null,
        paymentMethod: paymentMethod,
        status: "PENDING",
      };

      console.log("Final booking request:", bookingRequest);
      console.log("AccountId type:", typeof accountId, "value:", accountId);
      console.log(
        "GalaxyId type:",
        typeof galaxyIdAsInt,
        "value:",
        galaxyIdAsInt
      );
      console.log(
        "ShowTimeId type:",
        typeof showtimeIdAsInt,
        "value:",
        showtimeIdAsInt
      );

      console.log("Booking request data:", {
        bookingRequest,
        selectedSeats,
        showtimeId,
        finalPrice,
        galaxyId: safeMovieInfo.galaxyId,
      });

      // Gọi API đặt vé
      const bookingResponse = await axiosClient.post(
        "/postBooking",
        bookingRequest
      );

      if (bookingResponse.data.redirectUrl) {
        // Chuyển hướng đến trang thanh toán bên ngoài
        window.location.href = bookingResponse.data.redirectUrl;
      } else {
        // Thanh toán thành công nội bộ
        // Cập nhật trạng thái ghế và chuyển đến trang chủ
        for (const seatRoom of selectedSeats) {
          console.log("Updating seatRoom to BOOKED:", {
            seatRoomId: seatRoom.id,
          });
          await axiosClient.put(
            `/putSeatRoomStatus?seatRoomId=${seatRoom.id}&status=BOOKED`
          );
        }

        toast.success("Đặt vé thành công!");
        navigate("/"); // Đưa về trang chủ sau khi đặt vé thành công
      }
    } catch (err) {
      console.error("Payment error:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        data: err.data,
        fullError: err,
      });

      // Rollback trạng thái ghế về AVAILABLE nếu thanh toán thất bại
      for (const seatRoom of selectedSeats) {
        console.log("Rolling back seatRoom to AVAILABLE:", {
          seatRoomId: seatRoom.id,
        });
        await axiosClient
          .put(`/putSeatRoomStatus?seatRoomId=${seatRoom.id}&status=AVAILABLE`)
          .catch((rollbackErr) => {
            console.error("Rollback error:", rollbackErr);
            toast.error(
              `Lỗi khi đặt lại trạng thái ghế ${seatRoom.name || "N/A"}`
            );
          });
      }

      // Xử lý các loại lỗi khác nhau
      let errorMessage = "Lỗi khi xử lý thanh toán";

      const status = err.status || err.response?.status;

      if (status === 401) {
        errorMessage =
          err.message || "Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại";
        navigate("/");
        return;
      } else if (status === 403) {
        errorMessage = err.message || "Bạn không có quyền thực hiện thanh toán";
      } else if (status === 400) {
        // Sử dụng thông báo lỗi từ server
        errorMessage =
          err.message ||
          err.data?.message ||
          err.response?.data?.message ||
          "Thông tin thanh toán không hợp lệ";
      } else if (status === 500) {
        errorMessage = err.message || "Lỗi máy chủ, vui lòng thử lại sau";
      } else {
        errorMessage =
          err.message ||
          err.data?.message ||
          err.response?.data?.message ||
          "Đã xảy ra lỗi không xác định";
      }

      toast.error(errorMessage);
      navigate("/seat-selection");
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">{safeMovieInfo.movieName}</h1>
        <p className="text-lg">
          {safeMovieInfo.galaxyName} | {safeMovieInfo.date} |{" "}
          {safeMovieInfo.time}
        </p>
        <button
          className="mt-4 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
          onClick={() => navigate(-1)} // Quay lại trang trước
        >
          Quay lại
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="md:w-2/3">
          <div className="voucher-section mb-6">
            <h3 className="text-lg font-semibold mb-2">Mã khuyến mãi</h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={voucherCode}
                onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                placeholder="Nhập mã khuyến mãi"
                className="p-2 border rounded flex-grow"
              />
              <button
                onClick={handleApplyVoucher}
                disabled={loading}
                className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
              >
                {loading ? "Đang xử lý..." : "Áp dụng"}
              </button>
            </div>
          </div>

          <div className="payment-method-section mb-6">
            <h3 className="text-lg font-semibold mb-2">
              Phương thức thanh toán
            </h3>
            <div className="flex flex-col gap-2">
              <label>
                <input
                  type="radio"
                  value="CREDIT_CARD"
                  checked={paymentMethod === "CREDIT_CARD"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                Thẻ tín dụng/Thẻ ghi nợ
              </label>
              <label>
                <input
                  type="radio"
                  value="MOMO"
                  checked={paymentMethod === "MOMO"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                Ví Momo
              </label>
              <label>
                <input
                  type="radio"
                  value="VNPAY"
                  checked={paymentMethod === "VNPAY"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                VNPay (QR Code/Thẻ ngân hàng)
              </label>
              <label>
                <input
                  type="radio"
                  value="ZALOPAY"
                  checked={paymentMethod === "ZALOPAY"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                ZaloPay
              </label>
              <label>
                <input
                  type="radio"
                  value="BANK_TRANSFER"
                  checked={paymentMethod === "BANK_TRANSFER"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                Chuyển khoản ngân hàng
              </label>
            </div>
          </div>
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
            {selectedSeats?.length > 0 ? (
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedSeats.map((seatRoom) => (
                  <span
                    key={seatRoom.id}
                    className="px-2 py-1 bg-green-100 border border-green-500 rounded-md text-xs"
                  >
                    {seatRoom.name || "N/A"}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 mb-4">Chưa chọn ghế nào</p>
            )}
            {selectedSeats?.length > 0 && (
              <div className="space-y-2 border-t pt-4">
                {selectedSeats.map((seatRoom) => (
                  <div key={seatRoom.id} className="flex justify-between">
                    <span>{seatRoom.name || "N/A"}:</span>
                    <span>{formatCurrency(seatRoom.price || 0)}</span>
                  </div>
                ))}
                <div className="flex guanine-between font-bold border-t pt-2 mt-2">
                  <span>Tổng tiền vé:</span>
                  <span>{formatCurrency(totalSeatPrice || 0)}</span>
                </div>
              </div>
            )}
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-bold mb-4">Combo đã chọn</h2>
            {comboItems?.length > 0 ? (
              <div className="space-y-2 border-t pt-4">
                {comboItems.map((item) => (
                  <div key={item.comboId} className="flex justify-between">
                    <span>
                      {item.name} x {item.quantity}
                    </span>
                    <span>
                      {formatCurrency(item.quantity * (item.price || 0))}
                    </span>
                  </div>
                ))}
                <div className="flex justify-between font-bold border-t pt-2 mt-2">
                  <span>Tổng tiền combo:</span>
                  <span>{formatCurrency(totalComboPrice || 0)}</span>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 mb-4">Chưa chọn combo nào</p>
            )}
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-bold mb-4">Thông tin khuyến mãi</h2>
            <div className="space-y-2 border-t pt-4">
              <div className="flex justify-between">
                <span>Giảm giá:</span>
                <span>{formatCurrency(voucher?.discountAmount || 0)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2">
                <span>Tổng cộng:</span>
                <span>{formatCurrency(finalPrice)}</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleConfirmPayment}
            className="w-full py-3 rounded-lg text-white font-bold bg-green-500 hover:bg-green-600 md:static fixed bottom-0 left-0 right-0 md:mx-0 mx-4 mb-4 md:mb-0 z-10 md:z-auto"
          >
            Xác nhận thanh toán
          </button>
        </div>
      </div>
    </div>
  );
};

export default Payment;
