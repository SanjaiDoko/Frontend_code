import { createSlice } from "@reduxjs/toolkit";

const popupSlice = createSlice({
	name: "popup",
	initialState: {
		popupStatus: false,
	},
	reducers: {
		openPopup: (state) => {
			state.popupStatus = true;
		},
		closePopup: (state) => {
			state.popupStatus = false;
		},
	},
});

export const { openPopup, closePopup } = popupSlice.actions;
export default popupSlice.reducer;
