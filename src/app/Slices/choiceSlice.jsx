// src/app/Slices/choiceSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  choice: "", // "Separate" or "Mix"
};

const choiceSlice = createSlice({
  name: "choice",
  initialState,
  reducers: {
    setChoice: (state, action) => {
      state.choice = action.payload;
    },
    resetChoice: (state) => {
      state.choice = "";
    },
  },
});

export const { setChoice, resetChoice } = choiceSlice.actions;

export default choiceSlice.reducer;
