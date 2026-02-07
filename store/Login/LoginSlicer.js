import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie";

// Thunks for sending and verifying OTP
export const sendOtp = createAsyncThunk(
  "otp/sendOtp",
  async (email, { rejectWithValue }) => {
    console.log(email);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/login/otp`,
        { email }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to send OTP."
      );
    }
  }
);

export const verifyOtp = createAsyncThunk(
  "otp/verifyOtp",
  async ({ email, otp }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/login/otp/verify`,
        { email, otp }
      );
      console.log(response.data);
      Cookies.set("token", JSON.stringify(response.data.token));
      Cookies.set("user", JSON.stringify(response.data.admin));
      return response.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response?.data?.message || "Invalid OTP.");
    }
  }
);

const user =
  typeof window !== "undefined" && Cookies.get("user")
    ? JSON.parse(Cookies.get("user"))
    : {
        _id: "",
        username: "",
        name: "",
      };
const token =
  typeof window !== "undefined" && Cookies.get("token")
    ? JSON.parse(Cookies.get("token"))
    : null;

const initialState = {
  otpSent: false,
  otpVerified: false,
  otpExpirationTime: null,
  loading: false,
  error: null,
  user: user,
  token: token,
};

// Slice definition
const otpSlice = createSlice({
  name: "otp",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(sendOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.otpSent = true;
        state.otpExpirationTime = action.payload.expirationTime;
      })
      .addCase(sendOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to send OTP.";
      })
      .addCase(verifyOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state, payload) => {
        state.loading = false;
        state.otpVerified = true;
        state.user = payload.admin;
        state.token = payload.token;
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Invalid OTP.";
      });
  },
});

export default otpSlice.reducer;
