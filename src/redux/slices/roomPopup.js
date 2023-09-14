import { createSlice } from "@reduxjs/toolkit";

const roomPopupSlice = createSlice({
	name: "roomPopup",
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

export const { openPopup, closePopup } = roomPopupSlice.actions;
export default roomPopupSlice.reducer;
