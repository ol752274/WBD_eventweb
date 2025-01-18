// src/redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import reducer from "./reducers"; // Ensure this path is correct

const store = configureStore({
  reducer: reducer, // Or simply 'reducer' if the property and variable have the same name
});

export default store;