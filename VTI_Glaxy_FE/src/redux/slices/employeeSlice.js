import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import employeeService from "./../../services/employeeService";

// GET ALL
export const fetchEmployees = createAsyncThunk(
  "employee/fetchEmployees",
  async (_, { rejectWithValue }) => {
    try {
      const res = await employeeService.fetchEmployees();
      console.log("data nhân viên: ", res.data);
      return res.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || "Fetch failed");
    }
  }
);

// GET BY ID
export const fetchEmployeeById = createAsyncThunk(
  "employee/fetchById",
  async (employeeId, { rejectWithValue }) => {
    try {
      const res = await employeeService.fetchEmployeeById(employeeId);
      return res.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || "Fetch by ID failed");
    }
  }
);

// POST
export const postEmployee = createAsyncThunk(
  "employee/createEmployee",
  async (employeeRequest, { rejectWithValue }) => {
    try {
      const res = await employeeService.createEmployee(employeeRequest);
      return res.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || "Create failed");
    }
  }
);

// PUT
export const putEmployee = createAsyncThunk(
  "employee/updateEmployee",
  async ({ employeeId, employeeRequest }, { rejectWithValue }) => {
    try {
      const res = await employeeService.updateEmployee(employeeId, employeeRequest);
      return res.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || "Update failed");
    }
  }
);

const initialState = {
  employee: null,
  employees: [],
  loading: false,
  error: null,
};

const employeeSlice = createSlice({
  name: "employee",
  initialState,
  reducers: {
    clearEmployeeSlice: (state) => {
      state.employee = null;
      state.employees = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // FETCH ALL
      .addCase(fetchEmployees.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.loading = false;
        state.employees = action.payload;
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // FETCH BY ID
      .addCase(fetchEmployeeById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployeeById.fulfilled, (state, action) => {
        state.loading = false;
        state.employee = action.payload;
      })
      .addCase(fetchEmployeeById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // CREATE
      .addCase(postEmployee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(postEmployee.fulfilled, (state, action) => {
        state.loading = false;
        state.employee = action.payload;
      })
      .addCase(postEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // UPDATE
      .addCase(putEmployee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(putEmployee.fulfilled, (state, action) => {
        state.loading = false;
        state.employee = action.payload;
      })
      .addCase(putEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearEmployeeSlice } = employeeSlice.actions;
export default employeeSlice.reducer;
