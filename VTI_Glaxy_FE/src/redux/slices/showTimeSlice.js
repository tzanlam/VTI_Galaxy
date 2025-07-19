import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import showTimeService from "../../services/showTimeService";

export const fetchShowTimes = createAsyncThunk(
  "showtime/fetchShowTimes",
  async (_, { rejectWithValue }) => {
    try {
      const response = await showTimeService.fetchShowTime();
      console.log("fetchShowTimes response:", response.data);
      return response.data;
    } catch (err) {
      console.error("fetchShowTimes error:", err.response?.data);
      return rejectWithValue(
        err.response?.data || "Lỗi khi lấy danh sách lịch chiếu"
      );
    }
  }
);

export const fetchShowTimeByRoom = createAsyncThunk(
  "showTime/fetchShowTimeByRoom",
  async (roomId, { rejectWithValue }) => {
    try {
      return (await showTimeService.fetchShowTimeByRoom(roomId)).data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const fetchShowTimeById = createAsyncThunk(
  "showtime/fetchShowTimeById",
  async (showTimeId, { rejectWithValue }) => {
    try {
      const response = await showTimeService.fetchShowTimeById(showTimeId);
      console.log("fetchShowTimeById response:", response.data);
      return response.data;
    } catch (err) {
      console.error("fetchShowTimeById error:", err.response?.data);
      return rejectWithValue(err.response?.data || "Lỗi khi lấy lịch chiếu");
    }
  }
);

export const fetchShowTimeByRoomAndDate = createAsyncThunk(
  "showtime/fetchByRoomAndDate",
  async ({ roomId, date }, { rejectWithValue }) => {
    try {
      const res = await showTimeService.fetchShowTimeByRoomAndDate(
        roomId,
        date
      );
      const data = res?.data;
      const realData = Array.isArray(data)
        ? data
        : Array.isArray(data?.data)
        ? data.data
        : [data];
      return realData;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Lỗi lấy lịch chiếu theo ngày và phòng"
      );
    }
  }
);

export const fetchShowTimeByMovieDateAndGalaxy = createAsyncThunk(
  "showtime/fetchShowTimeByMovieDateAndGalaxy",
  async ({ galaxyId, movieId, date }, { rejectWithValue }) => {
    try {
      const response = await showTimeService.fetchShowTimeByMovieDateAndGalaxy(
        movieId,
        date,
        galaxyId
      );
      console.log("fetchShowTimeByMovieDateAndGalaxy response:", response.data);
      return Array.isArray(response.data) ? response.data : [response.data];
    } catch (err) {
      console.error(
        "fetchShowTimeByMovieDateAndGalaxy error:",
        err.response?.data
      );
      return rejectWithValue(
        err.response?.data || "Lỗi khi lấy lịch chiếu theo bộ lọc"
      );
    }
  }
);

export const postShowTime = createAsyncThunk(
  "showtime/postShowTime",
  async (showTimeRequest, { rejectWithValue, getState }) => {
    try {
      const { startTime } = getState();
      console.log("postShowTime request:", showTimeRequest);
      console.log("Available startTimes from state:", startTime.startTimes);
      const startTimeIds = Array.isArray(showTimeRequest.startTimes)
        ? showTimeRequest.startTimes
            .map((time) => {
              const st = startTime.startTimes.find(
                (st) => st.startTime === time
              );
              return st ? st.id : null;
            })
            .filter((id) => id !== null)
            .join(",")
        : showTimeRequest.startTimes;
      const response = await showTimeService.createShowTime({
        ...showTimeRequest,
        startTimes: startTimeIds,
      });
      console.log("postShowTime response:", response.data);
      return response.data;
    } catch (err) {
      console.error("postShowTime error:", err.response?.data);
      return rejectWithValue(err.response?.data || "Lỗi khi tạo lịch chiếu");
    }
  }
);

export const updateShowTime = createAsyncThunk(
  "showtime/updateShowTime",
  async ({ showTimeId, showTimeRequest }, { rejectWithValue, getState }) => {
    try {
      const { startTime } = getState();
      console.log("updateShowTime request:", { showTimeId, showTimeRequest });
      console.log("Available startTimes from state:", startTime.startTimes);
      const startTimeIds = Array.isArray(showTimeRequest.startTimes)
        ? showTimeRequest.startTimes
            .map((time) => {
              const st = startTime.startTimes.find(
                (st) => st.startTime === time
              );
              return st ? st.id : null;
            })
            .filter((id) => id !== null)
            .join(",")
        : showTimeRequest.startTimes;
      console.log("Mapped startTimeIds:", startTimeIds);
      const response = await showTimeService.updateShowTime(showTimeId, {
        ...showTimeRequest,
        startTimes: startTimeIds,
      });
      console.log("updateShowTime response:", response.data);
      return response.data;
    } catch (err) {
      console.error("updateShowTime error:", err.response?.data);
      return rejectWithValue(
        err.response?.data || "Lỗi khi cập nhật lịch chiếu"
      );
    }
  }
);

export const deleteShowTime = createAsyncThunk(
  "showtime/deleteShowTime",
  async (showTimeId, { rejectWithValue }) => {
    try {
      console.log("deleteShowTime showTimeId:", showTimeId);
      await showTimeService.deleteShowTime(showTimeId);
      console.log("deleteShowTime success:", showTimeId);
      return showTimeId;
    } catch (err) {
      console.error("deleteShowTime error:", err.response?.data);
      return rejectWithValue(err.response?.data || "Lỗi khi xóa lịch chiếu");
    }
  }
);

const showTimeSlice = createSlice({
  name: "showTime",
  initialState: {
    showTime: null,
    showTimes: [],
    loading: false,
    error: null,
    filters: {},
  },
  reducers: {
    clearShowTimeState: (state) => {
      state.showTime = null;
      state.showTimes = [];
      state.error = null;
      state.filters = {};
      console.log("clearShowTimeState executed, state reset");
    },
    setFilters: (state, action) => {
      state.filters = action.payload;
      console.log("setFilters:", action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchShowTimeByRoomAndDate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchShowTimeByRoomAndDate.fulfilled, (state, action) => {
        state.showTimes = action.payload;
        state.loading = false;
      })
      .addCase(fetchShowTimeByRoomAndDate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // fetch ShowTime By Room
      .addCase(fetchShowTimeByRoom.pending, (state) => {
        (state.loading = true), state.error - null;
      })
      .addCase(fetchShowTimeByRoom.fulfilled, (state, action) => {
        state.loading = false;
        state.showTimes = action.payload;
      })
      .addCase(fetchShowTimeByRoom.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchShowTimes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchShowTimes.fulfilled, (state, action) => {
        state.showTimes = action.payload;
        state.loading = false;
      })
      .addCase(fetchShowTimes.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(fetchShowTimeById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchShowTimeById.fulfilled, (state, action) => {
        state.showTime = action.payload;
        state.loading = false;
      })
      .addCase(fetchShowTimeById.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(fetchShowTimeByMovieDateAndGalaxy.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchShowTimeByMovieDateAndGalaxy.fulfilled, (state, action) => {
        state.showTimes = Array.isArray(action.payload)
          ? action.payload
          : [action.payload];
        state.loading = false;
        console.log(
          "fetchShowTimeByMovieDateAndGalaxy fulfilled, showTimes:",
          action.payload
        );
      })
      .addCase(fetchShowTimeByMovieDateAndGalaxy.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
        console.log(
          "fetchShowTimeByMovieDateAndGalaxy rejected, error:",
          action.payload
        );
      })
      .addCase(postShowTime.pending, (state) => {
        state.loading = true;
        state.error = null;
        console.log("postShowTime pending");
      })
      .addCase(postShowTime.fulfilled, (state, action) => {
        state.showTimes.push(action.payload);
        state.loading = false;
        console.log("postShowTime fulfilled, new showTime:", action.payload);
      })
      .addCase(postShowTime.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
        console.log("postShowTime rejected, error:", action.payload);
      })
      .addCase(updateShowTime.pending, (state) => {
        state.loading = true;
        state.error = null;
        console.log("updateShowTime pending");
      })
      .addCase(updateShowTime.fulfilled, (state, action) => {
        const index = state.showTimes.findIndex(
          (showTime) => showTime.id === action.payload.id
        );
        if (index !== -1) {
          state.showTimes[index] = action.payload;
        }
        state.showTime = action.payload;
        state.loading = false;
        console.log(
          "updateShowTime fulfilled, updated showTime:",
          action.payload
        );
      })
      .addCase(updateShowTime.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
        console.log("updateShowTime rejected, error:", action.payload);
      })
      .addCase(deleteShowTime.pending, (state) => {
        state.loading = true;
        state.error = null;
        console.log("deleteShowTime pending");
      })
      .addCase(deleteShowTime.fulfilled, (state, action) => {
        state.showTimes = state.showTimes.filter(
          (showTime) => showTime.id !== action.payload
        );
        state.loading = false;
        console.log(
          "deleteShowTime fulfilled, removed showTimeId:",
          action.payload
        );
      })
      .addCase(deleteShowTime.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
        console.log("deleteShowTime rejected, error:", action.payload);
      });
  },
});

export const { clearShowTimeState, setFilters } = showTimeSlice.actions;

export default showTimeSlice.reducer;
