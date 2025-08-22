import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import roomService from "../../services/roomService";

export const fetchRooms = createAsyncThunk(
  "room/fetchRooms",
  async (rejectWithValue) => {
    try {
      return (await roomService.fetchRooms()).data;
    } catch (error) {
      return rejectWithValue(error.data);
    }
  }
);

export const fetchRoomByShowTime = createAsyncThunk(
  "room/fetchRoomByShowTime",
  async ({ movieId, galaxyId, time, date }, { rejectWithValue }) => {
    try {
      console.log("fetchRoomByShowTime called with:", {
        movieId,
        galaxyId,
        time,
        date,
      });

      // Validate parameters
      if (!galaxyId || !movieId || !time || !date) {
        return rejectWithValue("Thiếu tham số bắt buộc");
      }

      if (!galaxyId || isNaN(galaxyId) || galaxyId === null || galaxyId <= 0) {
        return rejectWithValue("galaxyId không hợp lệ");
      }
      if (!movieId || isNaN(movieId) || movieId === null || movieId <= 0) {
        return rejectWithValue("movieId không hợp lệ");
      }
      return (
        await roomService.fetchRoomByShowTime(movieId, galaxyId, time, date)
      ).data;
    } catch (error) {
      console.error("API Error:", error.response?.data);
      return rejectWithValue(
        error.response?.data?.message || "Không tìm thấy phòng"
      );
    }
  }
);

export const fetchRoomById = createAsyncThunk(
  "room/fetchRoomById",
  async (roomId, { rejectWithValue }) => {
    try {
      return (await roomService.fetchRoomById(roomId)).data;
    } catch (err) {
      return rejectWithValue(err.data);
    }
  }
);

export const fetchRoomByGalaxy = createAsyncThunk(
  "room/fetchRoomByGalaxyId",
  async (galaxyId, { rejectWithValue }) => {
    try {
      return (await roomService.fetchRoomByGalaxy(galaxyId)).data;
    } catch (err) {
      return rejectWithValue(err.data.message);
    }
  }
);

export const createRoom = createAsyncThunk(
  "room/createRoom",
  async (request, { rejectWithValue }) => {
    try {
      return (await roomService.createRoom(request)).data;
    } catch (err) {
      return rejectWithValue(err.data.message);
    }
  }
);

export const updateRoom = createAsyncThunk(
  "room/updateRoom",
  async ({ roomId, request }, { rejectWithValue }) => {
    try {
      return (await roomService.updateRoom(roomId, request)).data;
    } catch (err) {
      return rejectWithValue(err.data.message);
    }
  }
);

export const deleteRoom = createAsyncThunk(
  "room/deleteRoom",
  async (roomId, { rejectWithValue }) => {
    try {
      return (await roomService.deleteRoom(roomId)).data;
    } catch (err) {
      return rejectWithValue(err.data.message);
    }
  }
);

const roomSlice = createSlice({
  name: "room",
  initialState: {
    roomId: null,
    room: null,
    rooms: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearRoomState: (state) => {
      (state.roomId = null),
        (state.room = null),
        (state.rooms = []),
        (state.loading = false),
        (state.error = null);
    },
  },
  extraReducers: (builder) => {
    builder
      // fetch Rooms
      .addCase(fetchRooms.pending, (state) => {
        (state.loading = true), (state.error = null);
      })
      .addCase(fetchRooms.fulfilled, (state, action) => {
        (state.loading = false),
          console.log("data reducer fetchRooms", action.payload);

        state.rooms = action.payload;
      })
      .addCase(fetchRooms.rejected, (state, action) => {
        (state.loading = false), (state.error = action.payload);
      })
      // fetch Room by showtime
      .addCase(fetchRoomByShowTime.pending, (state) => {
        (state.loading = true), (state.error = null);
      })
      .addCase(fetchRoomByShowTime.fulfilled, (state, action) => {
        state.loading = false;
        console.log("data reducer fetchRoomByShowTime", action.payload);
        state.roomId = action.payload; // Sửa từ state.rooms thành state.room
      })
      .addCase(fetchRoomByShowTime.rejected, (state, action) => {
        (state.loading = false), (state.error = action.payload);
      })
      // fetchRoom ByID
      .addCase(fetchRoomById.pending, (state) => {
        (state.loading = true), (state.error = null);
      })
      .addCase(fetchRoomById.fulfilled, (state, action) => {
        (state.loading = false), (state.room = action.payload);
      })
      .addCase(fetchRoomById.rejected, (state, action) => {
        (state.loading = false), (state.error = action.payload);
      })
      // fetch Room By galaxyID
      .addCase(fetchRoomByGalaxy.pending, (state) => {
        (state.loading = true), (state.error = null);
      })
      .addCase(fetchRoomByGalaxy.fulfilled, (state, action) => {
        (state.loading = false), (state.rooms = action.payload);
      })
      .addCase(fetchRoomByGalaxy.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // create
      .addCase(createRoom.pending, (state) => {
        (state.loading = true), (state.error = null);
      })
      .addCase(createRoom.fulfilled, (state, action) => {
        (state.loading = false), (state.room = action.payload);
      })
      .addCase(createRoom.rejected, (state, action) => {
        (state.loading = false), (state.error = action.payload);
      })
      // update
      .addCase(updateRoom.pending, (state) => {
        (state.loading = true), (state.error = null);
      })
      .addCase(updateRoom.fulfilled, (state, action) => {
        (state.loading = false), (state.room = action.payload);
      })
      .addCase(updateRoom.rejected, (action, state) => {
        (state.loading = false), (state.error = action.payload);
      })
      // delete
      .addCase(deleteRoom.pending, (state) => {
        (state.loading = true), (state.error = null);
      })
      .addCase(deleteRoom.fulfilled, (state, action) => {
        (state.loading = false), (state.room = action.playload);
      })
      .addCase(deleteRoom.rejected, (state, action) => {
        (state.loading = false), (state.error = action.payload);
      });
  },
});

export const { clearRoomState } = roomSlice.reducer;
export default roomSlice.reducer;
