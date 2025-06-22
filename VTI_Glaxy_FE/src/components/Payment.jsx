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
        window.location.href = paymentResponse.data.redirectUrl;
      } else {
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
      toast.error(
        "Lỗi khi xử lý thanh toán: " +
          (err.response?.data?.message || err.message)
      );
    }
  };

  return (
    <div className="payment-container p-4 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Thanh Toán</h2>

      <div className="order-summary mb-6 p-4 border rounded">
        <h3 className="text-lg font-semibold">Tóm tắt đơn hàng</h3>
        <p>Phim: {safeMovieInfo.movieName || "N/A"}</p>
        <p>Rạp: {safeMovieInfo.galaxyName || "N/A"}</p>
        <p>
          Thời gian: {safeMovieInfo.date} {safeMovieInfo.time}
        </p>
        <p>
          Ghế:{" "}
          {selectedSeats
            ?.map((seat) => seat.seat?.name || seat.name)
            .join(", ") || "N/A"}
        </p>
        <p>
          Combo:{" "}
          {comboItems
            ?.map((item) => `${item.name} x${item.quantity}`)
            .join(", ") || "Không có"}
        </p>
        <p>Tổng tiền vé: {totalSeatPrice?.toLocaleString()} VNĐ</p>
        <p>Tổng tiền combo: {totalComboPrice?.toLocaleString()} VNĐ</p>
        <p>
          Giảm giá:{" "}
          {voucher ? voucher.discountAmount?.toLocaleString() || 0 : 0} VNĐ
        </p>
        <p className="font-bold">
          Tổng cộng: {finalPrice.toLocaleString()} VNĐ
        </p>
      </div>

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
        <h3 className="text-lg font-semibold mb-2">Phương thức thanh toán</h3>
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
              value="BANK_TRANSFER"
              checked={paymentMethod === "BANK_TRANSFER"}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            Chuyển khoản ngân hàng
          </label>
        </div>
      </div>

      <button
        onClick={handleConfirmPayment}
        className="p-2 bg-green-500 text-white rounded hover:bg-green-600 w-full"
      >
        Xác nhận thanh toán
      </button>
    </div>
  );
};

export default Payment;
