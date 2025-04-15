import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import showTimeService from "../../services/showTimeService"

export const fetchShowTimes = createAsyncThunk(
    "showtime/fetchShowTimes",
    async(_,{rejectWithValue}) =>{
        try{
            const response = await showTimeService.fetchShowTimes()
            console.log(response.data)
            return response.data
        }catch(err){
            return rejectWithValue(err.response.data)
        }
    }
)

export const fetchShowTimeById = createAsyncThunk(
    "showtime/fetchShowTimeById",
    async(showTimeId, {rejectWithValue}) => {
        try{
            const response = await showTimeId.fetchShowTimeById(showTimeId)
            console.log(response.data)
            return response.data
        }catch(err){
            return rejectWithValue(err.response.data)
        }
    }
)

export const postShowTime = createAsyncThunk(
    "showTime/postShowTime",
    async(showTimeRequest,{rejectWithValue}) =>{
        try{
            const response = await postShowTime(showTimeRequest)
            console.log(response.data)
            return response.data
        }catch(err){
            return rejectWithValue(err.response.data)
        }
    }
)

export const updateShowTime = createAsyncThunk(
    "showTime/updateMovie",
    async ({showTimeId,showTimeRequest},{rejectWithValue}) =>{
        try{
            const response = await updateShowTime(showTimeId,showTimeRequest)
            console.log(response.data)
            return response.data
        }catch(err){
            return rejectWithValue(err.response.data)
        }
    }
)

export const deleteShowTime = createAsyncThunk(
    "showTime/delete",
    async (showTimeId,{rejectWithValue}) =>{
        try{
            const response = await deleteShowTime(showTimeId)
            console.log(response.data)
            return response.data
        }catch(err){
            return rejectWithValue(err.response.data)
        }
    }
)

const showTimeSlice = createSlice({
    name: "showTime",
    initialState:{
        showTime:null,
        showTimes:[],
        loading:false,
        error:null,
    },
    reducer:{
        clearShowTimeState:(state) =>{
            state.showTime = null
            state.showTimes = []
            state.error = null
        },
    },
    extraReducers: (builder) => {
        builder
        // fetch All ShowTime
            .addCase(fetchShowTimes.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchShowTimes.fulfilled, (state,action) =>{
                state.showTimes = action.payload
                state.loading = false
            })
            .addCase(fetchShowTimes.rejected,(state) => {
                state.error = true
                state.loading = false
            })
        // fetch showtime By Id
            .addCase(fetchShowTimeById.pending, (state) =>{
                state.loading = true
                state.error = null
            })
            .addCase(fetchShowTimeById.fulfilled, (action ,state) => {
                state.showTimes = action.payload
                state.loading = false
            })
            .addCase(fetchShowTimeById.rejected,(state,action) => {
                state.error = action.payload
                state.loading = false
            })
        // post showtime
            .addCase(postShowTime.pending,(state) => {
                state.loading = true
                state.error = null
            })
            .addCase(postShowTime.fulfilled, (state, action) => {
                state.movie = (action.payload);
                state.loading = false;
                  })
            .addCase(postShowTime.rejected, (state, action) => {
                 state.loading = false;
                 state.error = action.payload;
                  })
                  .addCase(updateShowTime.pending,(state) => {
                    state.loading = true
                    state.error = null
                })
                .addCase(updateShowTime.fulfilled, (state, action) => {
                    state.movie = action.payload;
                    const index = state.showTimes.findIndex(
                        (movie) => movie.id === action.payload.id
                    )
                    if(index !== -1){
                        state.movie[index] = action.payload
                    }
                    state.loading = false;
                      })
                .addCase(updateShowTime.rejected, (state, action) => {
                     state.loading = false;
                     state.error = action.payload;
                  })
                  .addCase(deleteShowTime.pending,(state) => {
                    state.loading = true
                    state.error = null
                })
                .addCase(deleteShowTime.fulfilled, (state, action) => {
                    state.showTimes = state.showTimes.filter(
                        (movie) =>movie.id !== action.meta.arg
                    )
                    state.loading = false;
                      })
                .addCase(deleteShowTime.rejected, (state, action) => {
                     state.loading = false;
                     state.error = action.payload;
                  })
    }
})

export const {clearShowTimeState} = showTimeSlice.actions

export default showTimeSlice.reducer