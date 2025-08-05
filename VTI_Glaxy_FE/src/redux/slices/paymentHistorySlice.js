import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import bookingService from "../../services/bookingService";

export const fetchPaymentHistory = createAsyncThunk(
  "paymentHistory/fetchPaymentHistory",
  async (accountId, { rejectWithValue }) => {
    try {
      console.log("Đang lấy lịch sử thanh toán cho accountId:", accountId);
      if (!accountId || isNaN(accountId)) {
        throw new Error("ID tài khoản không hợp lệ");
      }
      const response = await bookingService.fetchBookingsByAccountId(accountId);
      console.log("Phản hồi API:", response.data);
      if (!Array.isArray(response.data)) {
        console.warn("Dữ liệu không phải mảng:", response.data);
        return [];
      }
      const transformedData = response.data.map((booking) => ({
        id: booking.id,
        orderId: booking.id,
        account: {
          username: booking.account?.username || "Không xác định",
          email: booking.account?.email || "Không xác định",
        },
        movieName: booking.showTime?.movie?.name || "Không xác định",
        galaxyName: booking.galaxy?.name || "Không xác định",
        showDate: booking.showTime?.startTime || null,
        seats: booking.seatRooms?.map((seat) => seat.name) || [],
        totalPrice: booking.totalPrice || 0,
        paymentMethod: booking.paymentMethod || "Không xác định",
        status: booking.status || "Không xác định",
        createdAt: booking.createdAt || null,
      }));
      return transformedData;
    } catch (err) {
      console.error("Lỗi API:", err);
      const errorMessage =
        err.response?.status === 404
          ? "Không tìm thấy endpoint lịch sử thanh toán"
          : err.response?.data?.error ||
            err.response?.data?.message ||
            err.message ||
            "Lỗi khi lấy lịch sử thanh toán";
      return rejectWithValue(errorMessage);
    }
  }
);

const paymentHistorySlice = createSlice({
  name: "paymentHistory",
  initialState: {
    payments: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearPaymentHistory: (state) => {
      state.payments = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPaymentHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPaymentHistory.fulfilled, (state, action) => {
        state.payments = action.payload;
        state.loading = false;
      })
      .addCase(fetchPaymentHistory.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});

export const { clearPaymentHistory } = paymentHistorySlice.actions;
export default paymentHistorySlice.reducer;
