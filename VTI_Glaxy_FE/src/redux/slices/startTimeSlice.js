import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import startTimeService from "../../services/startTimeService";

export const fetchStartTimes = createAsyncThunk('startTime/getStartTime', async(_,{rejectWithValue})=>{
   try{
      const response = await startTimeService.getStartTimes();
      return response.data
   }catch(err){
      return rejectWithValue(err.data)
   }
})

export const createStartTime = createAsyncThunk('startTime/createStartTime', async({startTime, endTime}, {rejectWithValue})=>{
   try{
      return (await (startTimeService.createStartTime(startTime, endTime))).data
   }catch(err){
      return rejectWithValue(err.data)
   }
})

const startTimeSlice = createSlice({
   name: 'startTime',
   initialState: {
      startTime: null,
      startTimes: [],
      loading: true,
      error: null,
   },
   reducer: {
      clearStartTimeState: (state) => {
         state.startTime = null,
         state.startTimes = [],
         state.error = null
      }
   },
   extraReducers: (builder) => {
      builder
      // fetch list start time
         .addCase(fetchStartTimes.pending, (state)=>{
            state.loading = true,
            state.error = null
         })
         .addCase(fetchStartTimes.fulfilled, (state, action)=>{
            state.startTimes = action.payload,
            state.loading = false
         })
         .addCase(fetchStartTimes.rejected, (state, action)=>{
            state.loading = false,
            state.error = action.payload
         })
      // create new start time
         .addCase(createStartTime.pending, (state)=>{
            state.loading = true,
            state.error = null
         })
         .addCase(createStartTime.fulfilled, (state, action)=>{
            state.startTime = action.payload,
            state.loading = false
         })
         .addCase(createStartTime.rejected, (action, state)=>{
            state.loading = false,
            state.error = action.payload
         })
   }
})

export const {clearStartTimeState} = startTimeSlice.actions

export default startTimeSlice.reducer