// src/app/slices/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

/* -------------------------------------------------
   LOGIN THUNK (unchanged)
   ------------------------------------------------- */
export const loginUser = createAsyncThunk(
  "auth/login",
  async ({ email, password, rememberMe }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/api/auth/login`,
        { email, password, rememberMe },
        { withCredentials: true } // httpOnly cookie
      );
      return response.data.user;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);

/* -------------------------------------------------
   LOGOUT THUNK (new)
   ------------------------------------------------- */
export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      // Call backend logout (clears httpOnly cookie)
      await axios.post(`${API_URL}/api/auth/logout`, {}, { withCredentials: true });
      return true;
    } catch (error) {
      return rejectWithValue("Logout failed");
    }
  }
);

/* -------------------------------------------------
   SLICE
   ------------------------------------------------- */
const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    loading: false,
    error: null,
  },
  reducers: {
    
    logout: (state) => {
      state.user = null;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    setUser: (state, action) => {
    state.user = action.payload;
    state.loading = false; // ← This stops "Loading..." forever
  },
  },
  extraReducers: (builder) => {
    /* ---- LOGIN ---- */
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    /* ---- LOGOUT ---- */
    builder
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

/* -------------------------------------------------
   EXPORT ACTIONS & THUNKS
   ------------------------------------------------- */
export const { logout, clearError , setUser } = authSlice.actions;

export default authSlice.reducer;