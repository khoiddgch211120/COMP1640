import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import ideaReducer from "./slices/ideaSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ideas: ideaReducer
  }
});
