import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import seatRoomService from "../../services/seatRoomService";

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

export const fetchSeatRoomByRoomId = createAsyncThunk("seatRoom/fetchSeatRoomByRoomId", async (roomId, { rejectWithValue }) => {
  try {
    return (await seatRoomService.fetchSeatRoomByRoomId(roomId)).data
  } catch (error) {
    return rejectWithValue(
      error.response?.data?.message || "Lỗi khi lấy thông tin ghế phòng"

    )
  }
})
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
      .addCase(fetchSeatRoomByRoomId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSeatRoomByRoomId.fulfilled, (state, action) => {
        state.seatRooms = Array.isArray(action.payload) ? action.payload : [];
        state.loading = false;
      })
      .addCase(fetchSeatRoomByRoomId.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
        state.seatRooms = [];
      })
  },
});

export const { clearSeatRoomState, selectSeatRoom, unselectSeatRoom } =
  seatRoomSlice.actions;
export default seatRoomSlice.reducer;
