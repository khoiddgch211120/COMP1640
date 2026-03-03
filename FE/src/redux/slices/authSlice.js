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
    department: "IT"
  },
  {
    id: "2",
    email: "coordinator@test.com",
    password: "123456",
    fullName: "QA Coordinator",
    role: ROLES.QA_COORDINATOR,
    department: "IT"
  },
  {
    id: "3",
    email: "manager@test.com",
    password: "123456",
    fullName: "QA Manager",
    role: ROLES.QA_MANAGER,
    department: "Management"
  },
  {
    id: "4",
    email: "admin@test.com",
    password: "123456",
    fullName: "System Admin",
    role: ROLES.ADMIN,
    department: "System"
  }
];

/* ========================
   INITIAL STATE
======================== */

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
};

/* ========================
   SLICE
======================== */

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    /* FE LOGIN (fake) */
    login: (state, action) => {
      const { email, password } = action.payload;

      const user = fakeUsers.find(
        (u) => u.email === email && u.password === password
      );

      if (user) {
        state.user = user;
        state.token = "fake-jwt-token";
        state.isAuthenticated = true;
      } else {
        alert("Invalid email or password");
      }
    },

    /* Dùng khi sau này có BE */
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
  },
});

export const { login, loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;