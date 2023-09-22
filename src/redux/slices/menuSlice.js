import { createSlice } from "@reduxjs/toolkit";

const menuSlice = createSlice({
	name: "menu",
	initialState: {
		menu: 0,
	},
	reducers: {
		changeMenu: (state,action) => {
			state.menu = action.payload;
		},
	},
});

export const { changeMenu } = menuSlice.actions;
export default menuSlice.reducer;
