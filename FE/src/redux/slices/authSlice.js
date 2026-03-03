import { createSlice } from "@reduxjs/toolkit";
import { ROLES } from "../../constants/roles";

/* ========================
   FAKE USERS (FE ONLY)
======================== */

const fakeUsers = [
  {
    id: "1",
    email: "staff@test.com",
    password: "123456",
    fullName: "Staff User",
    role: ROLES.STAFF,
    department: "IT",
    status: true,
  },
  {
    id: "2",
    email: "coordinator@test.com",
    password: "123456",
    fullName: "QA Coordinator",
    role: ROLES.QA_COORDINATOR,
    department: "IT",
    status: true,
  },
  {
    id: "3",
    email: "manager@test.com",
    password: "123456",
    fullName: "QA Manager",
    role: ROLES.QA_MANAGER,
    department: "Management",
    status: true,
  },
  {
    id: "4",
    email: "admin@test.com",
    password: "123456",
    fullName: "System Admin",
    role: ROLES.ADMIN,
    department: "System",
    status: true,
  },
];

/* ========================
   INITIAL STATE
======================== */

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  users: fakeUsers, // 🔥 QUAN TRỌNG cho User Management
};

/* ========================
   SLICE
======================== */

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    /* ================= LOGIN (FAKE) ================= */
    login: (state, action) => {
      const { email, password } = action.payload;

      const user = state.users.find(
        (u) =>
          u.email === email &&
          u.password === password &&
          u.status !== false
      );

      if (user) {
        state.user = user;
        state.token = "fake-jwt-token";
        state.isAuthenticated = true;
      } else {
        alert("Invalid credentials or account disabled");
      }
    },

    loginSuccess: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },

    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },

    /* ================= USER MANAGEMENT ================= */

    addUser: (state, action) => {
      state.users.push(action.payload);
    },

    updateUser: (state, action) => {
      const index = state.users.findIndex(
        (u) => u.id === action.payload.id
      );
      if (index !== -1) {
        state.users[index] = action.payload;

        // Nếu đang update chính user đang login
        if (state.user?.id === action.payload.id) {
          state.user = action.payload;
        }
      }
    },

    deleteUser: (state, action) => {
      state.users = state.users.filter(
        (u) => u.id !== action.payload
      );

      // Nếu xóa chính mình → logout
      if (state.user?.id === action.payload) {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      }
    },

    toggleUserStatus: (state, action) => {
      const user = state.users.find(
        (u) => u.id === action.payload
      );
      if (user) {
        user.status = !user.status;

        // Nếu khóa chính mình → logout
        if (
          state.user?.id === user.id &&
          user.status === false
        ) {
          state.user = null;
          state.token = null;
          state.isAuthenticated = false;
        }
      }
    },
  },
});

/* ========================
   EXPORT ACTIONS
======================== */

export const {
  login,
  loginSuccess,
  logout,
  addUser,
  updateUser,
  deleteUser,
  toggleUserStatus,
} = authSlice.actions;

export default authSlice.reducer;