// src/redux/slices/packingSlice.js
import { createSlice } from '@reduxjs/toolkit';

const packingSlice = createSlice({
  name: 'packing',
  initialState: {
    nextCaseNumber: 1,
  },
  reducers: {
    setNextCaseNumber: (state, action) => {
      state.nextCaseNumber = action.payload;
    },
    resetNextCaseNumberToOne: (state) => {
      state.nextCaseNumber = 1;
    },
  },
});

export const { setNextCaseNumber, resetNextCaseNumberToOne } = packingSlice.actions;
export default packingSlice.reducer;
