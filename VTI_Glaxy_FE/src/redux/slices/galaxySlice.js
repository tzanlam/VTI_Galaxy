import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import galaxyService from "../../services/galaxyService";

export const fetchGalaxies = createAsyncThunk(
  "galaxy/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await galaxyService.fetchGalaxy();
      return response.data;
    } catch (error) {
      console.error("Error fetching galaxies:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchGalaxyById = createAsyncThunk(
  "galaxy/fetchById",
  async (galaxyId, { rejectWithValue }) => {
    try {
      const response = await galaxyService.fetchGalaxyById(galaxyId);
      return response.data;
    } catch (error) {
      console.error("Error fetching galaxy by ID:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createNewGalaxy = createAsyncThunk(
  "galaxy/createNew",
  async (galaxyRequest, { rejectWithValue }) => {
    try {
      const response = await galaxyService.createGalaxy(galaxyRequest);
      return response.data;
    } catch (error) {
      console.error("Error creating galaxy:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateGalaxy = createAsyncThunk(
  "galaxy/update",
  async ({ galaxyId, galaxyRequest }, { rejectWithValue }) => {
    try {
      const response = await galaxyService.updateGalaxy(
        galaxyId,
        galaxyRequest
      );
      return response.data;
    } catch (error) {
      console.error("Error updating galaxy:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteGalaxy = createAsyncThunk(
  "galaxy/delete",
  async (galaxyId, { rejectWithValue }) => {
    try {
      const response = await galaxyService.deleteGalaxy(galaxyId);
      console.log(response);
      return { id: galaxyId }; // Trả về galaxyId để lọc trong reducer
    } catch (error) {
      console.error("Error deleting galaxy:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const galaxySlice = createSlice({
  name: "galaxy",
  initialState: {
    galaxies: [],
    galaxy: null,
    error: null,
    loading: false,
  },
  reducers: {
    clearGalaxySlice: (state) => {
      state.galaxies = [];
      state.galaxy = null;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Lấy danh sách galaxy
      .addCase(fetchGalaxies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGalaxies.fulfilled, (state, action) => {
        state.galaxies = action.payload;
        state.loading = false;
      })
      .addCase(fetchGalaxies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Lấy galaxy by ID
      .addCase(fetchGalaxyById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGalaxyById.fulfilled, (state, action) => {
        state.galaxy = action.payload;
        state.loading = false;
      })
      .addCase(fetchGalaxyById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Tạo mới
      .addCase(createNewGalaxy.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createNewGalaxy.fulfilled, (state, action) => {
        state.galaxies.push(action.payload);
        state.loading = false;
      })
      .addCase(createNewGalaxy.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Cập nhật
      .addCase(updateGalaxy.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateGalaxy.fulfilled, (state, action) => {
        state.galaxies = state.galaxies.map((galaxy) =>
          galaxy.id === action.payload.id ? action.payload : galaxy
        );
        state.loading = false;
      })
      .addCase(updateGalaxy.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Xóa galaxy
      .addCase(deleteGalaxy.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteGalaxy.fulfilled, (state, action) => {
        state.galaxies = state.galaxies.filter(
          (galaxy) => galaxy.id !== action.payload.id
        );
        state.loading = false;
      })
      .addCase(deleteGalaxy.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearGalaxySlice } = galaxySlice.actions;
export default galaxySlice.reducer;
