// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import packingReducer from './Slices/packingSlice';

const store = configureStore({
  reducer: {
    packing: packingReducer,
  },
});

export default store;
