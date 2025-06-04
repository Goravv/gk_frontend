// src/redux/slices/packingSlice.js
import { createSlice } from '@reduxjs/toolkit';

const packingSlice = createSlice({
  name: 'packing',
  initialState: {
    nextCaseNumber: 1, // ← store next case number here
  },
  reducers: {
    setNextCaseNumber: (state, action) => {
      state.nextCaseNumber = action.payload;
    },
    setNextCaseNumber_to_one:(state)=>{
        state.setNextCaseNumber_to_one=1;
    }
  },
});

export const { setNextCaseNumber ,setNextCaseNumber_to_one} = packingSlice.actions;
export default packingSlice.reducer;
