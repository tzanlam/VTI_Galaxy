import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import accountService from "../../services/accountService";

export const fetchAccounts = createAsyncThunk('account/getAccounts', async({rejectWithValue})=>{
   try{
      const response = await accountService.fetchAccounts()
      return response.data
   }catch(err){
      return rejectWithValue(err)
   }
})

export const fetchAccountById = createAsyncThunk('account/getAccountById', async(accountId, {rejectWithValue})=>{
   try {
      const response = await accountService.fetchAccountById()
      return response.data
   } catch (error) {
      rejectWithValue(error)
   }
})

export const createAccountAdmin = createAsyncThunk('account/createAccountAdmin', async(accountRequest, {rejectWithValue})=>{
   try {
      const response = await accountService.createAccountAdmin(accountRequest)
      return response.data
   } catch (error) {
      rejectWithValue(error)
   }
})

export const createAccountUser = createAsyncThunk('account/createAccountUser', async(accountRequest, {rejectWithValue})=>{
   try {
      const response = await accountService.createAccountUser(accountRequest)
      return response.data
   } catch (error) {
      rejectWithValue(error)
   }
})

export const updateAccount = createAsyncThunk('account/updateAccount', async({accountId, accountRequest}, {rejectWithValue})=>{
   try{
      const response = await accountService.updateAccount(accountId, accountRequest)
      return response.data
   }catch(err){
      return rejectWithValue(err)
   }
})

export const updateEmail = createAsyncThunk('account/updateEmail', async({accountId, email}, {rejectWithValue})=>{
   try{
      return (await accountService.updateEmail(accountId, email)).data
   }catch(err){
      return rejectWithValue(err)
   }
})

export const updatePassword = createAsyncThunk('account/updatePassword', async({accountId, password}, {rejectWithValue})=>{
   try{
      return (await accountService.updatePassword(accountId, password)).data
   }catch(err){
      return rejectWithValue(err)
   }
})

export const deleteAccount = createAsyncThunk('account/deleteAccount', async(accountId, {rejectWithValue})=>{
   try{
      return (await accountService.deleteAccount(accountId)).data
   }catch(err){
      return rejectWithValue(err)
   }
})


const accountSlice = createSlice({
   name: "account",
   initialState: {
      accounts: [],
      account: null,
      err: null,
      loading: false
   },
   reducers: {
      clearAccountSlice: (state)=> {
         state.account = null,
         state.err = null
      }
   },
   extraReducers: (builder) => {
      builder
      // lấy danh sách account
      .addCase(fetchAccounts.pending, (state) => {
         state.loading = true,
         state.err = null;
      })
      .addCase(fetchAccounts.fulfilled, (state, action)=>{
         state.accounts = action.payload,
         state.loading = false
      })
      .addCase(fetchAccounts.rejected, (state, action)=>{
         state.loading = true,
         state.err = action.payload
      })

      // lấy account bằng id
      .addCase(fetchAccountById.pending, (state)=>{
         state.loading = true,
         state.err = null
      })
      .addCase(fetchAccountById.fulfilled, (state, action)=>{
         state.account = action.payload,
         state.loading = false
      })
      .addCase(fetchAccountById.rejected, (state, action)=>{
         state.loading = false,
         state.err = action.payload
      })

      // tạo account admin
      .addCase(createAccountAdmin.pending, (state)=>{
         state.loading = true,
         state.err = null
      })
      .addCase(createAccountAdmin, (state, action)=>{
         state.account = action.payload,
         state.loading = false
      })
      .addCase(createAccountAdmin.rejected, (action, state)=>{
         state.loading = false,
         state.err = action.payload
      })

      // tạo account usẻ
      .addCase(createAccountUser.pending, (state)=>{
         state.loading = true,
         state.err = null
      })
      .addCase(createAccountUser.fulfilled, (state, action)=>{
         state.account = action.payload,
         state.loading = false
      })
      .addCase(createAccountUser.rejected, (action, state)=>{
         state.loading = false,
         state.err = action.payload
      })

      // cập nhật account
      .addCase(updateAccount, (state)=>{
         state.loading = true,
         state.err = null
      })
      .addCase(updateAccount.fulfilled, (state, action)=>{
         state.account = action.payload,
         state.loading = false
      })
      .addCase(updateAccount.rejected, (state, action)=>{
         state.loading = false,
         state.err = action.payload
      })

      // cập nhật email
      .addCase(updateEmail.pending, (state)=>{
         state.loading = true,
         state.err = null
      })
      .addCase(updateEmail.fulfilled, (action, state)=>{
         state.account = action.payload,
         state.loading = false
      })
      .addCase(updateEmail.rejected, (state, action)=>{
         state.loading = false,
         state.err = action.payload
      })
      // cập nhật password
      .addCase(updatePassword.pending, (state)=>{
         state.loading = true,
         state.err = null
      })
      .addCase(updatePassword.fulfilled, (state, action)=>{
         state.account = action.payload,
         state.loading = false
      })
      .addCase(updatePassword.rejected, (state, action)=>{
         state.loading = false,
         state.err = action.payload
      })
      // xoá account
   }
})

export const { clearAccountSlice } = accountSlice.actions

export default accountSlice.reducer;