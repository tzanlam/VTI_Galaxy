import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import seatRoomService from "../../services/seatRoomService";

export const fetchSeatRooms = createAsyncThunk('seatRoom/fetchSeatRooms', async({rejectWithValue})=>{
   try{
      return (await (seatRoomService.fetchSeatRooms())).data
   }catch(err){
      return rejectWithValue(err)
   }
})

export const fetchSeatRoomById = createAsyncThunk('seatRoom/fetchSeatRoomById', async(seatRoomId, {rejectWithValue})=>{
   try {
      return (await seatRoomService.fetchSeatById(seatRoomId)).data
   } catch (error) {
      return rejectWithValue(error)
   }
})

export const createSeatRoom = createAsyncThunk('seatRoom/createSeatRoom', async(request, {rejectWithValue})=>{
   try {
      return (await seatRoomService.createSeatRoom(request)).data
   } catch (error) {
      return rejectWithValue(error.data)
   }
})

export const updateSeatRoomName = createAsyncThunk('seatRoom/update', async({seatRoomId, name}, {rejectWithValue})=>{
   try{
      return (await seatRoomService.updateNameSeatRoom(seatRoomId, name)).data
   }catch(err){
      return rejectWithValue(err.data)
   }
})

const seatRoomSlice = createSlice({
   name: 'seatRoom',
   initialState: {
      seatRoom: null,
      seatRooms: [],
      loading: false,
      error: null
   },
   reducers: {
      clearSeatRoomState: (state) => {
         state.seatRoom = null,
         state.seatRooms = [],
         state.loading = false,
         state.error = null
      }
   },
   extraReducers: (builder) => {
      builder
         // fetch All
         .addCase(fetchSeatRooms.pending, (state)=>{
            state.loading = true,
            state.err = null
         })
         .addCase(fetchSeatRooms.fulfilled, (state, action)=>{
            state.seatRooms = action.payload,
            state.loading = false
         })
         .addCase(fetchSeatRooms.rejected, (action, state)=>{
            state.loading = false,
            state.error = action.payload
         })
      // fetch by id
         .addCase(fetchSeatRoomById.pending, (state)=>{
            state.loading = true,
            state.error = null
         })
         .addCase(fetchSeatRoomById.fulfilled, (action, state)=>{
            state.seatRoom = action.payload,
            state.loading = false
         })
         .addCase(fetchSeatRoomById.rejected, (action, state)=>{
            state.loading = false,
            state.error = action.payload
         })
      // create
         .addCase(createSeatRoom.pending, (state)=>{
            state.loading = true,
            state.error = null
         })
         .addCase(createSeatRoom.fulfilled, (state, action)=>{
            state.loading = false,
            state.seatRoom = action.payload
         })
         .addCase(createSeatRoom.rejected, (action, state)=>{
            state.loading = false,
            state.error = action.payload
         })

      // set Name
         .addCase(updateSeatRoomName.pending, (state)=>{
            state.loading = true,
            state.error = null
         })
         .addCase(updateSeatRoomName.fulfilled, (state, action)=>{
            state.loading = false,
            state.seatRoom = action.payload
         })
         .addCase(updateSeatRoomName.rejected, (action, state)=>{
            state.loading = false,
            state.error = action.payload
         })
   }
})

export const {clearSeatRoomState} = seatRoomSlice.actions
export default seatRoomSlice.reducer