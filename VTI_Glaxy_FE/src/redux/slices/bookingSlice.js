import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import bookingService from "../../services/bookingService";

export const fetchBookings = createAsyncThunk(
  "booking/fetchBookings",
  async (_, { rejectWithValue }) => {
    try {
      const response = await bookingService.fetchBookings();
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const fetchBookingById = createAsyncThunk(
  "booking/fetchBookingById",
  async (bookingId, { rejectWithValue }) => {
    try {
      const response = await bookingService.fetchBookingById(bookingId);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const createBooking = createAsyncThunk(
  "booking/createBooking",
  async (bookingRequest, { rejectWithValue }) => {
    try {
      const response = await bookingService.createBooking(bookingRequest);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const updateBooking = createAsyncThunk(
  "booking/updateBooking",
  async ({ bookingId, bookingRequest }, { rejectWithValue }) => {
    try {
      const response = await bookingService.updateBooking(
        bookingId,
        bookingRequest
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const deleteBooking = createAsyncThunk(
  "booking/deleteBooking",
  async (bookingId, { rejectWithValue }) => {
    try {
      const response = await bookingService.deleteBooking(bookingId);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const bookingSlice = createSlice({
  name: "booking",
  initialState: {
    booking: null,
    bookings: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearBookingState: (state) => {
      state.booking = null;
      state.bookings = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
        console.log("fetchBookings pending");
      })
      .addCase(fetchBookings.fulfilled, (state, action) => {
        state.bookings = action.payload;
        state.loading = false;
        console.log("fetchBookings fulfilled, bookings:", action.payload);
      })
      .addCase(fetchBookings.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
        console.log("fetchBookings rejected, error:", action.payload);
      })
      .addCase(fetchBookingById.pending, (state) => {
        state.loading = true;
        state.error = null;
        console.log("fetchBookingById pending");
      })
      .addCase(fetchBookingById.fulfilled, (state, action) => {
        state.booking = action.payload;
        state.loading = false;
        console.log("fetchBookingById fulfilled, booking:", action.payload);
      })
      .addCase(fetchBookingById.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
        console.log("fetchBookingById rejected, error:", action.payload);
      })
      .addCase(createBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
        console.log("createBooking pending");
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.bookings.push(action.payload);
        state.loading = false;
        console.log("createBooking fulfilled, new booking:", action.payload);
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
        console.log("createBooking rejected, error:", action.payload);
      })
      .addCase(updateBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
        console.log("updateBooking pending");
      })
      .addCase(updateBooking.fulfilled, (state, action) => {
        const index = state.bookings.findIndex(
          (booking) => booking.id === action.payload.id
        );
        if (index !== -1) {
          state.bookings[index] = action.payload;
        }
        state.loading = false;
        console.log(
          "updateBooking fulfilled, updated booking:",
          action.payload
        );
      })
      .addCase(updateBooking.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
        console.log("updateBooking rejected, error:", action.payload);
      })
      .addCase(deleteBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
        console.log("deleteBooking pending");
      })
      .addCase(deleteBooking.fulfilled, (state, action) => {
        state.bookings = state.bookings.filter(
          (booking) => booking.id !== action.payload
        );
        state.loading = false;
        console.log(
          "deleteBooking fulfilled, removed bookingId:",
          action.payload
        );
      })
      .addCase(deleteBooking.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
        console.log("deleteBooking rejected, error:", action.payload);
      });
  },
});

export const { clearBookingState } = bookingSlice.actions;

export default bookingSlice.reducer;
