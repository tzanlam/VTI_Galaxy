import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import axiosClient from "../services/axiosClient";
import { fetchVoucher, resetVoucher } from "../redux/slices/voucherSlice";

const Payment = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();

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
  const [paymentMethod, setPaymentMethod] = useState("VNPAY");
  const [finalPrice, setFinalPrice] = useState(totalPrice);

  const { voucher, loading, error } = useSelector((state) => state.voucher);
  const { isLoggedIn } = useSelector((state) => state.auth);

  useEffect(() => {
    // Handle VNPay return
    const vnpResponseCode = searchParams.get("vnp_TransactionStatus");
    if (vnpResponseCode) {
      (async () => {
        try {
          console.log(
            "Processing VNPay return, transaction status:",
            vnpResponseCode
          );
          const response = await axiosClient.get(
            "/vnpay-payment?" + searchParams.toString()
          );
          console.log("VNPay response:", response.data);
          if (response.data.status === "success") {
            for (const seatRoom of selectedSeats) {
              await axiosClient.put(
                `/putSeatRoomStatus?seatRoomId=${seatRoom.id}&status=BOOKED`
              );
            }
            toast.success("Thanh toán VNPay thành công!");
            navigate("/");
          } else {
            for (const seatRoom of selectedSeats) {
              await axiosClient.put(
                `/putSeatRoomStatus?seatRoomId=${seatRoom.id}&status=AVAILABLE`
              );
            }
            toast.error(response.data.message || "Thanh toán VNPay thất bại");
            navigate("/seat-selection");
          }
        } catch (err) {
          console.error("VNPay return error:", {
            message: err.message,
            response: err.response?.data,
            status: err.response?.status,
          });
          for (const seatRoom of selectedSeats) {
            await axiosClient
              .put(
                `/putSeatRoomStatus?seatRoomId=${seatRoom.id}&status=AVAILABLE`
              )
              .catch((rollbackErr) => {
                console.error("Rollback error:", rollbackErr);
                toast.error(
                  `Lỗi khi đặt lại trạng thái ghế ${seatRoom.name || "N/A"}`
                );
              });
          }
          toast.error("Lỗi khi xử lý phản hồi từ VNPay");
          navigate("/seat-selection");
        }
      })();
      return;
    }

    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!isLoggedIn || !token) {
      toast.error("Vui lòng đăng nhập để thực hiện thanh toán");
      navigate("/");
      return;
    }

    if (
      !safeMovieInfo.galaxyId ||
      !selectedSeats ||
      selectedSeats.length === 0 ||
      !showtimeId
    ) {
      console.error("Missing required data:", {
        safeMovieInfo,
        selectedSeats,
        showtimeId,
      });
      toast.warn("Thiếu thông tin đặt vé, vui lòng thử lại");
      navigate("/seat-selection");
      return;
    }

    const setSeatsToSelected = async () => {
      try {
        for (const seatRoom of selectedSeats) {
          if (!seatRoom.id) {
            console.error("Invalid seatRoom data:", seatRoom);
            toast.error(`Ghế ${seatRoom.name || "N/A"} thiếu ID`);
            navigate("/seat-selection");
            return;
          }
          await axiosClient.put(
            `/putSeatRoomStatus?seatRoomId=${seatRoom.id}&status=SELECTED`
          );
        }
      } catch (err) {
        console.error("Error setting seats to SELECTED:", {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status,
        });
        toast.error("Lỗi khi tạm giữ ghế, vui lòng thử lại");
        navigate("/seat-selection");
      }
    };

    setSeatsToSelected();

    return () => {
      const rollbackSeats = async () => {
        try {
          for (const seatRoom of selectedSeats) {
            if (seatRoom.id) {
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
  }, [
    safeMovieInfo,
    selectedSeats,
    navigate,
    isLoggedIn,
    showtimeId,
    searchParams,
  ]);

  useEffect(() => {
    if (voucher) {
      const discount = voucher.discountAmount || 0;
      setFinalPrice(totalPrice - discount);
      toast.success(
        `Áp dụng mã ${voucherCode} thành công! Giảm ${formatCurrency(discount)}`
      );
    }
    if (error) {
      toast.error(error);
      dispatch(resetVoucher());
    }
  }, [voucher, error, totalPrice, voucherCode, dispatch]);

  const handleApplyVoucher = async () => {
    if (!voucherCode) {
      toast.error("Vui lòng nhập mã khuyến mãi");
      return;
    }
    try {
      dispatch(fetchVoucher({ code: voucherCode, totalPrice }));
    } catch (err) {
      console.error("Voucher error:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
      });
      toast.error("Mã khuyến mãi không hợp lệ");
    }
  };

  const handleConfirmPayment = async () => {
    console.log("handleConfirmPayment - Input data:", {
      showtimeId,
      selectedSeats,
      safeMovieInfo,
      totalSeatPrice,
      comboItems,
      totalComboPrice,
      paymentMethod,
      voucher,
      totalPrice,
      finalPrice,
    });

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
      toast.info("Đang xử lý thanh toán, vui lòng đợi...");
      for (const seatRoom of selectedSeats) {
        if (!seatRoom.id) {
          console.error("Invalid seatRoom data:", seatRoom);
          toast.error(`Ghế ${seatRoom.name || "N/A"} thiếu ID`);
          navigate("/seat-selection");
          return;
        }
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
      const userInfo = JSON.parse(localStorage.getItem("user") || "{}");
      const accountId = parseInt(userInfo.id);

      if (!userInfo.id || isNaN(accountId)) {
        console.error("Invalid user info:", userInfo);
        toast.error(
          "Không tìm thấy thông tin tài khoản hợp lệ, vui lòng đăng nhập lại"
        );
        navigate("/");
        return;
      }

      if (!showtimeId || isNaN(parseInt(showtimeId))) {
        console.error("Invalid showtimeId:", showtimeId);
        toast.error("Thiếu thông tin suất chiếu, vui lòng chọn lại");
        navigate("/seat-selection");
        return;
      }

      if (!safeMovieInfo.galaxyId || isNaN(parseInt(safeMovieInfo.galaxyId))) {
        console.error("Invalid galaxyId:", safeMovieInfo.galaxyId);
        toast.error("Thiếu thông tin rạp chiếu, vui lòng thử lại");
        navigate("/seat-selection");
        return;
      }

      const seatRoomIdsAsString = seatRoomIds.map((id) => String(id));
      const galaxyIdAsInt = parseInt(safeMovieInfo.galaxyId);
      const showtimeIdAsInt = parseInt(showtimeId);

      const bookingRequest = {
        accountId: accountId,
        galaxyId: galaxyIdAsInt,
        showtimeId: showtimeIdAsInt,
        seatRoomIds: seatRoomIdsAsString,
        otherIds: comboItems
          ? comboItems.map((item) => String(item.comboId))
          : [],
        voucherId: voucher ? parseInt(voucher.id) : null,
        paymentMethod: paymentMethod,
        status: "PENDING",
      };

      console.log("Sending booking request to /postBooking:", bookingRequest);

      const bookingResponse = await axiosClient.post(
        "/postBooking",
        bookingRequest
      );

      console.log("Booking response:", bookingResponse.data);

      if (bookingResponse.data.redirectUrl) {
        toast.success("Đang chuyển hướng đến trang thanh toán VNPay...");
        window.location.href = bookingResponse.data.redirectUrl;
      } else {
        if (paymentMethod === "VNPAY") {
          console.error(
            "VNPay redirectUrl missing in response:",
            bookingResponse.data
          );
          throw new Error(
            `Không nhận được URL thanh toán VNPay từ server. Response: ${JSON.stringify(
              bookingResponse.data
            )}`
          );
        }
        for (const seatRoom of selectedSeats) {
          await axiosClient.put(
            `/putSeatRoomStatus?seatRoomId=${seatRoom.id}&status=BOOKED`
          );
        }
        toast.success("Đặt vé thành công!");
        navigate("/");
      }
    } catch (err) {
      console.error("Payment error:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        bookingResponse: err.message.includes("Không nhận được URL thanh toán")
          ? bookingResponse?.data
          : undefined,
      });

      for (const seatRoom of selectedSeats) {
        await axiosClient
          .put(`/putSeatRoomStatus?seatRoomId=${seatRoom.id}&status=AVAILABLE`)
          .catch((rollbackErr) => {
            console.error("Rollback error:", rollbackErr);
            toast.error(
              `Lỗi khi đặt lại trạng thái ghế ${seatRoom.name || "N/A"}`
            );
          });
      }

      let errorMessage = "Lỗi khi xử lý thanh toán";
      const status = err.status || err.response?.status;

      if (status === 401) {
        errorMessage =
          err.message || "Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại";
        navigate("/");
      } else if (status === 403) {
        errorMessage = err.message || "Bạn không có quyền thực hiện thanh toán";
      } else if (status === 400) {
        errorMessage =
          err.message ||
          err.response?.data?.message ||
          "Thông tin thanh toán không hợp lệ";
      } else if (status === 500) {
        errorMessage = err.message || "Lỗi máy chủ, vui lòng thử lại sau";
      } else {
        errorMessage =
          err.message ||
          err.response?.data?.message ||
          `Lỗi thanh toán VNPay: ${err.message}`;
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
          onClick={() => navigate(-1)}
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
