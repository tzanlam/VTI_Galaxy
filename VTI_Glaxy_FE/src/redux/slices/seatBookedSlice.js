import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import seatBookedService from "../../services/seatBookedService";

export const fetchSeatBooked = createAsyncThunk(
  "seatBooked/fetchByRoomAndTime",
  async ({ roomId, time, date }, { rejectWithValue }) => {
    try {
      return (await seatBookedService.fetchSeatBooked(roomId, time, date)).data;
    } catch (error) {
      return rejectWithValue(
        error.data?.message || "lỗi khi fetch trạng thái ghế"
      );
    }
  }
);

const seatBookedSlice = createSlice({
  name: "seatBooked",
  initialState: {
    seatBooked: [],
    error: null,
    loading: false,
  },
  reducers: {
    clearSeatBookedState: (state) => {
      state.seatBooked = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSeatBooked.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSeatBooked.fulfilled, (state, action) => {
        state.loading = false;
        state.seatBooked = action.payload;
      })
      .addCase(fetchSeatBooked.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSeatBookedState } = seatBookedSlice.actions;
export default seatBookedSlice.reducer;
