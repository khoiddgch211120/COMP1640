import { createSlice } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode"; 

/* =========================
   NORMALIZE ROLE
========================= */
export const normalizeRole = (role = "") => {
  const r = role.replace("ROLE_", "").toUpperCase();

  if (r.includes("ADMIN")) return "ADMIN";
  if (r.includes("QA_MANAGER")) return "QA_MANAGER";
  if (r.includes("QA_COORDINATOR")) return "QA_COORDINATOR";
  if (r.includes("DEPT_MANAGER")) return "DEPT_MANAGER";
  if (r.includes("HR")) return "HR_MANAGER";
  if (r.includes("HEAD")) return "HEAD";
  if (r.includes("ACADEMIC")) return "ACADEMIC_STAFF";
  if (r.includes("SUPPORT")) return "SUPPORT_STAFF";

  return r;
};

/* =========================
   LOAD STORAGE
========================= */
const savedAuth = (() => {
  try {
    const data = JSON.parse(localStorage.getItem("auth"));
    if (!data?.token) return null;

    // Kiểm tra JWT expiry trước khi rehydrate
    try {
      const decoded = jwtDecode(data.token);
      if (decoded.exp && decoded.exp * 1000 < Date.now()) {
        localStorage.removeItem("auth");
        return null;
      }
    } catch {
      localStorage.removeItem("auth");
      return null;
    }

    return {
      ...data,
      user: data.user
        ? {
            ...data.user,
            role: normalizeRole(data.user.role),
          }
        : null,
    };
  } catch {
    return null;
  }
})();

const initialState = {
  user: savedAuth?.user || null,
  token: savedAuth?.token || null,
  userId: savedAuth?.userId || null, // From decoded JWT token
  isAuthenticated: !!savedAuth?.token,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      const { token, ...userData } = action.payload;

      // Decode JWT to extract userId
      let userId = null;
      try {
        const decoded = jwtDecode(token);
        userId = decoded.userId; // Backend stores userId in JWT
      } catch (err) {
        console.error('JWT decode error:', err);
      }

      const normalizedUser = {
        ...userData,
        role: normalizeRole(userData.role),
        id: userId, // Store in user object
      };

      state.user = normalizedUser;
      state.token = token;
      state.userId = userId; // Set userId from JWT
      state.isAuthenticated = true;

      localStorage.setItem(
        "auth",
        JSON.stringify({ user: normalizedUser, token, userId })
      );
    },

    logout: (state) => {
      state.user = null;
      state.token = null;
      state.userId = null;
      state.isAuthenticated = false;
      localStorage.removeItem("auth");
      // Note: notification clearing is handled in MainLayout via useEffect cleanup
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;