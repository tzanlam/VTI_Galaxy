import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import bookingService from "../../services/bookingService";
import axiosClient from "../../services/axiosClient";

export const fetchPaymentHistory = createAsyncThunk(
  "paymentHistory/fetchPaymentHistory",
  async (accountId, { rejectWithValue }) => {
    try {
      // Sử dụng endpoint có sẵn từ bookingService
      const response = await bookingService.fetchBookingsByAccountId(accountId);
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Lỗi khi lấy lịch sử thanh toán"
      );
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
