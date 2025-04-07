import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import galaxyService from "../../services/galaxyService";

export const fetchGalaxies = createAsyncThunk('galaxy/fetchAll', async(_, {rejectWithValue})=>{
   try {
      const response = await galaxyService.fetchGalaxy()
      return response.data
   } catch (error) {
      return rejectWithValue(error)
   }
})

export const fetchGalaxyById = createAsyncThunk('galaxy/fetchById', async(galaxyId, {rejectWithValue})=>{
   try {
      const response = await galaxyService.fetchGalaxyById(galaxyId)
      return response.data
   } catch (error) {
      rejectWithValue(error)
   }
})

export const createNewGalaxy = createAsyncThunk('galaxy/creatNew', async(galaxyRequest, {rejectWithValue})=>{
   try {
      const response = await galaxyService.createGalaxy(galaxyRequest)
      return response.data
   } catch (error) {
      rejectWithValue(error)
   }
})

export const updateGalaxy = createAsyncThunk('galaxy/update', async({galaxyId, galaxyRequest}, {rejectWithValue})=>{
   try {
      const response = await galaxyService.updateGalaxy(galaxyId, galaxyRequest)
      return response.data
   } catch (error) {
      rejectWithValue(error)
   }
})

export const deleteGalaxy = createAsyncThunk('galaxy/delete', async(galaxyId, {rejectWithValue})=>{
   try {
      const response = await galaxyService.deleteGalaxy(galaxyId)
      return response.data
   } catch (error) {
      rejectWithValue(error)
   }
})

const galaxySlice = createSlice({
   name: 'galaxy',
   initialState: {
      galaxied: [],
      galaxy: null,
      err: null,
      loading: false
   },
   reducers: {
      clearGalaxySlice: (state) => {
         state.galaxy= null,
         state.err=null
      }
   },
   extraReducers: (builder) => {
      builder
      // lấy danh sách galaxy
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
       // lấy galaxy by id
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
       // tạo mới
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
       // cập nhật
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
       // xoá galaxy
       .addCase(deleteGalaxy.pending, (state) => {
         state.loading = true;
         state.error = null;
       })
       .addCase(deleteGalaxy.fulfilled, (state, action) => {
         state.galaxies = state.galaxies.filter((galaxy) => galaxy.id !== action.payload.id);
         state.loading = false;
       })
       .addCase(deleteGalaxy.rejected, (state, action) => {
         state.loading = false;
         state.error = action.payload;
       });
   },
 });
 
 export const { clearGalaxyState } = galaxySlice.actions;
 
 export default galaxySlice.reducer;