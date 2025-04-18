import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import seatService from "../../services/seatService";

export const fetchSeats = createAsyncThunk('seat/fetchSeats', async({rejectWithValue})=>{
   try {
      return await (seatService.fetchSeats).data
   } catch (error) {
      return rejectWithValue(error.data)
   }
})

export const fetchSeatById = createAsyncThunk('seat/fetchSeatById', async(seatId, {rejectWithValue})=>{
   try{
      return (await (seatService.fetchSeatById(seatId))).data
   }catch(err){
      return rejectWithValue(err.data)
   }
})

export const createSeat = createAsyncThunk('seat/createSeat', async(request, {rejectWithValue})=>{
   try{
      return (await (seatService.createSeat(request))).data
   }catch(err){
      return rejectWithValue(err.data)
   }
})

export const updateSeat = createAsyncThunk('seat/updateSeat', async({seatId, request}, {rejectWithValue})=>{
   try {
      return (await (seatService.updateSeat(seatId, request))).data
   } catch (error) {
      return rejectWithValue(error.data)
   }
})

export const deleteSeat = createAsyncThunk('seat/deleteSeat', async(seatId, {rejectWithValue})=>{
   try{
      return (await (seatService.deleteSeat(seatId))).data
   }catch(err){
      return rejectWithValue(err.data)
   }
})

const seatSlice = createSlice({
   name: 'seat',
   initialState: {
      seat: null,
      seats: [],
      loading: false,
      error: null
   },
   reducers: {
      clearSeatState: (state) => {
         state.seat = null,
         state.seats = [],
         state.loading = false,
         state.error = null
      }
   },
   extraReducers: (builder) => {
      builder
      // fetch seats
      .addCase(fetchSeats.pending, (state)=>{
         state.loading = true,
         state.error = null
      })
      .addCase(fetchSeats.fulfilled, (state, action)=>{
         state.seats = action.payload,
         state.loading = false
      })
      .addCase(fetchSeats.rejected, (state, action)=>{
         state.error = action.payload,
         state.loading = false
      })
   }
})

export const {clearSeatState} = seatSlice.actions
export default seatSlice.reducer