import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { AuthUser } from "../../types";

export interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  isMongo: boolean;
  isAuthModalOpen: boolean;
  authModalTab: "login" | "register";
}

const TOKEN_KEY = "dec_univ_auth_token";

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem(TOKEN_KEY),
  isAuthenticated: false,
  loading: false,
  error: null,
  isMongo: false,
  isAuthModalOpen: false,
  authModalTab: "login",
};

// Check active session from token stored in localStorage
export const checkAuthSession = createAsyncThunk(
  "auth/checkSession",
  async (_, { rejectWithValue }) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return rejectWithValue(null);

    try {
      const res = await fetch("/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) {
        localStorage.removeItem(TOKEN_KEY);
        return rejectWithValue(data.error || "Session expired");
      }

      return { user: data.user, token, isMongo: data.isMongo };
    } catch (err: any) {
      return rejectWithValue(err.message || "Network error");
    }
  }
);

// Login User Thunk
export const loginUser = createAsyncThunk(
  "auth/login",
  async (
    credentials: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      const data = await res.json();
      if (!res.ok) {
        return rejectWithValue(data.error || "Login failed");
      }

      localStorage.setItem(TOKEN_KEY, data.token);
      return { user: data.user, token: data.token, isMongo: data.isMongo };
    } catch (err: any) {
      return rejectWithValue(err.message || "Network connection error");
    }
  }
);

// Register User Thunk
export const registerUser = createAsyncThunk(
  "auth/register",
  async (
    formData: {
      name: string;
      email: string;
      password: string;
      github?: string;
      role?: "student" | "admin";
    },
    { rejectWithValue }
  ) => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        return rejectWithValue(data.error || "Registration failed");
      }

      localStorage.setItem(TOKEN_KEY, data.token);
      return { user: data.user, token: data.token, isMongo: data.isMongo };
    } catch (err: any) {
      return rejectWithValue(err.message || "Network connection error");
    }
  }
);

// Logout User Thunk
export const logoutUser = createAsyncThunk("auth/logout", async () => {
  try {
    await fetch("/api/auth/logout", { method: "POST" });
  } catch (err) {
    console.error("Logout request failed:", err);
  } finally {
    localStorage.removeItem(TOKEN_KEY);
  }
  return null;
});

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    openAuthModal: (
      state,
      action: PayloadAction<{ tab?: "login" | "register" } | undefined>
    ) => {
      state.isAuthModalOpen = true;
      state.error = null;
      if (action.payload?.tab) {
        state.authModalTab = action.payload.tab;
      }
    },
    closeAuthModal: (state) => {
      state.isAuthModalOpen = false;
      state.error = null;
    },
    setAuthModalTab: (state, action: PayloadAction<"login" | "register">) => {
      state.authModalTab = action.payload;
      state.error = null;
    },
    clearAuthError: (state) => {
      state.error = null;
    },
    setVerifiedAdmin: (state, action: PayloadAction<boolean>) => {
      if (action.payload) {
        if (!state.user) {
          state.user = {
            id: "verified-admin",
            name: "Instructor Umair Riaz",
            email: "umair@dotblockers.com",
            role: "admin",
            github: "umair-riaz",
          };
          state.isAuthenticated = true;
        } else {
          state.user.role = "admin";
        }
      }
    },
  },
  extraReducers: (builder) => {
    // Check session
    builder
      .addCase(checkAuthSession.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkAuthSession.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.isMongo = action.payload.isMongo;
        state.error = null;
      })
      .addCase(checkAuthSession.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      });

    // Login
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.isMongo = action.payload.isMongo;
        state.error = null;
        state.isAuthModalOpen = false;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Login failed";
      });

    // Register
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.isMongo = action.payload.isMongo;
        state.error = null;
        state.isAuthModalOpen = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Registration failed";
      });

    // Logout
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
    });
  },
});

export const {
  openAuthModal,
  closeAuthModal,
  setAuthModalTab,
  clearAuthError,
  setVerifiedAdmin,
} = authSlice.actions;

export default authSlice.reducer;
