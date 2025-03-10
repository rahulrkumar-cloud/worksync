import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the structure of the state
interface SearchState {
  searchTerm: string;
  isLoggedIn: boolean;
  user: any | null; // Store the user object (or null if not logged in)
  token: string | null; // Store the token (or null if not logged in)
  userData: [];
}

const initialState: SearchState = {
  isLoggedIn: false, // Set initial login state to false
  searchTerm: "", // No search term initially
  user: null, // User is not logged in by default
  token: null, // No token by default
  userData: [],
};

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    // Action to update the search term
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
    // Action to handle login success (store user data and token)
    loginSuccess: (
      state,
      action: PayloadAction<{ user: any; token: string }>,
    ) => {
      console.log("tokentoken", action.payload.user);
      state.isLoggedIn = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    // Action to handle logout (clear user data and token)
    logout: (state) => {
      state.isLoggedIn = false;
      state.user = null;
      state.token = null;
    },
  },
});

// Export actions
export const { setSearchTerm, loginSuccess, logout } = searchSlice.actions;

// Export reducer
export default searchSlice.reducer;
