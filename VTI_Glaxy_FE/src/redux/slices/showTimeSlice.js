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

export const fetchShowTimesByFilter = createAsyncThunk(
  "showtime/fetchShowTimesByFilter",
  async ({ galaxyId, movieId, date }, { rejectWithValue }) => {
    try {
      console.log("fetchShowTimesByFilter params:", {
        galaxyId,
        movieId,
        date,
      });
      const response = await showTimeService.fetchShowTimesByFilter(
        galaxyId,
        movieId,
        date
      );
      console.log("fetchShowTimesByFilter response:", response.data);
      return response.data;
    } catch (err) {
      console.error("fetchShowTimesByFilter error:", err.response?.data);
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
      console.log("Mapped startTimeIds:", startTimeIds);
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
      .addCase(fetchShowTimes.pending, (state) => {
        state.loading = true;
        state.error = null;
        console.log("fetchShowTimes pending");
      })
      .addCase(fetchShowTimes.fulfilled, (state, action) => {
        state.showTimes = action.payload;
        state.loading = false;
        console.log("fetchShowTimes fulfilled, showTimes:", action.payload);
      })
      .addCase(fetchShowTimes.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
        console.log("fetchShowTimes rejected, error:", action.payload);
      })
      .addCase(fetchShowTimeById.pending, (state) => {
        state.loading = true;
        state.error = null;
        console.log("fetchShowTimeById pending");
      })
      .addCase(fetchShowTimeById.fulfilled, (state, action) => {
        state.showTime = action.payload;
        state.loading = false;
        console.log("fetchShowTimeById fulfilled, showTime:", action.payload);
      })
      .addCase(fetchShowTimeById.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
        console.log("fetchShowTimeById rejected, error:", action.payload);
      })
      .addCase(fetchShowTimesByFilter.pending, (state) => {
        state.loading = true;
        state.error = null;
        console.log("fetchShowTimesByFilter pending");
      })
      .addCase(fetchShowTimesByFilter.fulfilled, (state, action) => {
        state.showTimes = action.payload;
        state.loading = false;
        console.log(
          "fetchShowTimesByFilter fulfilled, showTimes:",
          action.payload
        );
      })
      .addCase(fetchShowTimesByFilter.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
        console.log("fetchShowTimesByFilter rejected, error:", action.payload);
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
