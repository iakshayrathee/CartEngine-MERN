import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isAuthenticated: false,
  isLoading: true,
  user: null,
};

export const registerUser = createAsyncThunk(
  "/auth/register",

  async (formData) => {
    const response = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}auth/register`,
      formData,
      {
        withCredentials: true,
      }
    );

    return response.data;
  }
);

export const loginUser = createAsyncThunk(
  "/auth/login",

  async (formData) => {
    const response = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}auth/login`,
      formData,
      {
        withCredentials: true,
      }
    );

    // If login is successful, store user data in localStorage
    if (response.data.success) {
      localStorage.setItem('cartengine_user', JSON.stringify(response.data.user));
      localStorage.setItem('cartengine_auth_status', 'true');
    }

    return response.data;
  }
);

export const logoutUser = createAsyncThunk(
  "/auth/logout",

  async () => {
    const response = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}auth/logout`,
      {},
      {
        withCredentials: true,
      }
    );

    // Clear authentication data from localStorage on logout
    localStorage.removeItem('cartengine_user');
    localStorage.removeItem('cartengine_auth_status');

    return response.data;
  }
);

export const checkAuth = createAsyncThunk(
  "/auth/checkauth",

  async (_, { rejectWithValue }) => {
    try {
      // First check if we have user data in localStorage
      const storedUser = localStorage.getItem('cartengine_user');
      const storedAuthStatus = localStorage.getItem('cartengine_auth_status');
      
      // Set a timeout to prevent hanging requests
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout
      
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}auth/check-auth`,
        {
          withCredentials: true,
          signal: controller.signal,
          headers: {
            "Cache-Control": "max-age=60", // Allow some caching to improve performance
          },
        }
      );
      
      clearTimeout(timeoutId);
      
      // If server response is successful, store user data in localStorage
      if (response.data.success) {
        localStorage.setItem('cartengine_user', JSON.stringify(response.data.user));
        localStorage.setItem('cartengine_auth_status', 'true');
      } else {
        // If server says not authenticated, clear localStorage
        localStorage.removeItem('cartengine_user');
        localStorage.removeItem('cartengine_auth_status');
      }
      
      return response.data;
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('Request timed out');
        // If request timed out but we have stored user data, use that
        const storedUser = localStorage.getItem('cartengine_user');
        const storedAuthStatus = localStorage.getItem('cartengine_auth_status');
        
        if (storedUser && storedAuthStatus === 'true') {
          return { 
            success: true, 
            user: JSON.parse(storedUser),
            message: 'Using cached authentication data'
          };
        }
        
        // Return a default response instead of failing completely
        return rejectWithValue({ success: false, message: 'Authentication check timed out' });
      }
      
      // For other errors, clear localStorage and return error
      localStorage.removeItem('cartengine_user');
      localStorage.removeItem('cartengine_auth_status');
      return rejectWithValue(error.response?.data || { success: false, message: error.message });
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {},
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        // console.log(action);

        state.isLoading = false;
        state.user = action.payload.success ? action.payload.user : null;
        state.isAuthenticated = action.payload.success;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.success ? action.payload.user : null;
        state.isAuthenticated = action.payload.success;
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(logoutUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      });
  },
});

export const { setUser } = authSlice.actions;
export default authSlice.reducer;
