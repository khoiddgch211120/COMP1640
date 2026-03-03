import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import ideaReducer from "./slices/ideaSlice";
import academicYearReducer from "./slices/academicYearSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ideas: ideaReducer,
    academicYear: academicYearReducer
  }
});
