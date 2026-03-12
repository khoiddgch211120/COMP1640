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
   LOAD AUTH FROM STORAGE
======================== */

const savedAuth = JSON.parse(localStorage.getItem("auth"));

/* ========================
   INITIAL STATE
======================== */

const initialState = {
  user: savedAuth?.user || null,
  token: savedAuth?.token || null,
  isAuthenticated: !!savedAuth,
  users: fakeUsers,
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

        /* SAVE LOGIN */
        localStorage.setItem(
          "auth",
          JSON.stringify({
            user: user,
            token: "fake-jwt-token"
          })
        );

      } else {
        alert("Invalid credentials or account disabled");
      }
    },

    loginSuccess: (state, action) => {

      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;

      localStorage.setItem(
        "auth",
        JSON.stringify({
          user: action.payload.user,
          token: action.payload.token
        })
      );

    },

    logout: (state) => {

      state.user = null;
      state.token = null;
      state.isAuthenticated = false;

      localStorage.removeItem("auth");

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

        if (state.user?.id === action.payload.id) {
          state.user = action.payload;

          localStorage.setItem(
            "auth",
            JSON.stringify({
              user: action.payload,
              token: state.token
            })
          );
        }

      }
    },

    deleteUser: (state, action) => {

      state.users = state.users.filter(
        (u) => u.id !== action.payload
      );

      if (state.user?.id === action.payload) {

        state.user = null;
        state.token = null;
        state.isAuthenticated = false;

        localStorage.removeItem("auth");

      }
    },

    toggleUserStatus: (state, action) => {

      const user = state.users.find(
        (u) => u.id === action.payload
      );

      if (user) {

        user.status = !user.status;

        if (
          state.user?.id === user.id &&
          user.status === false
        ) {

          state.user = null;
          state.token = null;
          state.isAuthenticated = false;

          localStorage.removeItem("auth");

        }

      }
    },

  },
});

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
