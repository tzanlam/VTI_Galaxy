import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import employeeService from "./../../services/employeeService";

export const fetchEmployees = createAsyncThunk(
  "employee/fetchEmployees",
  async (_, { thunkAPI }) => {
    try {
      return (await employeeService.fetchEmployees()).data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.data.message);
    }
  }
);

export const fetchEmployeeById = createAsyncThunk(
  "employee/fetchById",
  async (employeeId, { thunkAPI }) => {
    try {
      return (await employeeService.fetchEmployeeById(employeeId)).data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.data.message);
    }
  }
);

export const postEmployee = createAsyncThunk(
  "employee/createEmployee",
  async ({ employeeRequest }, { thunkAPI }) => {
    try {
      return await employeeService.createEmployee(employeeRequest);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.data.message);
    }
  }
);

export const putEmployee = createAsyncThunk(
  "employee/updateEmployee",
  async ({ employeeId, employeeRequest }, { thunkAPI }) => {
    try {
      return (await employeeService.updateEmployee(employeeId, employeeRequest))
        .data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.data.message);
    }
  }
);

const EmployeeSlice = createSlice({
  name: "employee",
  initialState: {
    employee: null,
    employees: [],
    loading: false,
    error: null,
  },
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
   .addCase(fetchEmployees.fulfilled, (state, action)=>{
    state.loading = false
    state.employees = action.payload
   })
   .addMatcher(
    (action) => action.type.endsWith("/pending"),
    (state) => {
     state.loading = true;
     state.erorr = null;
    })
    .addMatcher((action)=>action.type.endsWith("/rejected"),
     (state, action) => {
      state.loading = false
      state.employee = action.payload
    })
  }
});

export const { clearEmployeeSlice } = EmployeeSlice.actions
export default EmployeeSlice.reducer