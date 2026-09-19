import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface GenericState {
  count: number;
  message: string;
}

const initialState: GenericState = {
  count: 0,
  message: "Hello from the generic slice",
};

const genericSlice = createSlice({
  name: "generic",
  initialState,
  reducers: {
    increment: (state) => {
      state.count += 1;
    },
    decrement: (state) => {
      state.count -= 1;
    },
    reset: (state) => {
      state.count = 0;
      state.message = "State reset";
    },
    setMessage: (state, action: PayloadAction<string>) => {
      state.message = action.payload;
    },
  },
});

export const { increment, decrement, reset, setMessage } = genericSlice.actions;
export default genericSlice.reducer;
