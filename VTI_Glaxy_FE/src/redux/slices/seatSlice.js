import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import seatService from "../../services/seatService";

// Async thunk để lấy danh sách ghế theo suất chiếu
export const fetchSeats = createAsyncThunk(
  "seat/fetchSeats",
  async (showTimeId, { rejectWithValue }) => {
    try {
      // Sử dụng service để gọi API
      const response = await seatService.fetchSeatByShowTimeId(showTimeId);
      return response.data;
    } catch (error) {
      console.error("Lỗi khi lấy thông tin ghế:", error);
      return rejectWithValue(
        error.response?.data?.message || "Không thể lấy thông tin ghế"
      );
    }
  }
);

// Slice
const seatSlice = createSlice({
  name: "seat",
  initialState: {
    seats: [],
    selectedSeats: [],
    loading: false,
    error: null,
  },
  reducers: {
    selectSeat: (state, action) => {
      const seat = action.payload;
      const isSelected = state.selectedSeats.some((s) => s.id === seat.id);

      if (isSelected) {
        state.selectedSeats = state.selectedSeats.filter(
          (s) => s.id !== seat.id
        );
      } else {
        state.selectedSeats.push(seat);
      }
    },
    resetSelectedSeats: (state) => {
      state.selectedSeats = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSeats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSeats.fulfilled, (state, action) => {
        state.loading = false;
        state.seats = action.payload;
      })
      .addCase(fetchSeats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Đã xảy ra lỗi khi lấy thông tin ghế";
      });
  },
});

// Đảm bảo export các actions từ slice
export const { selectSeat, resetSelectedSeats } = seatSlice.actions;

// Export reducer
export default seatSlice.reducer;
