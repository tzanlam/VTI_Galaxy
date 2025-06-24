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

  useEffect(() => {
    console.log("Payment.jsx - Received state:", {
      showtimeId,
      selectedSeats,
      movieInfo,
      totalSeatPrice,
      comboItems,
      totalComboPrice,
    });
    if (!safeMovieInfo.galaxyId) {
      toast.warn("Không tìm thấy galaxyId, vui lòng thử lại");
      navigate("/seat-selection");
    }
  }, [safeMovieInfo, navigate]);

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

  const handleConfirmPayment = async () => {
    if (!paymentMethod) {
      toast.error("Vui lòng chọn phương thức thanh toán");
      return;
    }

    try {
      const seatRoomIds = selectedSeats.map((seat) => seat.id);
      const bookingRequest = {
        showTimeId: showtimeId,
        seatRoomIds,
        comboItems: comboItems || [],
        totalPrice: finalPrice,
        galaxyId: safeMovieInfo.galaxyId,
        voucherCode: voucherCode || null,
        paymentMethod,
      };

      const paymentResponse = await axiosClient.post("/api/payment/initiate", {
        bookingRequest,
        paymentMethod,
        amount: finalPrice,
      });

      if (paymentResponse.data.redirectUrl) {
        // Chuyển hướng đến URL thanh toán của VNPay, ZaloPay, hoặc cổng thanh toán khác
        console.log(
          "Redirecting to payment URL:",
          paymentResponse.data.redirectUrl
        );
        window.location.href = paymentResponse.data.redirectUrl;
      } else {
        // Trường hợp thanh toán nội bộ (ví dụ: CREDIT_CARD, BANK_TRANSFER)
        const bookingResponse = await axiosClient.post(
          "/api/booking/create",
          bookingRequest
        );
        toast.success("Đặt vé thành công!");
        navigate("/booking-success", {
          state: { booking: bookingResponse.data },
        });
      }
    } catch (err) {
      console.error("Payment error:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
      });
      toast.error(
        "Lỗi khi xử lý thanh toán: " +
          (err.response?.data?.message || err.message)
      );
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
                    {seatRoom.seat?.name || "N/A"}
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
                    <span>{seatRoom.seat?.name || "N/A"}:</span>
                    <span>{formatCurrency(seatRoom.seat?.price || 0)}</span>
                  </div>
                ))}
                <div className="flex justify-between font-bold border-t pt-2 mt-2">
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
