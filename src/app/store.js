// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import packingReducer from './Slices/packingSlice';
import clientReducer from './Slices/clientSlice';
import choiceReducer from "./Slices/choiceSlice";
import authReducer from "./Slices/authslice"; 

const store = configureStore({
  reducer: {
    packing: packingReducer,
    client:clientReducer,
    choice:choiceReducer,
    auth: authReducer,
  },
});

export default store;
