import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import academicYearReducer from "./slices/academicYearSlice";
import departmentReducer from "./slices/departmentSlice";
import notificationReducer from './slices/notificationSlice';
export const store = configureStore({
  reducer: {
    auth: authReducer,
    academicYear: academicYearReducer,
    department: departmentReducer,
    notifications: notificationReducer,
  }
});
