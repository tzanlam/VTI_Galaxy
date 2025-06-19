import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import seatRoomService from "../../services/seatRoomService";

export const fetchSeatRooms = createAsyncThunk(
  "seatRoom/fetchSeatRooms",
  async (_, { rejectWithValue }) => {
    try {
      const response = await seatRoomService.fetchSeatRooms();
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || "Lỗi khi lấy danh sách ghế phòng"
      );
    }
  }
);

export const fetchSeatRoomsByShowtimeId = createAsyncThunk(
  "seatRoom/fetchSeatRoomsByShowtimeId",
  async (showtimeId, { rejectWithValue }) => {
    try {
      const response = await seatRoomService.fetchSeatRoomsByShowtimeId(
        showtimeId
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data ||
          "Lỗi khi lấy danh sách ghế phòng theo suất chiếu"
      );
    }
  }
);

export const updateSeatRoomStatus = createAsyncThunk(
  "seatRoom/updateSeatRoomStatus",
  async ({ seatRoomId, status }, { rejectWithValue }) => {
    try {
      const response = await seatRoomService.updateSeatRoomStatus(
        seatRoomId,
        status
      );
      return { id: seatRoomId, status, data: response.data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Lỗi khi cập nhật trạng thái ghế"
      );
    }
  }
);

export const fetchSeatRoomById = createAsyncThunk(
  "seatRoom/fetchSeatRoomById",
  async (seatRoomId, { rejectWithValue }) => {
    try {
      return (await seatRoomService.fetchSeatById(seatRoomId)).data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const createSeatRoom = createAsyncThunk(
  "seatRoom/createSeatRoom",
  async (request, { rejectWithValue }) => {
    try {
      return (await seatRoomService.createSeatRoom(request)).data;
    } catch (error) {
      return rejectWithValue(error.data);
    }
  }
);

export const updateSeatRoomName = createAsyncThunk(
  "seatRoom/update",
  async ({ seatRoomId, name }, { rejectWithValue }) => {
    try {
      return (await seatRoomService.updateNameSeatRoom(seatRoomId, name)).data;
    } catch (err) {
      return rejectWithValue(err.data);
    }
  }
);

const seatRoomSlice = createSlice({
  name: "seatRoom",
  initialState: {
    seatRoom: null,
    seatRooms: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearSeatRoomState: (state) => {
      state.seatRoom = null;
      state.seatRooms = [];
      state.loading = false;
      state.error = null;
    },
    selectSeatRoom: (state, action) => {
      const seatRoomId = action.payload;
      const seatRoom = state.seatRooms.find((sr) => sr.id === seatRoomId);
      if (seatRoom && seatRoom.status === "AVAILABLE") {
        seatRoom.status = "SELECTED";
      }
    },
    unselectSeatRoom: (state, action) => {
      const seatRoomId = action.payload;
      const seatRoom = state.seatRooms.find((sr) => sr.id === seatRoomId);
      if (seatRoom && seatRoom.status === "SELECTED") {
        seatRoom.status = "AVAILABLE";
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // fetch seat rooms
      .addCase(fetchSeatRooms.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSeatRooms.fulfilled, (state, action) => {
        state.seatRooms = action.payload;
        state.loading = false;
      })
      .addCase(fetchSeatRooms.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      // fetch seat rooms by showtime id
      .addCase(fetchSeatRoomsByShowtimeId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSeatRoomsByShowtimeId.fulfilled, (state, action) => {
        state.seatRooms = action.payload;
        state.loading = false;
      })
      .addCase(fetchSeatRoomsByShowtimeId.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      // update seat room status
      .addCase(updateSeatRoomStatus.fulfilled, (state, action) => {
        const { id, status } = action.payload;
        const seatRoom = state.seatRooms.find((sr) => sr.id === id);
        if (seatRoom) {
          seatRoom.status = status;
        }
      });
  },
});

export const { clearSeatRoomState, selectSeatRoom, unselectSeatRoom } =
  seatRoomSlice.actions;
export default seatRoomSlice.reducer;
