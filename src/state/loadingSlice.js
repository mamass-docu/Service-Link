import { createSlice } from "@reduxjs/toolkit";

const loadingSlice = createSlice({
  name: "loading",
  initialState: { value: false },
  reducers: {
    openLoading: (state) => {
      state.value = true;
    },
    closeLoading: (state) => {
      state.value = false;
    },
  },
});

export const { openLoading, closeLoading } = loadingSlice.actions;
export default loadingSlice.reducer;
