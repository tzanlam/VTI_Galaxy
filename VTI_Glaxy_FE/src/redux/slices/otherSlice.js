import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import otherService from "../../services/otherService";

export const fetchOthers = createAsyncThunk(
  "other/fetchOthers",
  async (_, { rejectWithValue }) => {
    try {
      return (await otherService.fetchOthers()).data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const fetchOtherById = createAsyncThunk(
  "other/fetchOtherById",
  async (otherId, { rejectWithValue }) => {
    try {
      return (await otherService.fetchOtherById(otherId)).data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchOtherByGalaxyId = createAsyncThunk(
  "other/fetchOtherByGalaxyId",
  async (galaxyId, { rejectWithValue }) => {
    try {
      return (await otherService.fetchOtherByGalaxyId(galaxyId)).data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createOther = createAsyncThunk(
  "other/createOther",
  async (request, { rejectWithValue }) => {
    try {
      return (await otherService.createOther(request)).data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateOther = createAsyncThunk(
  "other/updateOther",
  async ({ id, request }, { rejectWithValue }) => {
    try {
      return (await otherService.updateOther(id, request)).data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteOther = createAsyncThunk(
  "other/deleteOther",
  async (id, { rejectWithValue }) => {
    try {
      return (await otherService.deleteOther(id)).data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const otherSlice = createSlice({
  name: "other",
  initialState: {
    other: null,
    others: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearOtherState: (state) => {
      state.other = null;
      state.others = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetch others
      .addCase(fetchOthers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOthers.fulfilled, (state, action) => {
        state.loading = false;
        state.others = action.payload;
      })
      .addCase(fetchOthers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // fetch other by id
      .addCase(fetchOtherById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOtherById.fulfilled, (state, action) => {
        state.loading = false;
        state.other = action.payload;
      })
      .addCase(fetchOtherById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // fetch other by galaxyId
      .addCase(fetchOtherByGalaxyId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOtherByGalaxyId.fulfilled, (state, action) => {
        state.loading = false;
        state.others = action.payload; // Sửa: gán vào state.others
      })
      .addCase(fetchOtherByGalaxyId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // create other
      .addCase(createOther.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOther.fulfilled, (state, action) => {
        state.loading = false;
        state.other = action.payload;
      })
      .addCase(createOther.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // update other
      .addCase(updateOther.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOther.fulfilled, (state, action) => {
        state.loading = false;
        state.other = action.payload;
      })
      .addCase(updateOther.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // delete other
      .addCase(deleteOther.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteOther.fulfilled, (state, action) => {
        state.loading = false;
        state.other = action.payload;
      })
      .addCase(deleteOther.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearOtherState } = otherSlice.actions;
export default otherSlice.reducer;
