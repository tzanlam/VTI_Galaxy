import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import startTimeService from "../../services/startTimeService";

export const fetchStartTimes = createAsyncThunk(
  "startTime/fetchStartTimeByMovieIdAndDate",
  async ({ movieId, date }, { rejectWithValue }) => {
    try {
      const response = await startTimeService.fetchStartTimeByMovieIdAndDate(movieId, date);
      console.log("fetchStartTimes response:", response);
      return response.data;
    } catch (err) {
      console.error("fetchStartTimes error:", err.response?.data);
      return rejectWithValue(
        err.response?.data || "Lỗi khi lấy danh sách thời gian bắt đầu"
      );
    }
  }
);

export const createStartTime = createAsyncThunk(
  "startTime/createStartTime",
  async ({ times, showTimeId }, { rejectWithValue }) => {
    try {
      console.log("createStartTime request:", { times, showTimeId });
      const response = await startTimeService.createStartTime(
        startTime,
        endTime
      );
      console.log("createStartTime response:", response.data);
      return response.data;
    } catch (err) {
      console.error("createStartTime error:", err.response?.data);
      return rejectWithValue(
        err.response?.data || "Lỗi khi tạo thời gian bắt đầu"
      );
    }
  }
);

const startTimeSlice = createSlice({
  name: "startTime",
  initialState: {
    startTimes: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearStartTimeState: (state) => {
      state.startTimes = [];
      state.loading = false;
      state.error = null;
      console.log("clearStartTimeState executed, state reset");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStartTimes.pending, (state) => {
        state.loading = true;
        state.error = null;
        console.log("fetchStartTimes pending");
      })
      .addCase(fetchStartTimes.fulfilled, (state, action) => {
        state.startTimes = action.payload;
        state.loading = false;
        console.log("fetchStartTimes fulfilled, startTimes:", action.payload);
      })
      .addCase(fetchStartTimes.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
        console.log("fetchStartTimes rejected, error:", action.payload);
      })
      .addCase(createStartTime.pending, (state) => {
        state.loading = true;
        state.error = null;
        console.log("createStartTime pending");
      })
      .addCase(createStartTime.fulfilled, (state, action) => {
        state.startTimes.push(action.payload);
        state.loading = false;
        console.log(
          "createStartTime fulfilled, new startTime:",
          action.payload
        );
      })
      .addCase(createStartTime.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
        console.log("createStartTime rejected, error:", action.payload);
      });
  },
});

export const { clearStartTimeState } = startTimeSlice.actions;

export default startTimeSlice.reducer;
