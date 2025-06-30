import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import seatRoomService from "../../services/seatRoomService";

export const fetchSeatRooms = createAsyncThunk(
  "seatRoom/fetchSeatRooms",
  async (_, { rejectWithValue }) => {
    try {
      const response = await seatRoomService.fetchSeatRooms();
      console.log("fetchSeatRooms response:", response.data);
      return response.data;
    } catch (err) {
      console.error("fetchSeatRooms error:", err);
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
      console.log(
        "fetchSeatRoomsByShowtimeId response for showtimeId",
        showtimeId,
        ":",
        response.data
      );
      return response.data;
    } catch (error) {
      console.error("fetchSeatRoomsByShowtimeId error:", error);
      return rejectWithValue(
        error.response?.data?.message ||
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
      console.error("updateSeatRoomStatus error:", error);
      return rejectWithValue(
        error.response?.data?.message || "Lỗi khi cập nhật trạng thái ghế"
      );
    }
  }
);

export const fetchSeatRoomById = createAsyncThunk(
  "seatRoom/fetchSeatRoomById",
  async (seatRoomId, { rejectWithValue }) => {
    try {
      const response = await seatRoomService.fetchSeatRoomById(seatRoomId);
      return response.data;
    } catch (error) {
      console.error("fetchSeatRoomById error:", error);
      return rejectWithValue(
        error.response?.data?.message || "Lỗi khi lấy thông tin ghế phòng"
      );
    }
  }
);

export const createSeatRoom = createAsyncThunk(
  "seatRoom/createSeatRoom",
  async (seatRoomRequest, { rejectWithValue }) => {
    try {
      const request = {
        id: parseInt(seatRoomRequest.id),
        seatId: parseInt(seatRoomRequest.seatId),
        roomId: parseInt(seatRoomRequest.roomId),
        seatPerRow: parseInt(seatRoomRequest.seatPerRow),
        quantityColumn: parseInt(seatRoomRequest.quantityColumn),
      };
      console.log("Sending SeatRoomRequest:", request);
      const response = await seatRoomService.createSeatRoom(request);
      console.log("createSeatRoom response:", response.data);
      return response.data;
    } catch (error) {
      console.error("createSeatRoom error:", error);
      return rejectWithValue(
        error.response?.data?.message || "Lỗi khi tạo ghế phòng"
      );
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
      .addCase(fetchSeatRooms.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSeatRooms.fulfilled, (state, action) => {
        state.seatRooms = Array.isArray(action.payload) ? action.payload : [];
        state.loading = false;
      })
      .addCase(fetchSeatRooms.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
        state.seatRooms = [];
      })
      .addCase(fetchSeatRoomsByShowtimeId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSeatRoomsByShowtimeId.fulfilled, (state, action) => {
        state.seatRooms = Array.isArray(action.payload) ? action.payload : [];
        state.loading = false;
      })
      .addCase(fetchSeatRoomsByShowtimeId.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
        state.seatRooms = [];
      })
      .addCase(updateSeatRoomStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSeatRoomStatus.fulfilled, (state, action) => {
        const { id, status } = action.payload;
        const seatRoom = state.seatRooms.find((sr) => sr.id === id);
        if (seatRoom) {
          seatRoom.status = status;
        }
        state.loading = false;
      })
      .addCase(updateSeatRoomStatus.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(createSeatRoom.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSeatRoom.fulfilled, (state, action) => {
        state.seatRooms.push(action.payload);
        state.loading = false;
      })
      .addCase(createSeatRoom.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});

export const { clearSeatRoomState, selectSeatRoom, unselectSeatRoom } =
  seatRoomSlice.actions;
export default seatRoomSlice.reducer;
