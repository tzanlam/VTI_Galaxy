import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import voucherService from "../../services/voucherService";

// Thunk để áp dụng voucher theo mã
export const fetchVoucher = createAsyncThunk(
  "voucher/fetchVoucher",
  async ({ code, totalPrice }, { rejectWithValue }) => {
    try {
      return (await voucherService.applyVoucher({ code, totalPrice })).data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Thunk để lấy tất cả vouchers
export const fetchVouchers = createAsyncThunk(
  "voucher/fetchVouchers",
  async (_, { rejectWithValue }) => {
    try {
      return (await voucherService.fetchVouchers()).data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Thunk để lấy voucher theo ID
export const fetchVoucherById = createAsyncThunk(
  "voucher/fetchVoucherById",
  async (voucherId, { rejectWithValue }) => {
    try {
      return (await voucherService.fetchVoucherById(voucherId)).data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Thunk để tạo voucher
export const createVoucher = createAsyncThunk(
  "voucher/createVoucher",
  async (voucherRequest, { rejectWithValue }) => {
    try {
      return (await voucherService.createVoucher(voucherRequest)).data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Thunk để cập nhật voucher
export const updateVoucher = createAsyncThunk(
  "voucher/updateVoucher",
  async ({ voucherId, voucherRequest }, { rejectWithValue }) => {
    try {
      return (await voucherService.updateVoucher(voucherId, voucherRequest))
        .data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Thunk để xóa voucher
export const deleteVoucher = createAsyncThunk(
  "voucher/deleteVoucher",
  async (voucherId, { rejectWithValue }) => {
    try {
      return (await voucherService.deleteVoucher(voucherId)).data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const voucherSlice = createSlice({
  name: "voucher",
  initialState: {
    voucher: null,
    vouchers: [],
    loading: false,
    error: null,
  },
  reducers: {
    resetVoucher: (state) => {
      state.voucher = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchVoucher
      .addCase(fetchVoucher.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVoucher.fulfilled, (state, action) => {
        state.loading = false;
        state.voucher = action.payload;
      })
      .addCase(fetchVoucher.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // fetchVouchers
      .addCase(fetchVouchers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVouchers.fulfilled, (state, action) => {
        state.loading = false;
        state.vouchers = action.payload;
      })
      .addCase(fetchVouchers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // fetchVoucherById
      .addCase(fetchVoucherById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVoucherById.fulfilled, (state, action) => {
        state.loading = false;
        state.voucher = action.payload;
      })
      .addCase(fetchVoucherById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // createVoucher
      .addCase(createVoucher.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createVoucher.fulfilled, (state, action) => {
        state.loading = false;
        state.voucher = action.payload;
      })
      .addCase(createVoucher.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // updateVoucher
      .addCase(updateVoucher.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateVoucher.fulfilled, (state, action) => {
        state.loading = false;
        state.voucher = action.payload;
      })
      .addCase(updateVoucher.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // deleteVoucher
      .addCase(deleteVoucher.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteVoucher.fulfilled, (state, action) => {
        state.loading = false;
        state.voucher = action.payload;
      })
      .addCase(deleteVoucher.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetVoucher } = voucherSlice.actions;
export default voucherSlice.reducer;
