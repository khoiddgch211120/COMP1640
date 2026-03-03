import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [
    {
      id: "2023-2024",
      name: "Academic Year 2023-2024",
      closureDate: "2024-03-31",
      finalClosureDate: "2024-04-15"
    },
    {
      id: "2024-2025",
      name: "Academic Year 2024-2025",
      closureDate: "2025-03-31",
      finalClosureDate: "2025-04-15"
    }
  ],
  currentAcademicYear: {
    id: "2024-2025",
    name: "Academic Year 2024-2025",
    closureDate: "2027-03-31",
    finalClosureDate: "2027-04-15"
  }
};

const academicYearSlice = createSlice({
  name: "academicYear",
  initialState,
  reducers: {
    setCurrentAcademicYear: (state, action) => {
      state.currentAcademicYear = action.payload;
    }
  }
});

export const { setCurrentAcademicYear } =
  academicYearSlice.actions;

export default academicYearSlice.reducer;