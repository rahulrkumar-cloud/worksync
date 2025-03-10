import { configureStore } from "@reduxjs/toolkit";

import searchReducer from "@/features/search/searchSlice"; // Import the search reducer

export const store = configureStore({
  reducer: {
    search: searchReducer, // Use the search reducer here
  },
});

// Export types for state and dispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
