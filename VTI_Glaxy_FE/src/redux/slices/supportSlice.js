import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import supportService from "../../services/supportService";

export const confirm = createAsyncThunk('support/confirm', async({accountId, code}, {rejectWithValue})=>{
   try {
      const response = await supportService.confirm(accountId, code);
      return response.data
   } catch (error) {
      return rejectWithValue(error)
   }
})

export const postImage = createAsyncThunk('support/postImg', async(file, {rejectWithValue})=>{
   try {
      return await ((supportService.postImage(file))).data
   } catch (error) {
      return rejectWithValue(error)
   }
})

const supportSlice = createSlice({
   name: 'support',
   initialState: {
      value: null,
      loading:false,
      error: null
   },
   reducers: {
      clearSupportState: (state) => {
         state.value = null,
         state.loading = false,
         state.error = null
      }
   },
   extraReducers: (builder) => {
      builder
      // confirm method
         .addCase(confirm.pending, (state)=>{
            state.loading = true,
            state.error = null
         })
         .addCase(confirm.fulfilled, (state, action)=>{
            state.value = action.payload,
            state.loading = false
         })
         .addCase(confirm.rejected, (state, action)=>{
            state.loading = false,
            state.error = action.payload
         })
      // up load img
         .addCase(postImage.pending, (state)=>{
            state.loading = true,
            state.error = null
         })
         .addCase(postImage.fulfilled, (state, action)=>{
            state.loading = false,
            state.value = action.payload
         })
         .addCase(postImage.rejected, (action, state)=>{
            state.loading = false,
            state.error = action.payload
         })
   }
})

export const {clearSupportState} = supportSlice.actions

export default supportSlice.reducer